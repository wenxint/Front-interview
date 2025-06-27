# CSS变量与计算

CSS变量（自定义属性）和计算（`calc()`函数）是现代CSS中的强大功能，它们显著增强了样式表的灵活性、可维护性和动态性。本章将详细介绍这些功能的用法及最佳实践。

## CSS变量（自定义属性）

### 基本概念

CSS变量，正式名称为"CSS自定义属性"，允许开发者定义可重用的值，这些值可以在整个样式表中引用。

### 语法

定义变量：
```css
:root {
  --primary-color: #3498db;
  --spacing-unit: 8px;
  --font-family: 'Arial', sans-serif;
}
```

使用变量：
```css
.element {
  color: var(--primary-color);
  padding: var(--spacing-unit);
  font-family: var(--font-family);
}
```

带默认值的变量：
```css
.element {
  /* 如果--secondary-color未定义，将使用#f1c40f */
  background-color: var(--secondary-color, #f1c40f);
}
```

### 变量的作用域

CSS变量遵循CSS的级联规则和继承机制：

```css
:root {
  --main-color: blue; /* 全局作用域 */
}

.container {
  --main-color: green; /* 局部作用域 */
  color: var(--main-color); /* 使用绿色 */
}

.container .child {
  color: var(--main-color); /* 继承父元素的绿色 */
}

.sibling {
  color: var(--main-color); /* 使用全局的蓝色 */
}
```

### 动态修改CSS变量

CSS变量最强大的特性是可以通过JavaScript动态修改：

```javascript
// 修改全局变量
document.documentElement.style.setProperty('--primary-color', '#2ecc71');

// 修改特定元素的变量
document.querySelector('.container').style.setProperty('--spacing', '20px');
```

### CSS变量实际应用场景

#### 1. 主题切换

```css
/* 明亮主题（默认） */
:root {
  --background-color: #ffffff;
  --text-color: #333333;
  --accent-color: #3498db;
}

/* 暗黑主题 */
.dark-theme {
  --background-color: #222222;
  --text-color: #f5f5f5;
  --accent-color: #2980b9;
}

body {
  background-color: var(--background-color);
  color: var(--text-color);
}

.button {
  background-color: var(--accent-color);
}
```

```javascript
// 切换主题
function toggleTheme() {
  document.body.classList.toggle('dark-theme');
}
```

#### 2. 响应式设计

```css
:root {
  --container-width: 1200px;
  --font-size-base: 16px;
  --spacing-base: 24px;
}

@media (max-width: 768px) {
  :root {
    --container-width: 100%;
    --font-size-base: 14px;
    --spacing-base: 16px;
  }
}

.container {
  width: var(--container-width);
}

p {
  font-size: var(--font-size-base);
  margin-bottom: var(--spacing-base);
}
```

#### 3. 创建组件变体

```css
.card {
  --card-padding: 16px;
  --card-radius: 8px;
  --card-shadow: 0 2px 4px rgba(0,0,0,0.1);

  padding: var(--card-padding);
  border-radius: var(--card-radius);
  box-shadow: var(--card-shadow);
}

.card--compact {
  --card-padding: 8px;
}

.card--large {
  --card-padding: 24px;
  --card-radius: 12px;
}

.card--elevated {
  --card-shadow: 0 4px 8px rgba(0,0,0,0.2);
}
```

### 嵌套使用变量

CSS变量可以引用其他变量：

```css
:root {
  --primary-hue: 210; /* 蓝色 */
  --primary-color: hsl(var(--primary-hue), 80%, 50%);
  --primary-light: hsl(var(--primary-hue), 80%, 70%);
  --primary-dark: hsl(var(--primary-hue), 80%, 30%);
}

/* 只需修改--primary-hue即可更改整个配色方案 */
```

## CSS计算函数

### calc()函数

`calc()`函数允许在CSS中进行数学计算，支持加(+)、减(-)、乘(*)、除(/)四种运算。

#### 基本用法

```css
.container {
  width: calc(100% - 40px); /* 宽度为父容器宽度减去40px */
  padding: calc(1rem + 5px); /* 混合不同单位 */
  margin-top: calc(var(--spacing-base) * 2); /* 使用变量 */
}
```

#### 混合单位计算

`calc()`的一个强大功能是可以混合不同类型的单位：

```css
.element {
  width: calc(50% + 20px); /* 百分比和像素 */
  height: calc(100vh - 5rem); /* 视口高度和rem */
  font-size: calc(1rem + 0.5vw); /* 响应式字体大小 */
}
```

