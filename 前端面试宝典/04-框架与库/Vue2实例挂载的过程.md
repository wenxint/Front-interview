# Vue2实例挂载的过程

## 概念介绍

Vue实例挂载是Vue框架中将模板转换为真实DOM并渲染到页面的核心流程。这个过程涉及数据初始化、模板编译、依赖收集等多个关键步骤，最终实现数据驱动视图。

## Vue实例初始化流程

当使用`new Vue()`创建一个Vue实例时，整个初始化和挂载过程如下：

### 1. Vue构造函数调用

```javascript
// Vue构造函数
function Vue(options) {
  // 检查是否使用new关键字调用
  if (process.env.NODE_ENV !== 'production' &&
    !(this instanceof Vue)
  ) {
    warn('Vue is a constructor and should be called with the `new` keyword')
  }
  
  // 调用初始化方法
  this._init(options)
}
```

### 2. _init方法执行

`_init`方法是Vue实例初始化的核心，定义在`src/core/instance/init.js`中：

```javascript
Vue.prototype._init = function (options) {
  const vm = this
  // 每个实例都有唯一的_uid
  vm._uid = uid++
  
  // 避免被观察的标志
  vm._isVue = true
  
  // 合并选项
  if (options && options._isComponent) {
    initInternalComponent(vm, options)
  } else {
    vm.$options = mergeOptions(
      resolveConstructorOptions(vm.constructor),
      options || {},
      vm
    )
  }
  
  if (process.env.NODE_ENV !== 'production') {
    initProxy(vm)
  } else {
    vm._renderProxy = vm
  }
  
  // 暴露真实的self
  vm._self = vm
  
  // 初始化组件生命周期标志位
  initLifecycle(vm)
  // 初始化组件事件侦听
  initEvents(vm)
  // 初始化渲染方法
  initRender(vm)
  
  // 调用beforeCreate钩子
  callHook(vm, 'beforeCreate')
  
  // 初始化依赖注入内容，在初始化data、props之前
  initInjections(vm)
  
  // 初始化props/data/method/watch/methods
  initState(vm)
  
  initProvide(vm)
  
  // 调用created钩子
  callHook(vm, 'created')
  
  // 如果提供了el选项，则挂载元素
  if (vm.$options.el) {
    vm.$mount(vm.$options.el)
  }
}
```

### 3. initState数据初始化

`initState`方法负责初始化组件的各种状态：

```javascript
export function initState (vm) {
  // 初始化组件的watcher列表
  vm._watchers = []
  const opts = vm.$options
  
  // 初始化props
  if (opts.props) initProps(vm, opts.props)
  // 初始化methods方法
  if (opts.methods) initMethods(vm, opts.methods)
  
  if (opts.data) {
    // 初始化data  
    initData(vm)
  } else {
    observe(vm._data = {}, true /* asRootData */)
  }
  
  if (opts.computed) initComputed(vm, opts.computed)
  if (opts.watch && opts.watch !== nativeWatch) {
    initWatch(vm, opts.watch)
  }
}
```

## 挂载阶段详解

### 1. $mount方法调用

当Vue实例配置了`el`选项时，会调用`$mount`方法进行挂载：

```javascript
// 挂载元素
if (vm.$options.el) {
  vm.$mount(vm.$options.el)
}
```

### 2. 平台相关的挂载实现

在Web平台上，`$mount`方法在`src/platforms/web/runtime/index.js`中定义：

```javascript
// 公共的$mount方法
Vue.prototype.$mount = function (el, hydrating) {
  el = el && inBrowser ? query(el) : undefined
  return mountComponent(this, el, hydrating)
}
```

### 3. mountComponent核心挂载函数

`mountComponent`函数定义在`src/core/instance/lifecycle.js`中，是挂载过程的核心：

