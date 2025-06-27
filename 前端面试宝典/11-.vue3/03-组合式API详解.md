# 组合式API详解

> 组合式API (Composition API) 是Vue3的核心特性，它提供了一种更灵活的组织组件逻辑的方式。本文详细介绍组合式API的设计理念、核心函数和实际应用。

## 概念介绍

组合式API是Vue3引入的一组基于函数的API，它允许我们使用导入的API函数而不是声明选项的方式来编写Vue组件。与Vue2的Options API（选项式API）相比，组合式API提供了更好的代码组织能力、逻辑复用能力和类型推导。

组合式API解决了Vue2中常见的几个问题：
1. 代码组织：相关逻辑可以放在一起，而不是分散在不同的选项中
2. 逻辑复用：可以轻松提取和重用逻辑，而不需要通过混入(mixins)或高阶组件
3. 更好的TypeScript类型推导：函数参数和返回值的类型推导比选项对象更简单直接

## 核心API概览

组合式API包含了一系列函数，主要分为以下几类：

### 1. 响应式API

- `ref`：创建一个响应式的值引用
- `reactive`：创建一个响应式对象
- `computed`：创建一个计算属性
- `watch`/`watchEffect`：监听响应式数据变化
- `readonly`：创建一个只读的响应式引用

### 2. 生命周期钩子

- `onMounted`：组件挂载完成时调用
- `onUpdated`：组件更新后调用
- `onUnmounted`：组件卸载前调用
- `onBeforeMount`：组件挂载前调用
- `onBeforeUpdate`：组件更新前调用
- `onBeforeUnmount`：组件卸载前调用
- `onErrorCaptured`：捕获来自后代组件的错误
- `onActivated`：被keep-alive缓存的组件激活时调用
- `onDeactivated`：被keep-alive缓存的组件停用时调用

### 3. 依赖注入

- `provide`：向后代组件提供数据
- `inject`：从祖先组件注入提供的数据

### 4. 模板引用

- `ref`：获取模板中元素或组件的引用

## 基本使用方式

### setup 函数

在Vue3中，组合式API主要通过`setup`函数使用：

```javascript
/**
 * @description 使用setup函数的基本示例
 */
import { ref, onMounted } from 'vue'

export default {
  setup() {
    // 响应式状态
    const count = ref(0)

    // 方法
    function increment() {
      count.value++
    }

    // 生命周期钩子
    onMounted(() => {
      console.log('组件已挂载')
    })

    // 返回值会暴露给模板和其他选项
    return {
      count,
      increment
    }
  }
}
```

### `<script setup>` 语法糖

Vue3.2引入的`<script setup>`语法糖是组合式API的编译时语法糖，提供了更简洁的编写方式：

```vue
<template>
  <button @click="increment">计数：{{ count }}</button>
</template>

<script setup>
import { ref, onMounted } from 'vue'

// 响应式状态
const count = ref(0)

// 方法
function increment() {
  count.value++
}

// 生命周期钩子
onMounted(() => {
  console.log('组件已挂载')
})

// 无需return，所有变量自动暴露给模板
</script>
```

## 响应式API详解

### ref

`ref`用于创建包含单一值的响应式引用，适用于任意类型：

```javascript
/**
 * @description ref的使用示例
 */
import { ref } from 'vue'

// 创建基本类型的响应式引用
const count = ref(0)
console.log(count.value) // 0
count.value++
console.log(count.value) // 1

// 创建对象类型的响应式引用
const user = ref({ name: 'Alice', age: 25 })
console.log(user.value.name) // Alice
user.value.age = 26
// 整个对象替换
user.value = { name: 'Bob', age: 30 }

// 模板中自动解包，无需.value
// <div>{{ count }} {{ user.name }}</div>
```

### reactive

`reactive`用于创建响应式对象，适用于对象类型：

```javascript
/**
 * @description reactive的使用示例
 */
import { reactive } from 'vue'

// 创建响应式对象
const state = reactive({
  count: 0,
  user: {
    name: 'Alice',
    age: 25
  }
})

// 直接访问和修改属性
console.log(state.count) // 0
state.count++
console.log(state.count) // 1

// 嵌套属性也是响应式的
state.user.age = 26
// 注意：不能直接替换整个reactive对象
// state = reactive({}) // ❌ 不起作用
```

