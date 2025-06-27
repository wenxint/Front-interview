# Pinia的用法

## 概念介绍

Pinia 是 Vue 3 官方推荐的状态管理库，旨在替代 Vuex。它提供了更简洁的 API、更好的 TypeScript 支持，以及更灵活的架构设计。相比 Vuex，Pinia 移除了 mutations，仅保留 state、getters 和 actions，同时支持模块化 store 和组合式 API 风格的使用方式，使得状态管理更加直观和易于维护。

## 基本语法

### 创建 Store
使用 `defineStore` 函数定义一个 store，需要传入一个唯一的 ID（用于 devtools 调试）和一个配置对象（包含 state、getters、actions）。

```javascript
// stores/counter.js
import { defineStore } from 'pinia';

/**
 * @description 定义一个计数器store
 * @param {string} 'counter' - store的唯一ID
 * @param {Object} 配置对象
 * @param {Function} state - 返回初始状态的函数
 * @param {Object} getters - 计算属性
 * @param {Object} actions - 方法（可同步或异步）
 * @returns {Object} store实例
 */
export const useCounterStore = defineStore('counter', {
  state: () => ({
    count: 0,
    name: 'Counter Store'
  }),
  getters: {
    doubleCount: (state) => state.count * 2,
  },
  actions: {
    increment() {
      this.count++;
    },
    async fetchCount() {
      // 模拟异步请求
      const res = await fetch('https://api.example.com/count');
      this.count = await res.json();
    }
  }
});
```

### 在组件中使用
在 Vue 组件中通过 `useStore` 函数获取 store 实例，即可访问其 state、getters 和 actions。

```vue
<template>
  <div>
    <p>{{ counterStore.name }}: {{ counterStore.count }}</p>
    <p>Double Count: {{ counterStore.doubleCount }}</p>
    <button @click="counterStore.increment">Increment</button>
    <button @click="counterStore.fetchCount">Fetch Count</button>
  </div>
</template>

<script setup>
import { useCounterStore } from '@/stores/counter';

// 获取store实例
const counterStore = useCounterStore();
</script>
```

## 核心特性

1. **无 Mutations**：移除了 Vuex 中的 mutations，所有状态变更直接通过 actions 完成，简化了状态管理流程。
2. **模块化设计**：每个 store 独立定义，支持动态导入，避免全局命名空间污染。
3. **TypeScript 友好**：原生支持类型推断，通过 `defineStore` 的泛型参数可明确指定 state 类型。
4. **组合式 API 风格**：支持使用函数式的方式定义 store（`setup` 语法），提供更灵活的逻辑复用能力。
5. **Devtools 支持**：与 Vue Devtools 深度集成，可追踪状态变更、actions 调用和时间旅行调试。

## 实战案例

### 用户信息管理
在用户登录场景中，使用 Pinia 管理用户信息，包括登录状态、用户详情和权限数据。

```javascript
// stores/user.js
import { defineStore } from 'pinia';
export const useUserStore = defineStore('user', {
  state: () => ({
    isLoggedIn: false,
    userInfo: null,
    permissions: []
  }),
  getters: {
    hasAdminPermission: (state) => state.permissions.includes('admin'),
  },
  actions: {
    async login(credentials) {
      const res = await fetch('/api/login', {
        method: 'POST',
        body: JSON.stringify(credentials)
      });
      const data = await res.json();
      this.isLoggedIn = true;
      this.userInfo = data.user;
      this.permissions = data.permissions;
    },
    logout() {
      this.isLoggedIn = false;
      this.userInfo = null;
      this.permissions = [];
    }
  }
});
```

在组件中使用该 store 控制导航菜单的显示：

```vue
<template>
  <nav>
    <a v-if="userStore.isLoggedIn" href="/profile">个人中心</a>
    <a v-if="userStore.hasAdminPermission" href="/admin">管理后台</a>
    <a v-else href="/login">登录</a>
  </nav>
</template>

<script setup>
import { useUserStore } from '@/stores/user';

const userStore = useUserStore();
</script>
```

## 兼容性说明

Pinia 支持 Vue 3.0+ 及 Vue 2.7+（需配合 `@vue/composition-api` 插件）。浏览器兼容性方面，现代浏览器（Chrome 64+, Firefox 67+, Safari 12.1+, Edge 79+）可直接使用；对于旧版浏览器（如 IE11），需通过 Babel 转译 ES6+ 语法，并安装 `core-js` 等 polyfill 库。

## 面试常见问题

### 1. Pinia 与 Vuex 的主要区别是什么？
- **API 设计**：Pinia 移除了 mutations，仅保留 state、getters 和 actions，简化了状态变更流程。
- **类型支持**：Pinia 原生支持 TypeScript，通过类型推断和泛型参数提供更强大的类型检查。
- **模块化**：Pinia 的 store 是模块化的，无需手动注册，支持动态导入，避免了 Vuex 中命名空间的复杂性。
- **组合式 API**：Pinia 支持使用 `setup` 函数定义 store，与 Vue 3 的组合式 API 风格一致，提供更灵活的逻辑复用。

### 2. 如何在 Pinia 中定义响应式的 state？
Pinia 的 state 是通过 `state` 函数返回的对象来定义的，该对象会被自动转换为响应式数据。推荐使用箭头函数返回初始状态，以确保类型推断的正确性：

```javascript
state: () => ({
  count: 0,
  list: []
})
```

### 3. 如何在 Pinia 的 actions 中访问其他 store？
可以在 actions 中直接调用其他 store 的 `useStore` 函数来获取实例，例如：

```javascript
actions: {
  updateUser() {
    const counterStore = useCounterStore();
    this.userInfo.count = counterStore.count;
  }
}
```