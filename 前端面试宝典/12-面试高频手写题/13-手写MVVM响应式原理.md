# 手写MVVM响应式原理

> 本文将详细讲解Vue的MVVM响应式原理，分别实现Vue 2和Vue 3的简化版响应式系统，帮助理解数据驱动视图的核心机制。

## 概念介绍

MVVM（Model-View-ViewModel）是一种软件架构模式，它通过数据绑定将视图（View）和模型（Model）连接起来，ViewModel负责同步两者之间的数据。Vue的响应式系统是MVVM模式的核心实现，它能够自动追踪数据变化并更新DOM。

## Vue 2响应式原理实现

### 核心原理

Vue 2使用`Object.defineProperty`来实现数据响应式，通过劫持对象的`getter`和`setter`方法，在数据被访问时收集依赖，在数据变化时触发更新。

### 实现代码

```javascript
/**
 * 依赖收集器
 * 管理订阅者并在数据变化时通知它们
 */
class Dep {
  constructor() {
    // 存储所有订阅者
    this.subscribers = [];
  }

  /** 添加订阅者 */
  addSub(sub) {
    if (sub && sub.update) {
      this.subscribers.push(sub);
    }
  }

  /** 通知所有订阅者更新 */
  notify() {
    this.subscribers.forEach(sub => sub.update());
  }
}

/**
 * 订阅者
 * 接收数据变化通知并执行更新操作
 */
class Watcher {
  /**
   * 创建订阅者
   * @param {Object} vm - Vue实例
   * @param {string} exp - 数据属性名
   * @param {Function} cb - 回调函数，用于更新视图
   */
  constructor(vm, exp, cb) {
    this.vm = vm;
    this.exp = exp;
    this.cb = cb;
    // 存储当前值用于比较变化
    this.value = this.get();
  }

  /** 获取数据并收集依赖 */
  get() {
    // 将当前订阅者设为全局目标
    Dep.target = this;
    // 获取数据，触发getter，从而收集依赖
    const value = this.vm[this.exp];
    // 清空全局目标
    Dep.target = null;
    return value;
  }

  /** 更新视图 */
  update() {
    const newValue = this.vm[this.exp];
    const oldValue = this.value;
    if (newValue !== oldValue) {
      this.value = newValue;
      // 执行回调更新视图
      this.cb.call(this.vm, newValue, oldValue);
    }
  }
}

/**
 * 数据劫持
 * 通过Object.defineProperty实现数据响应式
 * @param {Object} data - 需要劫持的数据对象
 */
function observe(data) {
  if (!data || typeof data !== 'object') return;

  // 遍历对象属性
  Object.keys(data).forEach(key => {
    defineReactive(data, key, data[key]);
  });
}

/**
 * 定义响应式属性
 * @param {Object} obj - 目标对象
 * @param {string} key - 属性名
 * @param {*} val - 属性值
 */
function defineReactive(obj, key, val) {
  // 递归观察子属性
  observe(val);
  // 创建依赖收集器
  const dep = new Dep();

  // 劫持属性
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get() {
      // 收集依赖
      if (Dep.target) {
        dep.addSub(Dep.target);
      }
      return val;
    },
    set(newVal) {
      if (newVal === val) return;
      val = newVal;
      // 新值也需要被观察
      observe(newVal);
      // 通知所有订阅者数据已更新
      dep.notify();
    }
  });
}

/**
 * Vue构造函数
 * @param {Object} options - 配置选项
 */
function Vue(options = {}) {
  this.$options = options;
  this._data = options.data;

  // 将data属性代理到Vue实例上
  Object.keys(this._data).forEach(key => {
    this._proxy(key);
  });

  // 观察数据
  observe(this._data);

  // 执行编译
  if (options.el) {
    this.$mount(options.el);
  }
}

/**
 * 代理data属性到Vue实例
 * @param {string} key - 属性名
 */
Vue.prototype._proxy = function(key) {
  const self = this;
  Object.defineProperty(self, key, {
    configurable: true,
    enumerable: true,
    get() {
      return self._data[key];
    },
    set(newVal) {
      self._data[key] = newVal;
    }
  });
};

/**
 * 编译模板
 * @param {string} el - 选择器
 */
Vue.prototype.$mount = function(el) {
  const dom = document.querySelector(el);
  this._compile(dom);
};

/**
 * 简单的模板编译
 * @param {HTMLElement} el - DOM元素
 */
Vue.prototype._compile = function(el) {
  const childNodes = el.childNodes;
  const self = this;

  Array.from(childNodes).forEach(node => {
    // 处理文本节点
    if (node.nodeType === 3) {
      const text = node.textContent.trim();
      if (text) {
        // 简单匹配{{}}模板语法
        const reg = /\{\{(.+?)\}\}/g;
        if (reg.test(text)) {
          const exp = RegExp.$1.trim();
          // 创建订阅者
          new Watcher(self, exp, function(newVal) {
            node.textContent = text.replace(reg, newVal);
          });
          // 初始化视图
          const initVal = self[exp];
          node.textContent = text.replace(reg, initVal);
        }
      }
    }
    // 递归处理子节点
    else if (node.nodeType === 1 && node.childNodes.length) {
      self._compile(node);
    }
  });
};
```

