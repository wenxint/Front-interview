# Grid布局

CSS Grid布局是一个二维布局系统，专为设计复杂的网页布局而创建。它允许开发者创建基于行和列的网格系统，无需依赖浮动和定位等传统技术。Grid布局是目前最强大的CSS布局方案之一，特别适合构建复杂的响应式界面。

## Grid布局基础概念

### 网格容器与网格项

- **网格容器（Grid Container）**：设置了`display: grid`或`display: inline-grid`的元素
- **网格项（Grid Item）**：网格容器的直接子元素
- **网格线（Grid Line）**：构成网格结构的分隔线，包括水平和垂直线
- **网格轨道（Grid Track）**：两条相邻网格线之间的空间，即行或列
- **网格单元格（Grid Cell）**：四条网格线包围的区域，是网格的最小单位
- **网格区域（Grid Area）**：由任意数量的网格单元格组成的矩形区域

### 创建网格容器

```css
.container {
  display: grid; /* 或 inline-grid */
}
```

### HTML 示例
```html
<div class="container">
  <div class="item">Item 1</div>
  <div class="item">Item 2</div>
  <div class="item">Item 3</div>
</div>
```

### 预览效果
三个子元素默认沿行方向排列成一行，每个子元素占据一列，宽度由内容自动填充。网格容器宽度占满父容器，子元素高度默认拉伸填充网格行高度。

## 定义网格结构

### 网格轨道尺寸

#### 使用grid-template-columns和grid-template-rows

```css
.container {
  display: grid;
  /* 创建3列网格，宽度分别为100px、1fr和2fr */
  grid-template-columns: 100px 1fr 2fr;
  /* 创建2行网格，高度分别为50px和100px */
  grid-template-rows: 50px 100px;
}
```

### HTML 示例
```html
<div class="container">
  <div class="item">Item 1</div>
  <div class="item">Item 2</div>
  <div class="item">Item 3</div>
  <div class="item">Item 4</div>
  <div class="item">Item 5</div>
  <div class="item">Item 6</div>
</div>
```

### 预览效果
网格容器创建3列（宽度100px、剩余空间1:2分配）和2行（高度50px、100px），共6个单元格。6个子元素分别填充到6个单元格中，第一行高度50px，第二行高度100px，列宽分别为固定100px、自适应1份、自适应2份。

单位可以混合使用：
- `px`, `%`, `em`, `rem` - 绝对或相对长度
- `fr` - 分数单位，按比例分配剩余空间
- `auto` - 根据内容自动调整大小
- `minmax(min, max)` - 设置最小和最大尺寸
- `min-content` - 基于内容的最小尺寸
- `max-content` - 基于内容的最大尺寸

#### 使用repeat()函数

```css
.container {
  display: grid;
  /* 创建12列等宽网格 */
  grid-template-columns: repeat(12, 1fr);
  /* 创建3行，每行100px */
  grid-template-rows: repeat(3, 100px);
}
```

### HTML 示例
```html
<div class="container">
  <div class="item">Col 1</div>
  <div class="item">Col 2</div>
  <!-- 省略中间8个item -->
  <div class="item">Col 12</div>
</div>
```

### 预览效果
网格容器创建12列等宽（每列占1/12容器宽度）和3行（每行100px高度），子元素沿行方向依次填充，每行12个元素，共3行。适合实现12列栅格系统布局。

repeat()函数也可以创建复杂模式：

```css
.container {
  /* 创建模式重复的列 [100px 1fr]×3 */
  grid-template-columns: repeat(3, 100px 1fr);

  /* 自动填充功能 */
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));

  /* 自动适应功能 */
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
}
```

### 网格间距

```css
.container {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;

  /* 设置行间距和列间距 */
  grid-row-gap: 20px; /* 或 row-gap */
  grid-column-gap: 10px; /* 或 column-gap */

  /* 简写形式：行间距 列间距 */
  grid-gap: 20px 10px; /* 或 gap */

  /* 如果只提供一个值，则行列间距相同 */
  gap: 20px;
}
```

### HTML 示例
```html
<div class="container">
  <div class="item">Item 1</div>
  <div class="item">Item 2</div>
  <div class="item">Item 3</div>
  <div class="item">Item 4</div>
  <div class="item">Item 5</div>
  <div class="item">Item 6</div>
</div>
```

### 预览效果
3列网格布局，列间距10px，行间距20px。子元素之间水平间隔10px，垂直间隔20px，间距不影响网格轨道尺寸（轨道宽度计算时会扣除间距）。

