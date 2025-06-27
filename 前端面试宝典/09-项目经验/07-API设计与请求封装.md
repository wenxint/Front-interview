# Vue3 API设计与请求封装

## 背景介绍
在现代前端项目中，API请求是前后端交互的桥梁。Vue3项目通常需要高效、可维护的API请求封装方案，以提升开发效率和代码复用性。

## 核心思路
- 统一封装请求工具（如axios），集中管理baseURL、拦截器、错误处理
- 支持类型推断，提升TypeScript开发体验
- 结合组合式API实现业务API模块化
- 支持请求取消、重试、并发控制等高级特性

## 关键代码示例
### axios基础封装
```typescript
// utils/request.ts
import axios from 'axios'
const service = axios.create({
  baseURL: '/api',
  timeout: 10000
})
// 请求拦截器
service.interceptors.request.use(config => {
  // 可统一添加token
  return config
})
// 响应拦截器
service.interceptors.response.use(
  response => response.data,
  error => {
    // 统一错误处理
    return Promise.reject(error)
  }
)
export default service
```

### 业务API模块化
```typescript
// api/user.ts
import request from '@/utils/request'
export function login(data: LoginParams) {
  return request.post<UserInfo>('/login', data)
}
export function getUserInfo() {
  return request.get<UserInfo>('/user/info')
}
```

### 组合式API中调用
```typescript
import { ref } from 'vue'
import { getUserInfo } from '@/api/user'
const userInfo = ref<UserInfo | null>(null)
async function fetchUser() {
  userInfo.value = await getUserInfo()
}
```

## 遇到的问题与解决方案
- **重复代码多**：建议统一封装通用请求逻辑，减少冗余。
- **错误处理分散**：通过拦截器集中处理错误和异常。
- **类型不一致**：接口返回类型建议统一定义TS类型或接口。

## 面试高频问答
1. 如何在Vue3中优雅地封装API请求？
2. axios拦截器的常见应用场景？
3. 如何处理API请求的错误与异常？
4. 组合式API下如何组织业务API模块？
5. 如何实现请求的取消与防抖？