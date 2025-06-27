# 图片懒加载实现文档

## 简介

图片懒加载是一种优化网页性能的技术，通过延迟加载不在可视区域内的图片，减少初始页面加载时间和带宽消耗。本文档详细介绍了`lazyLoad.js`的使用方法和配置选项。

## 特性

- 支持现代浏览器的`IntersectionObserver` API和传统浏览器的滚动监听
- 自动检测浏览器支持并选择最佳实现方式
- 内置节流函数优化滚动性能
- 支持动态加载内容后重新扫描
- 提供加载状态的CSS类名
- 支持自定义事件
- 链式调用API

## 使用方法

### HTML结构

在HTML中，使用`data-src`属性存储图片的真实地址，`src`属性可以设置为占位图或空：

```html
<img class="lazy-image" src="placeholder.jpg" data-src="real-image.jpg" alt="懒加载图片">
```

### JavaScript集成

#### 基本用法

```javascript
// 引入LazyLoad类
// 方式1：ES模块
import LazyLoad from './lazyLoad.js';

// 方式2：CommonJS
// const LazyLoad = require('./lazyLoad.js');

// 方式3：直接通过script标签引入
// <script src="lazyLoad.js"></script>

// 创建懒加载实例
const lazyLoader = new LazyLoad();

// 初始化
document.addEventListener('DOMContentLoaded', () => {
  lazyLoader.init();
});
```

#### 配置选项

```javascript
const lazyLoader = new LazyLoad({
  // 选择器，用于查找需要懒加载的图片
  selector: '.lazy-image',

  // 存储真实图片地址的data属性名
  dataSrc: 'data-src',

  // IntersectionObserver的阈值，表示元素可见比例达到多少时触发加载
  threshold: 0.1,

  // 节流延迟时间（毫秒）
  throttleDelay: 200,

  // 加载中的CSS类名
  loadingClass: 'lazy-loading',

  // 加载完成的CSS类名
  loadedClass: 'lazy-loaded',

  // 加载失败的CSS类名
  errorClass: 'lazy-error'
});
```

#### 动态内容处理

当通过AJAX或其他方式动态添加新内容后，需要调用`rescan()`方法重新扫描页面：

```javascript
// 加载更多内容
document.getElementById('load-more-btn').addEventListener('click', () => {
  // 加载更多内容的代码...
  fetch('/api/more-content')
    .then(response => response.json())
    .then(data => {
      // 将新内容添加到DOM
      const container = document.getElementById('content-container');
      data.items.forEach(item => {
        container.innerHTML += `
          <div class="item">
            <img class="lazy-image" src="placeholder.jpg" data-src="${item.imageUrl}" alt="${item.title}">
            <h3>${item.title}</h3>
          </div>
        `;
      });

      // 重新扫描懒加载图片
      lazyLoader.rescan();
    });
});
```

### rescan()方法

`rescan()`方法用于在动态添加内容后重新扫描页面中的懒加载图片。它会查找新添加的符合条件的图片，并将它们添加到监控列表中。

```javascript
// 重新扫描并返回实例，支持链式调用
lazyLoader.rescan().init();
```

## 注意事项

1. **占位图**：建议使用轻量级的占位图，或者通过CSS设置图片容器的尺寸，避免页面加载时的布局偏移。

2. **CSS样式**：可以为不同的加载状态设置样式：

```css
/* 加载中的样式 */
.lazy-loading {
  opacity: 0.5;
  transition: opacity 0.3s;
}

/* 加载完成的样式 */
.lazy-loaded {
  opacity: 1;
  transition: opacity 0.3s;
}

/* 加载失败的样式 */
.lazy-error {
  opacity: 0.7;
  filter: grayscale(100%);
}
```

3. **事件监听**：可以监听图片加载完成或失败的事件：

```javascript
document.querySelectorAll('.lazy-image').forEach(img => {
  img.addEventListener('lazyloaded', () => {
    console.log('图片加载完成:', img.src);
  });

  img.addEventListener('lazyerror', () => {
    console.log('图片加载失败:', img.getAttribute('data-src'));
  });
});
```