### computed

`computed`用于创建基于响应式状态的计算属性：

```javascript
/**
 * @description computed的使用示例
 */
import { ref, computed } from 'vue'

const count = ref(0)

// 只读计算属性
const doubleCount = computed(() => count.value * 2)
console.log(doubleCount.value) // 0

count.value = 2
console.log(doubleCount.value) // 4

// 可写计算属性
const plusOne = computed({
  get: () => count.value + 1,
  set: (val) => {
    count.value = val - 1
  }
})

console.log(plusOne.value) // 3
plusOne.value = 10 // 触发set函数
console.log(count.value) // 9
```

### watch

`watch`用于监听响应式状态的变化：

```javascript
/**
 * @description watch的使用示例
 */
import { ref, reactive, watch } from 'vue'

const count = ref(0)
const state = reactive({ count: 0 })

// 监听ref
watch(count, (newValue, oldValue) => {
  console.log(`count从${oldValue}变为${newValue}`)
}, { immediate: true }) // 立即执行一次

// 监听reactive的属性
watch(
  () => state.count,
  (newValue, oldValue) => {
    console.log(`state.count从${oldValue}变为${newValue}`)
  }
)

// 监听多个来源
watch(
  [count, () => state.count],
  ([newCount, newStateCount], [oldCount, oldStateCount]) => {
    console.log(`多个值变化: ${oldCount}->${newCount}, ${oldStateCount}->${newStateCount}`)
  }
)

// 深度监听
watch(state, (newState, oldState) => {
  console.log('state发生变化:', newState)
}, { deep: true })
```

### watchEffect

`watchEffect`用于自动追踪依赖并在依赖变化时执行回调：

```javascript
/**
 * @description watchEffect的使用示例
 */
import { ref, watchEffect } from 'vue'

const count = ref(0)
const message = ref('Hello')

// 自动追踪count和message的依赖
const stop = watchEffect(() => {
  console.log(`Count: ${count.value}, Message: ${message.value}`)
})

// 修改值会触发watchEffect回调
count.value++ // 输出: Count: 1, Message: Hello
message.value = 'World' // 输出: Count: 1, Message: World

// 停止监听
stop()

// 此后的修改不会触发回调
count.value++ // 没有输出
```

## 生命周期钩子

组合式API提供了一系列生命周期钩子函数，对应Vue2中的生命周期选项：

```javascript
/**
 * @description 组合式API生命周期钩子示例
 */
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

    onBeforeUpdate(() => {
      console.log('组件更新前')
    })

    onUpdated(() => {
      console.log('组件已更新')
    })

    onBeforeUnmount(() => {
      console.log('组件卸载前')
    })

    onUnmounted(() => {
      console.log('组件已卸载')
    })

    onErrorCaptured((err, instance, info) => {
      console.log('捕获到错误:', err)
      return false // 阻止错误继续传播
    })
  }
}
```

生命周期对应关系：

| 选项式API | 组合式API |
|----------|----------|
| beforeCreate/created | setup() |
| beforeMount | onBeforeMount |
| mounted | onMounted |
| beforeUpdate | onBeforeUpdate |
| updated | onUpdated |
| beforeUnmount | onBeforeUnmount |
| unmounted | onUnmounted |
| errorCaptured | onErrorCaptured |
| renderTracked | onRenderTracked |
| renderTriggered | onRenderTriggered |
| activated | onActivated |
| deactivated | onDeactivated |

## 依赖注入

`provide`和`inject`用于跨组件传递数据，尤其是在组件层次较深的情况：

```javascript
/**
 * @description 依赖注入示例
 */
// 父组件
import { provide, ref } from 'vue'

export default {
  setup() {
    // 提供一个响应式值
    const theme = ref('light')

    // 提供值和修改方法
    provide('theme', {
      theme,
      toggleTheme: () => {
        theme.value = theme.value === 'light' ? 'dark' : 'light'
      }
    })
  }
}

// 后代组件(可能嵌套很深)
import { inject } from 'vue'

export default {
  setup() {
    // 注入由祖先组件提供的值
    const { theme, toggleTheme } = inject('theme')

    // 可以使用默认值
    const userSettings = inject('settings', { notifications: true })

    return { theme, toggleTheme, userSettings }
  }
}
```