### 调用示例

```javascript
// 创建Vue实例
const vm = new Vue({
  el: '#app',
  data: {
    message: 'Hello Vue 2!',
    count: 0
  }
});

// 在HTML中使用:
// <div id="app">
//   <p>{{message}}</p>
//   <p>{{count}}</p>
// </div>

// 修改数据会自动更新视图
vm.message = 'Hello Reactive World!';
vm.count = 1;
```

### Vue 2响应式系统的局限性

1. **无法检测对象新增/删除属性**：由于`Object.defineProperty`只能劫持已存在的属性
2. **数组变化检测限制**：需要特殊处理数组的7个方法(push, pop, etc.)
3. **深度监听性能问题**：初始化时需要递归遍历所有属性
4. **不支持Map、Set等数据结构**

## Vue 3响应式原理实现

### 核心原理

Vue 3使用ES6的`Proxy`和`Reflect`API实现响应式，相比Vue 2有以下改进：
- 原生支持监听对象新增/删除属性
- 原生支持数组索引和length变化
- 支持Map、Set等数据结构
- 懒代理，只有在访问时才递归处理子属性
- 可以拦截更多操作（apply、construct等）

### 实现代码

```javascript
/**
 * 副作用函数管理
 */
const effectStack = [];
let activeEffect = null;

/**
 * 创建副作用函数
 * @param {Function} fn - 副作用函数
 * @param {Object} options - 选项
 * @returns {Function} 包装后的副作用函数
 */
function effect(fn, options = {}) {
  const effectFn = function() {
    try {
      // 入栈并设置为当前激活的副作用函数
      effectStack.push(effectFn);
      activeEffect = effectFn;
      // 执行副作用函数
      return fn();
    } finally {
      // 出栈
      effectStack.pop();
      // 设置当前激活的副作用函数为栈顶
      activeEffect = effectStack[effectStack.length - 1];
    }
  };

  // 非lazy模式立即执行
  if (!options.lazy) {
    effectFn();
  }

  // 将原始函数挂载到副作用函数上
  effectFn.raw = fn;
  // 将选项挂载到副作用函数上
  effectFn.options = options;
  return effectFn;
}

/**
 * 依赖收集Map
 * key: target对象
 * value: depsMap（key: 属性, value: Set<effect>）
 */
const targetMap = new WeakMap();

/**
 * 收集依赖
 * @param {Object} target - 目标对象
 * @param {string | symbol} key - 属性
 */
function track(target, key) {
  if (!activeEffect) return;

  // 获取target对应的depsMap
  let depsMap = targetMap.get(target);
  if (!depsMap) {
    targetMap.set(target, (depsMap = new Map()));
  }

  // 获取key对应的依赖集合
  let deps = depsMap.get(key);
  if (!deps) {
    depsMap.set(key, (deps = new Set()));
  }

  // 将当前激活的副作用函数添加到依赖集合
  if (!deps.has(activeEffect)) {
    deps.add(activeEffect);
    // 如果副作用函数有onTrack钩子，调用它
    if (activeEffect.options.onTrack) {
      activeEffect.options.onTrack({
        effect: activeEffect,
        target,
        key
      });
    }
  }
}

/**
 * 触发依赖
 * @param {Object} target - 目标对象
 * @param {string | symbol} key - 属性
 * @param {*} newValue - 新值
 * @param {*} oldValue - 旧值
 */
function trigger(target, key, newValue, oldValue) {
  // 获取target对应的depsMap
  const depsMap = targetMap.get(target);
  if (!depsMap) return;

  // 获取key对应的依赖集合
  const deps = depsMap.get(key);
  if (!deps) return;

  // 创建一个副本以避免副作用函数执行时修改deps
  const effects = new Set(deps);

  // 执行所有依赖的副作用函数
  effects.forEach(effectFn => {
    // 如果副作用函数有调度器，使用调度器执行
    if (effectFn.options.scheduler) {
      effectFn.options.scheduler(effectFn);
    } else {
      // 否则直接执行
      effectFn();
    }
  });
}

/**
 * 创建响应式对象
 * @param {Object} target - 目标对象
 * @returns {Proxy} 响应式代理对象
 */
function reactive(target) {
  // 不是对象则直接返回
  if (typeof target !== 'object' || target === null) {
    return target;
  }

  // 创建代理对象
  return new Proxy(target, {
    // 读取属性
    get(target, key, receiver) {
      const res = Reflect.get(target, key, receiver);

      // 收集依赖
      track(target, key);

      // 如果结果是对象，递归创建响应式
      if (typeof res === 'object' && res !== null) {
        return reactive(res);
      }

      return res;
    },

    // 设置属性
    set(target, key, value, receiver) {
      const oldValue = Reflect.get(target, key, receiver);
      const res = Reflect.set(target, key, value, receiver);

      // 值变化才触发依赖
      if (oldValue !== value) {
        trigger(target, key, value, oldValue);
      }

      return res;
    },

    // 删除属性
    deleteProperty(target, key) {
      const hadKey = Reflect.has(target, key);
      const res = Reflect.deleteProperty(target, key);

      // 存在该属性且删除成功才触发依赖
      if (hadKey && res) {
        trigger(target, key, undefined, Reflect.get(target, key, receiver));
      }

      return res;
    },

    // 检查属性是否存在
    has(target, key) {
      const res = Reflect.has(target, key);
      // 收集依赖
      track(target, key);
      return res;
    },

    // 获取属性描述符
    getOwnPropertyDescriptor(target, key) {
      const res = Reflect.getOwnPropertyDescriptor(target, key);
      // 收集依赖
      track(target, key);
      return res;
    },

    // 其他拦截方法可以根据需要添加...
  });
}

/**
 * 创建ref响应式数据
 * @param {*} value - 原始值
 * @returns {Object} 包含value属性的对象
 */
function ref(value) {
  // 如果已经是ref，则直接返回
  if (isRef(value)) {
    return value;
  }

  // 创建包装对象
  const wrapper = {
    __v_isRef: true,
    get value() {
      // 收集依赖
      track(wrapper, 'value');
      return value;
    },
    set value(newValue) {
      if (newValue !== value) {
        value = newValue;
        // 触发依赖
        trigger(wrapper, 'value', newValue);
      }
    }
  };

  return wrapper;
}

/**
 * 判断是否是ref对象
 * @param {*} value - 要检查的值
 * @returns {boolean} 是否是ref对象
 */
function isRef(value) {
  return !!value && value.__v_isRef === true;
}

/**
 * 将ref对象解包
 * @param {*} value - 可能是ref的值
 * @returns {*} 解包后的值
 */
function unref(value) {
  return isRef(value) ? value.value : value;
}

/**
 * 模板编译函数
 * @param {HTMLElement} el - DOM元素
 * @param {Object} ctx - 上下文对象
 */
function compile(el, ctx) {
  const childNodes = el.childNodes;

  Array.from(childNodes).forEach(node => {
    // 处理文本节点
    if (node.nodeType === 3) {
      const text = node.textContent.trim();
      if (text) {
        // 简单匹配{{}}模板语法
        const reg = /\{\{(.+?)\}\}/g;
        if (reg.test(text)) {
          const exp = RegExp.$1.trim();
          // 创建副作用函数
          effect(() => {
            // 获取表达式的值
            const value = getValueByPath(ctx, exp);
            // 更新文本内容
            node.textContent = text.replace(reg, value);
          });
        }
      }
    }
    // 递归处理子节点
    else if (node.nodeType === 1 && node.childNodes.length) {
      compile(node, ctx);
    }
  });
}

/**
 * 根据路径获取对象属性值
 * @param {Object} obj - 对象
 * @param {string} path - 属性路径
 * @returns {*} 属性值
 */
function getValueByPath(obj, path) {
  return path.split('.').reduce((acc, key) => acc && acc[key], obj);
}

/**
 * 创建Vue 3实例
 * @param {Object} options - 配置选项
 * @returns {Object} Vue实例
 */
function createApp(options) {
  const { data, el } = options;
  // 创建响应式数据
  const state = typeof data === 'function' ? data() : data;
  const reactiveState = reactive(state);

  // 编译模板
  if (el) {
    const dom = typeof el === 'string' ? document.querySelector(el) : el;
    compile(dom, reactiveState);
  }

  return {
    state: reactiveState,
    // 提供mount方法
    mount(el) {
      const dom = typeof el === 'string' ? document.querySelector(el) : el;
      compile(dom, reactiveState);
      return this;
    }
  };
}
```

