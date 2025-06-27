# CSS动画与过渡

CSS动画和过渡是现代Web开发中创建交互式、吸引人界面的重要技术。相比于JavaScript动画，CSS动画通常性能更好、更易于实现，且能充分利用硬件加速。本章详细介绍CSS过渡、变换和动画的实现方法及最佳实践。

## CSS过渡（Transitions）

CSS过渡提供了一种在CSS属性变化时平滑过渡的方式，而不是瞬间改变。

### 基础语法

```css
.element {
  transition-property: opacity, transform;  /* 要过渡的属性 */
  transition-duration: 0.3s;                /* 过渡持续时间 */
  transition-timing-function: ease-out;     /* 过渡速度曲线 */
  transition-delay: 0.1s;                   /* 过渡延迟时间 */

  /* 简写形式 */
  transition: opacity 0.3s ease-out, transform 0.5s ease-in;
}
```

### 过渡属性（transition-property）

指定哪些CSS属性将发生过渡效果：

```css
/* 单个属性 */
transition-property: opacity;

/* 多个属性 */
transition-property: opacity, transform, background-color;

/* 所有可动画属性 */
transition-property: all;

/* 不过渡任何属性 */
transition-property: none;
```

注意：并非所有CSS属性都可以产生过渡效果。一般来说，具有中间值的属性才能过渡，如颜色、尺寸、位置等。

### 过渡持续时间（transition-duration）

指定过渡效果完成需要的时间，单位可以是秒(s)或毫秒(ms)：

```css
transition-duration: 0.5s;        /* 0.5秒 */
transition-duration: 500ms;       /* 500毫秒 */
transition-duration: 0.2s, 0.5s;  /* 为不同属性指定不同时间 */
```

### 过渡速度曲线（transition-timing-function）

控制过渡效果的速度变化：

```css
/* 预定义曲线 */
transition-timing-function: ease;        /* 默认值，慢开始，快中间，慢结束 */
transition-timing-function: ease-in;     /* 慢开始，快结束 */
transition-timing-function: ease-out;    /* 快开始，慢结束 */
transition-timing-function: ease-in-out; /* 慢开始和结束，快中间 */
transition-timing-function: linear;      /* 匀速 */
transition-timing-function: step-start;  /* 直接开始 */
transition-timing-function: step-end;    /* 直接结束 */

/* 阶梯函数 */
transition-timing-function: steps(4, end); /* 分4步完成，在每步结束时变化 */

/* 三次贝塞尔曲线 - 自定义速度曲线 */
transition-timing-function: cubic-bezier(0.25, 0.1, 0.25, 1.0);
```

### 过渡延迟（transition-delay）

指定过渡开始前的等待时间：

```css
transition-delay: 0.2s;        /* 0.2秒后开始 */
transition-delay: 0, 0.5s;     /* 为不同属性指定不同延迟 */
```

### 过渡简写

`transition`是所有过渡属性的简写形式：

```css
/* 所有属性的过渡效果相同 */
transition: all 0.3s ease;

/* 为不同属性指定不同效果 */
transition: opacity 0.3s ease, transform 0.5s ease-out 0.1s;
                  /* 属性  持续时间  速度曲线  延迟 */
```

### 过渡触发

CSS过渡通常在伪类、媒体查询或JavaScript修改样式时触发：

```css
/* 悬停触发 */
.button {
  background-color: blue;
  transition: background-color 0.3s;
}
.button:hover {
  background-color: darkblue;
}

/* 通过类触发（通常由JavaScript添加/移除） */
.box {
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.3s, transform 0.5s;
}
.box.visible {
  opacity: 1;
  transform: translateY(0);
}
```

```javascript
// JavaScript触发
document.querySelector('.box').classList.add('visible');
```

## CSS变换（Transforms）

CSS变换允许元素进行平移、旋转、缩放和倾斜等二维或三维的变化。变换通常与过渡结合使用，创建流畅的动画效果。

### 2D变换

```css
.element {
  /* 平移 translateX, translateY */
  transform: translate(50px, 20px);
  transform: translateX(50px);
  transform: translateY(20px);

  /* 缩放 scaleX, scaleY */
  transform: scale(1.5, 0.8);
  transform: scaleX(1.5);
  transform: scaleY(0.8);

  /* 旋转 */
  transform: rotate(45deg);

  /* 倾斜 skewX, skewY */
  transform: skew(10deg, 20deg);
  transform: skewX(10deg);
  transform: skewY(20deg);

  /* 组合变换（顺序很重要） */
  transform: translate(50px, 20px) rotate(45deg) scale(1.5);
}
```