## 组合式函数(Composables)

组合式函数是组合式API最强大的特性之一，它允许我们提取和重用有状态逻辑：

```javascript
/**
 * @description 一个获取鼠标位置的组合式函数
 * @file useMousePosition.js
 */
import { ref, onMounted, onUnmounted } from 'vue'

export function useMousePosition() {
  const x = ref(0)
  const y = ref(0)

  function update(event) {
    x.value = event.pageX
    y.value = event.pageY
  }

  onMounted(() => {
    window.addEventListener('mousemove', update)
  })

  onUnmounted(() => {
    window.removeEventListener('mousemove', update)
  })

  return { x, y }
}
```

使用组合式函数：

```vue
<template>
  <div>
    鼠标位置：x: {{ x }}, y: {{ y }}
  </div>
</template>

<script setup>
import { useMousePosition } from './useMousePosition'

// 使用组合式函数
const { x, y } = useMousePosition()
</script>
```

## 实战案例

### 案例1：实现表单验证逻辑（组合式API）

```javascript
/**
 * @description 使用组合式API封装表单验证逻辑
 */
import { ref, reactive, watch } from 'vue'

function useFormValidation(initialValues, validationRules) {
  // 表单数据
  const formData = reactive(initialValues)
  // 错误信息
  const errors = ref({})

  // 验证单个字段
  const validateField = (field) => {
    const rules = validationRules[field]
    const value = formData[field]
    let error = ''

    if (rules.required && !value) {
      error = `${field}是必填项`
    }
    if (rules.minLength && value.length < rules.minLength) {
      error = `${field}至少需要${rules.minLength}个字符`
    }
    if (rules.pattern && !new RegExp(rules.pattern).test(value)) {
      error = `${field}格式不正确`
    }

    errors.value[field] = error
  }

  // 验证所有字段
  const validateAll = () => {
    Object.keys(validationRules).forEach(field => validateField(field))
    return Object.values(errors.value).every(e => !e)
  }

  // 监听字段变化自动验证
  watch(() => formData, (newVal, oldVal) => {
    Object.keys(newVal).forEach(field => {
      if (newVal[field] !== oldVal[field]) {
        validateField(field)
      }
    })
  }, { deep: true })

  return {
    formData,
    errors,
    validateField,
    validateAll
  }
}

// 兼容性说明：支持Vue3.0+，需配合Vuelidate 2.0+使用（可选）
```

```javascript
/**
 * @description 表单验证组合式函数
 * @file useFormValidation.js
 */
import { reactive, computed } from 'vue'

export function useFormValidation(initialState, validations) {
  // 表单状态
  const formState = reactive({ ...initialState })

  // 错误状态
  const errors = reactive({})

  // 验证表单字段
  const validateField = (field) => {
    // 获取字段的验证规则
    const fieldValidations = validations[field]
    if (!fieldValidations) return true

    // 清除当前字段的错误
    errors[field] = ''

    // 执行所有验证规则
    for (const rule of fieldValidations) {
      const result = rule(formState[field], formState)
      if (result !== true) {
        errors[field] = result
        return false
      }
    }

    return true
  }

  // 验证整个表单
  const validateForm = () => {
    let valid = true

    // 验证所有字段
    for (const field in validations) {
      if (!validateField(field)) {
        valid = false
      }
    }

    return valid
  }

  // 表单是否有效
  const isValid = computed(() => {
    for (const field in errors) {
      if (errors[field]) return false
    }
    return true
  })

  // 重置表单
  const resetForm = () => {
    Object.assign(formState, initialState)
    for (const field in errors) {
      errors[field] = ''
    }
  }

  return {
    formState,
    errors,
    validateField,
    validateForm,
    isValid,
    resetForm
  }
}
```

使用表单验证组合式函数：

