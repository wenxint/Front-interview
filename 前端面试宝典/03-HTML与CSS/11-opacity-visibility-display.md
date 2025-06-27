# opacity: 0、visibility: hidden、display: none 的区别

## 概念介绍

### opacity: 0
通过设置不透明度为0使元素不可见，但元素仍占据页面空间，且能响应点击等事件。

### visibility: hidden
设置元素不可见，元素同样保留空间位置，但无法响应鼠标事件（如点击、悬停）。

### display: none
完全移除元素在页面中的渲染，不占据任何空间，且不会触发重排或重绘（除非父元素状态变化）。

## 核心特性对比

| 特性                | opacity: 0          | visibility: hidden    | display: none         |
|---------------------|----------------------|------------------------|-----------------------|
| 占据空间            | 是                   | 是                     | 否                    |
| 事件响应            | 是（如click、hover） | 否                     | 否                    |
| 子元素可见性        | 子元素继承opacity值  | 子元素可通过visibility: visible恢复 | 子元素完全隐藏        |
| 性能影响            | 触发重绘（repaint）  | 触发重绘               | 触发重排（reflow）    |
| CSS过渡/动画支持    | 支持（如transition） | 不支持（visibility无中间值） | 不支持                |

## 实战案例

```html
<!DOCTYPE html>
<html>
<head>
    <style>
        .box {
            width: 100px;
            height: 100px;
            background: lightblue;
            margin: 10px;
        }
        .opacity-zero {
            opacity: 0;
        }
        .visibility-hidden {
            visibility: hidden;
        }
        .display-none {
            display: none;
        }
    </style>
</head>
<body>
    <div class="box">正常显示</div>
    <div class="box opacity-zero">opacity: 0（不可见但占空间）</div>
    <div class="box visibility-hidden">visibility: hidden（不可见但占空间）</div>
    <div class="box display-none">display: none（完全隐藏不占空间）</div>
</body>
</html>
```

## 兼容性说明

- opacity: 所有现代浏览器及IE9+支持，IE8及以下需使用filter: alpha(opacity=0)。
- visibility: 所有主流浏览器均支持（包括IE6+）。
- display: none: 所有浏览器支持。

## 面试常见问题

### 问题1：如何让子元素在父元素visibility: hidden时可见？
**解答**：子元素设置`visibility: visible`即可覆盖父元素的隐藏状态。

```css
.parent {
    visibility: hidden;
}
.child {
    visibility: visible;
}
```

### 问题2：opacity: 0和visibility: hidden哪个性能更好？
**解答**：opacity会触发重绘（repaint），而visibility同样触发重绘，但opacity支持过渡动画时可能涉及更多计算，因此简单隐藏场景下两者性能差异不大。

### 问题3：display: none为什么会触发重排？
**解答**：因为元素从文档流中移除会改变其他元素的布局位置，浏览器需要重新计算所有受影响元素的几何属性。