### 3D变换

```css
.element {
  /* 3D旋转 */
  transform: rotateX(45deg);
  transform: rotateY(45deg);
  transform: rotateZ(45deg);
  transform: rotate3d(1, 1, 1, 45deg);

  /* 3D平移 */
  transform: translate3d(50px, 20px, 10px);
  transform: translateZ(10px);

  /* 3D缩放 */
  transform: scale3d(1.5, 0.8, 2);
  transform: scaleZ(2);

  /* 透视效果 - 应用于父元素 */
  perspective: 1000px;

  /* 设置透视原点 */
  perspective-origin: center;
}
```

### 变换原点（transform-origin）

定义变换的基准点：

```css
.element {
  transform-origin: center;     /* 默认值 */
  transform-origin: top left;   /* 左上角 */
  transform-origin: 50px 30px;  /* 具体坐标 */
  transform-origin: 50% 50% 10px; /* 3D变换中添加Z轴坐标 */
}
```

### 背面可见性（backface-visibility）

控制3D旋转时元素背面的可见性：

```css
.element {
  backface-visibility: visible; /* 默认值 */
  backface-visibility: hidden;  /* 隐藏背面 */
}
```

## CSS关键帧动画（Animations）

CSS动画允许创建更复杂的动画序列，可以定义关键帧并控制动画的各个方面。

### 基础语法

```css
/* 定义动画 */
@keyframes slidein {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

/* 应用动画 */
.element {
  animation-name: slidein;               /* 动画名称 */
  animation-duration: 1s;                /* 持续时间 */
  animation-timing-function: ease-out;   /* 速度曲线 */
  animation-delay: 0.5s;                 /* 延迟 */
  animation-iteration-count: 2;          /* 重复次数 */
  animation-direction: alternate;        /* 播放方向 */
  animation-fill-mode: forwards;         /* 结束后状态 */
  animation-play-state: running;         /* 播放状态 */

  /* 简写形式 */
  animation: slidein 1s ease-out 0.5s 2 alternate forwards;
}
```

### 关键帧定义（@keyframes）

关键帧定义了动画的各个阶段：

```css
/* 使用from/to（只有开始和结束） */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* 使用百分比（可以有多个阶段） */
@keyframes bounce {
  0% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-30px);
  }
  100% {
    transform: translateY(0);
  }
}

/* 多属性动画 */
@keyframes colorAndSize {
  0% {
    background-color: red;
    transform: scale(1);
  }
  50% {
    background-color: blue;
  }
  100% {
    background-color: green;
    transform: scale(1.5);
  }
}
```

### 动画属性

#### 动画名称（animation-name）

指定要应用的@keyframes动画：

```css
animation-name: slidein, fadeIn; /* 多个动画 */
animation-name: none;           /* 无动画 */
```

#### 动画持续时间（animation-duration）

指定动画完成一个周期所需的时间：

```css
animation-duration: 2s;
animation-duration: 200ms;
animation-duration: 1s, 2s; /* 多个动画的不同持续时间 */
```

#### 动画速度曲线（animation-timing-function）

控制动画的速度变化，语法与过渡中的相同：

```css
animation-timing-function: ease-in-out;
animation-timing-function: cubic-bezier(0.42, 0, 0.58, 1);
animation-timing-function: steps(8, end);
```

#### 动画延迟（animation-delay）

指定动画开始前的等待时间：

```css
animation-delay: 1s;
animation-delay: -0.5s; /* 负值会使动画从中间开始 */
```

#### 动画重复次数（animation-iteration-count）

指定动画的播放次数：

```css
animation-iteration-count: 3;      /* 播放3次 */
animation-iteration-count: infinite; /* 无限重复 */
```

#### 动画方向（animation-direction）

定义动画是向前播放、向后播放还是来回交替：

```css
animation-direction: normal;          /* 正向播放 */
animation-direction: reverse;         /* 反向播放 */
animation-direction: alternate;       /* 先正向后反向 */
animation-direction: alternate-reverse; /* 先反向后正向 */
```

#### 动画填充模式（animation-fill-mode）

定义动画开始前和结束后的状态：

```css
animation-fill-mode: none;      /* 默认，不应用任何样式 */
animation-fill-mode: forwards;  /* 保持最后一帧的样式 */
animation-fill-mode: backwards; /* 应用第一帧的样式 */
animation-fill-mode: both;      /* 同时应用forwards和backwards */
```

