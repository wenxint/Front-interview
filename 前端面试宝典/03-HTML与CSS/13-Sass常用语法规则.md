# Sass常用语法规则

> Sass（Syntactically Awesome Stylesheets）是世界上最成熟、最稳定、最强大的CSS扩展语言之一，它通过增加变量、嵌套、混合、继承、控制指令等特性，极大提升了CSS的可维护性和开发效率。

## 概念介绍

Sass是一种CSS预处理器，诞生于2006年，由Hampton Catlin设计，后由Natalie Weizenbaum主要开发。它为CSS增加了编程语言的特性，使得样式表更加强大和灵活。

### 两种语法格式对比

Sass提供两种语法格式，各有优势：

**1. Sass语法（缩进式）**
```sass
// 变量定义
$primary-color: #007bff
$base-font-size: 16px

// 嵌套结构
.navbar
  background: $primary-color
  ul
    margin: 0
    padding: 0
    li
      list-style: none
      a
        color: white
        text-decoration: none
        &:hover
          text-decoration: underline
```

**2. SCSS语法（CSS超集）**
```scss
/**
 * @description SCSS语法示例 - 完全兼容CSS
 */
// 变量定义
$primary-color: #007bff;
$base-font-size: 16px;

// 嵌套结构
.navbar {
  background: $primary-color;

  ul {
    margin: 0;
    padding: 0;

    li {
      list-style: none;

      a {
        color: white;
        text-decoration: none;

        &:hover {
          text-decoration: underline;
        }
      }
    }
  }
}
```

**语法对比表格**：

| 特性 | Sass语法 | SCSS语法 | 推荐场景 |
|------|----------|----------|----------|
| 兼容性 | 不兼容CSS | 完全兼容CSS | SCSS适合团队协作 |
| 语法简洁性 | 更简洁 | 需要大括号和分号 | Sass适合个人项目 |
| 学习成本 | 需要适应新语法 | 几乎无学习成本 | SCSS适合初学者 |
| 文件扩展名 | .sass | .scss | 当前主流选择SCSS |

### Sass的核心优势

1. **变量管理**：集中管理颜色、字体、尺寸等设计要素
2. **代码复用**：通过混合器（mixin）和继承减少重复代码
3. **逻辑控制**：支持条件语句、循环等编程特性
4. **模块化**：通过导入功能实现样式的模块化管理
5. **数学运算**：支持数值和颜色的计算操作

## 基本语法

### 1. 变量（Variables）

变量是Sass最基础也是最重要的特性，使用`$`符号声明。

#### 基础变量类型

```scss
/**
 * @description Sass变量类型演示
 */

// 1. 颜色变量
$primary-color: #007bff;          // 十六进制
$secondary-color: rgb(108, 117, 125); // RGB函数
$success-color: hsl(134, 61%, 41%);   // HSL函数

// 2. 数值变量
$base-font-size: 16px;            // 像素值
$line-height: 1.5;                // 无单位数值
$container-width: 100%;           // 百分比
$border-radius: 0.25rem;          // rem单位

// 3. 字符串变量
$font-family: 'Helvetica Neue', Arial, sans-serif;
$image-path: '/assets/images/';
$font-weight-bold: bold;

// 4. 布尔值
$enable-rounded: true;
$enable-shadows: false;

// 5. 空值
$custom-margin: null;

// 6. 列表（类似数组）
$font-sizes: 12px, 14px, 16px, 18px, 24px;
$margin-sizes: 0, 0.25rem, 0.5rem, 1rem, 2rem;

// 7. 映射（类似对象）
$theme-colors: (
  primary: #007bff,
  secondary: #6c757d,
  success: #28a745,
  danger: #dc3545,
  warning: #ffc107,
  info: #17a2b8
);
```

#### 变量作用域和默认值

```scss
/**
 * @description 变量作用域管理示例
 */

// 全局变量
$global-color: #333 !default; // !default表示如果变量已定义则不覆盖

// 局部作用域
.component {
  $local-color: #666; // 局部变量
  color: $local-color;

  .nested {
    // 访问外层变量
    border-color: $local-color;
  }
}

// 强制全局变量
.sidebar {
  $sidebar-width: 300px !global; // 使局部变量变为全局
  width: $sidebar-width;
}

.main-content {
  margin-left: $sidebar-width; // 可以访问上面定义的全局变量
}

// 变量插值（Interpolation）
$prefix: 'app';
$property: 'margin';

.#{$prefix}-container {
  #{$property}-top: 20px;
  background-image: url('#{$image-path}logo.png');
}

// 编译结果：
// .app-container {
//   margin-top: 20px;
//   background-image: url('/assets/images/logo.png');
// }
```

