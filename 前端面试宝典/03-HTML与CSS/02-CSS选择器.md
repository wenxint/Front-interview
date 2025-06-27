# CSS选择器

CSS选择器是CSS规则的第一部分，它允许我们选择并定位HTML文档中的特定元素，从而应用样式规则。掌握CSS选择器是高效开发和精确控制页面样式的关键。

## 基本选择器

### 1. 通用选择器（Universal Selector）

`*` 选择器匹配文档中的所有元素。

```css
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
```

⚠️ 谨慎使用通用选择器，它可能会影响性能，特别是在大型文档中。

### 2. 元素选择器（Type Selector）

根据标签名称选择元素。

```css
p {
  color: #333;
  line-height: 1.5;
}

h1 {
  font-size: 2rem;
  margin-bottom: 1rem;
}
```

### 3. 类选择器（Class Selector）

使用`.`加类名选择具有特定class属性的元素。

```css
.container {
  width: 1200px;
  margin: 0 auto;
}

.btn-primary {
  background-color: #007bff;
  color: white;
}
```

### 4. ID选择器（ID Selector）

使用`#`加ID名选择具有特定id属性的元素。ID在页面中应当是唯一的。

```css
#header {
  position: sticky;
  top: 0;
  z-index: 100;
}

#app-root {
  min-height: 100vh;
}
```

### 5. 属性选择器（Attribute Selector）

根据元素的属性及其值来选择元素。

#### 基本属性选择器：

```css
/* 选择所有带有title属性的元素 */
[title] {
  cursor: help;
}

/* 选择所有type="text"的输入框 */
[type="text"] {
  border: 1px solid #ccc;
  padding: 8px;
}
```

#### 高级属性选择器：

```css
/* 选择以"https"开头的链接 */
[href^="https"] {
  color: green;
}

/* 选择以".pdf"结尾的链接 */
[href$=".pdf"] {
  background-image: url('pdf-icon.png');
  padding-left: 20px;
}

/* 选择包含"example"的链接 */
[href*="example"] {
  font-style: italic;
}

/* 选择以"en-"开头，区分大小写 */
[lang|="en"] {
  font-family: 'Arial', sans-serif;
}

/* 选择包含特定单词的元素，单词由空格分隔 */
[class~="highlight"] {
  background-color: yellow;
}
```

## 组合选择器

### 1. 后代选择器（Descendant Combinator）

使用空格分隔，选择前一个元素内部的所有后代元素。

```css
article p {
  text-indent: 2em;
}

.sidebar .widget {
  margin-bottom: 20px;
}
```

### 2. 子选择器（Child Combinator）

使用`>`符号，选择前一个元素的直接子元素。

```css
ul > li {
  list-style-type: square;
}

.dropdown > .menu {
  display: none;
}
```

### 3. 相邻兄弟选择器（Adjacent Sibling Combinator）

使用`+`符号，选择紧接在前一个元素后的兄弟元素。

```css
h2 + p {
  font-weight: bold;
}

.form-field + .form-field {
  margin-top: 10px;
}
```

### 4. 通用兄弟选择器（General Sibling Combinator）

使用`~`符号，选择前一个元素后的所有兄弟元素。

```css
h2 ~ p {
  color: #666;
}

.active ~ li {
  opacity: 0.7;
}
```

### 5. 组选择器（Grouping Selectors）

使用逗号分隔，同时为多个选择器应用相同的样式规则。

```css
h1, h2, h3, h4, h5, h6 {
  font-family: 'Georgia', serif;
  line-height: 1.2;
}

.btn-success, .btn-primary, .btn-info {
  border-radius: 4px;
  padding: 8px 16px;
}
```

## 伪类选择器

伪类用于定义元素的特殊状态或条件。

### 1. 链接和用户操作伪类

```css
/* 未访问的链接 */
a:link {
  color: blue;
}

/* 已访问的链接 */
a:visited {
  color: purple;
}

/* 鼠标悬停状态 */
a:hover {
  text-decoration: underline;
}

/* 激活状态（鼠标按下） */
a:active {
  color: red;
}

/* 获得焦点的元素 */
input:focus {
  border-color: #007bff;
  outline: none;
}
```

⚠️ 链接伪类的顺序很重要：`:link`、`:visited`、`:hover`、`:active`（LoVe HAte）。

### 2. 结构伪类

