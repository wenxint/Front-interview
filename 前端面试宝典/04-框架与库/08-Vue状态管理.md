# Vue状态管理

## 为什么需要状态管理

在Vue应用中，状态管理是指对应用中各个组件共享的数据进行统一管理的技术和模式。随着应用规模的增长，组件之间共享状态变得越来越复杂，主要体现在以下几个问题：

1. **多层组件嵌套的通信问题**：在深层组件树中，父子组件通信依赖props和事件，可能需要通过多个中间组件传递数据
2. **兄弟组件间通信困难**：不直接相关的组件之间共享状态需要提升到共同的父组件
3. **全局状态难以管理**：用户信息、应用配置等全局数据需要在多个组件中使用
4. **状态变化难以追踪**：当多个组件可以修改同一状态时，数据流向变得难以理解和调试

## Vue3的状态管理方案

### 1. 基于组合式API的简单状态管理

使用Vue3的组合式API，可以创建简单的状态管理解决方案：

```js
// store/counter.js
import { reactive, computed } from 'vue'

// 创建一个响应式状态
const state = reactive({
  count: 0
})

// 创建actions修改状态
const actions = {
  increment() {
    state.count++
  },
  decrement() {
    state.count--
  },
  incrementBy(amount) {
    state.count += amount
  }
}

// 创建getters
const getters = {
  doubleCount: computed(() => state.count * 2)
}

// 导出状态管理模块
export default {
  state,
  ...actions,
  ...getters
}
```

在组件中使用：

```vue
<script setup>
import counterStore from '@/store/counter'

// 在模板中可以直接使用
</script>

<template>
  <div>
    <p>Count: {{ counterStore.state.count }}</p>
    <p>Double Count: {{ counterStore.doubleCount }}</p>
    <button @click="counterStore.increment">+</button>
    <button @click="counterStore.decrement">-</button>
  </div>
</template>
```

### 2. provide/inject模式

使用Vue3的provide/inject API可以实现轻量级的状态管理：

```js
// StateProvider.vue
<script setup>
import { provide, reactive } from 'vue'

const state = reactive({
  user: null,
  theme: 'light'
})

function updateUser(newUser) {
  state.user = newUser
}

function setTheme(newTheme) {
  state.theme = newTheme
}

// 向子组件提供状态和修改方法
provide('appState', state)
provide('updateUser', updateUser)
provide('setTheme', setTheme)
</script>

<template>
  <slot></slot>
</template>
```

在子组件中使用：

```vue
<script setup>
import { inject } from 'vue'

// 注入状态和方法
const appState = inject('appState')
const updateUser = inject('updateUser')
const setTheme = inject('setTheme')

function login() {
  updateUser({ id: 1, name: 'User' })
}

function toggleTheme() {
  setTheme(appState.theme === 'light' ? 'dark' : 'light')
}
</script>

<template>
  <div :class="appState.theme">
    <p>Current user: {{ appState.user?.name || 'Not logged in' }}</p>
    <button @click="login">Login</button>
    <button @click="toggleTheme">Toggle Theme</button>
  </div>
</template>
```

## Pinia - Vue3推荐的状态管理方案

Pinia是Vue官方团队推荐的状态管理库，为Vue3设计，具有以下特点：

1. 简洁的API设计
2. 完整的TypeScript支持
3. 支持Vue DevTools调试
4. 极小的体积
5. 无需再创建mutation，直接变更状态
6. 支持多个store模块，且自动代码分割

### 基本使用

安装Pinia：

```bash
npm install pinia
```

在应用中注册：

```js
// main.js
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'

const app = createApp(App)
app.use(createPinia())
app.mount('#app')
```

定义Store：

