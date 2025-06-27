# Iterator与Generator

Iterator（迭代器）和Generator（生成器）是ES6引入的新特性，用于处理数据集合的遍历和异步编程。它们提供了更灵活的方式来处理数据序列，简化了复杂的循环和异步流程。

## Iterator（迭代器）

### 迭代器概念

迭代器是一种特殊对象，它提供了一种统一的方式来遍历各种数据结构而无需了解其内部实现细节。迭代器对象必须实现`next()`方法，该方法返回一个包含`value`和`done`属性的对象。

```javascript
// 迭代器接口的基本结构
interface Iterator {
  next(): IteratorResult;
}

interface IteratorResult {
  value: any;
  done: boolean;
}
```

### 可迭代对象

可迭代对象是实现了`Symbol.iterator`方法的对象，该方法返回一个迭代器对象。JavaScript中的许多内置类型都是可迭代的，例如Array、String、Map、Set等。

```javascript
// 检查对象是否可迭代
function isIterable(obj) {
  return obj != null && typeof obj[Symbol.iterator] === 'function';
}

console.log(isIterable([])); // true
console.log(isIterable('')); // true
console.log(isIterable(new Map())); // true
console.log(isIterable({})); // false
```

### 创建可迭代对象

你可以通过实现`Symbol.iterator`方法使自定义对象变成可迭代的：

```javascript
const myIterable = {
  data: [1, 2, 3, 4, 5],

  [Symbol.iterator]() {
    let index = 0;
    const data = this.data;

    return {
      next() {
        if (index < data.length) {
          return { value: data[index++], done: false };
        } else {
          return { done: true };
        }
      }
    };
  }
};

// 现在可以使用for...of循环遍历对象
for (const item of myIterable) {
  console.log(item); // 1, 2, 3, 4, 5
}

// 也可以使用扩展运算符
const arr = [...myIterable]; // [1, 2, 3, 4, 5]
```

### 内置迭代器

JavaScript提供了多种内置可迭代对象：

```javascript
// 数组迭代
const arr = [1, 2, 3];
for (const item of arr) {
  console.log(item); // 1, 2, 3
}

// 字符串迭代
const str = 'hello';
for (const char of str) {
  console.log(char); // 'h', 'e', 'l', 'l', 'o'
}

// Map迭代
const map = new Map([['a', 1], ['b', 2]]);
for (const [key, value] of map) {
  console.log(key, value); // 'a' 1, 'b' 2
}

// Set迭代
const set = new Set([1, 2, 3]);
for (const item of set) {
  console.log(item); // 1, 2, 3
}
```

### 迭代器方法

ES6提供了多种使用迭代器的方法：

```javascript
const arr = [1, 2, 3, 4, 5];

// for...of循环
for (const value of arr) {
  console.log(value);
}

// 扩展运算符
const newArr = [...arr];

// 解构赋值
const [first, second, ...rest] = arr;

// Array.from()
const arrCopy = Array.from(arr);

// Promise.all(), Promise.race()
Promise.all(arr.map(item => Promise.resolve(item)))
  .then(results => console.log(results));

// Map和Set构造函数
const map = new Map([['a', 1], ['b', 2]]);
const set = new Set(arr);
```

## Generator（生成器）

### 生成器概念

生成器是一种特殊的函数，可以中断执行并稍后恢复。生成器返回一个迭代器对象，可以用于控制生成器的执行。生成器使用`function*`语法声明，并使用`yield`关键字暂停执行。

```javascript
function* simpleGenerator() {
  yield 1;
  yield 2;
  yield 3;
}

const gen = simpleGenerator(); // 返回一个迭代器对象

console.log(gen.next()); // { value: 1, done: false }
console.log(gen.next()); // { value: 2, done: false }
console.log(gen.next()); // { value: 3, done: false }
console.log(gen.next()); // { value: undefined, done: true }
```

### 生成器的基本用法

```javascript
// 基本生成器
function* countToThree() {
  yield 1;
  yield 2;
  return 3; // return值会作为最后一个迭代结果的value，但done为true
}

const counter = countToThree();
console.log(counter.next()); // { value: 1, done: false }
console.log(counter.next()); // { value: 2, done: false }
console.log(counter.next()); // { value: 3, done: true }
console.log(counter.next()); // { value: undefined, done: true }

// for...of循环只迭代yield的值，不包含return的值
for (const value of countToThree()) {
  console.log(value); // 只输出1, 2
}
```

