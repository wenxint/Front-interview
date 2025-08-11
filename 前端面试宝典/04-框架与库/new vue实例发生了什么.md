# new Vue实例发生了什么

> 深入理解Vue实例的创建过程，掌握Vue框架的核心机制。

## 概念介绍

在Vue.js中，`new Vue()` 是创建Vue应用的起点。当我们调用这个构造函数时，Vue会经历一系列初始化步骤，最终生成一个可交互的Vue实例。这个过程涉及数据观测、模板编译、挂载DOM等核心功能，是理解Vue工作原理的关键。

## 初始化过程详解

Vue实例的创建过程主要包括以下几个步骤：

### 1. 参数合并与选项处理

```javascript
/**
 * Vue实例初始化的第一步：参数合并
 */
function initMixin(Vue) {
  Vue.prototype._init = function(options) {
    const vm = this;
    // 合并选项（将用户传入的options与Vue默认选项合并）
    vm.$options = mergeOptions(
      resolveConstructorOptions(vm.constructor),
      options || {},
      vm
    );
    // ...其他初始化工作
  }
}
```

- Vue会将用户传入的选项与默认选项进行合并
- 处理组件继承关系，解析构造函数选项
- 对选项进行标准化处理（如props、inject等）

### 2. 初始化生命周期钩子

```javascript
/**
 * 初始化生命周期相关属性
 */
function initLifecycle(vm) {
  const options = vm.$options;
  // 定位第一个非抽象父组件
  let parent = options.parent;
  if (parent && !options.abstract) {
    while (parent.$options.abstract && parent.$parent) {
      parent = parent.$parent;
    }
    parent.$children.push(vm);
  }
  
  vm.$parent = parent;
  vm.$root = parent ? parent.$root : vm;
  
  vm.$children = [];
  vm.$refs = {};
  
  vm._provided = parent ? parent._provided : Object.create(null);
  vm._parentListeners = options._parentListeners || Object.create(null);
  
  // 生命周期标志
  vm._isMounted = false;
  vm._isDestroyed = false;
  vm._isBeingDestroyed = false;
}
```

- 建立组件树关系（$parent, $children, $root）
- 初始化生命周期状态标志（_isMounted, _isDestroyed等）
- 设置引用关系（$refs）和提供/注入（provide/inject）系统

### 3. 初始化事件系统

```javascript
/**
 * 初始化事件处理系统
 */
function initEvents(vm) {
  // 初始化事件中心
  vm._events = Object.create(null);
  vm._hasHookEvent = false;
  
  // 处理父组件传入的事件监听
  const listeners = vm.$options._parentListeners;
  if (listeners) {
    updateComponentListeners(vm, listeners);
  }
}
```

- 初始化事件中心（_events对象）
- 处理父组件传递的事件监听器
- 设置事件钩子标识（_hasHookEvent）

### 4. 初始化渲染系统

```javascript
/**
 * 初始化渲染相关属性和方法
 */
function initRender(vm) {
  vm._vnode = null; // 虚拟节点
  vm._staticTrees = null; // 静态树缓存
  vm.$vnode = null; // 父虚拟节点
  vm.$slots = {}; // 插槽
  vm.$scopedSlots = {}; // 作用域插槽
  
  // 绑定createElement方法
  vm._c = (a, b, c, d) => createElement(vm, a, b, c, d, false);
  vm.$createElement = (a, b, c, d) => createElement(vm, a, b, c, d, true);
  
  // 处理v-bind:is特殊情况
  const parentVnode = vm.$vnode = options._parentVnode;
  if (parentVnode) {
    vm.$scopedSlots = parentVnode.data.scopedSlots || {};
  }
}
```

- 初始化虚拟DOM相关属性（_vnode, $vnode等）
- 绑定渲染函数（_c, $createElement）
- 处理插槽系统（$slots, $scopedSlots）
- 初始化静态内容缓存（_staticTrees）

### 5. 数据响应式处理