### 调用示例

```javascript
// 创建应用
const app = createApp({
  data() {
    return {
      message: 'Hello Vue 3!',
      user: {
        name: 'Vue',
        age: 3
      },
      list: ['a', 'b', 'c']
    };
  }
});

// 挂载应用
app.mount('#app');

// 在HTML中使用:
// <div id="app">
//   <p>{{message}}</p>
//   <p>{{user.name}}</p>
//   <p>{{list.length}}</p>
// </div>

// 修改数据会自动更新视图
app.state.message = 'Hello Proxy!';
app.state.user.age = 4; // Vue 3原生支持
app.state.list.push('d'); // Vue 3原生支持
app.state.newProp = '新增属性'; // Vue 3原生支持
```

## Vue 2与Vue 3响应式系统对比

| 特性 | Vue 2 | Vue 3 |
|------|-------|-------|
| 核心API | Object.defineProperty | Proxy |
| 对象新增属性 | 不支持，需使用Vue.set | 原生支持 |
| 对象删除属性 | 不支持，需使用Vue.delete | 原生支持 |
| 数组索引修改 | 不支持 | 原生支持 |
| 数组length修改 | 不支持 | 原生支持 |
| 数据类型支持 | 对象、数组 | 对象、数组、Map、Set等 |
| 初始化性能 | 较差（递归遍历所有属性） | 较好（懒代理） |
| 运行时性能 | 一般（需维护依赖列表） | 较好（更精准的依赖追踪） |
| 递归响应式 | 初始化时递归 | 访问时递归（懒递归） |
| 浏览器兼容性 | IE9+ | IE11+（需polyfill） |