### yield表达式

`yield`表达式用于暂停生成器函数的执行并返回一个值。当生成器恢复执行时，它会从上次暂停的地方继续。

```javascript
function* twoWayGenerator() {
  const what = yield 'Hello';
  yield what;
}

const gen = twoWayGenerator();

console.log(gen.next()); // { value: 'Hello', done: false }
// next()方法可以接收一个参数，该参数会作为yield表达式的返回值
console.log(gen.next('World')); // { value: 'World', done: false }
console.log(gen.next()); // { value: undefined, done: true }
```

### yield*委托

`yield*`表达式用于委托给另一个生成器或可迭代对象：

```javascript
function* generatorA() {
  yield 'A1';
  yield 'A2';
}

function* generatorB() {
  yield 'B1';
  yield* generatorA(); // 委托给generatorA
  yield 'B2';
}

const gen = generatorB();

console.log(gen.next().value); // 'B1'
console.log(gen.next().value); // 'A1'
console.log(gen.next().value); // 'A2'
console.log(gen.next().value); // 'B2'
```

也可以委托给任何可迭代对象：

```javascript
function* genFromIterable() {
  yield* [1, 2, 3]; // 委托给数组
  yield* 'hello'; // 委托给字符串
}

const gen = genFromIterable();
for (const value of gen) {
  console.log(value); // 1, 2, 3, 'h', 'e', 'l', 'l', 'o'
}
```

### 生成器的实际应用

#### 实现可迭代对象

生成器是实现自定义可迭代对象的简单方法：

```javascript
const iterableObj = {
  *[Symbol.iterator]() {
    yield 1;
    yield 2;
    yield 3;
  }
};

for (const value of iterableObj) {
  console.log(value); // 1, 2, 3
}
```

#### 惰性计算

生成器可以实现惰性计算，只在需要时计算值：

```javascript
// 无限斐波那契数列生成器
function* fibonacci() {
  let a = 0, b = 1;

  while (true) {
    yield a;
    [a, b] = [b, a + b];
  }
}

// 获取前10个斐波那契数
const fib = fibonacci();
for (let i = 0; i < 10; i++) {
  console.log(fib.next().value); // 0, 1, 1, 2, 3, 5, 8, 13, 21, 34
}
```

#### 简化异步编程

在ES2017的async/await之前，生成器被用于简化异步代码：

```javascript
function fetchData(url) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(`数据来自 ${url}`);
    }, 1000);
  });
}

// 辅助函数来执行生成器
function run(generatorFunc) {
  const generator = generatorFunc();

  function handle(result) {
    if (result.done) return Promise.resolve(result.value);

    return Promise.resolve(result.value)
      .then(res => handle(generator.next(res)))
      .catch(err => handle(generator.throw(err)));
  }

  return handle(generator.next());
}

// 使用生成器模拟async/await
run(function* () {
  try {
    const data1 = yield fetchData('/api/data1');
    console.log(data1);

    const data2 = yield fetchData('/api/data2');
    console.log(data2);

    return 'All done!';
  } catch (error) {
    console.error('Error:', error);
  }
})
.then(result => console.log(result));
```

## Iterator与Generator的结合应用

### 实现自定义集合

```javascript
class Collection {
  constructor(items = []) {
    this.items = items;
  }

  *[Symbol.iterator]() {
    for (let i = 0; i < this.items.length; i++) {
      yield this.items[i];
    }
  }

  // 添加其他自定义迭代器
  *backwards() {
    for (let i = this.items.length - 1; i >= 0; i--) {
      yield this.items[i];
    }
  }

  *take(n) {
    for (let i = 0; i < Math.min(n, this.items.length); i++) {
      yield this.items[i];
    }
  }
}

const collection = new Collection([1, 2, 3, 4, 5]);

// 普通遍历
for (const item of collection) {
  console.log(item); // 1, 2, 3, 4, 5
}

// 反向遍历
for (const item of collection.backwards()) {
  console.log(item); // 5, 4, 3, 2, 1
}

// 只取前3个元素
for (const item of collection.take(3)) {
  console.log(item); // 1, 2, 3
}
```

### 状态机实现

生成器可以很容易地实现状态机：

```javascript
function* trafficLight() {
  while (true) {
    yield '红灯';
    yield '黄灯';
    yield '绿灯';
  }
}

const light = trafficLight();
console.log(light.next().value); // 红灯
console.log(light.next().value); // 黄灯
console.log(light.next().value); // 绿灯
console.log(light.next().value); // 红灯
```