```javascript
/**
 * 初始化数据响应式系统
 */
function initState(vm) {
  vm._watchers = [];
  const opts = vm.$options;
  
  // 按顺序初始化：props -> methods -> data -> computed -> watch
  if (opts.props) initProps(vm, opts.props);
  if (opts.methods) initMethods(vm, opts.methods);
  if (opts.data) {
    initData(vm);
  } else {
    observe(vm._data = {}, true /* asRootData */);
  }
  if (opts.computed) initComputed(vm, opts.computed);
  if (opts.watch && opts.watch !== nativeWatch) {
    initWatch(vm, opts.watch);
  }
}
```

- 初始化props、methods、data、computed、watch等状态
- 对data进行响应式处理（observe）
- 设置getter/setter，实现数据变化检测
- 初始化依赖收集系统（_watchers数组）

### 6. 初始化钩子函数

```javascript
/**
 * 调用beforeCreate钩子之后初始化inject
 */
function initInjections(vm) {
  const result = resolveInject(vm.$options.inject, vm);
  if (result) {
    toggleObserving(false);
    Object.keys(result).forEach(key => {
      defineReactive(vm, key, result[key]);
    });
    toggleObserving(true);
  }
}

/**
 * 初始化provide
 */
function initProvide(vm) {
  const provide = vm.$options.provide;
  if (provide) {
    vm._provided = typeof provide === 'function'
      ? provide.call(vm)
      : provide;
  }
}
```

- 调用beforeCreate生命周期钩子
- 初始化inject/provide依赖注入系统
- 调用created生命周期钩子

### 7. 挂载DOM元素

```javascript
/**
 * 挂载Vue实例到DOM
 */
Vue.prototype.$mount = function(
  el?: string | Element,
  hydrating?: boolean
): Component {
  el = el && inBrowser ? query(el) : undefined;
  return mountComponent(this, el, hydrating);
};

/**
 * 组件挂载核心逻辑
 */
function mountComponent(
  vm: Component,
  el: ?Element,
  hydrating?: boolean
): Component {
  vm.$el = el;
  if (!vm.$options.render) {
    // 如果没有render函数，尝试编译模板
    // ...
  }
  
  // 调用beforeMount钩子
  callHook(vm, 'beforeMount');
  
  // 创建渲染Watcher
  let updateComponent = () => {
    vm._update(vm._render(), hydrating);
  };
  
  vm._watcher = new Watcher(vm, updateComponent, noop);
  hydrating = false;
  
  // 调用mounted钩子
  callHook(vm, 'mounted');
  
  return vm;
}
```

- 解析并挂载DOM元素（$el）
- 编译模板（如果没有提供render函数）
- 创建渲染Watcher，建立响应式更新机制
- 调用beforeMount和mounted生命周期钩子

## 核心特性与实例属性

创建Vue实例后，我们可以访问以下重要属性和方法：

### 1. 数据相关
- `vm.$data`: 组件的数据对象
- `vm.$props`: 组件接收的props
- `vm.$computed`: 计算属性
- `vm.$watch`: 监听数据变化

### 2. DOM相关
- `vm.$el`: 组件挂载的DOM元素
- `vm.$refs`: 引用DOM元素或组件
- `vm.$slots`: 插槽内容
- `vm.$scopedSlots`: 作用域插槽

### 3. 组件通信相关
- `vm.$parent`: 父组件实例
- `vm.$children`: 子组件实例数组
- `vm.$root`: 根组件实例
- `vm.$emit`: 触发事件
- `vm.$on`: 监听事件

### 4. 生命周期相关
- `vm.$mount()`: 手动挂载组件
- `vm.$destroy()`: 销毁组件
- `vm.$forceUpdate()`: 强制更新
- `vm.$nextTick()`: 在下一次DOM更新后执行回调

## 实战案例