```vue
<template>
  <form @submit.prevent="submitForm">
    <div>
      <label for="username">用户名:</label>
      <input
        id="username"
        v-model="formState.username"
        @blur="validateField('username')"
      />
      <span v-if="errors.username" class="error">{{ errors.username }}</span>
    </div>

    <div>
      <label for="email">邮箱:</label>
      <input
        id="email"
        v-model="formState.email"
        @blur="validateField('email')"
      />
      <span v-if="errors.email" class="error">{{ errors.email }}</span>
    </div>

    <div>
      <label for="password">密码:</label>
      <input
        id="password"
        type="password"
        v-model="formState.password"
        @blur="validateField('password')"
      />
      <span v-if="errors.password" class="error">{{ errors.password }}</span>
    </div>

    <button type="submit" :disabled="!isValid">提交</button>
    <button type="button" @click="resetForm">重置</button>
  </form>
</template>

<script setup>
import { useFormValidation } from './useFormValidation'

// 定义初始表单状态
const initialState = {
  username: '',
  email: '',
  password: ''
}

// 定义验证规则
const validations = {
  username: [
    v => !!v || '用户名不能为空',
    v => v.length >= 3 || '用户名长度不能少于3个字符'
  ],
  email: [
    v => !!v || '邮箱不能为空',
    v => /^.+@.+\..+$/.test(v) || '邮箱格式不正确'
  ],
  password: [
    v => !!v || '密码不能为空',
    v => v.length >= 6 || '密码长度不能少于6个字符'
  ]
}

// 使用表单验证组合式函数
const {
  formState,
  errors,
  validateField,
  validateForm,
  isValid,
  resetForm
} = useFormValidation(initialState, validations)

// 提交表单
function submitForm() {
  if (validateForm()) {
    // 表单验证通过，可以提交
    console.log('表单提交:', formState)
    // 实际项目中这里可能会调用API
  } else {
    console.log('表单验证失败')
  }
}
</script>

<style scoped>
.error {
  color: red;
  font-size: 12px;
}
</style>
```

### 案例2：实现数据请求逻辑（带加载状态）

```javascript
/**
 * @description 使用组合式API封装带加载状态的数据请求
 */
import { ref, computed } from 'vue'
import axios from 'axios'

function useDataFetch(url) {
  const data = ref(null)
  const loading = ref(false)
  const error = ref(null)

  const fetchData = async () => {
    loading.value = true
    error.value = null
    try {
      const response = await axios.get(url)
      data.value = response.data
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  const isEmpty = computed(() => !data.value || Object.keys(data.value).length === 0)

  return {
    data,
    loading,
    error,
    fetchData,
    isEmpty
  }
}

// 兼容性说明：支持现代浏览器（Chrome 64+, Firefox 78+），需安装axios 0.27+依赖
```

```javascript
/**
 * @description API请求处理组合式函数
 * @file useApi.js
 */
import { ref, computed } from 'vue'

export function useApi(apiFn) {
  const data = ref(null)
  const error = ref(null)
  const loading = ref(false)

  // 请求状态
  const isLoading = computed(() => loading.value)
  const isError = computed(() => error.value !== null)
  const isSuccess = computed(() => !loading.value && !error.value && data.value !== null)

  // 执行请求
  async function execute(...args) {
    loading.value = true
    error.value = null

    try {
      const result = await apiFn(...args)
      data.value = result
      return result
    } catch (err) {
      error.value = err
      return Promise.reject(err)
    } finally {
      loading.value = false
    }
  }

  // 重置状态
  function reset() {
    data.value = null
    error.value = null
    loading.value = false
  }

  return {
    data,
    error,
    loading,
    isLoading,
    isError,
    isSuccess,
    execute,
    reset
  }
}
```

使用API组合式函数：