### 命名网格线

可以在定义轨道尺寸时为网格线命名：

```css
.container {
  display: grid;
  grid-template-columns: [start] 1fr [middle] 2fr [end];
  grid-template-rows: [header-start] 100px [header-end content-start] auto [content-end];
}
```

### HTML 示例
```html
<div class="container">
  <div class="item">Start</div>
  <div class="item">Middle</div>
  <div class="item">End</div>
  <div class="item">Header</div>
  <div class="item">Content</div>
  <div class="item">Footer</div>
</div>
```

### 预览效果
网格列线命名为start、middle、end，行线命名为header-start、header-end等。子元素可通过线名定位，例如从start到end列跨越1fr+2fr宽度，header区域占据100px高度行。

### 命名网格区域

使用`grid-template-areas`可以直观地定义网格区域：

```css
.container {
  display: grid;
  grid-template-columns: 1fr 3fr 1fr;
  grid-template-rows: auto 1fr auto;
  grid-template-areas:
    "header header header"
    "sidebar content aside"
    "footer footer footer";
}

.header { grid-area: header; }
.sidebar { grid-area: sidebar; }
.content { grid-area: content; }
.aside { grid-area: aside; }
.footer { grid-area: footer; }
```

### HTML 示例
```html
<div class="container">
  <div class="header">Header</div>
  <div class="sidebar">Sidebar</div>
  <div class="content">Main Content</div>
  <div class="aside">Aside</div>
  <div class="footer">Footer</div>
</div>
```

### 预览效果
通过命名区域直观定义布局结构，header占满3列，sidebar和content、aside分别占据对应列，footer占满3列。适合实现经典的页头-侧边栏-主内容-页脚布局。

使用`.`表示空单元格：

```css
grid-template-areas:
  "header header header"
  "sidebar content ."
  "footer footer footer";
```

## 定位网格项

### 使用行号和列号

```css
.item {
  /* 从第1列开始，到第3列结束（不含第3列） */
  grid-column-start: 1;
  grid-column-end: 3;
  /* 简写形式 */
  grid-column: 1 / 3;

  /* 从第2行开始，到第4行结束 */
  grid-row-start: 2;
  grid-row-end: 4;
  /* 简写形式 */
  grid-row: 2 / 4;

  /* 合并简写形式：grid-row-start / grid-column-start / grid-row-end / grid-column-end */
  grid-area: 2 / 1 / 4 / 3;
}
```

### HTML 示例
```html
<div class="container">
  <div class="item">跨越列1-3，行2-4的元素</div>
  <div class="item">普通元素</div>
  <div class="item">普通元素</div>
</div>
```

### 预览效果
目标元素占据列1到3（覆盖2列）、行2到4（覆盖2行），形成一个2x2的网格区域，其他元素自动填充剩余空间。

也可以使用`span`关键字：

```css
.item {
  /* 从第1列开始，跨越2列 */
  grid-column: 1 / span 2;

  /* 从第2行开始，跨越3行 */
  grid-row: 2 / span 3;
}
```

### 使用命名线

```css
.item {
  grid-column: start / end;
  grid-row: header-start / content-end;
}
```

### 使用命名区域

```css
.item {
  grid-area: sidebar;
}
```

## 对齐与对齐内容

### 容器属性

控制所有网格项的对齐方式：

```css
.container {
  /* 水平对齐（列轴） */
  justify-items: start | end | center | stretch;

  /* 垂直对齐（行轴） */
  align-items: start | end | center | stretch;

  /* 简写形式 */
  place-items: <align-items> <justify-items>;

  /* 网格轨道在容器中的对齐方式 */
  /* 当网格总大小小于容器大小时生效 */

  /* 列轨道的水平对齐 */
  justify-content: start | end | center | stretch | space-around | space-between | space-evenly;

  /* 行轨道的垂直对齐 */
  align-content: start | end | center | stretch | space-around | space-between | space-evenly;

  /* 简写形式 */
  place-content: <align-content> <justify-content>;
}
```

### HTML 示例
```html
<div class="container" style="width: 500px; height: 300px; border: 1px solid #ccc;">
  <div class="item" style="width: 100px; height: 50px;">Item</div>
</div>
```

### 预览效果
通过justify-items控制子元素在列轴（水平方向）的对齐方式（如start左对齐、center居中），align-items控制行轴（垂直方向）的对齐方式（如end底部对齐）。当网格总宽度小于容器时，justify-content控制轨道整体在容器中的对齐（如space-between两端对齐）。

### 项目属性