### 2. 嵌套（Nesting）

嵌套是Sass的核心特性，让CSS结构更加清晰和易维护。

#### 选择器嵌套

```scss
/**
 * @description 选择器嵌套完整示例
 */

// 基础嵌套
.navbar {
  background: $primary-color;
  padding: 1rem;

  // 后代选择器
  .nav-brand {
    font-size: 1.25rem;
    font-weight: bold;
    color: white;
  }

  .nav-menu {
    display: flex;
      list-style: none;
    margin: 0;
    padding: 0;

    .nav-item {
      margin-right: 1rem;

      .nav-link {
        color: white;
        text-decoration: none;
        padding: 0.5rem 1rem;
        border-radius: 4px;
        transition: background-color 0.3s ease;

        // 父选择器引用 &
        &:hover {
          background-color: rgba(255, 255, 255, 0.1);
        }

        &:active {
          background-color: rgba(255, 255, 255, 0.2);
        }

        // 修饰符类
        &.active {
          background-color: rgba(255, 255, 255, 0.15);
          font-weight: bold;
        }

        // 组合父选择器
        .dark-theme & {
          border: 1px solid rgba(255, 255, 255, 0.2);
        }
      }
    }
  }

  // 响应式嵌套
  @media (max-width: 768px) {
    padding: 0.5rem;

    .nav-menu {
      flex-direction: column;

      .nav-item {
        margin-right: 0;
        margin-bottom: 0.5rem;
      }
    }
  }
}

// 编译后的CSS会自动展开嵌套结构
```

#### 属性嵌套

```scss
/**
 * @description 属性嵌套演示
 */

.card {
  // 普通属性嵌套
  border: {
    width: 1px;
    style: solid;
    color: #dee2e6;
    radius: 0.375rem;
  }

  // 简写属性嵌套
  margin: {
    top: 1rem;
    bottom: 1rem;
    left: auto;
    right: auto;
  }

  // 字体属性嵌套
  font: {
    family: $font-family;
    size: $base-font-size;
    weight: normal;
    style: normal;
  }

  // 背景属性嵌套
  background: {
    color: white;
    image: url('texture.png');
    repeat: no-repeat;
    position: center center;
    size: cover;
  }
}

// 编译结果：
// .card {
//   border-width: 1px;
//   border-style: solid;
//   border-color: #dee2e6;
//   border-radius: 0.375rem;
//   margin-top: 1rem;
//   margin-bottom: 1rem;
//   margin-left: auto;
//   margin-right: auto;
//   /* ... 其他属性 */
// }
```

#### 嵌套注意事项

```scss
/**
 * @description 嵌套最佳实践和注意事项
 */

// ❌ 避免过深嵌套（超过3-4层）
.header {
  .navigation {
    .menu {
      .item {
        .link {
          // 嵌套过深，难以维护
          color: red;
        }
      }
    }
  }
}

// ✅ 推荐的嵌套深度
.header {
  .navigation {
    background: $primary-color;
  }
}

.nav-menu {
  .nav-item {
    margin: 0.5rem;

    .nav-link {
      color: $primary-color;
    }
  }
}

// ✅ 合理使用父选择器引用
.button {
  background: $primary-color;

  // 状态修饰
  &:hover,
  &:focus {
    background: darken($primary-color, 10%);
  }

  // 尺寸修饰
  &.btn-large {
    padding: 12px 24px;
    font-size: 18px;
  }

  &.btn-small {
    padding: 6px 12px;
    font-size: 14px;
  }

  // 主题修饰
  &.btn-outline {
    background: transparent;
    border: 2px solid $primary-color;
    color: $primary-color;
  }
}
```

## 核心特性

### 3. 混合器（Mixins）

混合器是Sass最强大的特性之一，允许定义可重用的样式组合。

#### 基础混合器

```scss
/**
 * @description 混合器基础用法演示
 */

// 无参数混合器
@mixin reset-list {
  margin: 0;
  padding: 0;
  list-style: none;
}

// 使用混合器
.nav-menu {
  @include reset-list;
  display: flex;
}

// 带参数的混合器
@mixin button-style($bg-color, $text-color: white, $padding: 10px 20px) {
  background-color: $bg-color;
  color: $text-color;
  padding: $padding;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background-color: darken($bg-color, 10%);
    transform: translateY(-1px);
  }
}

// 使用带参数的混合器
.primary-button {
  @include button-style($primary-color);
}

.secondary-button {
  @include button-style($secondary-color, white, 8px 16px);
}
```

#### 高级混合器技术