```javascript
/**
 * Vue实例创建的完整示例
 */
// HTML模板
// <div id="app">{{ message }} - {{ reversedMessage }}</div>

// 创建Vue实例
const vm = new Vue({
  el: '#app',
  data: {
    message: 'Hello Vue'
  },
  computed: {
    reversedMessage() {
      return this.message.split('').reverse().join('');
    }
  },
  methods: {
    updateMessage(newMessage) {
      this.message = newMessage;
    }
  },
  beforeCreate() {
    console.log('beforeCreate: 实例初始化前');
    console.log('data:', this.message); // undefined
  },
  created() {
    console.log('created: 实例创建完成');
    console.log('data:', this.message); // 'Hello Vue'
  },
  beforeMount() {
    console.log('beforeMount: 挂载前');
    console.log('$el:', this.$el); // 未编译的DOM元素
  },
  mounted() {
    console.log('mounted: 挂载完成');
    console.log('$el:', this.$el); // 已编译的DOM元素
    // 3秒后更新数据
    setTimeout(() => {
      this.updateMessage('Hello World');
    }, 3000);
  }
});
```

## 面试常见问题

### 1. Vue实例的生命周期钩子有哪些？它们的执行顺序是什么？

**答案**：
Vue实例的生命周期钩子主要包括：
- `beforeCreate`: 实例初始化前，数据和事件系统未初始化
- `created`: 实例创建完成，数据和事件系统已初始化，但DOM未挂载
- `beforeMount`: 挂载前，模板已编译，但未挂载到DOM
- `mounted`: 挂载完成，DOM已渲染
- `beforeUpdate`: 数据更新前
- `updated`: 数据更新后，DOM已重新渲染
- `beforeDestroy`: 实例销毁前
- `destroyed`: 实例销毁后

执行顺序为：`beforeCreate` -> `created` -> `beforeMount` -> `mounted` -> `beforeUpdate` -> `updated` -> `beforeDestroy` -> `destroyed`

### 2. `data`为什么是一个函数而不是对象？

**答案**：
在组件中，`data`必须是一个函数而不是对象，这是为了避免组件复用时代码共享导致的数据污染。当`data`是函数时，每次创建组件实例都会调用该函数，返回一个新的数据对象，确保每个组件实例都有独立的数据副本。

```javascript
// 正确的组件data定义
export default {
  data() {
    return {
      count: 0
    };
  }
}
```

### 3. 什么是响应式数据？Vue是如何实现响应式的？

**答案**：
响应式数据是指当数据发生变化时，视图会自动更新。Vue通过Object.defineProperty()来实现数据响应式：

1. 对数据对象的每个属性设置getter/setter
2. 当读取属性时（getter），收集依赖（即哪些地方使用了这个数据）
3. 当修改属性时（setter），触发依赖更新（即通知使用这个数据的地方重新渲染）

这种机制使得开发者可以专注于数据变化，而不需要手动操作DOM。

### 4. `$nextTick`的作用是什么？

**答案**：
`$nextTick`用于在下次DOM更新循环结束后执行延迟回调。当我们修改数据后，Vue不会立即更新DOM，而是将更新操作放入一个队列中。`$nextTick`可以让我们在DOM更新完成后执行回调函数，确保我们能获取到最新的DOM状态。

```javascript
// 使用示例
this.message = 'new message';
// 此时DOM尚未更新
console.log(this.$el.textContent); // 旧值

this.$nextTick(() => {
  // DOM已更新
  console.log(this.$el.textContent); // 新值
});
```

## 总结

`new Vue()`实例化过程是Vue框架的核心机制，涉及参数合并、生命周期初始化、事件系统、渲染系统、数据响应式处理等多个环节。理解这个过程有助于我们更好地使用Vue框架，解决开发中遇到的问题，并在面试中脱颖而出。

Vue实例的创建过程可以概括为：
1. 选项合并与初始化
2. 建立组件关系和生命周期
3. 初始化事件和渲染系统
4. 数据响应式处理
5. 挂载DOM并建立更新机制

通过这个过程，Vue将一个普通的JavaScript对象转换为一个具有响应式特性的组件实例。