#### 动画播放状态（animation-play-state）

控制动画的播放和暂停：

```css
animation-play-state: running; /* 播放 */
animation-play-state: paused;  /* 暂停 */
```

#### 动画简写

`animation`是所有动画属性的简写形式：

```css
animation: name duration timing-function delay iteration-count direction fill-mode play-state;

/* 例如 */
animation: slidein 3s ease-in 1s infinite alternate forwards;

/* 多个动画 */
animation: slidein 3s ease, fadeout 2s ease-out;
```

### 实用动画示例

#### 淡入效果

```css
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.fade-in {
  animation: fadeIn 1s;
}
```

#### 弹跳效果

```css
@keyframes bounce {
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-30px);
  }
  60% {
    transform: translateY(-15px);
  }
}

.bounce {
  animation: bounce 2s infinite;
}
```

#### 脉动效果

```css
@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}

.pulse {
  animation: pulse 2s infinite;
}
```

#### 旋转加载

```css
@keyframes spinner {
  to {
    transform: rotate(360deg);
  }
}

.loading {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3498db;
  border-radius: 50%;
  animation: spinner 1.2s linear infinite;
}
```

#### 进入动画

```css
@keyframes slideInUp {
  from {
    transform: translate3d(0, 100%, 0);
    visibility: visible;
  }
  to {
    transform: translate3d(0, 0, 0);
  }
}

.slide-in-up {
  animation: slideInUp 0.5s;
}
```

## 动画性能优化

CSS动画若使用不当可能导致性能问题。以下是一些优化技巧：

### 1. 使用硬件加速

某些CSS属性可以触发GPU硬件加速，提高动画性能：

```css
.accelerated {
  transform: translateZ(0);      /* 启用硬件加速 */
  will-change: transform, opacity; /* 告知浏览器预先准备 */
}
```

通常会触发硬件加速的属性：

- transform
- opacity
- filter

尽量避免动画：

- width/height（触发布局）
- top/left/right/bottom（不如transform：translate）
- background-position（不如transform）

### 2. 减少重绘和回流

```css
/* 不好的做法 - 触发回流 */
.element:hover {
  width: 200px;
  height: 100px;
  margin-left: 20px;
}

/* 好的做法 - 只使用transform */
.element:hover {
  transform: scale(1.2) translateX(20px);
}
```

### 3. 使用恰当的过渡结束处理

```javascript
// 使用transitionend事件处理过渡完成后的工作
element.addEventListener('transitionend', function(event) {
  // 过渡结束后执行操作
  if (event.propertyName === 'transform') {
    this.classList.remove('animating');
  }
});
```

### 4. 减少同时动画的元素数量

大量元素同时动画会消耗大量资源。如有必要：

- 对非可视区域的元素禁用动画
- 使用动画库的节流功能
- 考虑使用Canvas或WebGL进行复杂动画

## CSS动画库

许多优秀的CSS动画库可以帮助快速实现常见效果：

### 1. Animate.css

一个跨浏览器的CSS动画库，提供了丰富的预设动画：

```html
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css">
```

```html
<div class="animate__animated animate__bounce">弹跳元素</div>
```

### 2. Magic CSS

提供特殊效果动画：

```html
<link rel="stylesheet" href="https://www.minimamente.com/example/magic_animations/css/magic.min.css">
```

```html
<div class="magictime puffIn">神奇出现</div>
```

### 3. CSShake

提供各种抖动效果：

```html
<link rel="stylesheet" href="https://elrumordelaluz.github.io/csshake/csshake.min.css">
```

```html
<div class="shake shake-hard">抖动元素</div>
```

## JavaScript与CSS动画交互

在复杂动画中，常需要JavaScript与CSS动画进行交互：

### 添加/移除类触发动画

```javascript
// 触发动画
document.querySelector('.box').classList.add('animate');

// 重置动画
const box = document.querySelector('.box');
box.classList.remove('animate');
// 触发重排以重新应用动画
void box.offsetWidth; // 强制回流
box.classList.add('animate');
```

### 监听动画和过渡事件

```javascript
const element = document.querySelector('.animated');

// 监听动画开始
element.addEventListener('animationstart', (e) => {
  console.log('动画开始:', e.animationName);
});

// 监听动画迭代
element.addEventListener('animationiteration', (e) => {
  console.log('动画重复:', e.animationName);
});

// 监听动画结束
element.addEventListener('animationend', (e) => {
  console.log('动画结束:', e.animationName);
  element.classList.remove('animated');
});

// 监听过渡结束
element.addEventListener('transitionend', (e) => {
  console.log('过渡结束:', e.propertyName);
});
```