#### 嵌套calc()

`calc()`函数可以嵌套使用，尽管通常可以简化：

```css
.element {
  width: calc(100% - calc(50px * 2)); /* 可简化为 calc(100% - 100px) */
}
```

#### 实际应用场景

##### 1. 居中元素并考虑内边距

```css
.centered-box {
  width: 80%;
  max-width: 600px;
  padding: 20px;
  margin-left: calc(50% - 600px/2 - 20px);
}
```

##### 2. 创建网格布局

```css
.grid {
  --column-count: 3;
  --gap: 20px;

  display: grid;
  grid-template-columns: repeat(var(--column-count), calc((100% - (var(--column-count) - 1) * var(--gap)) / var(--column-count)));
  grid-gap: var(--gap);
}

@media (max-width: 768px) {
  .grid {
    --column-count: 2;
  }
}
```

##### 3. 动态调整元素高度

```css
.header {
  height: 60px;
}

.content {
  height: calc(100vh - 60px); /* 内容区域填充剩余视口高度 */
}
```

### 其他CSS计算函数

除了`calc()`，CSS还提供了其他几个计算函数：

#### min()函数

返回一组值中的最小值：

```css
.responsive-width {
  width: min(90%, 600px); /* 使用90%宽度，但不超过600px */
  padding: min(5%, 20px); /* 内边距为5%，但不超过20px */
}
```

#### max()函数

返回一组值中的最大值：

```css
.safe-text {
  font-size: max(16px, 1.2vw); /* 确保字体大小不小于16px */
  padding: max(5px, 1vw); /* 确保内边距不小于5px */
}
```

#### clamp()函数

设置一个值的范围（最小值、首选值、最大值）：

```css
.fluid-title {
  font-size: clamp(1.5rem, 5vw, 3rem); /* 响应式大小，在1.5rem到3rem之间 */
  line-height: clamp(1.2, 1.2 + 0.2vw, 1.5); /* 响应式行高 */
  width: clamp(300px, 50%, 800px); /* 响应式宽度 */
}
```

### CSS变量与calc()结合使用

CSS变量与计算函数结合使用可以创建非常灵活的样式系统：

```css
:root {
  --header-height: 60px;
  --footer-height: 80px;
  --sidebar-width: 250px;
  --main-padding: 20px;
}

.layout {
  height: 100vh;
  display: grid;
  grid-template-rows: var(--header-height) calc(100vh - var(--header-height) - var(--footer-height)) var(--footer-height);
  grid-template-columns: var(--sidebar-width) calc(100% - var(--sidebar-width));
}

@media (max-width: 768px) {
  :root {
    --sidebar-width: 0px; /* 移动设备隐藏侧边栏 */
  }
}
```

## 浏览器兼容性与降级方案

### 兼容性检测

可以使用CSS的`@supports`规则检测浏览器是否支持CSS变量：

```css
@supports (--test: 0) {
  /* 支持CSS变量的代码 */
  :root {
    --primary-color: blue;
  }

  .element {
    color: var(--primary-color);
  }
}

@supports not (--test: 0) {
  /* 不支持CSS变量的降级方案 */
  .element {
    color: blue;
  }
}
```

### JavaScript检测与填充

也可以使用JavaScript检测并提供降级方案：

```javascript
// 检测是否支持CSS变量
const supportsCSSVars = window.CSS && window.CSS.supports && window.CSS.supports('--a', 0);

if (!supportsCSSVars) {
  // 加载降级样式或插件
  const fallbackStyles = document.createElement('link');
  fallbackStyles.rel = 'stylesheet';
  fallbackStyles.href = 'fallback-styles.css';
  document.head.appendChild(fallbackStyles);
}
```

## CSS变量与预处理器变量的对比

| 特性 | CSS变量 | 预处理器变量 (SCSS/LESS) |
|-----|---------|------------------------|
| 处理时间 | 运行时 | 编译时 |
| 作用域 | 遵循DOM层级 | 遵循代码块作用域 |
| 动态修改 | 可通过JS修改 | 不能动态修改 |
| 条件变化 | 媒体查询中可重新定义 | 编译时确定 |
| 继承 | 自动继承 | 需明确导入/继承 |
| 浏览器兼容性 | 现代浏览器(IE11部分支持) | 完全兼容(编译为普通CSS) |
| 运行开销 | 有少量开销 | 无开销(已编译) |

### 何时使用CSS变量