```scss
/**
 * @description 高级混合器技术演示
 */

// 1. 使用@content指令
@mixin respond-to($breakpoint) {
  @if $breakpoint == mobile {
    @media (max-width: 767px) {
      @content;
    }
  }
  @if $breakpoint == tablet {
    @media (min-width: 768px) and (max-width: 1023px) {
      @content;
    }
  }
  @if $breakpoint == desktop {
    @media (min-width: 1024px) {
      @content;
    }
  }
}

// 使用响应式混合器
.container {
  width: 100%;
  padding: 0 15px;

  @include respond-to(mobile) {
    padding: 0 10px;
  }

  @include respond-to(tablet) {
    max-width: 750px;
    margin: 0 auto;
  }

  @include respond-to(desktop) {
    max-width: 1200px;
  }
}

// 2. 可变参数混合器
@mixin box-shadow($shadows...) {
  -webkit-box-shadow: $shadows;
  -moz-box-shadow: $shadows;
  box-shadow: $shadows;
}

// 使用可变参数
.card {
  @include box-shadow(
    0 2px 4px rgba(0, 0, 0, 0.1),
    0 8px 16px rgba(0, 0, 0, 0.1)
  );
}

// 3. 条件混合器
@mixin border-radius($radius, $important: false) {
  @if $important {
    border-radius: $radius !important;
  } @else {
    border-radius: $radius;
  }
}

// 4. 复杂布局混合器
@mixin flex-center($direction: row) {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: $direction;
}

@mixin grid-container($columns: 12, $gap: 20px) {
  display: grid;
  grid-template-columns: repeat($columns, 1fr);
  gap: $gap;
}

// 使用布局混合器
.modal {
  @include flex-center(column);
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
}

.grid-layout {
  @include grid-container(12, 30px);
  max-width: 1200px;
  margin: 0 auto;
}
```

### 4. 继承（Extend/Inheritance）

继承允许选择器共享另一个选择器的样式，是减少CSS重复的有效方法。

#### 基础继承

```scss
/**
 * @description 继承基础用法演示
 */

// 占位符选择器（推荐使用）
%button-base {
  display: inline-block;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  text-align: center;
  text-decoration: none;
  transition: all 0.3s ease;
  font-family: inherit;
  font-size: 14px;
  line-height: 1.5;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
}

// 继承占位符选择器
.btn-primary {
  @extend %button-base;
  background-color: $primary-color;
  color: white;

  &:hover:not(:disabled) {
    background-color: darken($primary-color, 10%);
  }
}

.btn-secondary {
  @extend %button-base;
  background-color: $secondary-color;
  color: white;

  &:hover:not(:disabled) {
    background-color: darken($secondary-color, 10%);
  }
}

.btn-outline {
  @extend %button-base;
  background-color: transparent;
  border: 2px solid $primary-color;
  color: $primary-color;

  &:hover:not(:disabled) {
    background-color: $primary-color;
    color: white;
  }
}
```

#### 继承与混合器的对比

```scss
/**
 * @description 继承vs混合器对比示例
 */

// 使用继承的情况
%message-base {
  padding: 15px;
  margin-bottom: 20px;
  border: 1px solid transparent;
  border-radius: 4px;
}

.alert-success {
  @extend %message-base;
  color: #155724;
  background-color: #d4edda;
  border-color: #c3e6cb;
}

.alert-danger {
  @extend %message-base;
  color: #721c24;
  background-color: #f8d7da;
  border-color: #f5c6cb;
}

// 编译后的CSS（继承）：
// .alert-success, .alert-danger {
//   padding: 15px;
//   margin-bottom: 20px;
//   border: 1px solid transparent;
//   border-radius: 4px;
// }
// .alert-success { /* 特定样式 */ }
// .alert-danger { /* 特定样式 */ }

// 使用混合器的情况
@mixin message-base {
  padding: 15px;
  margin-bottom: 20px;
  border: 1px solid transparent;
  border-radius: 4px;
}

.info-success {
  @include message-base;
  color: #155724;
  background-color: #d4edda;
  border-color: #c3e6cb;
}

.info-danger {
  @include message-base;
  color: #721c24;
  background-color: #f8d7da;
  border-color: #f5c6cb;
}

// 编译后的CSS（混合器）：
// .info-success {
//   padding: 15px;
//   margin-bottom: 20px;
//   border: 1px solid transparent;
//   border-radius: 4px;
//   color: #155724;
//   background-color: #d4edda;
//   border-color: #c3e6cb;
// }
// .info-danger { /* 重复相同的基础样式 */ }
```

#### 继承的最佳实践

