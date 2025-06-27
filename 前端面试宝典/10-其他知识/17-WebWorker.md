# Web Worker

## 概念介绍

Web Worker 是 HTML5 提供的一种在主线程之外运行 JavaScript 的机制，允许在后台线程中执行脚本操作，从而避免阻塞 UI 渲染，提高页面响应速度。

- 主要用于处理计算密集型任务、数据处理、文件解析等场景。
- Worker 线程与主线程之间通过消息传递（postMessage/onmessage）进行通信，不能直接操作 DOM。

## 基本用法

```javascript
// main.js
const worker = new Worker('worker.js');
worker.postMessage({ type: 'start', data: 100 });
worker.onmessage = function(e) {
  console.log('主线程收到消息:', e.data);
};

// worker.js
self.onmessage = function(e) {
  if (e.data.type === 'start') {
    // 进行耗时计算
    let sum = 0;
    for (let i = 0; i < e.data.data; i++) {
      sum += i;
    }
    self.postMessage({ result: sum });
  }
};
```

## 核心特性

- 独立线程：Worker 运行在独立线程，不会阻塞主线程。
- 通信机制：只能通过消息事件与主线程通信，数据会被结构化克隆。
- 作用域限制：Worker 不能访问 DOM、window、document，只能访问自身作用域（self）。
- 支持导入脚本：可通过 importScripts() 导入其他脚本。

## 实战案例

### 1. 大数据计算防止页面卡顿

```javascript
// 主线程
const worker = new Worker('calc.worker.js');
worker.postMessage({ n: 1e8 });
worker.onmessage = e => {
  console.log('结果：', e.data);
};

// calc.worker.js
self.onmessage = e => {
  let sum = 0;
  for (let i = 0; i < e.data.n; i++) sum += i;
  self.postMessage(sum);
};
```

### 2. 图片压缩、文件解析等

- 使用 Worker 进行图片压缩、音视频转码、Excel/CSV 解析等，提升性能体验。

## 兼容性说明

- 现代主流浏览器均已支持 Web Worker。
- 不支持 IE9 及以下。
- Service Worker、Shared Worker、Dedicated Worker 等扩展类型需注意兼容性。

## 面试常见问题

1. Web Worker 能否访问 DOM？为什么？
2. Worker 与主线程如何通信？数据是如何传递的？
3. Worker 线程如何终止？
4. Worker 的应用场景有哪些？
5. 如何在 Vue/React 项目中集成 Web Worker？

## 参考资料

- [MDN Web Worker](https://developer.mozilla.org/zh-CN/docs/Web/API/Web_Workers_API)
- [Web Worker 实战指南](https://juejin.cn/post/6844904101386983438)