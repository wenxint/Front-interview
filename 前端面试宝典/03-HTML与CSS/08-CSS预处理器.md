# CSS预处理器

CSS预处理器是一种特殊的脚本语言，通过编译生成标准的CSS代码，为CSS增加了编程的特性。它们提供了变量、嵌套、混合、继承、函数等在标准CSS中不具备的功能，极大地提高了CSS的开发效率和可维护性。

## 主流CSS预处理器

### 1. Sass/SCSS

Sass(Syntactically Awesome Stylesheets)是最早、最成熟的CSS预处理器之一，提供两种语法：

- **Sass**：使用缩进而非大括号和分号（类似Python）的简洁语法
- **SCSS**：使用与CSS类似的大括号和分号语法，更容易被CSS开发者接受

SCSS已成为最广泛使用的语法，它是CSS的超集，这意味着所有有效的CSS也是有效的SCSS。

### 2. LESS

LESS是受Sass启发的另一种预处理器，由JavaScript编写，最初在客户端运行，现在也支持服务器端编译。语法上更接近CSS，学习曲线较平缓。

### 3. Stylus

Stylus受到Sass和LESS的影响，提供了一种极简的语法，允许省略冒号、分号和括号，同时支持比较丰富的JavaScript式函数功能。

## SCSS基础语法

### 变量

使用`$`符号定义变量：

```scss
// 定义变量
$primary-color: #4A90E2;
$font-stack: Helvetica, sans-serif;
$spacing-unit: 10px;

// 使用变量
body {
  font-family: $font-stack;
  color: $primary-color;
  padding: $spacing-unit * 2;
}

// 变量作用域
.container {
  $secondary-color: #FFC107 !global; // 全局变量
  $local-padding: 20px; // 局部变量
  padding: $local-padding;
  background-color: $secondary-color;
}

// 变量默认值
$border-width: 1px !default; // 如果已定义则不覆盖
```

### 嵌套

SCSS允许选择器嵌套，简化复杂的CSS规则：

```scss
nav {
  background-color: #333;

  ul {
    margin: 0;
    padding: 0;
    list-style: none;
  }

  li {
    display: inline-block;

    a {
      color: white;
      text-decoration: none;
      padding: 10px 15px;

      &:hover {
        background-color: #555;
      }
    }
  }

  // 与同级元素的关系
  & + .content {
    margin-top: 20px;
  }
}
```

`&`符号表示父选择器，常用于伪类和类的修饰。

### 混合(Mixins)

混合是可重用的样式块，可以接受参数：

```scss
// 定义混合
@mixin border-radius($radius) {
  -webkit-border-radius: $radius;
  -moz-border-radius: $radius;
  border-radius: $radius;
}

// 使用混合
.button {
  @include border-radius(3px);
}

.card {
  @include border-radius(10px);
}

// 带默认值的混合
@mixin box-shadow($x: 0, $y: 2px, $blur: 4px, $color: rgba(0,0,0,.3)) {
  box-shadow: $x $y $blur $color;
}

// 多个参数
@mixin position($position, $top: null, $right: null, $bottom: null, $left: null) {
  position: $position;
  top: $top;
  right: $right;
  bottom: $bottom;
  left: $left;
}

.fixed-header {
  @include position(fixed, $top: 0, $left: 0, $right: 0);
}
```

### 继承/扩展

使用`@extend`共享CSS规则：

```scss
// 基础样式
.message {
  border: 1px solid #ccc;
  padding: 10px;
  color: #333;
}

// 扩展基础样式
.success {
  @extend .message;
  border-color: green;
  color: green;
}

.error {
  @extend .message;
  border-color: red;
  color: red;
}

// 占位符选择器（不会编译到CSS中）
%button-base {
  display: inline-block;
  padding: 10px 15px;
  border: none;
  cursor: pointer;
}

.primary-button {
  @extend %button-base;
  background-color: blue;
  color: white;
}

.secondary-button {
  @extend %button-base;
  background-color: gray;
  color: black;
}
```

### 函数和运算

SCSS支持各种运算符和内置函数：

