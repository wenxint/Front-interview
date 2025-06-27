# Vue基础

## Vue3概述

Vue3是一个用于构建用户界面的渐进式JavaScript框架，于2020年9月正式发布。相比Vue2，Vue3具有更好的性能、更小的体积、更好的TypeScript支持以及更强大的组合式API。

### Vue3核心特性

- **组合式API (Composition API)**: 一种基于函数的API，提供了更灵活的代码组织方式
- **改进的响应式系统**: 基于Proxy的响应式系统，提供更好的性能和功能
- **Teleport组件**: 允许将内容渲染到DOM的不同位置
- **Fragments**: 支持多根节点组件
- **Tree-shaking友好**: 可以大幅减小打包体积
- **TypeScript支持**: 从头开始就支持TypeScript

## Vue3基础语法

### 创建Vue应用

```js
import { createApp } from 'vue'
import App from './App.vue'

const app = createApp(App)
app.mount('#app')
```

### 模板语法

Vue使用基于HTML的模板语法，允许开发者声明式地将DOM绑定到底层组件实例的数据。

#### 文本插值

```html
<span>消息: {{ message }}</span>
```

#### 原始HTML

```html
<p>使用v-html指令: <span v-html="rawHtml"></span></p>
```

#### 属性绑定

```html
<div v-bind:id="dynamicId"></div>
<!-- 简写 -->
<div :id="dynamicId"></div>
```

#### 条件渲染

```html
<div v-if="seen">现在你看到我了</div>
<div v-else-if="conditionB">条件B为真时显示</div>
<div v-else>否则显示我</div>

<!-- v-show切换元素的CSS display属性 -->
<div v-show="isVisible">根据条件显示</div>
```

#### 列表渲染

```html
<ul>
  <li v-for="(item, index) in items" :key="item.id">
    {{ index }} - {{ item.name }}
  </li>
</ul>
```

#### 事件处理

```html
<button v-on:click="counter++">增加1</button>
<!-- 简写 -->
<button @click="increment">增加1</button>

<!-- 事件修饰符 -->
<form @submit.prevent="onSubmit">...</form>
```

#### 表单输入绑定

```html
<input v-model="message" placeholder="编辑我">
<p>消息是: {{ message }}</p>
```

### 计算属性与侦听器

#### 计算属性

```js
import { ref, computed } from 'vue'

const firstName = ref('John')
const lastName = ref('Doe')

// 计算属性
const fullName = computed(() => {
  return firstName.value + ' ' + lastName.value
})
```

#### 侦听器

```js
import { ref, watch } from 'vue'

const question = ref('')
const answer = ref('问题通常包含问号。;-)')

// 使用watch监听问题变化
watch(question, (newQuestion) => {
  if (newQuestion.includes('?')) {
    fetchAnswer()
  }
})
```

## Vue3组件系统

### 组件基础

组件是Vue中的重要概念，它是可复用的Vue实例，带有一个名字。

#### 组件注册

```js
// 全局注册
import { createApp } from 'vue'
import App from './App.vue'
import MyComponent from './MyComponent.vue'

const app = createApp(App)
app.component('MyComponent', MyComponent)
app.mount('#app')

// 局部注册
import { defineComponent } from 'vue'
import ComponentA from './ComponentA.vue'

export default defineComponent({
  components: {
    ComponentA
  }
})
```

#### 单文件组件(SFC)

Vue单文件组件(`.vue`文件)是Vue项目中最常用的组件格式：

```vue
<template>
  <div class="example">
    <h1>{{ title }}</h1>
    <button @click="changeTitle">改变标题</button>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  setup() {
    const title = ref('Hello Vue 3!')

    function changeTitle() {
      title.value = 'Title Changed!'
    }

    return {
      title,
      changeTitle
    }
  }
}
</script>

<style scoped>
.example {
  color: red;
}
</style>
```

#### Props传递

```vue
<!-- 父组件 -->
<template>
  <ChildComponent :message="parentMessage" />
</template>

<script>
import { ref } from 'vue'
import ChildComponent from './ChildComponent.vue'

export default {
  components: {
    ChildComponent
  },
  setup() {
    const parentMessage = ref('从父组件传递的消息')
    return { parentMessage }
  }
}
</script>

<!-- 子组件 -->
<template>
  <div>{{ message }}</div>
</template>

<script>
export default {
  props: {
    message: {
      type: String,
      required: true
    }
  }
}
</script>
```

#### 事件发射

```vue
<!-- 子组件 -->
<template>
  <button @click="emitEvent">点击发射事件</button>
</template>

<script>
export default {
  emits: ['custom-event'],
  setup(props, { emit }) {
    function emitEvent() {
      emit('custom-event', '这是一些数据')
    }

    return { emitEvent }
  }
}
</script>

<!-- 父组件 -->
<template>
  <ChildComponent @custom-event="handleEvent" />
</template>

<script>
import ChildComponent from './ChildComponent.vue'

export default {
  components: {
    ChildComponent
  },
  setup() {
    function handleEvent(data) {
      console.log('接收到事件:', data)
    }

    return { handleEvent }
  }
}
</script>
```

#### 插槽(Slots)