## 面试常见问题

### 1. Vue 2为什么不能检测对象新增/删除属性？

Vue 2使用`Object.defineProperty`实现响应式，该API只能劫持对象已存在的属性。当我们新增或删除属性时，无法触发`setter`或`deleteProperty`，因此Vue 2无法检测到这些变化。

解决方案：
- 新增属性：使用`this.$set(this.obj, 'newKey', value)`
- 删除属性：使用`this.$delete(this.obj, 'key')`

Vue 3使用Proxy解决了这个问题，因为Proxy可以拦截`set`和`deleteProperty`操作。

### 2. Vue 2如何检测数组变化？有什么局限性？

Vue 2通过重写数组的7个变更方法（push, pop, shift, unshift, splice, sort, reverse）来检测数组变化。当调用这些方法时，Vue会触发更新。

局限性：
- 无法检测数组索引直接修改：`this.arr[0] = newValue`
- 无法检测数组length修改：`this.arr.length = newLength`

解决方案是使用`this.$set(this.arr, index, value)`或`splice`方法。

Vue 3使用Proxy可以直接检测数组索引和length的变化，无需特殊处理。

### 3. Vue 3的Proxy相比Vue 2的Object.defineProperty有哪些优势？

1. **原生支持对象新增/删除属性**：无需额外API
2. **原生支持数组索引和length变化**
3. **支持更多数据类型**：Map、Set、WeakMap、WeakSet等
4. **懒代理**：只有在访问属性时才递归创建响应式，提升初始化性能
5. **更精准的依赖收集**：能精确到具体属性
6. **可以拦截更多操作**：如apply、construct等
7. **不污染原始对象**：Proxy返回新对象，不修改原始对象