```scss
// 数学运算
.container {
  width: 100% / 3; // 33.33333%
  margin: 10px + 5px; // 15px
  padding: 20px * 1.5; // 30px
}

// 颜色函数
$base-color: #3498db;

.light {
  background-color: lighten($base-color, 20%);
}

.dark {
  background-color: darken($base-color, 20%);
}

.transparent {
  background-color: rgba($base-color, 0.5);
}

// 自定义函数
@function calculate-width($col-span, $total-cols: 12) {
  @return percentage($col-span / $total-cols);
}

.sidebar {
  width: calculate-width(3); // 25%
}

.main-content {
  width: calculate-width(9); // 75%
}
```

### 条件语句和循环

SCSS提供编程控制结构：

```scss
// 条件语句
$theme: 'dark';

body {
  @if $theme == 'dark' {
    background-color: #222;
    color: #fff;
  } @else if $theme == 'light' {
    background-color: #fff;
    color: #222;
  } @else {
    background-color: #f5f5f5;
    color: #333;
  }
}

// for循环
$grid-columns: 12;

@for $i from 1 through $grid-columns {
  .col-#{$i} {
    width: percentage($i / $grid-columns);
  }
}

// each循环
$social-colors: (
  facebook: #3b5998,
  twitter: #1da1f2,
  instagram: #e1306c
);

@each $platform, $color in $social-colors {
  .#{$platform}-icon {
    background-color: $color;
    color: white;
  }
}

// while循环
$i: 1;
$max: 5;

@while $i <= $max {
  .item-#{$i} {
    font-size: 10px + (2px * $i);
  }
  $i: $i + 1;
}
```

### 导入与模块化

SCSS支持文件导入，促进代码模块化：

```scss
// _variables.scss
$primary-color: #3498db;
$secondary-color: #2ecc71;

// _mixins.scss
@mixin center {
  display: flex;
  justify-content: center;
  align-items: center;
}

// main.scss
@import 'variables';
@import 'mixins';

.container {
  background-color: $primary-color;
  @include center;
}

// 使用新的模块系统
@use 'variables' as v;
@use 'mixins' as m;

.container {
  background-color: v.$primary-color;
  @include m.center;
}
```

## LESS基础语法

### 变量

使用`@`符号定义变量：

```less
// 定义变量
@primary-color: #4A90E2;
@font-stack: Helvetica, sans-serif;
@spacing-unit: 10px;

// 使用变量
body {
  font-family: @font-stack;
  color: @primary-color;
  padding: @spacing-unit * 2;
}

// 变量插值
@my-selector: banner;
.@{my-selector} {
  font-weight: bold;
  background-color: red;
}

// 变量作为变量名
@primary: color;
.header {
  @{primary}: blue;
}
```

### 嵌套

LESS与SCSS类似，支持选择器嵌套：

```less
nav {
  background-color: #333;

  ul {
    margin: 0;
    padding: 0;
    list-style: none;
  }

  li {
    display: inline-block;

    a {
      color: white;
      text-decoration: none;
      padding: 10px 15px;

      &:hover {
        background-color: #555;
      }
    }
  }
}
```

### 混合(Mixins)

LESS中的混合更为直观，不需要特殊的声明或引用语法：

```less
// 定义混合
.border-radius(@radius) {
  -webkit-border-radius: @radius;
  -moz-border-radius: @radius;
  border-radius: @radius;
}

// 使用混合
.button {
  .border-radius(3px);
}

.card {
  .border-radius(10px);
}

// 不输出混合本身
.invisible-mixin() {
  color: white;
  background-color: blue;
}

// 带默认值的混合
.box-shadow(@x: 0, @y: 2px, @blur: 4px, @color: rgba(0,0,0,.3)) {
  box-shadow: @x @y @blur @color;
}
```

### 扩展

使用`:extend`实现继承：

```less
.message {
  border: 1px solid #ccc;
  padding: 10px;
  color: #333;
}

.success:extend(.message) {
  border-color: green;
  color: green;
}

.error:extend(.message) {
  border-color: red;
  color: red;
}
```

### 函数和运算

LESS提供了丰富的内置函数和运算能力：

