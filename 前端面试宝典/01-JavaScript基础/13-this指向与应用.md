# this指向与应用

## 概念介绍
`this`是JavaScript中动态绑定的关键字，其指向取决于函数的调用方式。理解`this`的绑定规则是掌握JavaScript函数行为的核心，也是前端面试的高频考点。

## this的绑定规则
### 1. 默认绑定（独立函数调用）
当函数独立调用（非对象方法、非构造函数）时，`this`指向全局对象（浏览器中为`window`，严格模式下为`undefined`）。

### 2. 隐式绑定（对象方法调用）
当函数作为对象的方法调用时，`this`指向该对象。若方法被赋值后独立调用，隐式绑定会丢失，退化为默认绑定。

### 3. 显式绑定（call/apply/bind）
通过`call`、`apply`或`bind`方法可显式指定`this`指向。其中`bind`会返回一个永久绑定`this`的新函数。

### 4. new绑定（构造函数调用）
使用`new`调用函数时，`this`指向新创建的实例对象。

### 5. 箭头函数绑定
箭头函数没有自己的`this`，其`this`继承自外层词法作用域。

## 实战案例：典型this指向问题分析
### 题目代码
```javascript
function foo() {
  console.log(this.name);
}

function Foo(fn) {
  fn();
}

var obj = {
  name: 'zl',
  foo,
}

var name = 'Heternally';

Foo(obj.foo);
```

### 执行过程与输出分析
1. `obj.foo`被赋值给`Foo`函数的参数`fn`，此时`fn`引用的是`foo`函数本身。
2. `Foo`函数内部调用`fn()`，属于独立函数调用（无明确调用对象）。
3. 根据默认绑定规则，非严格模式下`this`指向全局对象`window`。
4. 全局变量`name`的值为'Heternally'，因此`console.log(this.name)`输出`'Heternally'`。

**输出结果**：`Heternally`

## 面试常见问题
### 问题1：隐式绑定丢失场景
```javascript
const person = { name: 'Alice', getName() { return this.name; } };
const getName = person.getName;
console.log(getName()); // 输出什么？
```
**答案**：`undefined`（非严格模式）或`undefined`（严格模式）。原因：`getName`被赋值后独立调用，隐式绑定丢失，`this`指向全局对象（无`name`属性）。

### 问题2：箭头函数的this指向
```javascript
const timer = { seconds: 10, start() { setTimeout(function() { console.log(this.seconds); }, 1000); } };
timer.start(); // 输出什么？如何修正？
```
**答案**：输出`undefined`（普通函数`this`指向全局）。修正方法：使用箭头函数继承外层`this`：
```javascript
start() { setTimeout(() => { console.log(this.seconds); }, 1000); }
```

### 问题3：构造函数与new绑定
```javascript
function Person(name) { this.name = name; }
const alice = new Person('Alice');
console.log(alice.getName()); // 报错，如何让代码正常执行？
```
**答案**：需在原型上添加方法：
```javascript
Person.prototype.getName = function() { return this.name; };
```

### 问题4：箭头函数与普通函数混合调用
```javascript
const obj = {
  name: 'obj',
  getThis: function() {
    return () => {
      console.log(this.name);
    };
  }
};
const func = obj.getThis();
func();
```
**答案**：输出`'obj'`。原因：箭头函数的`this`继承自外层`getThis`方法的`this`（指向`obj`），因此调用`func()`时仍访问`obj.name`。

### 问题5：构造函数中不同函数类型的this绑定
```javascript
function Car() {
  this.brand = 'Tesla';
  this.getBrand = function() {
    console.log(this.brand);
  };
  this.getBrandArrow = () => {
    console.log(this.brand);
  };
}
const car = new Car();
const getBrand = car.getBrand;
const getBrandArrow = car.getBrandArrow;
getBrand();
getBrandArrow();
```
**答案**：
- `getBrand()`输出`undefined`（普通函数独立调用，`this`指向全局对象）。
- `getBrandArrow()`输出`'Tesla'`（箭头函数`this`继承自构造函数的`this`，即`car`实例）。

## 兼容性说明
`this`的绑定规则在ES5及以上版本中一致，无特殊浏览器兼容性问题。严格模式（`'use strict'`）会影响默认绑定的`this`指向（变为`undefined`），需注意代码环境。