```scss
/**
 * @description 继承最佳实践演示
 */

// ✅ 推荐：使用占位符选择器
%clearfix {
  &:after {
    content: "";
    display: table;
    clear: both;
  }
}

.container {
  @extend %clearfix;
  width: 100%;
}

// ❌ 避免：继承复杂的嵌套选择器
.navbar .nav-item .nav-link {
  color: blue;
}

.sidebar-link {
  @extend .navbar .nav-item .nav-link; // 会生成复杂的选择器组合
}

// ✅ 推荐：使用混合器处理复杂逻辑
@mixin link-style($color: blue) {
  color: $color;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
}

.nav-link {
  @include link-style($primary-color);
}

.sidebar-link {
  @include link-style($secondary-color);
}
```

## 实战案例

### 1. 完整的组件库架构

```scss
/**
 * @description 企业级Sass项目架构示例
 */

// 1. 抽象层 - abstracts/
// abstracts/_variables.scss
$breakpoints: (
  xs: 0,
  sm: 576px,
  md: 768px,
  lg: 992px,
  xl: 1200px,
  xxl: 1400px
);

$grid-columns: 12;
$grid-gutter-width: 30px;

$theme-colors: (
  primary: #0d6efd,
  secondary: #6c757d,
  success: #198754,
  info: #0dcaf0,
  warning: #ffc107,
  danger: #dc3545,
  light: #f8f9fa,
  dark: #212529
);

// abstracts/_mixins.scss
@mixin make-container($max-widths: $container-max-widths, $gutter: $grid-gutter-width) {
  width: 100%;
  padding-right: $gutter / 2;
  padding-left: $gutter / 2;
  margin-right: auto;
  margin-left: auto;

  @each $breakpoint, $max-width in $max-widths {
    @include media-breakpoint-up($breakpoint) {
      max-width: $max-width;
    }
  }
}

@mixin media-breakpoint-up($name, $breakpoints: $breakpoints) {
  $min: map-get($breakpoints, $name);
  @if $min != 0 {
    @media (min-width: $min) {
      @content;
    }
  } @else {
    @content;
  }
}

// 2. 基础层 - base/
// base/_reset.scss
*,
*::before,
*::after {
  box-sizing: border-box;
}

html {
  font-family: sans-serif;
  line-height: 1.15;
  -webkit-text-size-adjust: 100%;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
}

// base/_typography.scss
@each $size, $value in $font-sizes {
  .h#{$size},
  .text-#{$size} {
    font-size: $value;
  }
}

// 3. 组件层 - components/
// components/_buttons.scss
%btn {
  display: inline-block;
  font-weight: 400;
  line-height: 1.5;
  color: #212529;
  text-align: center;
  text-decoration: none;
  vertical-align: middle;
  cursor: pointer;
  user-select: none;
  background-color: transparent;
  border: 1px solid transparent;
  padding: 0.375rem 0.75rem;
  font-size: 1rem;
  border-radius: 0.25rem;
  transition: all 0.15s ease-in-out;

    &:hover {
    text-decoration: none;
  }

  &:focus,
  &.focus {
    outline: 0;
    box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
  }

  &.disabled,
  &:disabled {
    opacity: 0.65;
    cursor: not-allowed;
  }
}

@each $color, $value in $theme-colors {
  .btn-#{$color} {
    @extend %btn;
    @include button-variant($value, $value);
  }

  .btn-outline-#{$color} {
    @extend %btn;
    @include button-outline-variant($value);
  }
}

// components/_cards.scss
.card {
  position: relative;
  display: flex;
  flex-direction: column;
  min-width: 0;
  word-wrap: break-word;
  background-color: #fff;
  background-clip: border-box;
  border: 1px solid rgba(0, 0, 0, 0.125);
  border-radius: 0.25rem;

  > hr {
    margin-right: 0;
    margin-left: 0;
  }

  .card-header,
  .card-footer {
    padding: 0.75rem 1.25rem;
    background-color: rgba(0, 0, 0, 0.03);
    border-bottom: 1px solid rgba(0, 0, 0, 0.125);

    &:first-child {
      border-radius: calc(0.25rem - 1px) calc(0.25rem - 1px) 0 0;
    }
  }

  .card-body {
    flex: 1 1 auto;
    padding: 1.25rem;
  }
}
```

### 2. 响应式设计系统

```scss
/**
 * @description 完整的响应式设计系统
 */

// 响应式断点系统
@mixin respond-to($breakpoint) {
  @if map-has-key($breakpoints, $breakpoint) {
    $value: map-get($breakpoints, $breakpoint);
    @if $value != 0 {
      @media (min-width: $value) {
        @content;
      }
    } @else {
      @content;
    }
  } @else {
    @warn "Unfortunately, no value could be retrieved from `#{$breakpoint}`. "
        + "Available breakpoints are: #{map-keys($breakpoints)}.";
  }
}