```css
/* 第一个子元素 */
li:first-child {
  font-weight: bold;
}

/* 最后一个子元素 */
li:last-child {
  margin-bottom: 0;
}

/* 唯一的子元素 */
li:only-child {
  list-style: none;
}

/* 指定位置的子元素 */
li:nth-child(3) {
  background-color: #f0f0f0;
}

/* 偶数位置的子元素 */
li:nth-child(even) {
  background-color: #f8f8f8;
}

/* 奇数位置的子元素 */
li:nth-child(odd) {
  background-color: #e8e8e8;
}

/* 公式：每第3个元素，从第2个开始 */
li:nth-child(3n+2) {
  color: red;
}

/* 倒数第n个 */
li:nth-last-child(2) {
  font-style: italic;
}
```

### 3. 类型伪类

```css
/* 第一个特定类型的元素 */
p:first-of-type {
  font-size: 1.2em;
}

/* 最后一个特定类型的元素 */
p:last-of-type {
  margin-bottom: 2em;
}

/* 唯一类型的元素 */
img:only-of-type {
  display: block;
  margin: 0 auto;
}

/* 指定位置的特定类型元素 */
p:nth-of-type(2) {
  font-weight: bold;
}

/* 倒数第n个特定类型元素 */
p:nth-last-of-type(3) {
  color: #666;
}
```

### 4. 表单相关伪类

```css
/* 禁用的元素 */
input:disabled {
  background-color: #f0f0f0;
  cursor: not-allowed;
}

/* 启用的元素 */
input:enabled {
  background-color: white;
}

/* 选中的复选框/单选按钮 */
input:checked {
  border-color: #007bff;
}

/* 必填字段 */
input:required {
  border-left: 3px solid red;
}

/* 可选字段 */
input:optional {
  border-left: 3px solid #ccc;
}

/* 有效输入 */
input:valid {
  border-color: green;
}

/* 无效输入 */
input:invalid {
  border-color: red;
}

/* 范围内的值 */
input:in-range {
  background-color: #dff0d8;
}

/* 范围外的值 */
input:out-of-range {
  background-color: #f2dede;
}
```

### 5. 其他常用伪类

```css
/* 空元素 */
p:empty {
  display: none;
}

/* 目标元素（URL中锚点指向的元素） */
:target {
  background-color: #fffbcc;
  transition: background-color 0.5s;
}

/* 否定伪类 */
button:not(.primary) {
  background-color: #f0f0f0;
}

li:not(:last-child) {
  margin-bottom: 10px;
}

/* 前n个元素 */
.item:nth-child(-n+3) {
  font-weight: bold;
}

/* 语言伪类 */
:lang(zh) {
  font-family: "Microsoft YaHei", sans-serif;
}

/* 根元素 */
:root {
  --primary-color: #007bff;
}
```

## 伪元素选择器

伪元素用于创建不存在于DOM树中的元素，或者选择元素的特定部分。CSS3标准中建议使用双冒号`::`来区分伪元素和伪类，但也兼容单冒号写法。

```css
/* 元素的第一行 */
p::first-line {
  font-weight: bold;
  text-transform: uppercase;
}

/* 元素的第一个字母 */
p::first-letter {
  font-size: 2em;
  float: left;
  margin-right: 5px;
}

/* 在元素前插入内容 */
.quote::before {
  content: "\201C"; /* 左引号 */
  font-size: 2em;
  color: #ccc;
}

/* 在元素后插入内容 */
.quote::after {
  content: "\201D"; /* 右引号 */
  font-size: 2em;
  color: #ccc;
}

/* 选中的文本 */
::selection {
  background-color: #b3d4fc;
  color: #000;
}

/* 占位符文本 */
::placeholder {
  color: #999;
  font-style: italic;
}

/* 标记文本（高亮） */
::marker {
  color: #007bff;
}
```

## 选择器的特异性和优先级

CSS选择器的特异性（Specificity）决定了当多个选择器指向同一元素时，哪个选择器的样式将被应用。

### 特异性计算规则

特异性值通常表示为四个部分的值(a, b, c, d)：

1. `a`：内联样式（style属性）= 1，0表示无内联样式
2. `b`：ID选择器的数量
3. `c`：类选择器、属性选择器和伪类的数量
4. `d`：元素选择器和伪元素的数量

### 特异性示例

| 选择器 | 特异性 | 十进制值 |
|------|-------|--------|
| `h1` | (0,0,0,1) | 1 |
| `h1 + p::first-line` | (0,0,0,3) | 3 |
| `.class` | (0,0,1,0) | 10 |
| `#id` | (0,1,0,0) | 100 |
| `style="color: red;"` | (1,0,0,0) | 1000 |

### 优先级规则

1. **!important** 声明具有最高优先级，会覆盖其他所有样式（包括内联样式）
2. 内联样式优先级高于所有外部样式
3. 选择器特异性越高，优先级越高
4. 如果特异性相同，后声明的规则会覆盖先声明的规则（源码顺序）
5. 继承的样式优先级最低，总是可以被后代元素的直接样式覆盖

