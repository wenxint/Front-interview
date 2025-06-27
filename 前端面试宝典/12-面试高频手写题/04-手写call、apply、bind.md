# 手写call、apply、bind

## 概念介绍

`call`、`apply`和`bind`是JavaScript中函数对象的方法，用于改变函数执行时的`this`指向。`call`和`apply`立即执行函数，而`bind`返回一个新函数，需要手动调用。

## 基本语法

原生`call`、`apply`和`bind`的使用：
```javascript
function func() {
  console.log(this.name);
}

const obj = { name: 'Alice' };

func.call(obj); // 输出: Alice
func.apply(obj); // 输出: Alice

const boundFunc = func.bind(obj);
boundFunc(); // 输出: Alice
```

## 核心特性

- `call`：接收多个参数，第一个参数是`this`指向，后续是函数参数。
- `apply`：接收两个参数，第一个是`this`指向，第二个是参数数组。
- `bind`：返回一个新函数，新函数的`this`固定为传入的对象，参数可以部分绑定。

## 实战案例

手写`call`、`apply`和`bind`的实现：
```javascript
// 手写call方法：修改函数执行时的this指向并立即执行
Function.prototype.myCall = function(context, ...args) {
  // 处理上下文：若未传入context则默认使用window（浏览器环境），null/undefined时也指向window
  context = context || window;
  // 创建唯一Symbol作为临时属性名，避免覆盖对象原有属性
  const fn = Symbol('fn');
  // 将当前函数（调用myCall的函数）挂载到context的临时属性上
  context[fn] = this;
  // 执行临时属性（即原函数），传入剩余参数，此时函数内的this指向context
  const result = context[fn](...args);
  // 删除临时属性，避免污染原context对象
  delete context[fn];
  // 返回函数执行结果
  return result;
};

// 手写apply方法：与call类似，但参数通过数组传递
Function.prototype.myApply = function(context, args) {
  // 处理上下文：同call逻辑
  context = context || window;
  // 创建唯一Symbol作为临时属性名
  const fn = Symbol('fn');
  // 将当前函数挂载到context的临时属性上
  context[fn] = this;
  // 执行函数：若有参数数组则展开传递，否则直接执行
  const result = args ? context[fn](...args) : context[fn]();
  // 删除临时属性
  delete context[fn];
  // 返回执行结果
  return result;
};

// 手写bind方法：返回一个绑定this的新函数
Function.prototype.myBind = function(context, ...args) {
  // 保存原函数引用（调用bind的函数）
  const self = this;
  // 返回新函数，支持后续传递新参数
  return function(...newArgs) {
    // 调用自定义的myCall方法，合并初始参数和新参数
    return self.myCall(context, ...args, ...newArgs);
  };
};
```

## 兼容性说明

这些方法是ES3引入的特性，现代浏览器基本支持，但在旧版浏览器（如IE）中可能需要手动实现以确保兼容性。

## 面试常见问题

### 1. `call`、`apply`和`bind`的区别是什么？
**答案**：`call`和`apply`立即执行函数，`call`接收参数列表，`apply`接收参数数组；`bind`返回新函数，需要手动调用，且可以部分绑定参数。

### 2. 手写`call`方法。
**答案**：参考上述手写`call`的实现。

### 3. 手写`bind`方法时需要注意什么？
**答案**：需要考虑`this`的绑定、参数的传递，以及返回函数可能被作为构造函数调用的情况（需要使用`new`时保持原型链）。