控制单个网格项的对齐方式：

```css
.item {
  /* 水平对齐（列轴） */
  justify-self: start | end | center | stretch;

  /* 垂直对齐（行轴） */
  align-self: start | end | center | stretch;

  /* 简写形式 */
  place-self: <align-self> <justify-self>;
}
```

## 隐式网格与自动定位

### 隐式网格尺寸

当内容超出显式定义的网格时，会创建隐式网格轨道。可以使用`grid-auto-rows`和`grid-auto-columns`控制隐式网格的尺寸：

```css
.container {
  display: grid;
  grid-template-columns: 100px 100px;
  grid-template-rows: 100px;

  /* 隐式创建的行高为80px */
  grid-auto-rows: 80px;

  /* 也可以使用minmax */
  grid-auto-rows: minmax(80px, auto);
}
```

### 自动定位方向

`grid-auto-flow`属性控制自动定位算法的工作方式：

```css
.container {
  grid-auto-flow: row | column | row dense | column dense;
}
```

- `row`（默认值）：填充每一行，再移动到下一行
- `column`：填充每一列，再移动到下一列
- `dense`：尝试填充网格中的空洞（可能会改变元素的顺序）

## 响应式网格设计

### 使用minmax()和auto-fill/auto-fit

```css
.container {
  display: grid;
  /* 根据容器宽度自动创建尽可能多的列，每列最小200px，最大1fr */
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
}
```

`auto-fill`和`auto-fit`的区别：
- `auto-fill`：尽可能创建多的轨道，即使有些轨道是空的
- `auto-fit`：扩展已有轨道填满可用空间，空轨道会折叠为0宽度

### 结合媒体查询

```css
.grid-container {
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
}

@media (min-width: 600px) {
  .grid-container {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 900px) {
  .grid-container {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (min-width: 1200px) {
  .grid-container {
    grid-template-columns: repeat(4, 1fr);
  }
}
```

## 网格布局实例

### 经典报纸布局

```html
<div class="newspaper">
  <header class="header">Header</header>
  <div class="main-article">Main Article</div>
  <div class="side-news">Side News</div>
  <div class="ads">Advertisements</div>
  <footer class="footer">Footer</footer>
</div>
```

```css
.newspaper {
  display: grid;
  grid-template-columns: 3fr 1fr;
  grid-template-rows: auto 1fr auto auto;
  gap: 10px;
  grid-template-areas:
    "header header"
    "main side"
    "ads side"
    "footer footer";
}

.header { grid-area: header; }
.main-article { grid-area: main; }
.side-news { grid-area: side; }
.ads { grid-area: ads; }
.footer { grid-area: footer; }
```

### 照片画廊

```html
<div class="gallery">
  <img src="img1.jpg" alt="Image 1" class="img1">
  <img src="img2.jpg" alt="Image 2" class="img2">
  <img src="img3.jpg" alt="Image 3" class="img3">
  <img src="img4.jpg" alt="Image 4" class="img4">
  <img src="img5.jpg" alt="Image 5" class="img5">
</div>
```

```css
.gallery {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: repeat(3, 150px);
  gap: 10px;
}

.img1 {
  grid-column: 1 / 3;
  grid-row: 1 / 3;
}

.img2 {
  grid-column: 3 / 5;
  grid-row: 1;
}

.img3 {
  grid-column: 3;
  grid-row: 2 / 4;
}

.img4 {
  grid-column: 4;
  grid-row: 2;
}

.img5 {
  grid-column: 1 / 3;
  grid-row: 3;
}
```

### 仪表板布局

```html
<div class="dashboard">
  <header class="header">Dashboard</header>
  <nav class="sidebar">Sidebar</nav>
  <main class="main-content">Main Content</main>
  <div class="widget widget1">Widget 1</div>
  <div class="widget widget2">Widget 2</div>
  <div class="widget widget3">Widget 3</div>
  <div class="widget widget4">Widget 4</div>
  <footer class="footer">Footer</footer>
</div>
```

```css
.dashboard {
  display: grid;
  grid-template-columns: 200px repeat(4, 1fr);
  grid-template-rows: auto 1fr 1fr auto;
  min-height: 100vh;
  gap: 10px;
  grid-template-areas:
    "header header header header header"
    "sidebar main main widget1 widget2"
    "sidebar main main widget3 widget4"
    "footer footer footer footer footer";
}

.header { grid-area: header; }
.sidebar { grid-area: sidebar; }
.main-content { grid-area: main; }
.widget1 { grid-area: widget1; }
.widget2 { grid-area: widget2; }
.widget3 { grid-area: widget3; }
.widget4 { grid-area: widget4; }
.footer { grid-area: footer; }
```