```css
/* 特异性: (0,0,0,1) */
p {
  color: black;
}

/* 特异性: (0,0,1,1) */
.content p {
  color: gray;
}

/* 特异性: (0,1,0,1) */
#article p {
  color: blue;
}

/* 使用!important (会覆盖上面所有规则) */
p {
  color: red !important;
}
```

⚠️ 尽量避免使用`!important`，它会破坏CSS的自然级联流，导致后期维护困难。

## 高级选择器技巧

### 1. 选择器组合的创新应用

```css
/* 选择既有class="btn"又有class="primary"的元素 */
.btn.primary {
  background-color: #007bff;
}

/* 选择直接包含图片的链接 */
a > img {
  border: none;
}

/* 选择带有特定属性组合的元素 */
input[type="text"][required][data-validation="email"] {
  background-color: #f8f9fa;
}
```

### 2. 兄弟选择器的实用模式

```css
/* 卡片网格中除第一行外的所有卡片添加上边距 */
.card-row + .card-row {
  margin-top: 20px;
}

/* 表格中相邻的两个带有.highlight类的行使用不同背景色 */
tr.highlight + tr.highlight {
  background-color: #e6f7ff;
}
```

### 3. 使用:not()伪类简化代码

```css
/* 给除最后一个列表项外的所有项添加底部边框 */
li:not(:last-child) {
  border-bottom: 1px solid #eee;
}

/* 选择所有非禁用的输入框 */
input:not([disabled]) {
  background-color: white;
}

/* 组合使用not和其他伪类 */
button:not(:hover):not(:focus) {
  box-shadow: none;
}
```

### 4. 表单元素精确控制

```css
/* 选择只读但非禁用的输入框 */
input[readonly]:not([disabled]) {
  background-color: #f8f9fa;
  border-color: #dee2e6;
}

/* 必填且当前无效的字段 */
input:required:invalid {
  border-color: red;
}

/* 已填写但非必填的字段 */
input:not(:placeholder-shown):not(:required) {
  border-color: green;
}
```

## CSS选择器性能考虑

CSS选择器的性能影响实际上在现代浏览器中已不是主要瓶颈，但了解以下原则仍有助于优化大型复杂网站：

1. **选择器匹配是从右向左进行的**：
   ```css
   /* 性能较低 - 浏览器需要检查所有div元素 */
   div p a {
     color: red;
   }

   /* 性能较好 - 直接找到所有链接，然后向上查找父元素 */
   a.nav-link {
     color: red;
   }
   ```

2. **避免过深的嵌套选择器**：
   ```css
   /* 避免这样 */
   html body .container .content .article .title {
     font-size: 20px;
   }

   /* 更好的方式 */
   .article-title {
     font-size: 20px;
   }
   ```

3. **避免通用选择器作为关键选择器**：
   ```css
   /* 避免这样 */
   .nav-bar * {
     margin: 0;
   }

   /* 更好的方式 */
   .nav-bar .item {
     margin: 0;
   }
   ```

4. **合理使用子选择器**：
   ```css
   /* 使用子选择器限制范围 */
   .nav > li {
     margin: 0 10px;
   }
   ```

## 现代CSS选择器（CSS4选择器模块）

虽然CSS4作为整体规范不存在，但有一些处于草案阶段的新选择器：

```css
/* 父元素选择器 (尚未实现) */
/* !.parent:has(> .child) {
  display: flex;
} */

/* 正则属性选择器 (部分实现) */
/* ![data-code=/^[A-Z]{2}$/] {
  font-family: monospace;
} */

/* 条件选择器 (尚未实现) */
/* !:matches(.sidebar, .widget) img {
  max-width: 100%;
} */
```

⚠️ 这些选择器可能尚未被广泛支持，使用前请查阅最新的浏览器兼容性信息。

## 面试常见问题

### 1. CSS选择器的优先级规则是什么？

CSS选择器优先级按照以下顺序从高到低：
1. !important 声明
2. 内联样式（style属性）
3. ID选择器（#id）
4. 类选择器（.class）、属性选择器（[attr]）和伪类（:hover）
5. 元素选择器（p）和伪元素（::before）
6. 通用选择器（*）和组合器（>, +, ~, 空格）

当选择器的优先级相同时，后声明的规则会覆盖先声明的规则。

### 2. 解释CSS选择器的特异性计算方法

特异性使用四个部分的值表示(a,b,c,d)：
- a: 内联样式 = 1，否则 = 0
- b: ID选择器的数量
- c: 类选择器、属性选择器和伪类的数量
- d: 元素选择器和伪元素的数量

