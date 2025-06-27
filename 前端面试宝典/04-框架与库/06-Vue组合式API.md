# Vue组合式API

## 基本概念

组合式API（Composition API）是Vue 3引入的一种新的编写组件逻辑的方式，它允许我们基于功能而非选项来组织代码，解决了Vue 2中选项式API（Options API）在复杂组件中代码组织和逻辑复用方面的问题。

### 核心优势

- **更好的逻辑复用**: 通过自定义组合函数（Composables）实现跨组件的逻辑复用
- **更灵活的代码组织**: 相关逻辑可以放在一起，而不是分散在不同的选项中
- **更好的类型推导**: 对TypeScript的支持更加友好
- **更小的打包体积**: 通过摇树优化（Tree-shaking）减少最终打包体积

## 核心API

### setup函数

`setup`是组合式API的入口点，Vue 3组件的所有组合式功能都是在此声明的：

```js
export default {
  setup(props, context) {
    // 这里声明响应式状态、方法和生命周期钩子

    // 返回一个对象，对象中的属性将被暴露给模板
    return {
      // ...
    }
  }
}
```

在`<script setup>`语法中，可以直接在`<script>`标签中编写组合式API代码，无需显式返回：

```vue
<script setup>
// 导入的组件会自动注册
import { ref, onMounted } from 'vue'

// 声明的变量直接暴露给模板使用
const count = ref(0)
const increment = () => count.value++

// 生命周期钩子
onMounted(() => {
  console.log('组件已挂载')
})
</script>

<template>
  <button @click="increment">{{ count }}</button>
</template>
```

### 响应式API

#### ref和reactive

Vue 3提供了两种主要的创建响应式状态的API：

**`ref`**: 用于将基本类型转换为响应式对象

```js
import { ref } from 'vue'

const count = ref(0)  // 创建响应式引用
console.log(count.value)  // 通过.value访问值
count.value++  // 修改值
```

**`reactive`**: 用于将对象转换为响应式对象

```js
import { reactive } from 'vue'

const state = reactive({
  count: 0,
  message: 'Hello'
})

console.log(state.count)  // 直接访问属性
state.count++  // 直接修改属性
```

#### 响应式系统工具函数

- **`computed`**: 创建计算属性

```js
import { ref, computed } from 'vue'

const count = ref(0)
const doubleCount = computed(() => count.value * 2)
```

- **`watch`和`watchEffect`**: 观察和响应响应式状态的变化

```js
import { ref, watch, watchEffect } from 'vue'

const count = ref(0)

// 监听特定值的变化
watch(count, (newValue, oldValue) => {
  console.log(`count从${oldValue}变为${newValue}`)
})

// 自动跟踪依赖并在它们变化时执行回调
watchEffect(() => {
  console.log(`count的当前值为: ${count.value}`)
})
```

- **`toRef`和`toRefs`**: 创建指向源对象属性的refs

```js
import { reactive, toRef, toRefs } from 'vue'

const state = reactive({
  foo: 1,
  bar: 2
})

// 创建一个ref，指向state.foo
const fooRef = toRef(state, 'foo')

// 将整个reactive对象转换为ref对象
const stateAsRefs = toRefs(state)
const { foo, bar } = stateAsRefs
```

### 生命周期钩子

组合式API提供了与选项式API相对应的生命周期钩子：

```js
import {
  onBeforeMount,
  onMounted,
  onBeforeUpdate,
  onUpdated,
  onBeforeUnmount,
  onUnmounted,
  onErrorCaptured
} from 'vue'

export default {
  setup() {
    onBeforeMount(() => {
      console.log('组件挂载前')
    })

    onMounted(() => {
      console.log('组件已挂载')
    })

    // 其他生命周期钩子...
  }
}
```

## 依赖注入

使用`provide`和`inject`来实现组件间的依赖注入：

```js
// 父组件
import { provide, ref } from 'vue'

export default {
  setup() {
    const theme = ref('dark')
    provide('theme', theme)  // 提供给后代组件
  }
}

// 后代组件
import { inject } from 'vue'

export default {
  setup() {
    const theme = inject('theme')  // 注入父级提供的值
    return { theme }
  }
}
```

## 组合函数(Composables)

组合函数是组合式API最强大的特性之一，它允许我们将组件逻辑提取到可重用的函数中：

```js
// useCounter.js
import { ref } from 'vue'

export function useCounter(initialValue = 0) {
  const count = ref(initialValue)

  function increment() {
    count.value++
  }

  function decrement() {
    count.value--
  }

  return { count, increment, decrement }
}

// 在组件中使用
import { useCounter } from './composables/useCounter'

export default {
  setup() {
    const { count, increment, decrement } = useCounter(10)
    return { count, increment, decrement }
  }
}
```

### 常见的组合函数示例

#### 状态管理