### 4. Vue 3的响应式系统有哪些新特性？

1. **Reactive API**：`reactive()`创建对象响应式
2. **Ref API**：`ref()`创建基本类型响应式
3. **Computed API**：`computed()`创建计算属性
4. **Effect API**：`effect()`创建副作用函数
5. **To API**：`toRef()`、`toRefs()`转换响应式对象
6. **响应式判断**：`isReactive()`、`isRef()`等
7. **Effect作用域**：`effectScope()`管理副作用函数生命周期

### 5. Vue 3的Ref和Reactive有什么区别？如何选择？

- **Reactive**：用于对象类型数据，返回Proxy对象
- **Ref**：用于基本类型数据，返回包含`.value`属性的对象

选择原则：
- 基本类型（String, Number, Boolean等）使用Ref
- 对象类型推荐使用Reactive
- 如果需要将对象属性单独提取使用，使用Ref或toRef
- 函数组件中推荐使用Ref，便于解构

### 6. Vue 3的响应式系统如何实现嵌套对象的响应式？

Vue 3在`get`拦截器中，当获取到的属性值是对象时，会递归调用`reactive()`函数将其转换为响应式对象。这种"懒递归"策略相比Vue 2的初始化递归，提升了初始化性能，特别是对于大型对象。

### 7. 如何在Vue中实现深层响应式和浅层响应式？

Vue 3提供了明确的API：
- **深层响应式**：`reactive()`默认是深层响应式
- **浅层响应式**：`shallowReactive()`只响应顶层属性变化

对于Ref：
- **深层Ref**：`ref()`对于对象值默认是深层响应式
- **浅层Ref**：`shallowRef()`只响应`.value`的替换

### 8. 什么是响应式丢失问题？如何解决？

响应式丢失指当我们从响应式对象中解构属性或将属性传递给函数时，属性可能失去响应式能力。

解决方法：
1. **使用toRef**：`const { name } = toRefs(user)`
2. **使用ref**：`const name = ref(user.name)`
3. **保持引用**：直接使用`user.name`而不是解构

Vue 3的`setup`函数中，通常使用`toRefs`来解决这个问题：
```javascript
setup() {
  const user = reactive({ name: 'Vue' });
  return { ...toRefs(user) };
}
```

## 总结

Vue的响应式系统是MVVM模式的核心实现，Vue 2使用`Object.defineProperty`，Vue 3改用`Proxy`实现，带来了更好的性能和更完善的功能。理解响应式原理不仅有助于解决实际开发问题，也是前端面试的重要考点。

掌握Vue响应式原理需要理解以下核心概念：
- 数据劫持/代理
- 依赖收集
- 依赖触发
- 副作用函数

通过本文的简化实现，希望能帮助你深入理解Vue响应式系统的工作机制。