# TypeScript与Vue3

> Vue3采用TypeScript重写，为TypeScript用户提供了一流的开发体验。本章探讨TypeScript在Vue3中的集成与应用，从基础配置到高级类型技巧，帮助你构建类型安全的Vue应用。

## 概念介绍

TypeScript是JavaScript的超集，它为JavaScript添加了静态类型系统，能够在开发阶段发现潜在的类型错误。Vue3与TypeScript的深度整合使得开发者可以获得更好的IDE支持、更强的类型检查和更可靠的代码重构能力。

TypeScript在Vue3中主要提供以下价值：

1. **类型安全**：在编译时捕获潜在的错误，减少运行时错误
2. **更好的IDE支持**：代码补全、类型提示、跳转到定义等
3. **更易于维护**：类型作为文档，使代码更易于理解和重构
4. **更好的团队协作**：明确的接口定义，减少沟通成本

与Vue2相比，Vue3在TypeScript支持方面有显著提升：
- 源码采用TypeScript重写，提供完整的类型声明
- Composition API天然适合TypeScript类型推导
- 组件选项和属性拥有精确的类型定义
- Volar插件提供强大的模板类型检查

## 基本语法

### 1. 在Vue3项目中配置TypeScript

使用Vue CLI创建支持TypeScript的项目：

```bash
vue create my-vue3-ts-app
# 选择Vue3 + TypeScript 预设
```

或通过Vite创建：

```bash
npm create vite@latest my-vue3-ts-app -- --template vue-ts
```

主要配置文件：

```typescript
// tsconfig.json
{
  "compilerOptions": {
    "target": "esnext",
    "module": "esnext",
    "strict": true,
    "jsx": "preserve",
    "moduleResolution": "node",
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "forceConsistentCasingInFileNames": true,
    "useDefineForClassFields": true,
    "sourceMap": true,
    "baseUrl": ".",
    "types": ["webpack-env", "jest"],
    "paths": {
      "@/*": ["src/*"]
    },
    "lib": ["esnext", "dom", "dom.iterable", "scripthost"]
  },
  "include": [
    "src/**/*.ts",
    "src/**/*.tsx",
    "src/**/*.vue",
    "tests/**/*.ts",
    "tests/**/*.tsx"
  ],
  "exclude": ["node_modules"]
}
```

### 2. 为Vue组件添加类型

Vue3提供两种方式编写带类型的组件：Options API和Composition API。

#### Options API组件示例：

```typescript
/**
 * @description Options API组件类型定义示例
 */
<script lang="ts">
import { defineComponent, PropType } from 'vue'

interface User {
  id: number
  name: string
  email: string
}

export default defineComponent({
  name: 'UserProfile',
  props: {
    user: {
      type: Object as PropType<User>,
      required: true
    },
    isAdmin: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      localUser: { ...this.user } as User,
      loading: false
    }
  },
  computed: {
    formattedName(): string {
      return `${this.localUser.name} (ID: ${this.localUser.id})`
    }
  },
  methods: {
    updateUser(newName: string): void {
      this.loading = true
      this.localUser.name = newName
      // 模拟API调用
      setTimeout(() => {
        this.loading = false
      }, 500)
    }
  }
})
</script>
```

#### Composition API组件示例：

```typescript
/**
 * @description Composition API组件类型定义示例
 */
<script setup lang="ts">
import { ref, computed, defineProps, defineEmits } from 'vue'

interface User {
  id: number
  name: string
  email: string
}

const props = defineProps<{
  user: User
  isAdmin?: boolean
}>()

const emit = defineEmits<{
  (e: 'update', userId: number, newData: Partial<User>): void
  (e: 'delete', userId: number): void
}>()

const localUser = ref<User>({ ...props.user })
const loading = ref(false)

const formattedName = computed(() => {
  return `${localUser.value.name} (ID: ${localUser.value.id})`
})

function updateUser(newName: string): void {
  loading.value = true
  localUser.value.name = newName

  // 通知父组件
  emit('update', localUser.value.id, { name: newName })

  setTimeout(() => {
    loading.value = false
  }, 500)
}

function deleteUser(): void {
  if (confirm('确定要删除此用户吗？')) {
    emit('delete', localUser.value.id)
  }
}
</script>
```

### 3. 类型定义文件

自定义`.d.ts`文件扩展Vue类型：

```typescript
/**
 * @description 类型定义文件示例
 */
// src/types/index.d.ts

// 全局类型声明
declare global {
  interface Window {
    myAppConfig: {
      apiBaseUrl: string
      version: string
    }
  }
}

// 扩展Vue接口
declare module 'vue' {
  interface ComponentCustomProperties {
    $api: ApiService
    $formatDate: (date: Date) => string
  }
}

// 自定义类型
export interface ApiService {
  get<T>(url: string): Promise<T>
  post<T, D>(url: string, data: D): Promise<T>
}

// 状态管理相关类型
export interface RootState {
  user: UserState
  products: ProductState
}

export interface UserState {
  currentUser: User | null
  isLoggedIn: boolean
}

export interface User {
  id: number
  name: string
  email: string
  role: 'user' | 'admin' | 'guest'
}

// 导出默认空对象，使其成为模块
export default {}
```

## 核心特性

### 1. 在Composition API中使用TypeScript

使用`<script setup lang="ts">`和类型化的API：