```javascript
export function mountComponent (vm, el, hydrating) {
  vm.$el = el
  
  // 如果没有渲染函数，则创建空的渲染函数
  if (!vm.$options.render) {
    vm.$options.render = createEmptyVNode
  }
  
  // 调用beforeMount钩子
  callHook(vm, 'beforeMount')
  
  let updateComponent
  if (process.env.NODE_ENV !== 'production' && config.performance && mark) {
    updateComponent = () => {
      const name = vm._name
      const id = vm._uid
      const startTag = `vue-perf-start:${id}`
      const endTag = `vue-perf-end:${id}`
      
      mark(startTag)
      const vnode = vm._render()
      mark(endTag)
      measure(`vue ${name} render`, startTag, endTag)
      
      mark(startTag)
      vm._update(vnode, hydrating)
      mark(endTag)
      measure(`vue ${name} patch`, startTag, endTag)
    }
  } else {
    updateComponent = () => {
      vm._update(vm._render(), hydrating)
    }
  }
  
  // 创建渲染Watcher
  vm._watcher = new Watcher(vm, updateComponent, noop, {
    before () {
      if (vm._isMounted && !vm._isDestroyed) {
        callHook(vm, 'beforeUpdate')
      }
    }
  }, true /* isRenderWatcher */)
  
  hydrating = false
  
  // 手动挂载的实例调用mounted钩子
  if (vm.$vnode == null) {
    vm._isMounted = true
    callHook(vm, 'mounted')
  }
  
  return vm
}
```

## 渲染过程详解

### 1. _render方法

`_render`方法负责生成虚拟DOM：

```javascript
Vue.prototype._render = function () {
  const vm = this
  const { render, _parentVnode } = vm.$options
  
  // 重置$slots和$scopedSlots
  if (_parentVnode) {
    vm.$scopedSlots = normalizeScopedSlots(
      _parentVnode.data.scopedSlots,
      vm.$slots,
      vm.$scopedSlots
    )
  }
  
  // 设置父级VNode
  vm.$vnode = _parentVnode
  
  let vnode
  try {
    // 执行render函数，生成VNode
    vnode = render.call(vm._renderProxy, vm.$createElement)
  } catch (e) {
    // 错误处理
    handleError(e, vm, `render`)
    vnode = vm._vnode
  }
  
  // 如果返回的是数组且只有一个元素，则直接使用该元素
  if (Array.isArray(vnode) && vnode.length === 1) {
    vnode = vnode[0]
  }
  
  // 设置父级
  vnode.parent = _parentVnode
  
  return vnode
}
```

### 2. _update方法

`_update`方法负责将虚拟DOM更新到真实DOM：

```javascript
Vue.prototype._update = function (vnode, hydrating) {
  const vm = this
  const prevEl = vm.$el
  const prevVnode = vm._vnode
  const restoreActiveInstance = setActiveInstance(vm)
  vm._vnode = vnode
  
  // Vue.prototype.__patch__ is injected in entry points
  // based on the rendering backend used.
  if (!prevVnode) {
    // 初始渲染
    vm.$el = vm.__patch__(vm.$el, vnode, hydrating, false
      /* removeOnly */
    )
  } else {
    // 更新
    vm.$el = vm.__patch__(prevVnode, vnode)
  }
  
  restoreActiveInstance()
  
  // 更新__vue__引用
  if (prevEl) {
    prevEl.__vue__ = null
  }
  if (vm.$el) {
    vm.$el.__vue__ = vm
  }
  
  // 如果父级是HOC（高阶组件），则也更新其$el
  if (vm.$vnode && vm.$parent && vm.$vnode === vm.$parent.$vnode) {
    vm.$parent.$el = vm.$el
  }
}
```

## 生命周期钩子调用顺序

在整个挂载过程中，Vue实例会按照以下顺序调用生命周期钩子：

1. `beforeCreate`：实例初始化之后，数据观测 (data observer) 和 event/watcher 事件配置之前被调用
2. `created`：实例创建完成后被立即调用，此时已完成数据观测、属性和方法的运算，但$el属性还没有被创建
3. `beforeMount`：在挂载开始之前被调用，相关的 render 函数首次被调用
4. `mounted`：实例被挂载后调用，这时 el 被新创建的 vm.$el 替换了

## 总结

Vue2实例挂载过程可以概括为以下几个关键步骤：

1. **实例初始化**：通过`new Vue()`创建实例，调用`_init`方法进行初始化
2. **数据初始化**：通过`initState`初始化data、props、methods、computed、watch等
3. **挂载前准备**：调用`beforeMount`钩子
4. **渲染过程**：
   - 调用`_render`方法生成虚拟DOM
   - 调用`_update`方法将虚拟DOM转换为真实DOM
5. **挂载完成**：调用`mounted`钩子，完成整个挂载过程

这个过程实现了Vue的核心特性：数据驱动视图，当数据发生变化时，视图会自动更新。