### 管道处理

使用生成器实现数据处理管道：

```javascript
// 数据生成器
function* numbers() {
  for (let i = 0; i < 10; i++) {
    yield i;
  }
}

// 过滤处理
function* filter(iterable, predicate) {
  for (const item of iterable) {
    if (predicate(item)) {
      yield item;
    }
  }
}

// 映射处理
function* map(iterable, mapper) {
  for (const item of iterable) {
    yield mapper(item);
  }
}

// 组合处理流程
const pipeline = map(
  filter(numbers(), n => n % 2 === 0), // 筛选偶数
  n => n * n // 平方处理
);

for (const n of pipeline) {
  console.log(n); // 0, 4, 16, 36, 64
}
```

## 高级技巧与注意事项

### 生成器提前终止

可以使用`return()`或`throw()`方法提前终止生成器：

```javascript
function* gen() {
  try {
    yield 1;
    yield 2;
    yield 3;
  } finally {
    console.log('生成器已清理');
  }
}

const g = gen();
console.log(g.next()); // { value: 1, done: false }

// return()方法提前终止生成器并执行finally块
console.log(g.return('结束')); // 先输出'生成器已清理'，然后返回 { value: '结束', done: true }

// 生成器已终止，后续调用next()不会产生新值
console.log(g.next()); // { value: undefined, done: true }

// throw()方法抛出错误并终止生成器
const g2 = gen();
console.log(g2.next()); // { value: 1, done: false }
try {
  g2.throw(new Error('出错了!'));
} catch (e) {
  console.log(e.message); // '出错了!'
}
// 生成器已终止
console.log(g2.next()); // { value: undefined, done: true }
```

### 生成器与async/await的关系

ES2017引入的async/await实际上是生成器和Promise的语法糖：

```javascript
// 使用生成器模拟async/await
function run(generatorFunc) {
  const generator = generatorFunc();

  function handle(result) {
    if (result.done) return Promise.resolve(result.value);

    return Promise.resolve(result.value)
      .then(res => handle(generator.next(res)))
      .catch(err => handle(generator.throw(err)));
  }

  return handle(generator.next());
}

// 使用生成器
run(function* () {
  const result = yield fetch('https://api.example.com/data');
  const data = yield result.json();
  return data;
});

// 等效的async/await
async function fetchData() {
  const result = await fetch('https://api.example.com/data');
  const data = await result.json();
  return data;
}
```

### 性能考虑

迭代器和生成器在处理大型数据集或无限序列时非常有用，但它们可能会带来一些性能开销。对于简单的数组迭代，传统的for循环通常更快。

```javascript
// 性能测试：for循环与for...of循环
const arr = Array(1000000).fill(0).map((_, i) => i);

console.time('for loop');
for (let i = 0; i < arr.length; i++) {
  // 操作 arr[i]
}
console.timeEnd('for loop');

console.time('for...of');
for (const item of arr) {
  // 操作 item
}
console.timeEnd('for...of');
```

## 浏览器兼容性

Iterator和Generator在所有现代浏览器中都得到支持。对于旧版浏览器，可以使用Babel等工具将其转译为ES5代码。

## 面试常见问题

1. **Iterator和Generator的区别是什么？**
   - Iterator（迭代器）是一个对象，它提供了一种顺序访问集合中元素的方式
   - Generator（生成器）是一种特殊的函数，它可以生成Iterator对象，并通过yield表达式控制执行流程

2. **什么是可迭代对象？如何判断一个对象是否可迭代？**
   - 可迭代对象是实现了Symbol.iterator方法的对象
   - 可以通过typeof obj[Symbol.iterator] === 'function'判断对象是否可迭代

3. **生成器函数与普通函数有什么不同？**
   - 生成器函数使用function*语法声明
   - 生成器函数可以通过yield暂停执行
   - 生成器函数返回一个迭代器对象
   - 生成器函数执行后不会立即执行函数体，而是返回一个迭代器

4. **yield和yield*的区别是什么？**
   - yield会产生一个单独的值
   - yield*会委托给另一个生成器或可迭代对象，将其产生的所有值依次yield出来

5. **生成器的实际应用场景有哪些？**
   - 实现惰性计算和无限序列
   - 简化异步编程（作为async/await的前身）
   - 实现自定义迭代逻辑
   - 状态机实现
   - 数据处理管道