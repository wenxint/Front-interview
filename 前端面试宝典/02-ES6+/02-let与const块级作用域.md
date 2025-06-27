# let 与 const 块级作用域（Block Scope of let & const）

> let 和 const 是 ES6 引入的块级作用域声明关键字，替代了传统 var 的若干不足，使变量声明更加安全、可预测。

## 概念介绍

在 JavaScript 中，var 声明的变量只有函数作用域；ES6 引入的 let 和 const 提供了块级作用域（block scope），并带来了暂时性死区（TDZ）、禁止重复声明等机制，避免意外覆盖和变量提升带来的问题。

## 基本语法

```javascript
/**
 * @description var 声明的函数作用域示例
 */
function varScope() {
  var x = 1;
  {
    var x = 2;
    console.log(x); // 2
  }
  console.log(x);   // 2（同一函数体内覆盖）
}

/**
 * @description let 声明的块级作用域示例
 */
function letScope() {
  let y = 1;
  {
    let y = 2;
    console.log(y); // 2
  }
  console.log(y);   // 1（块内部 y 不影响外部）
}

/**
 * @description const 声明的常量示例
 */
const PI = 3.14;
// PI = 3.1415; // TypeError: Assignment to constant variable
```

## 核心特性

1. **块级作用域**：let/const 的变量只在最近一对 `{}` 内有效；
2. **暂时性死区（TDZ）**：在声明之前访问会抛出 ReferenceError；
3. **禁止重复声明**：同一作用域中不能对同一标识符多次使用 let/const；
4. **const 不可赋值**：保证引用不变，但对象属性仍可修改；
5. **不挂载全局对象**：全局作用域中使用 let/const 声明不会成为 globalThis 属性。

## 实战案例

```javascript
/**
 * @description 循环计数器安全示例
 */
for (let i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 100); // 0,1,2
}
// var 版本会输出 3,3,3

/**
 * @description 临时作用域避免变量污染
 */
{
  let temp = calculate();
  process(temp);
}
// console.log(temp); // ReferenceError

/**
 * @description switch 分支中安全声明
 */
switch (type) {
  case 'A': {
    let resultA = handleA();
    break;
  }
  case 'B': {
    let resultB = handleB();
    break;
  }
}

/**
 * @description const 对象常量示例
 */
const CONFIG = Object.freeze({ apiUrl: 'https://api.example.com' });
```

## 兼容性说明

| 引擎/浏览器 | 版本       |
| ---------- | ---------- |
| Chrome     | 49+        |
| Firefox    | 36+        |
| Safari     | 10+        |
| Edge       | 全版本支持 |
| IE         | 不支持     |

## 面试常见问题

### 1. let/const 与 var 有何本质区别？
**答**：let/const 引入块级作用域和 TDZ，避免 var 的变量提升和意外覆盖；const 进一步保证引用不变。

### 2. 什么是暂时性死区（TDZ）？
**答**：在块作用域开始到声明语句执行前的区域，使用 let/const 声明的变量存在于 TDZ，访问会抛出 ReferenceError。

### 3. const 声明的对象为什么可以修改属性？
**答**：const 保证的是变量的引用不变，对象内部仍可读写属性；如需深度不可变，可使用 Object.freeze 或不可变库。

### 4. 如何在旧环境中使用 let/const？
**答**：可通过 Babel 等编译工具将 ES6 代码转换为 ES5，或使用 polyfill（但 polyfill 只针对 API，不适用于语法转换）。

## 学习资源

- MDN - [let](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/let)  & [const](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/const)
- JavaScript.info - [变量作用域与声明](https://zh.javascript.info/variables)
- ECMAScript 6 入门 - 周立超 著