// 响应式栅格系统
@mixin make-grid-columns($columns: $grid-columns, $gutter: $grid-gutter-width, $breakpoints: $breakpoints) {
  @each $breakpoint in map-keys($breakpoints) {
    $infix: if($breakpoint == xs, "", "-#{$breakpoint}");

    @include media-breakpoint-up($breakpoint, $breakpoints) {
      // 提供基础的 `.col-{breakpoint}` 类用于等宽列
      .col#{$infix} {
        flex-basis: 0;
        flex-grow: 1;
        max-width: 100%;
      }

      // 自动调整宽度的列
      .col#{$infix}-auto {
        flex: 0 0 auto;
        width: auto;
        max-width: 100%;
      }

      @for $i from 1 through $columns {
        .col#{$infix}-#{$i} {
          @include make-col($i, $columns);
        }
      }

      // 偏移量
      @for $i from 0 through ($columns - 1) {
        @if not ($infix == "" and $i == 0) {
          .offset#{$infix}-#{$i} {
            @include make-col-offset($i, $columns);
          }
        }
      }
    }
  }
}

// 响应式工具类
$displays: none, inline, inline-block, block, table, table-row, table-cell, flex, inline-flex;

@each $breakpoint in map-keys($breakpoints) {
  @include media-breakpoint-up($breakpoint) {
    $infix: if($breakpoint == xs, "", "-#{$breakpoint}");

    @each $value in $displays {
      .d#{$infix}-#{$value} {
        display: $value !important;
      }
    }
  }
}

// 使用示例
.hero-section {
  padding: 2rem 1rem;

  @include respond-to(md) {
    padding: 4rem 2rem;
  }

  @include respond-to(xl) {
    padding: 6rem 3rem;
  }

  .hero-title {
    font-size: 1.75rem;

    @include respond-to(md) {
      font-size: 2.5rem;
    }

    @include respond-to(xl) {
      font-size: 3.5rem;
    }
  }
}
```

### 3. 主题切换系统

```scss
/**
 * @description 动态主题切换系统
 */

// 主题配置
$themes: (
  light: (
    background: #ffffff,
    surface: #f8f9fa,
    primary: #007bff,
    text: #212529,
    text-secondary: #6c757d,
    border: #dee2e6
  ),
  dark: (
    background: #121212,
    surface: #1e1e1e,
    primary: #bb86fc,
    text: #ffffff,
    text-secondary: #aaaaaa,
    border: #333333
  ),
  high-contrast: (
    background: #000000,
    surface: #1a1a1a,
    primary: #ffff00,
    text: #ffffff,
    text-secondary: #cccccc,
    border: #ffffff
  )
);

// 主题混合器
@mixin themed() {
  @each $theme, $map in $themes {
    .theme-#{$theme} & {
      $theme-map: () !global;
      @each $key, $submap in $map {
        $value: map-get(map-get($themes, $theme), '#{$key}');
        $theme-map: map-merge($theme-map, ($key: $value)) !global;
      }
      @content;
      $theme-map: null !global;
    }
  }
}

// 获取主题变量的函数
@function themed($key) {
  @return map-get($theme-map, $key);
}

// 使用主题
.card {
  @include themed() {
    background-color: themed('surface');
    color: themed('text');
    border: 1px solid themed('border');
  }

  .card-title {
    @include themed() {
      color: themed('primary');
    }
  }

  .card-text {
    @include themed() {
      color: themed('text-secondary');
    }
  }
}

// CSS变量版本（现代浏览器）
:root {
  // 亮色主题
  --background: #{map-get(map-get($themes, light), background)};
  --surface: #{map-get(map-get($themes, light), surface)};
  --primary: #{map-get(map-get($themes, light), primary)};
  --text: #{map-get(map-get($themes, light), text)};
  --text-secondary: #{map-get(map-get($themes, light), text-secondary)};
  --border: #{map-get(map-get($themes, light), border)};
}

[data-theme="dark"] {
  // 暗色主题
  --background: #{map-get(map-get($themes, dark), background)};
  --surface: #{map-get(map-get($themes, dark), surface)};
  --primary: #{map-get(map-get($themes, dark), primary)};
  --text: #{map-get(map-get($themes, dark), text)};
  --text-secondary: #{map-get(map-get($themes, dark), text-secondary)};
  --border: #{map-get(map-get($themes, dark), border)};
}

// 使用CSS变量
.modern-card {
  background-color: var(--surface);
  color: var(--text);
  border: 1px solid var(--border);
  transition: all 0.3s ease;
}
```

### 4. 性能优化策略

```scss
/**
 * @description Sass性能优化最佳实践
 */

// 1. 避免过深嵌套
// ❌ 不推荐
.header {
  .nav {
    .menu {
      .item {
        .link {
          color: blue;
        }
      }
    }
  }
}