```vue
<template>
  <div>
    <h2>用户列表</h2>

    <button @click="fetchUsers" :disabled="isLoading">
      {{ isLoading ? '加载中...' : '刷新数据' }}
    </button>

    <div v-if="isLoading">
      加载中...
    </div>

    <div v-else-if="isError">
      加载失败: {{ error.message }}
    </div>

    <ul v-else-if="isSuccess">
      <li v-for="user in data" :key="user.id">
        {{ user.name }} ({{ user.email }})
      </li>
    </ul>

    <div v-else>
      暂无数据，请点击刷新
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useApi } from './useApi'

// 模拟API函数
async function fetchUsersApi() {
  // 实际项目中这里会是真实的API调用
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() > 0.2) { // 80%成功率
        resolve([
          { id: 1, name: '张三', email: 'zhangsan@example.com' },
          { id: 2, name: '李四', email: 'lisi@example.com' },
          { id: 3, name: '王五', email: 'wangwu@example.com' }
        ])
      } else {
        reject(new Error('网络错误，请稍后再试'))
      }
    }, 1000) // 模拟网络延迟
  })
}

// 使用API组合式函数
const {
  data,
  error,
  loading,
  isLoading,
  isError,
  isSuccess,
  execute: fetchUsers
} = useApi(fetchUsersApi)

// 组件挂载时自动获取数据
onMounted(fetchUsers)
</script>
```

## 组合式API优劣分析

### 优势

1. **更好的代码组织**：相关逻辑可以集中在一起，而不是分散在不同选项中

2. **更强的逻辑复用**：可以轻松提取和复用逻辑，通过组合式函数替代混入和高阶组件

3. **更好的类型推导**：对TypeScript友好，提供了自然的类型推导

4. **更小的打包体积**：通过摇树优化，只打包使用的API

5. **更好的开发体验**：组合式函数可以在开发工具中获得更好的智能提示

### 局限性

1. **学习曲线**：对Vue2用户来说有一定学习成本

2. **引用类型的限制**：使用reactive时需要注意引用的保持

3. **调试复杂性**：响应式系统可能使调试变得更复杂

4. **代码组织不当**：如果没有良好的组织，可能导致setup函数过于庞大

## 最佳实践

1. **优先使用`<script setup>`语法**：更简洁、性能更好

2. **合理拆分组合式函数**：根据功能职责拆分为小的可复用函数

3. **ref vs reactive**：
   - 基本类型值使用ref
   - 对象类型可以使用reactive
   - 需要在函数间传递和返回的对象使用ref包装

4. **保持响应式**：
   - 避免解构reactive对象（会丢失响应性）
   - 如需解构，使用toRefs或toRef

5. **组件引用**：使用ref函数和defineExpose暴露组件方法和属性

```javascript
// 父组件
<script setup>
import { ref, onMounted } from 'vue'
import ChildComponent from './ChildComponent.vue'

// 模板引用
const childRef = ref(null)

onMounted(() => {
  // 访问子组件暴露的方法
  childRef.value.doSomething()
})
</script>

<template>
  <ChildComponent ref="childRef" />
</template>

// 子组件
<script setup>
function doSomething() {
  console.log('Child method called!')
}

// 显式暴露方法给父组件
defineExpose({
  doSomething
})
</script>
```

## 兼容性说明

组合式API对构建工具的兼容性要求如下：

| 构建工具 | 最低版本 | 备注                     |
|----------|----------|--------------------------|
| Vite     | 2.0+     | 推荐使用，对Vue3优化最佳 |
| Webpack  | 5.0+     | 需要配置vue-loader 17.0+  |
| Vue CLI  | 4.5+     | 需选择Vue3预设           |

## 面试常见问题

### Vue3的组合式API和Vue2的选项式API有什么区别？

**答**：Vue3的组合式API与Vue2的选项式API在以下几个方面存在区别：

1. **代码组织方式**：
   - 选项式API按照options选项(`data`, `methods`, `computed`等)组织代码
   - 组合式API按照逻辑功能组织代码，相关功能可以放在一起

2. **逻辑复用机制**：
   - 选项式API主要依赖mixins、高阶组件等实现逻辑复用
   - 组合式API通过组合式函数(Composables)实现逻辑复用，没有命名冲突问题

3. **TypeScript支持**：
   - 选项式API对TypeScript的支持有限
   - 组合式API专为TypeScript设计，提供更好的类型推导

4. **性能优化**：
   - 组合式API可以更好地进行摇树优化，减小打包体积
   - 使用`<script setup>`时，编译优化更彻底

5. **响应式系统**：
   - 选项式API基于`this`上下文和选项合并
   - 组合式API基于响应式API函数(`ref`, `reactive`等)