```js
// useState.js
import { reactive, toRefs } from 'vue'

export function useState(initialState) {
  const state = reactive(initialState)

  function setState(newState) {
    Object.assign(state, newState)
  }

  return {
    ...toRefs(state),
    setState
  }
}
```

#### 获取异步数据

```js
// useFetch.js
import { ref, watchEffect, toRefs } from 'vue'

export function useFetch(getUrl) {
  const data = ref(null)
  const error = ref(null)
  const loading = ref(false)

  async function fetchData() {
    loading.value = true
    error.value = null

    try {
      const url = typeof getUrl === 'function' ? getUrl() : getUrl
      const response = await fetch(url)
      data.value = await response.json()
    } catch (e) {
      error.value = e
    } finally {
      loading.value = false
    }
  }

  watchEffect(() => {
    fetchData()
  })

  return { data, error, loading, refetch: fetchData }
}
```

## 与TypeScript集成

组合式API对TypeScript的支持非常友好：

```ts
import { defineComponent, ref, Ref } from 'vue'

interface User {
  id: number
  name: string
}

export default defineComponent({
  setup() {
    const user: Ref<User | null> = ref(null)
    const loading = ref(false)

    async function fetchUser(id: number): Promise<void> {
      loading.value = true
      try {
        // 获取用户数据
        user.value = { id, name: 'John Doe' }
      } finally {
        loading.value = false
      }
    }

    return { user, loading, fetchUser }
  }
})
```

## 组合式API与选项式API对比

### 选项式API（Options API）

```js
export default {
  data() {
    return {
      count: 0,
      message: 'Hello'
    }
  },
  computed: {
    doubleCount() {
      return this.count * 2
    }
  },
  methods: {
    increment() {
      this.count++
    }
  },
  mounted() {
    console.log('组件已挂载')
  }
}
```

### 组合式API（Composition API）

```js
import { ref, computed, onMounted } from 'vue'

export default {
  setup() {
    const count = ref(0)
    const message = ref('Hello')

    const doubleCount = computed(() => count.value * 2)

    function increment() {
      count.value++
    }

    onMounted(() => {
      console.log('组件已挂载')
    })

    return {
      count,
      message,
      doubleCount,
      increment
    }
  }
}
```

## 最佳实践

1. **使用<script setup>语法**: 更简洁，性能更好
2. **按功能组织代码**: 将相关逻辑放在一起
3. **提取组合函数**: 将可复用逻辑提取到独立文件中
4. **合理命名**: 组合函数以`use`开头
5. **处理响应式丢失问题**: 了解响应式深层机制，避免解构导致响应性丢失
6. **优先使用`ref`**: 在大多数情况下优先使用`ref`而非`reactive`
7. **谨慎使用`toRefs`**: 不要过度使用`toRefs`对性能产生影响

## 常见问题与解决方案

### 响应式丢失

```js
const state = reactive({ count: 0 })
const { count } = state  // 丢失响应性!

// 解决方案
const { count } = toRefs(state)  // 保持响应性
```

### 更新深层嵌套对象

```js
const state = reactive({
  user: {
    profile: {
      address: {
        city: 'Beijing'
      }
    }
  }
})

// 更新深层嵌套属性
state.user.profile.address.city = 'Shanghai'
```

### 获取模板引用

```vue
<script setup>
import { ref, onMounted } from 'vue'

const inputRef = ref(null)

onMounted(() => {
  inputRef.value.focus()
})
</script>

<template>
  <input ref="inputRef" />
</template>
```

## 面试常见问题

1. **组合式API相比选项式API的优势是什么？**
   - 逻辑复用更容易
   - 代码组织更灵活
   - TypeScript类型推断更好
   - 打包体积更小

2. **`ref`和`reactive`有什么区别？**
   - `ref`可以包装任何值类型，访问需要`.value`
   - `reactive`只能用于对象类型，访问属性不需要`.value`
   - `ref`内部使用`reactive`实现

3. **如何处理响应式数据的解构问题？**
   - 使用`toRefs`/`toRef`转换reactive对象
   - 对于ref数据，保持其引用不解构

4. **如何在组合式API中访问生命周期钩子？**
   - 使用`onMounted`、`onUpdated`等钩子函数
   - 选项式API的`beforeCreate`和`created`对应setup函数本身

5. **组合函数的设计原则是什么？**
   - 职责单一
   - 命名以`use`开头
   - 返回响应式数据和方法
   - 参数接收配置选项，提供合理默认值

6. **Vue 3的响应式系统与Vue 2有什么不同？**
   - Vue 3使用Proxy而非Object.defineProperty
   - 可以检测属性添加、删除和数组索引修改
   - 性能更好，没有初始化时的递归转换开销

7. **如何优化使用组合式API的组件性能？**
   - 合理使用`shallowRef`和`shallowReactive`减少深度响应
   - 使用`computed`缓存计算结果
   - 避免不必要的响应式数据
   - 合理使用`v-once`和`v-memo`指令