- 需要在运行时更改的值（如主题切换）
- 需要响应用户交互的样式
- 需要在媒体查询中改变的样式
- 与DOM结构紧密相关的样式

### 何时使用预处理器变量

- 静态项目配置（不会变更的常量）
- 需要复杂数学运算或函数的场景
- 需要使用条件语句、循环生成CSS的场景
- 需要兼容旧浏览器的项目

## 实战：构建完整主题系统

结合CSS变量和计算函数构建一个完整的主题系统：

```css
/* theme.css */
:root {
  /* 基础颜色 */
  --hue-primary: 210; /* 蓝色 */
  --hue-secondary: 160; /* 青色 */
  --hue-accent: 350; /* 红色 */

  /* 亮度级别 */
  --lightness-base: 50%;
  --lightness-light: 80%;
  --lightness-dark: 30%;

  /* 生成具体颜色 */
  --color-primary: hsl(var(--hue-primary), 80%, var(--lightness-base));
  --color-primary-light: hsl(var(--hue-primary), 80%, var(--lightness-light));
  --color-primary-dark: hsl(var(--hue-primary), 80%, var(--lightness-dark));

  --color-secondary: hsl(var(--hue-secondary), 75%, var(--lightness-base));
  --color-secondary-light: hsl(var(--hue-secondary), 75%, var(--lightness-light));
  --color-secondary-dark: hsl(var(--hue-secondary), 75%, var(--lightness-dark));

  --color-accent: hsl(var(--hue-accent), 85%, var(--lightness-base));

  /* 中性色 */
  --color-gray-100: hsl(0, 0%, 90%);
  --color-gray-300: hsl(0, 0%, 70%);
  --color-gray-500: hsl(0, 0%, 50%);
  --color-gray-700: hsl(0, 0%, 30%);
  --color-gray-900: hsl(0, 0%, 10%);

  /* 背景和文本颜色 */
  --background-color: white;
  --text-color: var(--color-gray-900);

  /* 间距系统 */
  --spacing-unit: 8px;
  --spacing-xs: var(--spacing-unit);
  --spacing-sm: calc(var(--spacing-unit) * 2);
  --spacing-md: calc(var(--spacing-unit) * 3);
  --spacing-lg: calc(var(--spacing-unit) * 4);
  --spacing-xl: calc(var(--spacing-unit) * 6);

  /* 字体系统 */
  --font-size-base: 16px;
  --font-size-xs: calc(var(--font-size-base) * 0.75);
  --font-size-sm: calc(var(--font-size-base) * 0.875);
  --font-size-md: var(--font-size-base);
  --font-size-lg: calc(var(--font-size-base) * 1.25);
  --font-size-xl: calc(var(--font-size-base) * 1.5);
  --font-size-xxl: calc(var(--font-size-base) * 2);

  /* 圆角 */
  --border-radius-sm: 4px;
  --border-radius-md: 8px;
  --border-radius-lg: 16px;
  --border-radius-full: 9999px;

  /* 阴影 */
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1);

  /* 过渡 */
  --transition-fast: 150ms ease;
  --transition-normal: 300ms ease;
  --transition-slow: 500ms ease;
}

/* 暗黑主题 */
.dark-theme {
  --lightness-base: 45%;
  --lightness-light: 60%;
  --lightness-dark: 25%;

  --background-color: var(--color-gray-900);
  --text-color: var(--color-gray-100);

  /* 更深的阴影 */
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.3);
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.4);
  --shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.4);
}

/* 使用主题变量 */
body {
  background-color: var(--background-color);
  color: var(--text-color);
  font-size: var(--font-size-md);
  line-height: 1.5;
  transition: background-color var(--transition-normal), color var(--transition-normal);
}

.button {
  background-color: var(--color-primary);
  color: white;
  padding: var(--spacing-xs) var(--spacing-md);
  border-radius: var(--border-radius-sm);
  transition: all var(--transition-fast);
}

.button:hover {
  background-color: var(--color-primary-dark);
  box-shadow: var(--shadow-md);
}

.button--secondary {
  background-color: var(--color-secondary);
}

.button--accent {
  background-color: var(--color-accent);
}

.card {
  background-color: var(--background-color);
  border-radius: var(--border-radius-md);
  padding: var(--spacing-md);
  box-shadow: var(--shadow-md);
  margin-bottom: var(--spacing-md);
}

.input {
  border: 1px solid var(--color-gray-300);
  border-radius: var(--border-radius-sm);
  padding: var(--spacing-xs) var(--spacing-sm);
  width: 100%;
  background-color: var(--background-color);
  color: var(--text-color);
  transition: border-color var(--transition-fast);
}

.input:focus {
  border-color: var(--color-primary);
  outline: none;
}
```