## 完整示例

以下是一个完整的HTML示例，展示了如何使用懒加载：

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>图片懒加载示例</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
    }

    .image-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 20px;
    }

    .image-item {
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }

    .image-container {
      position: relative;
      padding-bottom: 66.67%; /* 3:2 宽高比 */
      background-color: #f0f0f0;
    }

    .lazy-image {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: opacity 0.3s ease;
    }

    .lazy-loading {
      opacity: 0.5;
    }

    .lazy-loaded {
      opacity: 1;
    }

    .lazy-error {
      opacity: 0.7;
      filter: grayscale(100%);
    }

    .image-caption {
      padding: 10px;
      background-color: #fff;
    }

    .load-more {
      display: block;
      margin: 30px auto;
      padding: 10px 20px;
      background-color: #4CAF50;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 16px;
    }

    .load-more:hover {
      background-color: #45a049;
    }
  </style>
</head>
<body>
  <h1>图片懒加载示例</h1>

  <div class="image-grid" id="image-grid">
    <!-- 图片项 -->
    <div class="image-item">
      <div class="image-container">
        <img class="lazy-image" src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 300 200'%3E%3C/svg%3E" data-src="https://picsum.photos/id/1/600/400" alt="示例图片1">
      </div>
      <div class="image-caption">示例图片1</div>
    </div>

    <!-- 更多图片项... -->
    <div class="image-item">
      <div class="image-container">
        <img class="lazy-image" src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 300 200'%3E%3C/svg%3E" data-src="https://picsum.photos/id/2/600/400" alt="示例图片2">
      </div>
      <div class="image-caption">示例图片2</div>
    </div>

    <!-- 重复添加更多图片，确保页面有滚动条 -->
    <!-- ... -->
  </div>

  <button class="load-more" id="load-more">加载更多</button>

  <script src="lazyLoad.js"></script>
  <script>
    // 初始化懒加载
    const lazyLoader = new LazyLoad({
      selector: '.lazy-image',
      threshold: 0.2,
      throttleDelay: 150
    });

    // 页面加载完成后启动懒加载
    document.addEventListener('DOMContentLoaded', () => {
      lazyLoader.init();

      // 监听图片加载完成事件
      document.querySelectorAll('.lazy-image').forEach(img => {
        img.addEventListener('lazyloaded', () => {
          console.log('图片加载完成:', img.src);
        });

        img.addEventListener('lazyerror', () => {
          console.log('图片加载失败:', img.getAttribute('data-src'));
        });
      });
    });

    // 加载更多按钮
    document.getElementById('load-more').addEventListener('click', () => {
      // 模拟加载更多图片
      const imageGrid = document.getElementById('image-grid');

      // 添加新的图片项
      for (let i = 10; i < 15; i++) {
        const imageId = Math.floor(Math.random() * 100);
        const imageItem = document.createElement('div');
        imageItem.className = 'image-item';
        imageItem.innerHTML = `
          <div class="image-container">
            <img class="lazy-image" src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 300 200'%3E%3C/svg%3E" data-src="https://picsum.photos/id/${imageId}/600/400" alt="动态加载图片${i}">
          </div>
          <div class="image-caption">动态加载图片${i}</div>
        `;

        imageGrid.appendChild(imageItem);
      }

      // 重新扫描懒加载图片
      lazyLoader.rescan();
    });
  </script>
</body>
</html>
```

## 兼容性

- 现代浏览器（Chrome、Firefox、Safari、Edge等）：使用`IntersectionObserver` API，性能最佳
- IE和旧版浏览器：使用滚动事件监听，自动降级

如果需要在非常旧的浏览器中使用，可以考虑添加`IntersectionObserver` polyfill：

```html
<script src="https://polyfill.io/v3/polyfill.min.js?features=IntersectionObserver"></script>
```

## 性能考虑

- 对于大量图片的页面，懒加载可以显著提高初始加载性能
- 内置的节流函数确保滚动事件处理不会过于频繁
- 图片加载完成后会自动移除对应的监听，减少内存占用
- 使用SVG或极小的占位图可以进一步减少初始页面大小