```javascript
// 选项式API示例
export default {
  data() {
    return {
      count: 0
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

// 组合式API示例
import { ref, onMounted } from 'vue'

export default {
  setup() {
    const count = ref(0)

    function increment() {
      count.value++
    }

    onMounted(() => {
      console.log('组件已挂载')
    })

    return { count, increment }
  }
}

// 使用<script setup>的组合式API
<script setup>
import { ref, onMounted } from 'vue'

const count = ref(0)

function increment() {
  count.value++
}

onMounted(() => {
  console.log('组件已挂载')
})
</script>
```

### 为什么Vue3引入组合式API？

**答**：Vue3引入组合式API的主要原因：

1. **代码组织问题**：随着组件复杂度增加，选项式API将相关逻辑分散在不同选项中，导致代码难以理解和维护。组合式API允许按功能组织代码。

2. **逻辑复用限制**：Vue2中的mixins和高阶组件存在命名冲突、数据来源不清晰等问题。组合式API通过函数提供了更清晰的逻辑复用方式。

3. **TypeScript支持**：选项式API对TypeScript的类型推导支持有限。组合式API的设计考虑了TypeScript的类型系统，提供更好的类型安全。

4. **打包优化**：基于函数的API更容易进行摇树优化，可以只打包使用的功能，减小应用体积。

5. **框架扩展能力**：组合式API提供了更好的框架扩展能力，使Vue生态系统更丰富。

### `setup`函数的执行时机是什么？

**答**：`setup`函数是组合式API的入口点，它有以下执行特点：

1. **执行时机**：`setup`函数在组件实例创建时执行，在`beforeCreate`钩子之前执行。

2. **只执行一次**：`setup`只在组件初始化时执行一次，不会随组件更新而重新执行。

3. **没有this上下文**：在`setup`中不能访问组件实例(this)，因为它在实例创建之前就执行了。

4. **接收props和context**：
   ```javascript
   export default {
     props: ['title'],
     setup(props, context) {
       // props是响应式的
       console.log(props.title)

       // context包含emit, attrs, slots
       context.emit('change')
     }
   }
   ```

5. **返回值**：`setup`返回的对象中的属性会作为组件实例的属性，可在模板中访问。

6. **异步setup**：Vue3.3+支持async setup，但需要配合Suspense组件使用。

### 组合式API中如何处理响应式数据解构问题？

**答**：在组合式API中，解构响应式数据时需要特别注意：

1. **ref的解构**：
   - ref是一个带有.value属性的对象，解构不会丢失响应性
   - 在模板中访问ref会自动解包(.value)

2. **reactive的解构问题**：
   - 直接解构reactive对象会丢失响应性

   ```javascript
   const state = reactive({ count: 0 })
   const { count } = state // count失去响应性
   ```

3. **解决方案**：

   1. 使用`toRefs`转换整个对象：
   ```javascript
   import { reactive, toRefs } from 'vue'

   const state = reactive({ count: 0, name: 'Vue' })
   // 保持响应性的解构
   const { count, name } = toRefs(state)

   // 现在可以直接使用count.value和name.value
   ```

   2. 使用`toRef`转换单个属性：
   ```javascript
   import { reactive, toRef } from 'vue'

   const state = reactive({ count: 0 })
   const count = toRef(state, 'count')

   // count.value与state.count保持同步
   ```

   3. 使用`computed`创建派生值：
   ```javascript
   import { reactive, computed } from 'vue'

   const state = reactive({ count: 0 })
   const doubleCount = computed(() => state.count * 2)
   ```

   4. 直接使用ref替代reactive：
   ```javascript
   import { ref } from 'vue'

   const count = ref(0)
   const name = ref('Vue')

   // 可以安全地传递和解构
   ```

### 如何在组合式API中正确使用生命周期钩子？

**答**：组合式API提供了一系列生命周期钩子函数，使用时需要注意以下几点：

1. **导入方式**：生命周期钩子需要从Vue中显式导入
   ```javascript
   import { onMounted, onUpdated, onUnmounted } from 'vue'
   ```

2. **注册时机**：生命周期钩子必须在`setup`函数或`<script setup>`中同步调用，不能在条件语句或回调函数中调用
   ```javascript
   // 正确
   setup() {
     onMounted(() => {})
     return {}
   }

   // 错误
   setup() {
     if (condition) {
       onMounted(() => {}) // 不允许条件调用
     }
     return {}
   }
   ```