JavaScript部分：

```javascript
// 切换主题
function toggleTheme() {
  document.body.classList.toggle('dark-theme');
  const isDarkTheme = document.body.classList.contains('dark-theme');
  localStorage.setItem('darkTheme', isDarkTheme);
}

// 根据用户偏好设置初始主题
function initTheme() {
  // 检查本地存储的偏好
  const storedTheme = localStorage.getItem('darkTheme');

  if (storedTheme === 'true') {
    document.body.classList.add('dark-theme');
    return;
  }

  // 检查系统偏好
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    document.body.classList.add('dark-theme');
  }
}

// 监听系统主题变化
function watchSystemTheme() {
  if (window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
      if (localStorage.getItem('darkTheme') === null) { // 只有当用户未手动设置主题时才跟随系统
        document.body.classList.toggle('dark-theme', event.matches);
      }
    });
  }
}

// 允许用户自定义主题色
function setCustomPrimaryColor(hue) {
  document.documentElement.style.setProperty('--hue-primary', hue);
  localStorage.setItem('primaryHue', hue);
}

// 初始化
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  watchSystemTheme();

  // 恢复自定义主题色
  const storedHue = localStorage.getItem('primaryHue');
  if (storedHue) {
    document.documentElement.style.setProperty('--hue-primary', storedHue);
  }
});
```

## 面试常见问题

### 1. CSS变量与传统CSS预处理器变量的主要区别是什么？

CSS变量是在运行时处理的，而预处理器变量是在编译时处理的。这导致了几个关键差异：
- CSS变量可以通过JavaScript动态修改，预处理器变量不能
- CSS变量遵循DOM树继承和级联规则，预处理器变量遵循代码块作用域
- CSS变量可以在媒体查询中重新定义，使UI响应更加灵活
- 预处理器变量支持更复杂的操作（如混合、条件逻辑）

### 2. 如何在不支持CSS变量的浏览器中提供回退方案？

可以采用以下策略：
- 提供直接的默认值作为备选：`var(--color, #default)`
- 使用`@supports`规则检测浏览器支持
- 使用JavaScript检测支持并加载备选样式
- 使用后处理工具（如PostCSS）自动生成带有备选方案的CSS
- 考虑使用polyfill（如css-vars-ponyfill）

### 3. calc()函数有哪些常见用途？

`calc()`函数的常见用途包括：
- 混合不同单位（如`calc(100% - 20px)`）
- 创建响应式布局（结合百分比和固定值）
- 基于视口计算尺寸（如`calc(100vh - 60px)`）
- 与CSS变量结合使用创建动态计算
- 在网格布局中计算轨道大小
- 创建可调整的间距系统

### 4. clamp()、min()和max()函数各自的用途是什么？

- `min(value1, value2, ...)`: 返回一组值中的最小值，常用于设置最大宽度（如`width: min(100%, 1200px)`）
- `max(value1, value2, ...)`: 返回一组值中的最大值，常用于确保最小尺寸（如`font-size: max(16px, 1vw)`）
- `clamp(min, preferred, max)`: 在最小值和最大值之间钳制一个首选值，常用于响应式排版（如`font-size: clamp(1rem, 5vw, 2rem)`）

### 5. 如何有效地组织和管理大型项目中的CSS变量？

有效管理CSS变量的策略包括：
- 采用命名约定（如`--color-primary`、`--spacing-lg`）
- 按功能分组变量（颜色、间距、字体等）
- 使用嵌套变量推导值（基础变量生成衍生变量）
- 将全局变量定义在`:root`选择器中
- 组件特定变量定义在组件内
- 创建变量文档或样式指南
- 只暴露需要定制的变量，内部计算保持私有

## 总结

CSS变量和计算函数代表了CSS向编程语言迈进的重要一步，它们为样式表带来了前所未有的灵活性和动态性。

CSS变量的主要优势在于：
- 减少重复代码
- 简化主题定制
- 提高可维护性
- 使样式具有响应能力
- 允许运行时修改

`calc()`及其相关函数则提供了强大的计算能力，使布局更加灵活和精确。

这些功能与现代框架和组件化开发相得益彰，已成为构建可扩展、维护性强的前端项目的必备工具。随着浏览器支持的普及，这些功能将在未来的Web开发中扮演越来越重要的角色。