## Grid与其他布局方式的对比

### Grid vs Flexbox

- **Grid**：二维布局（行和列），适合整体页面布局
- **Flexbox**：一维布局（行或列），适合组件内布局

二者可以结合使用：Grid用于整体页面结构，Flexbox用于内部元素排列。

### Grid vs 传统布局方法

相比浮动、定位等传统方法，Grid具有以下优势：

1. **更直观**：布局结构在CSS中一目了然
2. **更少的HTML**：无需额外的包装元素
3. **更可控**：准确控制元素在二维空间中的位置
4. **更灵活**：轻松实现复杂布局
5. **更简洁**：一个属性就能替代多个传统属性的组合
6. **更易响应**：内置响应式功能，如minmax()、auto-fill等

## 浏览器兼容性

现代浏览器(Chrome, Firefox, Safari, Edge)都已完全支持CSS Grid。对于需要支持IE11的项目，可以：

1. 使用特性检测提供后备方案
2. 使用自动前缀工具（如Autoprefixer）
3. 采用渐进增强的方式

```css
/* 检测网格支持 */
@supports (display: grid) {
  .container {
    display: grid;
    /* 网格相关属性 */
  }
}

@supports not (display: grid) {
  .container {
    display: flex;
    /* 后备方案 */
  }
}
```

## 面试常见问题

### 1. 什么是CSS Grid布局？它与Flexbox有什么区别？

CSS Grid是一个二维布局系统，专为创建基于行和列的布局而设计。它允许精确控制元素在页面上的位置和大小。

主要区别：
- Grid是二维布局（同时控制行和列），Flexbox是一维布局（主轴方向）
- Grid适合整体页面布局，Flexbox适合组件内部元素排列
- Grid通过容器控制子元素位置，Flexbox允许子元素更多自主权
- Grid适合不规则布局，Flexbox更适合均匀分布的内容

两者不是竞争关系，而是互补的工具，可以在同一页面使用。

### 2. 如何使用Grid创建一个响应式卡片布局？

```css
.card-container {
  display: grid;
  /* 创建响应式列，每列最小200px，最大1fr */
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}
```

这种方式无需媒体查询，网格会根据容器宽度自动调整列数。卡片在大屏幕上会并排显示，在小屏幕上会自动换行。

### 3. 解释grid-template-areas的工作原理

`grid-template-areas`属性允许通过可视化文本定义网格布局：

```css
.container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: auto 1fr auto;
  grid-template-areas:
    "header header header"
    "sidebar content aside"
    "footer footer footer";
}
```

每个引号内的字符串代表一行，每个名称代表一个网格区域。相同名称的单元格组成一个矩形区域。然后，可以使用`grid-area`属性将元素放置在这些命名区域中。

这种方法的优势在于直观、易理解，且便于修改布局结构。

### 4. 如何使用Grid实现元素的居中对齐？

```css
/* 单个元素在整个网格中居中 */
.container {
  display: grid;
  place-items: center; /* align-items + justify-items 的简写 */
  height: 100vh;
}

/* 网格内容整体在容器中居中 */
.container {
  display: grid;
  place-content: center; /* align-content + justify-content 的简写 */
  height: 100vh;
}
```

### 5. auto-fill和auto-fit有什么区别？

两者都用于创建自适应的网格列，但行为略有不同：

- `auto-fill`: 尽可能创建多的列，即使有些列是空的
- `auto-fit`: 扩展现有列填满可用空间，空列会被折叠

```css
/* 在小屏幕上，可能会有空列 */
grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));

/* 在小屏幕上，已有列会扩展填满空间 */
grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
```

当容器宽度足够容纳多列时，两者表现相同。差异在容器宽度刚好超过一列但不足以容纳两列的情况下。

## 总结

CSS Grid布局是现代Web开发中最强大的布局工具之一，它提供了前所未有的控制和灵活性。通过掌握Grid，开发者可以：

1. 实现复杂的二维布局，无需复杂的HTML结构
2. 创建真正的响应式设计，适应不同屏幕大小
3. 减少媒体查询的依赖
4. 精确控制元素在页面中的位置和大小
5. 简化以前需要复杂技巧才能实现的布局

Grid与Flexbox结合使用，可以解决几乎所有现代网页布局需求。随着浏览器支持的不断提升，Grid已成为前端开发的标准工具，是每个前端开发者必须掌握的核心技能。