```less
// 数学运算
.container {
  width: 100% / 3;
  margin: 10px + 5px;
  padding: 20px * 1.5;
}

// 颜色函数
@base-color: #3498db;

.light {
  background-color: lighten(@base-color, 20%);
}

.dark {
  background-color: darken(@base-color, 20%);
}

.transparent {
  background-color: fade(@base-color, 50%);
}
```

### 映射和循环

LESS中使用映射和guards实现条件逻辑：

```less
// 映射
@colors: {
  primary: blue;
  secondary: green;
  accent: orange;
}

.button {
  background-color: @colors[primary];
  border-color: @colors[secondary];
}

// 循环（使用递归混合）
.generate-columns(@n, @i: 1) when (@i =< @n) {
  .col-@{i} {
    width: (@i * 100% / @n);
  }
  .generate-columns(@n, (@i + 1));
}

.generate-columns(12);
```

### 导入

与SCSS类似，LESS支持文件导入：

```less
// variables.less
@primary-color: #3498db;
@secondary-color: #2ecc71;

// mixins.less
.center() {
  display: flex;
  justify-content: center;
  align-items: center;
}

// main.less
@import 'variables';
@import 'mixins';

.container {
  background-color: @primary-color;
  .center();
}
```

## Stylus基础语法

Stylus提供了最简洁的语法，可以省略大括号、冒号和分号：

```stylus
// 变量
primary-color = #4A90E2
font-stack = Helvetica, sans-serif

// 嵌套
nav
  background-color #333

  ul
    margin 0
    padding 0
    list-style none

  li
    display inline-block

    a
      color white
      text-decoration none
      padding 10px 15px

      &:hover
        background-color #555

// 混合
border-radius(radius)
  -webkit-border-radius radius
  -moz-border-radius radius
  border-radius radius

.button
  border-radius(3px)
```

## 预处理器的最佳实践

### 1. 组织文件结构

遵循模块化原则，将样式分割为多个有意义的文件：

```
styles/
├── base/
│   ├── _reset.scss
│   ├── _typography.scss
│   └── _utilities.scss
├── components/
│   ├── _buttons.scss
│   ├── _forms.scss
│   └── _navigation.scss
├── layout/
│   ├── _grid.scss
│   ├── _header.scss
│   └── _footer.scss
├── pages/
│   ├── _home.scss
│   └── _about.scss
├── themes/
│   ├── _dark.scss
│   └── _light.scss
├── abstracts/
│   ├── _variables.scss
│   ├── _functions.scss
│   └── _mixins.scss
└── main.scss
```

### 2. 命名约定

采用一致的命名方式，如BEM（Block, Element, Modifier）：

```scss
.card {
  &__header {
    font-weight: bold;
  }

  &__body {
    padding: 15px;
  }

  &--featured {
    border: 2px solid gold;
  }
}
```

### 3. 避免过度嵌套

嵌套不应超过3-4层，避免生成过于特定的选择器：

```scss
// 不推荐
.header {
  .nav {
    ul {
      li {
        a {
          // 这里嵌套太深
        }
      }
    }
  }
}

// 推荐
.header-nav {
  // 样式
}

.header-nav-link {
  // 样式
}
```

### 4. 合理使用混合和扩展

- **混合(Mixin)**：适用于需要传递参数的样式
- **扩展(@extend)**：适用于不需要参数的样式继承

```scss
// 适合使用混合
@mixin button-size($padding-x, $padding-y, $font-size) {
  padding: $padding-y $padding-x;
  font-size: $font-size;
}

// 适合使用扩展
%list-unstyled {
  margin: 0;
  padding: 0;
  list-style: none;
}
```

### 5. 注释和文档

为变量、混合和复杂部分添加注释：

```scss
// 主题颜色
// 用于应用的主要配色方案
$theme-colors: (
  "primary": #007bff,   // 主要操作、强调
  "secondary": #6c757d, // 次要操作
  "success": #28a745,   // 成功状态和操作
  "danger": #dc3545     // 错误、危险操作
);

/// 创建响应式容器
/// @param {Number} $max-width [1200px] - 容器最大宽度
/// @example scss
///   .container { @include container(); }
@mixin container($max-width: 1200px) {
  width: 100%;
  max-width: $max-width;
  margin-right: auto;
  margin-left: auto;
  padding-right: 15px;
  padding-left: 15px;
}
```