例如：
- `p` 的特异性为 (0,0,0,1)
- `p.active` 的特异性为 (0,0,1,1)
- `#nav p.active` 的特异性为 (0,1,1,1)

### 3. `:nth-child()`和`:nth-of-type()`选择器有什么区别？

- `:nth-child(n)` 选择其父元素的第n个子元素，不考虑元素类型
- `:nth-of-type(n)` 选择其父元素的第n个特定类型的子元素

例如，对于以下HTML结构：
```html
<div>
  <p>第一段</p>
  <h2>标题</h2>
  <p>第二段</p>
</div>
```

- `p:nth-child(2)` 不会选中任何元素，因为第二个子元素是h2
- `p:nth-of-type(2)` 会选中"第二段"，因为它是第二个p元素

### 4. 什么是伪类和伪元素？它们有什么区别？

- **伪类**选择元素的特定状态或条件，使用单冒号（:）。例如：`:hover`、`:active`、`:first-child`
- **伪元素**创建实际DOM中不存在的元素或选择元素的特定部分，CSS3建议使用双冒号（::）。例如：`::before`、`::after`、`::first-line`

伪类表示"元素的特殊状态"，而伪元素表示"元素的特定部分"或"不在DOM树中的虚拟元素"。

### 5. 如何使用CSS选择器实现类似"首字下沉"的效果？

可以使用`::first-letter`伪元素：

```css
p.intro::first-letter {
  font-size: 3em;
  font-weight: bold;
  float: left;
  line-height: 1;
  margin-right: 8px;
  color: #c00;
  font-family: 'Georgia', serif;
}
```

### 6. 属性选择器的不同匹配模式有哪些？

- `[attr]` - 选择具有attr属性的元素
- `[attr="value"]` - 选择attr属性值等于"value"的元素
- `[attr^="value"]` - 选择attr属性值以"value"开头的元素
- `[attr$="value"]` - 选择attr属性值以"value"结尾的元素
- `[attr*="value"]` - 选择attr属性值包含"value"的元素
- `[attr~="value"]` - 选择attr属性值包含"value"词（以空格分隔）的元素
- `[attr|="value"]` - 选择attr属性值等于"value"或以"value-"开头的元素

### 7. 不考虑其他因素时，`.box a` 和 `a` 选择器的渲染性能哪个更高？

**`a` 选择器的渲染性能更高**。

#### 原因分析
浏览器解析CSS选择器时遵循**从右向左匹配**的规则，选择器的复杂度直接影响渲染性能：
1. `.box a` 是后代选择器（需匹配 `.box` 容器内的所有 `<a>` 标签）
   - 匹配逻辑：先找到所有 `<a>` 标签，再向上遍历其父元素，检查是否存在 `.box` 类的祖先节点。
   - 复杂度：需要遍历更多DOM节点，匹配成本更高。

2. `a` 是类型选择器（直接匹配所有 `<a>` 标签）
   - 匹配逻辑：直接扫描所有 `<a>` 标签，无需向上查找父元素。
   - 复杂度：仅需一次DOM扫描，匹配成本更低。

#### 结论
类型选择器 `a` 的匹配逻辑更简单，渲染性能优于后代选择器 `.box a`。

### 8. 什么是FOUC？你是如何避免FOUC的？

**FOUC（Flash of Unstyled Content）** 指的是页面加载时，用户短暂看到未样式化的内容，随后样式突然应用的现象。这通常发生在CSS文件加载延迟，导致HTML结构先渲染，之后CSS才生效的情况。

#### 避免FOUC的常见方法：
1. **内联关键CSS**：将首屏所需的关键CSS直接写在`<style>`标签中嵌入HTML头部，避免外部CSS加载延迟。
2. **优化CSS加载顺序**：将CSS链接放在`<head>`标签中，确保浏览器尽早开始下载CSS资源。
3. **使用媒体查询延迟非关键CSS**：对非首屏需要的CSS（如打印样式）使用`media`属性，延迟加载：
   ```html
   <link rel="stylesheet" href="print.css" media="print">
   <link rel="stylesheet" href="non-critical.css" media="(min-width: 1024px)">

CSS选择器是CSS的核心部分，掌握各种选择器及其用法可以让我们更精确、高效地控制网页样式。现代CSS选择器功能强大，从简单的元素选择到复杂的结构和状态选择，为我们提供了几乎无限的样式可能性。

在实际开发中，应当根据需求选择最合适的选择器，同时考虑代码的可维护性和性能因素。良好的CSS选择器应该是精确、简洁且有语义的，既能实现所需的样式效果，又便于后期维护和扩展。