3. **执行顺序**：多个相同类型的钩子按照注册顺序执行
   ```javascript
   onMounted(() => {
     console.log('挂载钩子 1')
   })

   onMounted(() => {
     console.log('挂载钩子 2')
   })
   // 输出顺序: "挂载钩子 1" 然后 "挂载钩子 2"
   ```

4. **与选项式API的映射关系**：
   - `beforeCreate`/`created` → `setup()`
   - `beforeMount` → `onBeforeMount`
   - `mounted` → `onMounted`
   - `beforeUpdate` → `onBeforeUpdate`
   - `updated` → `onUpdated`
   - `beforeUnmount` → `onBeforeUnmount`
   - `unmounted` → `onUnmounted`
   - `errorCaptured` → `onErrorCaptured`
   - `renderTracked` → `onRenderTracked`
   - `renderTriggered` → `onRenderTriggered`

5. **在组合式函数中使用**：生命周期钩子可以在自定义的组合式函数中使用，确保代码复用
   ```javascript
   function useFeature() {
     onMounted(() => {
       console.log('特性在组件挂载时初始化')
     })

     onUnmounted(() => {
       console.log('特性在组件卸载时清理')
     })
   }

   // 组件中使用
   setup() {
     useFeature() // 生命周期钩子将注册到使用该特性的组件上
     return {}
   }
   ```

### 如何设计一个好的组合式函数(Composable)?

**答**：设计高质量的组合式函数应遵循以下原则：

1. **单一职责**：每个组合式函数应该专注于特定的功能或关注点

2. **命名规范**：使用`use`前缀，清晰表达功能，如`useMousePosition`、`useUserAuth`

3. **输入和输出**：
   - 接受明确的参数作为配置
   - 返回有用的响应式状态和方法
   ```javascript
   function useCounter(initialValue = 0, options = {}) {
     const count = ref(initialValue)
     const { min, max } = options

     function increment() {
       if (max !== undefined && count.value >= max) return
       count.value++
     }

     function decrement() {
       if (min !== undefined && count.value <= min) return
       count.value--
     }

     return { count, increment, decrement }
   }
   ```

4. **副作用管理**：
   - 在组合式函数内部处理生命周期相关的逻辑
   - 提供清理函数
   ```javascript
   function useEventListener(target, event, callback) {
     onMounted(() => {
       target.addEventListener(event, callback)
     })

     onUnmounted(() => {
       target.removeEventListener(event, callback)
     })
   }
   ```

5. **状态隔离**：确保每次调用组合式函数时创建独立的状态
   ```javascript
   // ❌ 错误：共享状态
   const globalState = ref(0)
   function useSharedState() {
     return { state: globalState }
   }

   // ✅ 正确：状态隔离
   function useIsolatedState(initial = 0) {
     return { state: ref(initial) }
   }
   ```

6. **可组合性**：设计能与其他组合式函数组合使用的API
   ```javascript
   // 两个组合式函数组合使用
   function useUserRepositories(user) {
     return { repositories: ref([]) }
   }

   function useRepositoryFilters(repositories) {
     return { filteredRepositories: computed(() => {/* ... */}) }
   }

   // 在组件中组合使用
   const { user } = useUser()
   const { repositories } = useUserRepositories(user)
   const { filteredRepositories } = useRepositoryFilters(repositories)
   ```

7. **透明的实现**：避免隐藏魔法，使调用者能理解函数的工作方式

8. **良好的文档**：提供清晰的JSDoc注释，说明参数、返回值和使用示例

## 学习资源

- [Vue3官方文档 - 组合式API](https://cn.vuejs.org/guide/extras/composition-api-faq.html)
- [Vue3官方文档 - 组合式函数](https://cn.vuejs.org/guide/reusability/composables.html)
- [Vue Mastery - Vue3组合式API课程](https://www.vuemastery.com/courses/vue-3-essentials/why-the-composition-api/)
- [VueUse - 实用组合式函数集合](https://vueuse.org/)
- [Vue3组合式API讲解视频](https://www.bilibili.com/video/BV1P64y1X7BM/)