```typescript
/**
 * @description Composition API中的TypeScript高级用法
 */
<script setup lang="ts">
import { ref, reactive, computed, watch, onMounted } from 'vue'
import type { Ref, ComputedRef } from 'vue'

// 类型化的响应式状态
const count = ref<number>(0)
const user = reactive<{
  name: string
  age: number
  isActive: boolean
}>({
  name: '',
  age: 0,
  isActive: false
})

// 带类型的计算属性
const doubleCount: ComputedRef<number> = computed(() => count.value * 2)

// 类型化的watch
watch(count, (newVal: number, oldVal: number) => {
  console.log(`Count changed from ${oldVal} to ${newVal}`)
})

// 复杂类型状态及其计算属性
interface Task {
  id: number
  title: string
  completed: boolean
  dueDate?: Date
}

const tasks = ref<Task[]>([])

const completedTasks = computed(() =>
  tasks.value.filter(task => task.completed)
)

const pendingTasks = computed(() =>
  tasks.value.filter(task => !task.completed)
)

// 类型化的方法
function addTask(title: string, dueDate?: Date): void {
  const newTask: Task = {
    id: Date.now(),
    title,
    completed: false,
    dueDate
  }
  tasks.value.push(newTask)
}

function toggleTask(id: number): void {
  const task = tasks.value.find(t => t.id === id)
  if (task) {
    task.completed = !task.completed
  }
}

// 生命周期钩子使用
onMounted(() => {
  // 加载初始任务
  addTask('学习Vue3和TypeScript')
  addTask('完成项目', new Date(2023, 11, 31))
})
</script>
```

### 2. defineProps和defineEmits类型声明

在`<script setup>`中使用类型声明：

```typescript
/**
 * @description defineProps和defineEmits的类型声明
 */
<script setup lang="ts">
// 方式1：使用类型注解
const props = defineProps<{
  title: string
  likes?: number
  initialValues: { count: number; messages: string[] }
  callback?: (id: number) => void
}>()

// 方式2：使用默认值
interface Props {
  title: string
  likes?: number
  initialValues: { count: number; messages: string[] }
  callback?: (id: number) => void
}

const props = withDefaults(defineProps<Props>(), {
  likes: 0,
  callback: (id: number) => console.log(`Default callback with id ${id}`)
})

// 为emit事件定义类型
const emit = defineEmits<{
  (e: 'update:title', value: string): void
  (e: 'submit', value: { title: string; count: number }): void
  (e: 'change', id: number, value: any): void
}>()

// 类型安全的事件触发
function handleChange() {
  emit('update:title', 'New Title') // ✓ 正确
  emit('submit', { title: props.title, count: 100 }) // ✓ 正确

  // 下面这行会出现类型错误
  // emit('update:title', 123) // ❌ 类型错误：参数类型不匹配
}
</script>
```

### 3. 泛型组件

创建可复用的泛型组件：

```typescript
/**
 * @description 泛型组件示例
 */
<script lang="ts">
import { defineComponent, PropType } from 'vue'

// DataTable.vue - 一个通用数据表格组件
export default defineComponent({
  name: 'DataTable',
  props: {
    // 使用泛型定义数据结构
    items: {
      type: Array as PropType<any[]>,
      required: true
    },
    columns: {
      type: Array as PropType<{
        key: string;
        title: string;
        formatter?: (val: any, row: any) => string
      }[]>,
      required: true
    }
  },
  methods: {
    formatCell(row: any, column: { key: string; formatter?: Function }): string {
      const value = row[column.key]
      return column.formatter ? column.formatter(value, row) : value
    }
  }
})
</script>

// 使用泛型组件的方式
<script setup lang="ts">
import DataTable from './components/DataTable.vue'

interface User {
  id: number
  name: string
  email: string
  lastLogin: Date
}

const users: User[] = [
  { id: 1, name: '张三', email: 'zhang@example.com', lastLogin: new Date() },
  { id: 2, name: '李四', email: 'li@example.com', lastLogin: new Date() }
]

const columns = [
  { key: 'id', title: 'ID' },
  { key: 'name', title: '姓名' },
  { key: 'email', title: '邮箱' },
  {
    key: 'lastLogin',
    title: '最后登录',
    formatter: (date: Date) => date.toLocaleString()
  }
]
</script>

<template>
  <DataTable :items="users" :columns="columns" />
</template>
```

### 4. 使用类型声明辅助函数

利用Vue3提供的类型辅助函数：

```typescript
/**
 * @description 类型辅助函数使用示例
 */
import { defineComponent, PropType, ComponentCustomProps } from 'vue'
import type { ExtractPropTypes, ExtractDefaultPropTypes } from 'vue'

// 定义props
const myProps = {
  name: {
    type: String,
    required: true
  },
  id: {
    type: Number,
    default: 0
  },
  tags: {
    type: Array as PropType<string[]>,
    default: () => []
  },
  config: {
    type: Object as PropType<{ maxSize: number; color: string }>,
    required: false
  }
} as const  // 使用as const确保类型推断精确

// 提取props类型
type MyProps = ExtractPropTypes<typeof myProps>
// 提取带有默认值的props类型
type MyDefaultProps = ExtractDefaultPropTypes<typeof myProps>

// 使用提取的类型
const component = defineComponent({
  props: myProps,
  setup(props: MyProps) {
    // props类型正确推断
    const fullName = `${props.name}-${props.id}`
    const allTags = [...props.tags, 'default-tag']

    return { fullName, allTags }
  }
})
```