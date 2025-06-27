# Flexbox布局

Flexbox（弹性盒子）是CSS3引入的一种新的布局模式，旨在提供一种更加高效和可预测的方式来布局、对齐和分配容器中项目之间的空间，即使它们的大小是未知或动态变化的。

## Flexbox基础概念

Flexbox布局基于"容器"（flex container）和"项目"（flex item）的概念。当一个元素被设置为`display: flex`或`display: inline-flex`时，它成为一个弹性容器，其子元素自动成为弹性项目。

### 主轴与交叉轴

Flexbox布局的核心是两个轴的概念：

- **主轴（Main Axis）**：弹性容器的主要排列方向，由`flex-direction`属性定义
- **交叉轴（Cross Axis）**：垂直于主轴的轴

默认情况下，主轴是水平方向（从左到右），交叉轴是垂直方向（从上到下）。

![Flexbox轴](https://css-tricks.com/wp-content/uploads/2018/11/00-basic-terminology.svg)

### 起点与终点

每个轴都有起点和终点的概念：

- **主轴起点（main start）和终点（main end）**
- **交叉轴起点（cross start）和终点（cross end）**

这些概念对于理解项目的对齐方式很重要。

## Flex容器属性

### 1. display

将元素定义为弹性容器：

```css
.container {
  display: flex; /* 或 display: inline-flex */
}
```

- `flex`：将容器定义为块级弹性容器
- `inline-flex`：将容器定义为内联弹性容器

### 2. flex-direction

定义主轴的方向（项目的排列方向）：

```css
.container {
  flex-direction: row | row-reverse | column | column-reverse;
}
```

- `row`（默认值）：主轴为水平方向，起点在左端
- `row-reverse`：主轴为水平方向，起点在右端
- `column`：主轴为垂直方向，起点在上端
- `column-reverse`：主轴为垂直方向，起点在下端

### 3. flex-wrap

定义项目是否换行以及如何换行：

```css
.container {
  flex-wrap: nowrap | wrap | wrap-reverse;
}
```

- `nowrap`（默认值）：不换行，可能会导致项目溢出容器
- `wrap`：项目会在需要时换行，第一行在上面
- `wrap-reverse`：项目会在需要时换行，第一行在下面

### 4. flex-flow

`flex-direction`和`flex-wrap`的简写属性：

```css
.container {
  flex-flow: <flex-direction> || <flex-wrap>;
}
```

例如：`flex-flow: row wrap;`

### 5. justify-content

定义项目在主轴上的对齐方式：

```css
.container {
  justify-content: flex-start | flex-end | center | space-between | space-around | space-evenly;
}
```

- `flex-start`（默认值）：项目靠主轴起点对齐
- `flex-end`：项目靠主轴终点对齐
- `center`：项目在主轴上居中对齐
- `space-between`：项目均匀分布，第一项在起点，最后一项在终点
- `space-around`：项目均匀分布，每个项目两侧的间隔相等
- `space-evenly`：项目均匀分布，每个项目之间的间隔相等

![justify-content示例](https://css-tricks.com/wp-content/uploads/2018/10/justify-content.svg)

### 6. align-items

定义项目在交叉轴上的对齐方式：

```css
.container {
  align-items: flex-start | flex-end | center | baseline | stretch;
}
```

- `stretch`（默认值）：如果项目未设置高度或设为auto，将占满整个容器的高度
- `flex-start`：项目靠交叉轴起点对齐
- `flex-end`：项目靠交叉轴终点对齐
- `center`：项目在交叉轴上居中对齐
- `baseline`：项目的第一行文字的基线对齐

![align-items示例](https://css-tricks.com/wp-content/uploads/2018/10/align-items.svg)

### 7. align-content

定义多行项目在交叉轴上的对齐方式（只有一行项目时不起作用）：

```css
.container {
  align-content: flex-start | flex-end | center | space-between | space-around | stretch;
}
```

- `stretch`（默认值）：拉伸占满整个交叉轴
- `flex-start`：项目靠交叉轴起点对齐
- `flex-end`：项目靠交叉轴终点对齐
- `center`：项目在交叉轴上居中对齐
- `space-between`：项目均匀分布，第一行在起点，最后一行在终点
- `space-around`：项目均匀分布，每行两侧的间隔相等

![align-content示例](https://css-tricks.com/wp-content/uploads/2018/10/align-content.svg)

## Flex项目属性

### 1. order

定义项目的排列顺序，数值越小，排列越靠前：

```css
.item {
  order: <integer>; /* 默认为0 */
}
```

![order示例](https://css-tricks.com/wp-content/uploads/2018/10/order.svg)

### 2. flex-grow

定义项目的放大比例：

```css
.item {
  flex-grow: <number>; /* 默认为0 */
}
```

如果所有项目的`flex-grow`值都为1，则它们将等分剩余空间。如果一个项目的`flex-grow`为2，其他项目都为1，则前者占据的剩余空间将比其他项目多一倍。

![flex-grow示例](https://css-tricks.com/wp-content/uploads/2018/10/flex-grow.svg)

### 3. flex-shrink

定义项目的缩小比例：

```css
.item {
  flex-shrink: <number>; /* 默认为1 */
}
```

当空间不足时，该属性定义项目的缩小比例。如果所有项目的`flex-shrink`都为1，当空间不足时，都将等比例缩小。如果一个项目的`flex-shrink`为0，其他项目都为1，则空间不足时，前者不缩小。

### 4. flex-basis

定义项目在分配多余空间之前的初始大小：

```css
.item {
  flex-basis: <length> | auto; /* 默认为auto */
}
```

可以设为具体的长度（如100px）或百分比。如果设为`auto`，则项目的大小基于其内容。

### 5. flex

`flex-grow`、`flex-shrink`和`flex-basis`的简写：

```css
.item {
  flex: none | [ <flex-grow> <flex-shrink>? || <flex-basis> ];
}
```

快速设置：
- `flex: 1;` = `flex: 1 1 0%;`（可放大，可缩小，初始大小为0）
- `flex: auto;` = `flex: 1 1 auto;`（可放大，可缩小，初始大小基于内容）
- `flex: none;` = `flex: 0 0 auto;`（不放大，不缩小，初始大小基于内容）
- `flex: 0 auto;` = `flex: 0 1 auto;`（不放大，可缩小，初始大小基于内容）

### 6. align-self

允许单个项目有与其他项目不一样的对齐方式，覆盖`align-items`属性：

```css
.item {
  align-self: auto | flex-start | flex-end | center | baseline | stretch;
}
```

![align-self示例](https://css-tricks.com/wp-content/uploads/2018/10/align-self.svg)

## Flexbox布局实战

### 1. 居中布局

垂直水平居中（单个元素）：

```html
<div class="container">
  <div class="item">居中内容</div>
</div>
```

```css
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 300px;
  border: 1px solid #ccc;
}
```

### 2. 均匀分布的导航栏

```html
<nav class="navbar">
  <a href="#">首页</a>
  <a href="#">产品</a>
  <a href="#">服务</a>
  <a href="#">关于</a>
  <a href="#">联系</a>
</nav>
```

```css
.navbar {
  display: flex;
  background-color: #333;
}

.navbar a {
  color: white;
  text-decoration: none;
  padding: 15px 20px;
  flex: 1;
  text-align: center;
  transition: background-color 0.3s;
}

.navbar a:hover {
  background-color: #555;
}
```

### 3. 圣杯布局（三栏布局）

```html
<div class="holy-grail">
  <header class="hg-header">Header</header>
  <div class="hg-body">
    <main class="hg-main">Main Content</main>
    <nav class="hg-nav">Navigation</nav>
    <aside class="hg-sidebar">Sidebar</aside>
  </div>
  <footer class="hg-footer">Footer</footer>
</div>
```

```css
.holy-grail {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.hg-header, .hg-footer {
  background-color: #f2f2f2;
  padding: 20px;
}

.hg-body {
  display: flex;
  flex: 1;
}

.hg-main {
  flex: 1;
  padding: 20px;
  background-color: #fff;
}

.hg-nav {
  order: -1;
  width: 200px;
  padding: 20px;
  background-color: #e6f7ff;
}

.hg-sidebar {
  width: 200px;
  padding: 20px;
  background-color: #ffe7e6;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .hg-body {
    flex-direction: column;
  }

  .hg-nav, .hg-sidebar {
    width: auto;
  }
}
```

### 4. 响应式卡片网格

```html
<div class="card-grid">
  <div class="card">Card 1</div>
  <div class="card">Card 2</div>
  <div class="card">Card 3</div>
  <div class="card">Card 4</div>
  <div class="card">Card 5</div>
  <div class="card">Card 6</div>
</div>
```

```css
.card-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  padding: 20px;
}

.card {
  flex: 1 1 300px; /* 增长、收缩和基本宽度 */
  min-height: 200px;
  background-color: #f0f0f0;
  border-radius: 5px;
  padding: 20px;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 24px;
}
```

### 5. 自适应表单布局

```html
<form class="flex-form">
  <div class="form-group">
    <label for="name">姓名</label>
    <input type="text" id="name">
  </div>
  <div class="form-group">
    <label for="email">邮箱</label>
    <input type="email" id="email">
  </div>
  <div class="form-group">
    <label for="message">留言</label>
    <textarea id="message"></textarea>
  </div>
  <div class="form-actions">
    <button type="reset">重置</button>
    <button type="submit">提交</button>
  </div>
</form>
```

```css
.flex-form {
  display: flex;
  flex-direction: column;
  max-width: 500px;
  gap: 15px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group label {
  margin-bottom: 5px;
}

.form-group input, .form-group textarea {
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.form-actions button {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.form-actions button[type="submit"] {
  background-color: #4CAF50;
  color: white;
}

.form-actions button[type="reset"] {
  background-color: #f5f5f5;
}
```

### 6. 粘性页脚

确保页脚始终位于页面底部，即使内容很少：

```html
<div class="page-container">
  <header>Header</header>
  <main>Main Content</main>
  <footer>Footer</footer>
</div>
```

```css
.page-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

header, footer {
  background-color: #333;
  color: white;
  padding: 20px;
}

main {
  flex: 1; /* 占据剩余空间 */
  padding: 20px;
}
```

## Flexbox的高级用法

### 1. 自动边距技巧

使用`margin: auto`在Flex容器中可以实现一些特殊的对齐效果：

```css
/* 将一个项目推到右边 */
.item:last-child {
  margin-left: auto;
}

/* 将多个项目分组 */
.left-group {
  display: flex;
  gap: 10px;
}

.right-group {
  display: flex;
  gap: 10px;
  margin-left: auto;
}
```

### 2. flex属性的精确比例

```css
/* 三栏布局，中间是两边的两倍宽 */
.container {
  display: flex;
}

.side {
  flex: 1; /* 1份 */
}

.main {
  flex: 2; /* 2份 */
}
```

### 3. 嵌套Flex布局

Flex容器可以嵌套使用，创建复杂布局：

```html
<div class="outer-flex">
  <div class="left-section">Left</div>
  <div class="inner-flex">
    <div class="top-section">Top</div>
    <div class="bottom-section">Bottom</div>
  </div>
</div>
```

```css
.outer-flex {
  display: flex;
  height: 400px;
}

.left-section {
  width: 200px;
  background-color: #e0e0e0;
}

.inner-flex {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.top-section {
  flex: 2;
  background-color: #f5f5f5;
}

.bottom-section {
  flex: 1;
  background-color: #eeeeee;
}
```

## Flexbox与其他布局方法的比较

### Flexbox vs Grid

- **Flexbox**：一维布局系统，适用于行或列的排列
- **Grid**：二维布局系统，同时处理行和列

| 特性 | Flexbox | Grid |
|-----|---------|------|
| 维度 | 一维 | 二维 |
| 方向 | 行或列 | 行和列 |
| 对齐 | 容器内项目 | 容器内单元格 |
| 适用场景 | 导航、工具栏、卡片列表 | 整页布局、复杂的网格系统 |

### Flexbox vs 传统布局方法

| 特性 | Flexbox | 浮动布局 | 表格布局 | 定位布局 |
|-----|---------|---------|---------|---------|
| 响应性 | 高 | 中 | 低 | 低 |
| 垂直居中 | 简单 | 复杂 | 简单 | 中等 |
| 自动空间分配 | 是 | 否 | 是 | 否 |
| 代码复杂度 | 低 | 高 | 高 | 高 |

## 浏览器兼容性

Flexbox在现代浏览器中得到了广泛支持：

- Chrome 29+
- Firefox 22+
- Safari 6.1+
- Opera 12.1+
- IE 11+
- Edge 12+

### 兼容性问题解决方案

#### 1. 使用供应商前缀

对于旧版浏览器，可能需要添加供应商前缀：

```css
.container {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
}
```

推荐使用Autoprefixer等工具自动添加前缀。

#### 2. IE 10-11 的特殊处理

IE 10-11对Flexbox的支持并不完美，可能需要一些特殊处理：

```css
/* IE 10-11特定修复 */
@media all and (-ms-high-contrast: none), (-ms-high-contrast: active) {
  .flex-item {
    flex-basis: auto; /* 修复IE的flex-basis问题 */
  }
}
```

#### 3. 降级方案

为不支持Flexbox的旧浏览器提供降级方案：

```css
/* 传统浮动布局 */
.container {
  overflow: hidden; /* 清除浮动 */
}

.item {
  float: left;
  width: 33.33%;
}

/* 现代Flexbox布局 */
@supports (display: flex) {
  .container {
    display: flex;
  }

  .item {
    float: none;
    flex: 1;
  }
}
```

## Flexbox性能优化

虽然Flexbox性能已经很好，但在大型应用中仍有一些优化点：

1. **避免深度嵌套的Flex容器**：多层嵌套会增加渲染计算
2. **大列表使用虚拟滚动**：当有大量Flex项目时，考虑虚拟滚动技术
3. **固定尺寸优于自动尺寸**：当可能时，为Flex项目设置明确的尺寸
4. **避免混合使用百分比和像素**：可能导致不稳定的布局

## 面试常见问题

### 1. 什么是Flexbox，它解决了什么问题？

Flexbox是一种一维布局模型，专为UI元素布局而设计。它解决了以下传统布局方式的问题：
- 简化垂直居中
- 简化等高列
- 自动调整元素大小适应容器
- 控制元素顺序而不改变HTML
- 自动分配空间

### 2. Flex容器和Flex项目的主要属性有哪些？

Flex容器的主要属性：
- display: flex | inline-flex
- flex-direction
- flex-wrap
- justify-content
- align-items
- align-content

Flex项目的主要属性：
- flex-grow
- flex-shrink
- flex-basis
- flex (简写属性)
- order
- align-self

### 3. 如何使用Flexbox实现水平和垂直居中？

```css
.container {
  display: flex;
  justify-content: center; /* 水平居中 */
  align-items: center;     /* 垂直居中 */
  height: 300px;
}
```

### 4. flex: 1是什么意思？

`flex: 1`是`flex: 1 1 0%`的简写，意味着：
- flex-grow: 1（可以增长）
- flex-shrink: 1（可以收缩）
- flex-basis: 0%（起始尺寸为0）

这个设置使得元素能够根据可用空间自动增长和收缩，通常用于创建灵活的、等分空间的布局。

### 5. Flexbox与CSS Grid的区别是什么？何时使用哪一个？

主要区别：
- Flexbox是一维布局（行或列），Grid是二维布局（行和列）
- Flexbox以内容为中心，Grid以布局为中心

使用指南：
- 使用Flexbox：当需要在单一维度上分布元素
- 使用Grid：当需要同时控制行和列的二维布局

常见场景：
- Flexbox：导航栏、卡片布局、工具栏
- Grid：整页布局、复杂的网格系统、表格数据

## 总结

Flexbox是现代CSS布局的重要组成部分，它提供了一种强大而灵活的方式来创建响应式和动态的页面布局。通过基于容器和项目的简单模型，Flexbox大大简化了许多常见的布局任务，如居中对齐、空间分配和内容排序。

主要优势：
- 布局逻辑简单明了
- 轻松实现垂直和水平居中
- 灵活控制空间分配
- 直观调整元素顺序
- 适应不同屏幕尺寸

随着浏览器对Flexbox的广泛支持，它已成为前端开发的基本技能。结合Grid布局，现代CSS提供了完整的工具集，使得构建复杂、响应式的Web界面比以往任何时候都更加简单和高效。