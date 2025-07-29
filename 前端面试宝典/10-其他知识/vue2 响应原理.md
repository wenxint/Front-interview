# Vue2响应式原理

## 概念介绍

Vue2的响应式系统是其核心特性之一，它允许数据模型的变化自动更新视图，实现了数据驱动开发。简单来说，当你修改Vue实例中的数据时，视图会自动重新渲染，无需手动操作DOM。

这个系统主要基于JavaScript的`Object.defineProperty`方法实现数据劫持，结合依赖收集机制来追踪数据变化并更新视图。

## 基本原理

### 数据劫持

Vue2通过`Object.defineProperty`方法为数据对象的每个属性添加getter和setter，实现对数据访问和修改的监听：

```javascript
// 简化版数据劫持实现
function defineReactive(obj, key, val) {
  // 递归处理嵌套对象
  if (typeof val === 'object' && val !== null) {
    new Observer(val);
  }

  const dep = new Dep(); // 创建依赖收集器

  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get() {
      console.log(`获取属性: ${key}`);
      // 收集依赖
      Dep.target && dep.addSub(Dep.target);
      return val;
    },
    set(newVal) {
      if (newVal === val) return;
      console.log(`设置属性: ${key} = ${newVal}`);
      val = newVal;
      // 通知依赖更新
      dep.notify();
    }
  });
}
```

### Observer类

Observer类用于将普通对象转换为响应式对象，遍历对象的所有属性并为它们添加响应式处理：

```javascript
class Observer {
  constructor(data) {
    this.data = data;
    this.walk(data);
  }

  // 遍历对象属性并添加响应式
  walk(obj) {
    Object.keys(obj).forEach(key => {
      defineReactive(obj, key, obj[key]);
    });
  }
}
```

## 依赖收集过程

依赖收集是Vue2响应式系统的核心，它会追踪哪些组件依赖于哪些数据，以便在数据变化时只更新相关组件。

### Dep类（依赖收集器）

Dep类用于管理依赖，每个响应式属性都会有一个对应的Dep实例：

```javascript
class Dep {
  constructor() {
    // 存储所有依赖的Watcher
    this.subs = [];
  }

  // 添加依赖
  addSub(sub) {
    this.subs.push(sub);
  }

  // 通知所有依赖更新
  notify() {
    this.subs.forEach(sub => sub.update());
  }
}

// Dep.target用于暂存当前Watcher
Dep.target = null;
```

### Watcher类（观察者）

Watcher类代表一个依赖，当数据变化时会收到通知并执行相应的更新函数：

```javascript
class Watcher {
  constructor(vm, expOrFn, callback) {
    this.vm = vm;
    this.callback = callback;
    // 记录当前Watcher，用于依赖收集
    Dep.target = this;
    // 触发getter，收集依赖
    this.value = this.getExpValue(vm, expOrFn);
    // 重置target
    Dep.target = null;
  }

  // 获取表达式的值
  getExpValue(vm, expOrFn) {
    return typeof expOrFn === 'function' ? expOrFn.call(vm) : vm[expOrFn];
  }

  // 更新方法
  update() {
    const oldValue = this.value;
    this.value = this.getExpValue(this.vm, this.expOrFn);
    this.callback.call(this.vm, this.value, oldValue);
  }
}
```

### 依赖收集完整流程

1. **初始化阶段**：
   - Vue实例初始化时，会将data选项传入Observer
   - Observer遍历data中的所有属性，为每个属性添加getter和setter
   - 每个属性会创建一个Dep实例

2. **模板编译阶段**：
   - Vue编译模板时，会为每个使用到数据的地方创建Watcher
   - 创建Watcher时，会将自身赋值给Dep.target
   - 访问数据属性，触发getter
   - getter将当前Watcher添加到该属性的Dep实例中
   - 完成依赖收集后，重置Dep.target

3. **数据更新阶段**：
   - 当数据属性被修改时，触发setter
   - setter调用Dep实例的notify方法
   - Dep实例通知所有依赖的Watcher执行update方法
   - Watcher执行回调函数，更新视图

## 简单实现示例

```javascript
// 简单的Vue响应式实现
class Vue {
  constructor(options) {
    this.$data = options.data;
    this.$el = document.querySelector(options.el);

    // 将data转换为响应式
    new Observer(this.$data);
    // 编译模板
    this.compile(this.$el);
  }

  // 简单的模板编译
  compile(el) {
    const childNodes = el.childNodes;
    Array.from(childNodes).forEach(node => {
      if (node.nodeType === 1) {
        // 元素节点
        this.compileElement(node);
        this.compile(node); // 递归编译子节点
      } else if (node.nodeType === 3) {
        // 文本节点
        this.compileText(node);
      }
    });
  }

  compileText(node) {
    const text = node.textContent;
    const reg = /\{\{(.+)\}\}/;
    if (reg.test(text)) {
      const exp = RegExp.$1.trim();
      // 创建Watcher，当数据变化时更新文本
      new Watcher(this, exp, (newVal) => {
        node.textContent = text.replace(reg, newVal);
      });
      // 初始值设置
      node.textContent = text.replace(reg, this.getExpValue(exp));
    }
  }

  getExpValue(exp) {
    return exp.split('.').reduce((obj, key) => obj[key], this.$data);
  }
}

// 使用示例
const vm = new Vue({
  el: '#app',
  data: {
    message: 'Hello Vue!',
    user: {
      name: 'Vue2'
    }
  }
});
```

## 常见问题及解决方案

### 1. 对象新增属性无法响应

Vue2无法检测对象新增属性，需要使用`Vue.set`方法：

```javascript
// 错误方式
vm.user.age = 20; // 无法检测

// 正确方式
Vue.set(vm.user, 'age', 20);
// 或者
this.$set(this.user, 'age', 20);
```

### 2. 数组变化检测问题

Vue2无法检测数组索引和长度变化，需要使用变异方法：

```javascript
// 错误方式
vm.items[0] = 'newValue'; // 无法检测
vm.items.length = 0; // 无法检测

// 正确方式
vm.items.splice(0, 1, 'newValue'); // 使用splice
vm.items.push('newItem'); // 使用变异方法
Vue.set(vm.items, 0, 'newValue'); // 使用Vue.set
```

## 初级程序员面试题

### Q1: Vue2响应式原理的核心是什么？
A1: Vue2响应式原理的核心是使用`Object.defineProperty`实现数据劫持，结合Dep和Watcher进行依赖收集和通知更新。当数据被访问时收集依赖，当数据被修改时通知依赖更新视图。

### Q2: 什么是依赖收集？为什么需要依赖收集？
A2: 依赖收集是追踪哪些组件依赖哪些数据的过程。有了依赖收集，Vue可以在数据变化时只更新依赖该数据的组件，而不是更新整个视图，提高性能。

### Q3: 为什么直接给对象添加属性不能触发视图更新？
A3: 因为Vue2的响应式是在初始化时通过`Object.defineProperty`为已有属性添加getter和setter实现的。新增属性没有经过这个过程，所以无法被Vue检测到。需要使用`Vue.set`方法手动添加响应式属性。

### Q4: Vue2如何检测数组变化？
A4: Vue2通过重写数组的7个变异方法（push, pop, shift, unshift, splice, sort, reverse）来检测数组变化。当调用这些方法时，Vue会触发视图更新。但直接修改数组索引或长度无法被检测。