```js
// stores/counter.js
import { defineStore } from 'pinia'

// 使用选项式API风格
export const useCounterStore = defineStore('counter', {
  // 状态
  state: () => ({
    count: 0,
    name: 'Counter'
  }),

  // 类似计算属性
  getters: {
    doubleCount: (state) => state.count * 2,
    // 使用this访问其他getter
    doubleCountPlusOne() {
      return this.doubleCount + 1
    }
  },

  // 同步和异步actions
  actions: {
    increment() {
      this.count++
    },
    async fetchAndAdd() {
      const result = await api.getNumber()
      this.count += result
    }
  }
})

// 或使用组合式API风格
export const useCounterStore = defineStore('counter', () => {
  const count = ref(0)
  const name = ref('Counter')

  const doubleCount = computed(() => count.value * 2)

  function increment() {
    count.value++
  }

  async function fetchAndAdd() {
    const result = await api.getNumber()
    count.value += result
  }

  return {
    count,
    name,
    doubleCount,
    increment,
    fetchAndAdd
  }
})
```

在组件中使用：

```vue
<script setup>
import { useCounterStore } from '@/stores/counter'

// 获取store实例
const counterStore = useCounterStore()

// 直接访问状态和getter
console.log(counterStore.count)
console.log(counterStore.doubleCount)

// 调用actions
function handleClick() {
  counterStore.increment()
}

// 也可以使用解构，但需要使用storeToRefs保持响应性
import { storeToRefs } from 'pinia'
const { count, doubleCount } = storeToRefs(counterStore)
// 注意：actions可以直接解构
const { increment } = counterStore
</script>

<template>
  <div>
    <p>Count: {{ counterStore.count }}</p>
    <p>Double: {{ counterStore.doubleCount }}</p>
    <button @click="counterStore.increment">+</button>
    <button @click="increment">+ (解构方法)</button>
  </div>
</template>
```

### Pinia的高级特性

#### 1. 订阅状态变化

```js
// 监听所有状态变化
const unsubscribe = counterStore.$subscribe((mutation, state) => {
  // 记录状态变化
  console.log(mutation.type) // 'direct' | 'patch'
  console.log(mutation.storeId) // store的ID
  console.log(mutation.payload) // 传递给patch的参数

  // 持久化到localStorage
  localStorage.setItem('counter', JSON.stringify(state))
}, { detached: false }) // detached: true 表示组件卸载时不取消订阅

// 取消订阅
unsubscribe()

// 监听action
counterStore.$onAction(({ name, args, after, onError, store }) => {
  console.log(`Action ${name} was called with args:`, args)

  after((result) => {
    console.log(`Action ${name} completed with result:`, result)
  })

  onError((error) => {
    console.error(`Action ${name} failed with error:`, error)
  })
})
```

#### 2. 插件系统

```js
// 创建Pinia插件
const myPlugin = ({ pinia, app, store, options }) => {
  // 添加属性
  store.myValue = 'plugin value'

  // 添加方法
  store.myMethod = () => console.log('plugin method')

  // 监听action
  store.$onAction(({ name }) => {
    console.log(`[Plugin] Action ${name} called`)
  })

  // 返回在组件中可用的属性
  return { hello: 'world' }
}

// 使用插件
const pinia = createPinia()
pinia.use(myPlugin)
```

#### 3. 热更新支持

```js
// stores/counter.js
import { defineStore } from 'pinia'

export const useCounterStore = defineStore('counter', {
  state: () => ({
    count: 0
  }),
  // ...
})

// 启用热更新
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useCounterStore, import.meta.hot))
}
```

#### 4. 持久化存储

使用插件实现状态持久化：

```js
// 创建一个持久化插件
const piniaLocalStorage = ({ pinia, options, store }) => {
  // 初始化时从localStorage获取数据
  const storageKey = `pinia-${store.$id}`
  const storedState = localStorage.getItem(storageKey)

  if (storedState) {
    store.$patch(JSON.parse(storedState))
  }

  // 监听变化存储到localStorage
  store.$subscribe((_, state) => {
    localStorage.setItem(storageKey, JSON.stringify(state))
  })
}

// 使用插件
const pinia = createPinia()
pinia.use(piniaLocalStorage)
```

## Vuex和Pinia的区别

虽然Vuex在Vue2时代是官方状态管理方案，但Vue3现在推荐使用Pinia。主要区别：