### 使用Web Animations API

Web Animations API提供更强大的JavaScript动画控制：

```javascript
// 创建关键帧动画
const keyframes = [
  { transform: 'translateX(0)', opacity: 1 },
  { transform: 'translateX(100px)', opacity: 0.5, offset: 0.7 },
  { transform: 'translateX(200px)', opacity: 0 }
];

const options = {
  duration: 2000,
  iterations: Infinity,
  direction: 'alternate',
  easing: 'ease-in-out'
};

// 播放动画
const animation = element.animate(keyframes, options);

// 控制动画
animation.pause();
animation.play();
animation.reverse();
animation.playbackRate = 2; // 加速
animation.finish(); // 直接跳到结束

// 监听动画事件
animation.onfinish = () => console.log('动画完成');
```

## 响应式动画

根据设备和视口调整动画：

```css
/* 默认动画配置 */
.element {
  animation: fadeIn 1s;
}

/* 大屏幕上的配置 */
@media (min-width: 992px) {
  .element {
    animation-duration: 1.5s;
    animation-timing-function: ease-in-out;
  }
}

/* 移动设备上减少动画 */
@media (max-width: 576px) {
  .element {
    animation: none; /* 移动设备禁用动画 */
  }
}
```

### 尊重用户偏好

响应用户减少动画的偏好：

```css
/* 对于偏好减少动画的用户 */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
  }
}
```

## 面试常见问题

### 1. CSS动画和JavaScript动画的区别和适用场景？

**CSS动画优势**：

- 性能通常更好，尤其是简单动画
- 较简单的实现方式
- 利用GPU硬件加速
- 即使JavaScript线程繁忙也能运行

**JavaScript动画优势**：

- 更精细的控制
- 支持动态变化和复杂逻辑
- 支持更多高级效果和物理仿真
- 可在不支持CSS动画的旧浏览器中降级

**适用场景**：

- CSS动画：简单过渡、悬停效果、循环动画
- JavaScript动画：基于用户输入的动画、游戏、需要中途修改的动画

### 2. 过渡(transition)和动画(animation)的区别？

主要区别：

- 过渡需要触发条件（如hover），动画可以自动开始
- 过渡只有开始和结束两个状态，动画可以定义多个关键帧状态
- 过渡只能运行一次，动画可以循环或设置多次运行
- 动画可以更细粒度控制（方向、填充模式等）

### 3. 如何提高CSS动画性能？

主要性能优化手段：

- 使用transform和opacity等触发硬件加速的属性
- 避免频繁改变触发布局的属性（width/height等）
- 使用will-change属性提前通知浏览器
- 将动画元素提升为独立图层（transform: translateZ(0)）
- 较大或复杂动画考虑使用requestAnimationFrame或Canvas/WebGL
- 限制同时进行动画的元素数量

### 4. 什么是关键帧动画？如何定义和使用？

关键帧动画是使用@keyframes规则定义的一系列样式变化：

- 使用from/to或百分比定义动画阶段
- 每个阶段可设置多个CSS属性变化
- 通过animation-*属性或animation简写应用到元素
- 可设置重复次数、方向、填充模式等参数

```css
@keyframes bounce {
  0% { transform: translateY(0); }
  50% { transform: translateY(-30px); }
  100% { transform: translateY(0); }
}

.element {
  animation: bounce 1s infinite;
}
```

### 5. 如何处理不同浏览器对CSS3动画的兼容性问题？

处理兼容性的主要方法：

- 使用autoprefixer等工具自动添加供应商前缀
- 为旧版浏览器提供回退样式
- 使用特性检测（Modernizr等）判断支持情况
- 针对关键场景提供JavaScript动画作为备选方案
- 设计时考虑优雅降级原则

## 总结

CSS动画和过渡为Web开发者提供了强大的工具，用于创建引人注目的用户界面和交互体验。通过合理使用这些技术，可以显著提升用户体验，同时保持良好的性能和兼容性。

关键要点：

- 过渡(transition)适用于简单的状态变化
- 变换(transform)可实现元素的移动、旋转、缩放而不影响布局
- 关键帧动画(animation)提供更复杂和精细的控制
- 性能优化至关重要，特别是在移动设备上
- 始终考虑用户偏好和辅助功能

随着Web平台的不断发展，CSS动画和过渡已成为前端开发的基础技能，熟练掌握这些技术对于创建现代Web应用至关重要。