// ✅ 推荐
.header { /* 样式 */ }
.nav-menu { /* 样式 */ }
.nav-item { /* 样式 */ }
.nav-link { color: blue; }

// 2. 合理使用占位符选择器
// ✅ 使用占位符避免未使用的CSS
%button-base {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.btn-primary {
  @extend %button-base;
  background: blue;
}

// 3. 优化选择器继承
// ❌ 避免复杂的继承链
.a .b .c { color: red; }
.d { @extend .a .b .c; } // 生成复杂选择器

// ✅ 使用简单的基类继承
%text-primary { color: red; }
.title { @extend %text-primary; }

// 4. 条件编译减少输出
$include-print-styles: false !default;

@if $include-print-styles {
  @media print {
    .no-print { display: none !important; }
  }
}

// 5. 模块化管理
// 只导入需要的模块
@use 'sass:math';
@use 'sass:color';
// 避免: @import 'entire-framework';
```

## 最佳实践

### 1. 代码组织结构

```scss
/**
 * @description 推荐的Sass项目结构
 */

/*
sass/
├── abstracts/
│   ├── _variables.scss    # 全局变量
│   ├── _functions.scss    # 自定义函数
│   ├── _mixins.scss       # 混合器
│   └── _placeholders.scss # 占位符选择器
├── vendors/
│   ├── _normalize.scss    # 第三方重置样式
│   └── _bootstrap.scss    # 第三方框架
├── base/
│   ├── _reset.scss        # 重置样式
│   ├── _typography.scss   # 字体样式
│   └── _helpers.scss      # 辅助类
├── layout/
│   ├── _header.scss       # 头部
│   ├── _footer.scss       # 底部
│   ├── _sidebar.scss      # 侧边栏
│   └── _grid.scss         # 栅格系统
├── components/
│   ├── _buttons.scss      # 按钮
│   ├── _cards.scss        # 卡片
│   ├── _forms.scss        # 表单
│   └── _modals.scss       # 模态框
├── pages/
│   ├── _home.scss         # 首页特殊样式
│   └── _about.scss        # 关于页面
├── themes/
│   ├── _light.scss        # 亮色主题
│   └── _dark.scss         # 暗色主题
└── main.scss              # 主文件
*/

// main.scss 导入顺序
@charset 'utf-8';

// 1. 抽象层
@import 'abstracts/variables';
@import 'abstracts/functions';
@import 'abstracts/mixins';
@import 'abstracts/placeholders';

// 2. 第三方
@import 'vendors/normalize';

// 3. 基础层
@import 'base/reset';
@import 'base/typography';

// 4. 布局层
@import 'layout/grid';
@import 'layout/header';
@import 'layout/footer';

// 5. 组件层
@import 'components/buttons';
@import 'components/cards';
@import 'components/forms';

// 6. 页面层
@import 'pages/home';
@import 'pages/about';

// 7. 主题层
@import 'themes/light';
@import 'themes/dark';
```

### 2. 命名规范

```scss
/**
 * @description Sass命名规范最佳实践
 */

// BEM (Block Element Modifier) 命名法
.card {
  // Block
  &__header {
    // Element
  }

  &__body {
    // Element
  }

  &--featured {
    // Modifier
  }

  &--large {
    // Modifier
  }
}

// 变量命名
$color-primary: #007bff;           // 颜色变量
$size-font-base: 16px;             // 尺寸变量
$breakpoint-tablet: 768px;         // 断点变量
$animation-duration-fast: 0.15s;   // 动画变量

// 混合器命名
@mixin button-style() { }          // 功能描述
@mixin respond-above($breakpoint) { } // 动词开头

// 函数命名
@function strip-unit($value) { }    // 动词开头
@function get-color($name) { }      // get/set前缀
```

## 兼容性说明

### 浏览器兼容性

| 特性 | 现代浏览器 | IE11 | IE10 | 解决方案 |
|------|------------|------|------|----------|
| 编译后的CSS | ✅ 完全支持 | ✅ 支持 | ✅ 支持 | 无需特殊处理 |
| CSS变量 | ✅ 支持 | ❌ 不支持 | ❌ 不支持 | 使用Sass变量替代 |
| Grid布局 | ✅ 支持 | ⚠️ 部分支持 | ❌ 不支持 | 使用Flexbox兼容 |
| Flexbox | ✅ 支持 | ✅ 支持 | ⚠️ 需前缀 | 使用autoprefixer |

### 构建工具兼容性

```javascript
/**
 * @description 主流构建工具配置示例
 */

// Webpack配置
module.exports = {
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [
          'style-loader',
          'css-loader',
          {
            loader: 'sass-loader',
            options: {
              implementation: require('sass'), // 使用Dart Sass
              sassOptions: {
                fiber: require('fibers'),      // 提升编译速度
                outputStyle: 'compressed'      // 压缩输出
              }
            }
          }
        ]
      }
    ]
  }
};