| 特性 | Vuex | Pinia |
|------|------|-------|
| 架构模式 | 单一状态树，模块嵌套 | 多个独立的store |
| Mutations | 必须使用mutations修改状态 | 直接在actions中修改状态 |
| 类型支持 | TypeScript支持有限 | 一流的TypeScript支持 |
| 开发体验 | 较多的样板代码 | API更加简洁友好 |
| 插件系统 | 有 | 有，且更加灵活 |
| 代码分割 | 需要手动配置 | 自动支持 |
| 调试工具 | Vue DevTools集成 | Vue DevTools集成，更好的体验 |
| 组合式API | 不支持 | 内置支持 |

## 最佳实践

### 1. Store结构设计

```
stores/
├── index.js          # 统一导出所有store
├── modules/          # 按领域或功能组织store
│   ├── auth.js       # 用户认证相关
│   ├── cart.js       # 购物车相关
│   └── products.js   # 产品相关
└── plugins/          # 自定义插件
    ├── persistence.js # 持久化插件
    └── logger.js     # 日志插件
```

### 2. 性能优化

```js
// 1. 使用shallowRef/shallowReactive减少深层响应
import { defineStore } from 'pinia'
import { shallowRef } from 'vue'

export const useProductStore = defineStore('products', () => {
  // 大型列表使用shallowRef
  const products = shallowRef([])

  async function fetchProducts() {
    products.value = await api.getProducts()
  }

  return { products, fetchProducts }
})

// 2. 按需加载store
export const useLargeStore = defineStore('large', () => {
  const state = ref(null)

  async function loadData() {
    if (state.value === null) {
      const data = await fetchLargeData()
      state.value = data
    }
  }

  return { state, loadData }
})
```

### 3. 组件中的使用模式

```vue
<script setup>
// 1. 按需解构store状态
import { useUserStore } from '@/stores/user'
import { storeToRefs } from 'pinia'

const userStore = useUserStore()
// 只提取需要的状态，保持响应性
const { name, email } = storeToRefs(userStore)
// actions可以直接解构
const { updateProfile } = userStore

// 2. 使用computed处理store状态
import { computed } from 'vue'
const userDisplayName = computed(() => {
  return userStore.name || userStore.email || 'Guest'
})
</script>
```

### 4. 测试Store

```js
// stores/counter.spec.js
import { setActivePinia, createPinia } from 'pinia'
import { useCounterStore } from '@/stores/counter'
import { test, expect, beforeEach } from 'vitest'

beforeEach(() => {
  // 创建新的pinia实例并设为活动实例
  setActivePinia(createPinia())
})

test('increments count', () => {
  const counter = useCounterStore()
  expect(counter.count).toBe(0)
  counter.increment()
  expect(counter.count).toBe(1)
})

test('doubles count', () => {
  const counter = useCounterStore()
  counter.count = 2
  expect(counter.doubleCount).toBe(4)
})
```

## 面试常见问题

1. **Vue3状态管理有哪些方案，各自的优缺点是什么？**
   - 响应式API自创简单状态管理：适合小型应用，缺乏开发工具支持
   - Provide/Inject：适合中小型应用，嵌套过深时代码可读性差
   - Pinia：适合中大型应用，提供完整的状态管理功能，开发体验好
   - Vuex：兼容Vue2/Vue3，但在Vue3中推荐使用Pinia

2. **为什么Vue3推荐Pinia而非Vuex？**
   - 更简洁的API，减少样板代码
   - 更好的TypeScript支持
   - 更小的体积
   - 不需要嵌套模块
   - 不需要命名空间
   - 不需要通过mutations修改状态

3. **如何在Vue3的Pinia中处理异步操作？**
   ```js
   // 在actions中直接处理异步操作
   actions: {
     async fetchUsers() {
       this.loading = true
       try {
         const data = await api.getUsers()
         this.users = data
       } catch (error) {
         this.error = error
       } finally {
         this.loading = false
       }
     }
   }
   ```

4. **如何在Vue3项目中实现状态持久化？**
   - 使用Pinia插件系统
   - 监听状态变化，保存到localStorage/sessionStorage
   - 初始化时从存储中恢复状态
   - 可使用第三方库如pinia-plugin-persistedstate

5. **Pinia如何组织大型应用的状态管理？**
   - 按功能或领域划分多个store
   - 使用组合函数共享逻辑
   - 利用TypeScript定义清晰的接口
   - 使用插件系统扩展功能
   - 按需加载store，优化性能