## 构建工具中的集成

### 与Webpack集成

```javascript
// webpack.config.js
module.exports = {
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [
          'style-loader', // 将CSS注入DOM
          'css-loader',   // 解析CSS
          'sass-loader'   // 编译SCSS到CSS
        ]
      }
    ]
  }
};
```

### 与Gulp集成

```javascript
// gulpfile.js
const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));

function compileSass() {
  return gulp.src('src/scss/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('dist/css'));
}

exports.sass = compileSass;
```

## 预处理器对比

| 特性 | SCSS | LESS | Stylus |
|-----|------|------|--------|
| 语法 | CSS的超集，使用{}和; | CSS的超集，使用{}和; | 可省略{}、:和; |
| 变量符号 | $ | @ | 无需符号 |
| 混合声明 | @mixin | .mixin() | mixin() |
| 混合调用 | @include | .mixin() | mixin() |
| 继承/扩展 | @extend | :extend() | @extend |
| 嵌套 | 支持 | 支持 | 支持 |
| 函数 | 丰富 | 较丰富 | 丰富 |
| 条件语句 | @if @else | guards和when | if else |
| 循环 | @for @each @while | 递归混合 | for in |
| 社区生态 | 最成熟 | 成熟 | 较小 |

## 面试常见问题

### 1. 什么是CSS预处理器？它们解决了哪些问题？

CSS预处理器是扩展CSS语言的工具，通过添加变量、嵌套、混合、函数等编程特性，解决了以下问题：
- CSS的代码复用困难
- 缺乏变量和计算能力
- 样式难以组织和维护
- 缺乏模块化机制
- 选择器重复使用导致冗余

### 2. SCSS和SASS有什么区别？

两者是同一预处理器的不同语法：
- SASS（最初语法）：使用缩进表示嵌套，无需括号和分号
- SCSS（新语法）：使用和CSS一致的大括号和分号，是CSS的超集

SCSS更容易被CSS开发者接受，现在使用更为广泛。

### 3. 为什么要在项目中使用CSS预处理器？

主要优势：
- 提高开发效率（变量、嵌套、混合等）
- 代码更易维护和扩展
- 更好的组织大型项目的样式
- 实现样式的模块化和复用
- 增强团队协作能力
- 兼容性处理更简单（通过混合）

### 4. 如何避免使用预处理器带来的潜在问题？

常见问题及解决方法：
- **生成的CSS过大**：避免嵌套过深，合理使用继承
- **调试困难**：使用source maps
- **过度使用嵌套**：限制嵌套层级（≤3层）
- **选择器过于特定**：遵循BEM等命名规范
- **性能问题**：避免过度使用`@extend`，它会生成大量选择器

### 5. CSS变量(自定义属性)与预处理器变量的区别是什么？

主要区别：
- **编译时间**：预处理器变量在编译时处理，CSS变量在运行时处理
- **作用域**：预处理器变量遵循块级作用域，CSS变量遵循DOM树继承
- **动态性**：CSS变量可以通过JavaScript动态修改，预处理器变量不能
- **回退机制**：CSS变量有内置的回退值机制，预处理器需要条件逻辑
- **浏览器支持**：预处理器变量无兼容性问题（编译为标准CSS），CSS变量需考虑浏览器支持

## 总结

CSS预处理器极大地改善了CSS开发体验，提供了强大的功能来解决CSS本身的局限性。如今，它们已成为前端开发工作流程中不可或缺的一部分。

选择合适的预处理器应基于项目需求、团队习惯和生态系统考虑：
- **SCSS**：功能最全面，社区支持最好，适合大多数项目
- **LESS**：学习曲线较平缓，与CSS语法相似，适合入门者
- **Stylus**：语法最简洁灵活，适合喜欢极简主义的开发者

随着CSS自身的发展（如自定义属性、嵌套等新特性），预处理器的某些功能正在被原生CSS所替代，但它们在可预见的未来仍将是前端开发的重要工具。