```vue
<!-- 父组件 -->
<template>
  <BaseLayout>
    <template #header>
      <h1>这是页头</h1>
    </template>

    <template #default>
      <p>主要内容</p>
    </template>

    <template #footer>
      <p>这是页脚</p>
    </template>
  </BaseLayout>
</template>

<!-- BaseLayout组件 -->
<template>
  <div class="container">
    <header>
      <slot name="header"></slot>
    </header>
    <main>
      <slot></slot>
    </main>
    <footer>
      <slot name="footer"></slot>
    </footer>
  </div>
</template>
```

## Vue3响应式系统

### 响应式基础

Vue3的响应式系统基于ES6的Proxy，相比Vue2基于Object.defineProperty的实现，功能更强大。

```js
import { reactive, ref, computed } from 'vue'

// 对象的响应式
const state = reactive({
  count: 0,
  items: []
})

// 基本类型的响应式
const count = ref(0)

// 修改响应式状态
function increment() {
  state.count++
  count.value++
}

// 计算属性
const doubleCount = computed(() => count.value * 2)
```

### 响应式工具函数

Vue3提供了丰富的响应式工具函数：

- `ref`: 创建一个响应式引用
- `reactive`: 创建一个响应式对象
- `computed`: 创建一个计算属性
- `watch/watchEffect`: 侦听响应式数据变化
- `readonly`: 创建一个只读的响应式对象
- `toRef/toRefs`: 将对象属性转换为ref

## Vue3生命周期

Vue3中，组件的生命周期钩子可以通过导入的函数访问：

```js
import {
  onBeforeMount,
  onMounted,
  onBeforeUpdate,
  onUpdated,
  onBeforeUnmount,
  onUnmounted,
  onActivated,
  onDeactivated,
  onErrorCaptured
} from 'vue'

export default {
  setup() {
    onBeforeMount(() => {
      // 在挂载前执行
    })

    onMounted(() => {
      // 在挂载后执行
    })

    onBeforeUpdate(() => {
      // 在更新前执行
    })

    onUpdated(() => {
      // 在更新后执行
    })

    onBeforeUnmount(() => {
      // 在卸载前执行
    })

    onUnmounted(() => {
      // 在卸载后执行
    })
  }
}
```

与Vue2选项式API生命周期对比：

| 选项式API | 组合式API |
|---------|----------|
| beforeCreate | setup() |
| created | setup() |
| beforeMount | onBeforeMount |
| mounted | onMounted |
| beforeUpdate | onBeforeUpdate |
| updated | onUpdated |
| beforeUnmount | onBeforeUnmount |
| unmounted | onUnmounted |
| errorCaptured | onErrorCaptured |

## Vue3内置组件

### Teleport

`Teleport`组件允许将内容传送到DOM中的另一个位置：

```vue
<template>
  <button @click="open = true">打开模态框</button>

  <teleport to="body">
    <div v-if="open" class="modal">
      <p>这是一个模态框</p>
      <button @click="open = false">关闭</button>
    </div>
  </teleport>
</template>

<script>
import { ref } from 'vue'

export default {
  setup() {
    const open = ref(false)
    return { open }
  }
}
</script>
```

### Suspense

`Suspense`组件用于处理异步组件和异步setup函数：

```vue
<template>
  <suspense>
    <template #default>
      <async-component />
    </template>
    <template #fallback>
      <div>Loading...</div>
    </template>
  </suspense>
</template>

<script>
import { defineAsyncComponent } from 'vue'

export default {
  components: {
    AsyncComponent: defineAsyncComponent(() =>
      import('./AsyncComponent.vue')
    )
  }
}
</script>
```

### KeepAlive

`KeepAlive`组件用于缓存组件实例：

```vue
<template>
  <keep-alive>
    <component :is="currentComponent" />
  </keep-alive>
</template>
```

## Vue3指令系统

### 自定义指令

Vue3中自定义指令的API有所简化：

```js
// 全局注册
app.directive('focus', {
  mounted(el) {
    el.focus()
  }
})

// 局部注册
export default {
  directives: {
    focus: {
      mounted(el) {
        el.focus()
      }
    }
  }
}
```

## Vue3应用配置

Vue3应用实例提供了一个配置API：

```js
import { createApp } from 'vue'
import App from './App.vue'

const app = createApp(App)

// 全局配置
app.config.errorHandler = (err) => {
  // 处理错误
}

app.config.globalProperties.$filters = {
  currencyUSD(value) {
    return '$' + value
  }
}

// 挂载应用
app.mount('#app')
```

## 面试常见问题

1. **Vue3相比Vue2有哪些重大改进？**
   - 更小的包体积，更好的性能
   - 基于Proxy的响应式系统
   - 组合式API提供更灵活的代码组织方式
   - 更好的TypeScript支持
   - Teleport, Fragments等新特性
   - 自定义渲染器API

2. **Vue3的响应式系统是如何工作的？**
   - 基于ES6 Proxy实现
   - 能够检测对象属性的添加和删除
   - 能够正确追踪数组的变化
   - 提供ref和reactive两种响应式API

3. **Vue3中如何实现组件间通信？**
   - Props和事件
   - Provide/Inject
   - Vuex/Pinia状态管理
   - EventBus (不推荐)
   - Refs

4. **Vue3的渲染性能如何优化？**
   - 静态树提升
   - Patch flag标记
   - 缓存事件处理函数
   - 按需编译
   - 使用v-once和v-memo指令

5. **Vue3中的setup函数有什么作用？**
   - 组合式API的入口点
   - 在组件创建之前被调用
   - 返回的对象属性可在模板中使用
   - 取代了Vue2中的data, methods, computed等选项