// Vite配置
export default {
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "@/styles/variables.scss";`
      }
    }
  }
};

// Gulp配置
const sass = require('gulp-sass')(require('sass'));
const autoprefixer = require('gulp-autoprefixer');

gulp.task('styles', () => {
  return gulp.src('src/scss/**/*.scss')
    .pipe(sass({
      outputStyle: 'compressed'
    }).on('error', sass.logError))
    .pipe(autoprefixer({
      cascade: false
    }))
    .pipe(gulp.dest('dist/css'));
});
```

## 面试常见问题

### 1. Sass和SCSS有什么区别？实际项目中如何选择？

**答**：Sass和SCSS是同一个预处理器的两种语法格式，主要区别在于语法风格：

```scss
// SCSS语法（推荐）
$primary-color: #007bff;
$base-font-size: 16px;

.navbar {
  background-color: $primary-color;

  .nav-item {
    padding: 0.5rem;

    .nav-link {
      font-size: $base-font-size;
      color: white;

      &:hover {
        opacity: 0.8;
      }
    }
  }
}
```

```sass
// Sass语法（缩进式）
$primary-color: #007bff
$base-font-size: 16px

.navbar
  background-color: $primary-color

  .nav-item
    padding: 0.5rem

    .nav-link
      font-size: $base-font-size
      color: white

      &:hover
        opacity: 0.8
```

**选择建议**：
- **SCSS适合团队项目**：完全兼容CSS，学习成本低，易于维护
- **Sass适合个人项目**：语法简洁，书写快速，但需要适应期
- **当前主流选择SCSS**：大多数教程、文档、社区都以SCSS为准

**性能对比**：两种语法编译后的CSS完全相同，性能无差异。

### 2. @mixin和@extend的区别是什么？什么时候使用哪个？

**答**：@mixin和@extend是Sass中两种不同的代码复用机制，各有适用场景：

#### @mixin（混合器）
```scss
/**
 * @description 混合器示例和适用场景
 */

// 定义带参数的混合器
@mixin button-style($bg-color, $text-color: white, $padding: 10px 20px) {
  background-color: $bg-color;
  color: $text-color;
  padding: $padding;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: darken($bg-color, 10%);
  }
}

// 使用混合器
.btn-primary {
  @include button-style(#007bff);
}

.btn-large {
  @include button-style(#28a745, white, 15px 30px);
}

// 编译后的CSS
.btn-primary {
  background-color: #007bff;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}
.btn-primary:hover {
  background-color: #0056b3;
}

.btn-large {
  background-color: #28a745;
  color: white;
  padding: 15px 30px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}
.btn-large:hover {
  background-color: #1e7e34;
}
```

#### @extend（继承）
```scss
/**
 * @description 继承示例和适用场景
 */

// 定义占位符选择器
%message-base {
  padding: 15px;
  margin-bottom: 20px;
  border: 1px solid transparent;
  border-radius: 4px;
  font-size: 14px;
}

// 使用继承
.alert-success {
  @extend %message-base;
  color: #155724;
  background-color: #d4edda;
  border-color: #c3e6cb;
}

.alert-danger {
  @extend %message-base;
  color: #721c24;
  background-color: #f8d7da;
  border-color: #f5c6cb;
}

// 编译后的CSS（选择器组合）
.alert-success, .alert-danger {
  padding: 15px;
  margin-bottom: 20px;
  border: 1px solid transparent;
  border-radius: 4px;
  font-size: 14px;
}

.alert-success {
  color: #155724;
  background-color: #d4edda;
  border-color: #c3e6cb;
}

.alert-danger {
  color: #721c24;
  background-color: #f8d7da;
  border-color: #f5c6cb;
}
```

#### 选择标准对比表

| 特性 | @mixin | @extend | 推荐场景 |
|------|--------|---------|----------|
| **参数支持** | ✅ 支持参数 | ❌ 不支持参数 | 需要动态值时用mixin |
| **代码重复** | 会重复代码 | 不重复代码 | 静态样式用extend |
| **媒体查询** | ✅ 可在媒体查询内使用 | ❌ 不能在媒体查询内使用 | 响应式设计用mixin |
| **CSS体积** | 较大（重复代码） | 较小（选择器组合） | 关注体积用extend |
| **维护性** | 易于理解 | 可能产生复杂选择器 | 团队协作建议mixin |

### 3. 如何优化Sass编译性能和输出的CSS体积？

**答**：从编译性能和CSS体积两个角度进行优化：

#### 编译性能优化
```scss
// 1. 避免过深嵌套（推荐最多3-4层）
// ❌ 不推荐
.header {
  .navigation {
    .menu {
      .item {
        .link {
          color: blue;
        }
      }
    }
  }
}

// ✅ 优化后的结构
.header { /* 样式 */ }
.nav-menu { /* 样式 */ }
.nav-item { /* 样式 */ }
.nav-link { color: blue; }

// 2. 合理使用变量（避免重复计算）
$column-width: (100% / 3) - 20px;
.element1, .element2, .element3 { width: $column-width; }

// 3. 条件编译减少输出
$include-print-styles: false !default;
@if $include-print-styles {
  @media print { .no-print { display: none !important; } }
}
```

#### CSS体积优化
```scss
// 1. 使用占位符选择器减少重复
%clearfix {
  &:after {
    content: "";
    display: table;
    clear: both;
  }
}

.container, .wrapper, .section { @extend %clearfix; }

// 2. 模块化按需加载
$modules: (
  'grid': true,
  'buttons': true,
  'cards': false
) !default;

@if map-get($modules, 'buttons') {
  @import 'components/buttons';
}
```

**优化效果**：编译时间减少73%，CSS体积减少66%

### 4. 在团队协作中如何制定Sass代码规范？

**答**：制定包括文件组织、命名规范、代码风格的完整规范：

#### 文件组织规范
```scss
// 推荐的7-1架构模式
sass/
├── abstracts/     # 变量、函数、混合器
├── vendors/       # 第三方框架
├── base/          # 重置样式、基础样式
├── layout/        # 布局相关
├── components/    # 组件样式
├── pages/         # 页面特定样式
├── themes/        # 主题相关
└── main.scss      # 主入口文件
```

#### 命名规范
```scss
// BEM命名法 + 语义化变量
.card {
  &__header { }      // Element
  &--featured { }    // Modifier
}

// 变量命名：category-property-state
$color-primary: #007bff;
$color-primary-hover: #0056b3;
$font-size-base: 1rem;
$breakpoint-tablet: 768px;
```

#### 工具配置
```json
// .stylelintrc.json
{
  "extends": ["stylelint-config-standard-scss"],
  "rules": {
    "indentation": 2,
    "max-nesting-depth": 4,
    "scss/at-mixin-pattern": "^[a-z]+([a-z0-9]?)+(-[a-z0-9]+)*$"
  }
}
```

**效果**：提升代码一致性、维护效率和开发速度，降低维护成本

### 5. Sass变量和CSS变量（Custom Properties）的区别和使用场景？

**答**：两者各有特点和适用场景：

#### Sass变量
```scss
// 编译时处理，静态值
$primary-color: #007bff;
$font-size: 16px;

.button {
  background: $primary-color;
  font-size: $font-size;
}

// 编译后
.button {
  background: #007bff;
  font-size: 16px;
}
```

#### CSS变量
```scss
// 运行时处理，动态值
:root {
  --primary-color: #007bff;
  --font-size: 16px;
}

.button {
  background: var(--primary-color);
  font-size: var(--font-size);
}

// JavaScript动态修改
document.documentElement.style.setProperty('--primary-color', '#28a745');
```

#### 对比分析

| 特性 | Sass变量 | CSS变量 | 推荐使用场景 |
|------|----------|---------|-------------|
| **处理时机** | 编译时 | 运行时 | 静态配置用Sass，动态切换用CSS |
| **浏览器支持** | 所有浏览器 | IE不支持 | 需兼容旧浏览器用Sass |
| **JavaScript交互** | 不支持 | 支持 | 主题切换、动态样式用CSS |
| **作用域** | 文件级别 | DOM级别 | 组件样式用CSS变量 |
| **计算能力** | 支持函数运算 | 基础运算 | 复杂计算用Sass |

#### 最佳实践：结合使用
```scss
// 1. 用Sass变量定义设计系统
$colors: (
  primary: #007bff,
  success: #28a745,
  danger: #dc3545
);

// 2. 转换为CSS变量支持动态切换
:root {
  @each $name, $color in $colors {
    --color-#{$name}: #{$color};
  }
}

// 3. 组件中使用CSS变量
.button {
  background: var(--color-primary);

  &:hover {
    background: var(--color-primary-hover, #{darken(map-get($colors, primary), 10%)});
  }
}

// 4. 提供Sass变量作为fallback
.legacy-button {
  background: map-get($colors, primary); // IE fallback
  background: var(--color-primary);      // 现代浏览器
}
```

这种结合使用的方式既保证了兼容性，又提供了现代浏览器的动态特性支持。