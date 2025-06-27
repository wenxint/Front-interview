# Symbol与迭代器

ES6引入了Symbol基本数据类型和迭代器（Iterator）机制，为JavaScript生态系统带来了新的能力，包括创建唯一值、实现自定义迭代行为和使用可迭代协议等。

## Symbol基础

### 概念

Symbol是ES6引入的一种新的原始数据类型，表示**独一无二的值**。它是JavaScript语言的第七种数据类型，前六种是：Undefined、Null、Boolean、String、Number和Object。

### 创建Symbol

```javascript
// 创建一个基本的Symbol
const sym1 = Symbol();
console.log(typeof sym1); // "symbol"

// 带描述的Symbol
const sym2 = Symbol('描述文本');
console.log(sym2.toString()); // "Symbol(描述文本)"

// 每个Symbol都是唯一的
const sym3 = Symbol('描述文本');
console.log(sym2 === sym3); // false
```

### Symbol特性

1. **唯一性**：每个Symbol值都是唯一的，即使描述相同

```javascript
const sym1 = Symbol('描述');
const sym2 = Symbol('描述');
console.log(sym1 === sym2); // false
```

2. **不能使用new操作符**：Symbol是原始值，不是对象

```javascript
// 错误用法
// const sym = new Symbol(); // TypeError: Symbol is not a constructor
```

3. **类型转换限制**：Symbol不能自动转为字符串或数字

```javascript
const sym = Symbol('symbol');
// console.log("Symbol is: " + sym); // TypeError: Cannot convert a Symbol value to a string
// console.log(sym + 1); // TypeError: Cannot convert a Symbol value to a number

// 正确用法
console.log("Symbol is: " + sym.toString()); // "Symbol is: Symbol(symbol)"
console.log("Symbol description: " + sym.description); // "Symbol description: symbol"
```

4. **可以作为对象属性的键**：Symbol常用于创建唯一的对象键

```javascript
const uniqueKey = Symbol('privateData');
const obj = {
  [uniqueKey]: '这是一个私有数据',
  publicData: '这是公开数据'
};

console.log(obj[uniqueKey]); // "这是一个私有数据"
console.log(Object.keys(obj)); // ["publicData"] - Symbol键不出现在这里
console.log(Object.getOwnPropertySymbols(obj)); // [Symbol(privateData)]
```

### Symbol.for和Symbol.keyFor

ES6提供了全局Symbol注册表，可以通过`Symbol.for()`创建共享的Symbol：

```javascript
// 创建或重用全局Symbol
const globalSym1 = Symbol.for('全局Symbol');
const globalSym2 = Symbol.for('全局Symbol');

console.log(globalSym1 === globalSym2); // true

// 获取全局Symbol的key
console.log(Symbol.keyFor(globalSym1)); // "全局Symbol"

// 普通Symbol不在全局注册表中
const localSym = Symbol('本地Symbol');
console.log(Symbol.keyFor(localSym)); // undefined
```

### 内置的Symbol值

ES6内置了一些Symbol常量，用于实现特定的JavaScript行为：

```javascript
// Symbol.iterator - 定义对象的默认迭代器
const iterableObj = {
  data: [1, 2, 3],
  [Symbol.iterator]() {
    let index = 0;
    return {
      next: () => {
        if (index < this.data.length) {
          return { value: this.data[index++], done: false };
        } else {
          return { done: true };
        }
      }
    };
  }
};

for (const item of iterableObj) {
  console.log(item); // 1, 2, 3
}

// Symbol.toPrimitive - 自定义对象转换为原始值的行为
const customObj = {
  [Symbol.toPrimitive](hint) {
    switch (hint) {
      case 'number':
        return 42;
      case 'string':
        return '自定义字符串';
      default: // 'default'
        return '默认值';
    }
  }
};

console.log(+customObj); // 42
console.log(`${customObj}`); // "自定义字符串"
console.log(customObj + ''); // "默认值"
```

其他常用内置Symbol包括：
- `Symbol.hasInstance`: 自定义`instanceof`行为
- `Symbol.isConcatSpreadable`: 定义数组是否可展开
- `Symbol.species`: 指定构造函数创建派生对象的函数
- `Symbol.match`, `Symbol.replace`, `Symbol.search`, `Symbol.split`: 自定义字符串方法

## 迭代器与可迭代协议

### 迭代器协议（Iterator Protocol）

迭代器是一种特殊对象，它实现了`next()`方法，该方法返回具有两个属性的对象：`value`和`done`。

```javascript
// 手动创建一个迭代器
function createIterator(array) {
  let index = 0;

  return {
    next() {
      if (index < array.length) {
        return { value: array[index++], done: false };
      } else {
        return { done: true };
      }
    }
  };
}

const iterator = createIterator([1, 2, 3]);
console.log(iterator.next()); // { value: 1, done: false }
console.log(iterator.next()); // { value: 2, done: false }
console.log(iterator.next()); // { value: 3, done: false }
console.log(iterator.next()); // { done: true }
```

### 可迭代协议（Iterable Protocol）

实现了`Symbol.iterator`方法的对象被称为可迭代对象（Iterable）。这个方法返回一个迭代器，允许对象被`for...of`循环、扩展运算符（`...`）等语法使用。

```javascript
// 创建可迭代对象
const myIterable = {
  data: [10, 20, 30],

  // 实现Symbol.iterator方法
  [Symbol.iterator]() {
    let index = 0;
    return {
      next: () => {
        if (index < this.data.length) {
          return { value: this.data[index++], done: false };
        } else {
          return { done: true };
        }
      }
    };
  }
};

// 使用for...of遍历
for (const item of myIterable) {
  console.log(item); // 10, 20, 30
}

// 使用扩展运算符
const array = [...myIterable];
console.log(array); // [10, 20, 30]

// 使用解构
const [first, ...rest] = myIterable;
console.log(first, rest); // 10, [20, 30]
```

### 内置可迭代对象

JavaScript中的许多内置对象已经实现了可迭代协议：

- Array
- String
- Map
- Set
- TypedArray
- arguments对象
- NodeList

```javascript
// 字符串迭代
for (const char of "Hello") {
  console.log(char); // "H", "e", "l", "l", "o"
}

// Map迭代
const map = new Map([
  ['name', '张三'],
  ['age', 30]
]);

for (const [key, value] of map) {
  console.log(`${key}: ${value}`); // "name: 张三", "age: 30"
}
```

### 生成器函数（Generators）

生成器是ES6引入的一种特殊函数，它简化了迭代器的创建过程。生成器函数使用`function*`语法，内部使用`yield`关键字产生值。

```javascript
// 简单生成器
function* simpleGenerator() {
  yield 1;
  yield 2;
  yield 3;
}

const gen = simpleGenerator();
console.log(gen.next()); // { value: 1, done: false }
console.log(gen.next()); // { value: 2, done: false }
console.log(gen.next()); // { value: 3, done: false }
console.log(gen.next()); // { value: undefined, done: true }

// 使用for...of自动迭代
for (const value of simpleGenerator()) {
  console.log(value); // 1, 2, 3
}
```

生成器可以创建无限序列，按需生成值：

```javascript
// 无限序列生成器
function* infiniteSequence() {
  let i = 0;
  while (true) {
    yield i++;
  }
}

const numberGen = infiniteSequence();
console.log(numberGen.next().value); // 0
console.log(numberGen.next().value); // 1
console.log(numberGen.next().value); // 2
// ...可以无限继续
```

生成器也可以接收值：

```javascript
function* twoWayGenerator() {
  const a = yield '第一个问题';
  console.log('回答1:', a);

  const b = yield '第二个问题';
  console.log('回答2:', b);

  return '结束';
}

const conversation = twoWayGenerator();
console.log(conversation.next().value); // "第一个问题"
console.log(conversation.next('回答A').value); // 输出"回答1: 回答A"，返回"第二个问题"
console.log(conversation.next('回答B').value); // 输出"回答2: 回答B"，返回"结束"
```

### 迭代器方法与组合

ES6提供了多种操作迭代器的方法：

```javascript
// 自定义可迭代对象与方法
const rangeIterable = {
  from: 1,
  to: 5,

  [Symbol.iterator]() {
    let current = this.from;
    const last = this.to;

    return {
      next() {
        if (current <= last) {
          return { value: current++, done: false };
        } else {
          return { done: true };
        }
      }
    };
  }
};

// 使用数组方法
console.log(Array.from(rangeIterable)); // [1, 2, 3, 4, 5]

// 使用解构赋值
const [first, second, ...rest] = rangeIterable;
console.log(first, second, rest); // 1, 2, [3, 4, 5]

// 组合迭代器
function* combined() {
  yield* [1, 2]; // 委托给数组迭代器
  yield* "AB";   // 委托给字符串迭代器
  yield 3;       // 直接生成值
}

for (const item of combined()) {
  console.log(item); // 1, 2, "A", "B", 3
}
```

## 应用场景

### Symbol的应用场景

#### 1. 创建私有属性

虽然不是真正的私有属性（可以通过`Object.getOwnPropertySymbols`获取），但Symbol提供了比普通属性更好的封装性：

```javascript
// 使用Symbol作为私有属性键
const _age = Symbol('age');
const _salary = Symbol('salary');

class Employee {
  constructor(name, age, salary) {
    this.name = name;      // 公开属性
    this[_age] = age;      // "私有"属性
    this[_salary] = salary; // "私有"属性
  }

  increaseSalary(percentage) {
    this[_salary] *= (1 + percentage / 100);
    return this[_salary];
  }

  // 公开访问方法
  getDetails() {
    return `${this.name}, ${this[_age]}岁`;
  }
}

const emp = new Employee('张三', 30, 10000);
console.log(emp.name); // "张三"
console.log(emp[_age]); // 30 (如果有Symbol引用，仍可访问)
console.log(emp.getDetails()); // "张三, 30岁"

// 普通属性枚举无法看到Symbol属性
console.log(Object.keys(emp)); // ["name"]

// 但可以专门获取Symbol属性
const symbols = Object.getOwnPropertySymbols(emp);
console.log(symbols.length); // 2
console.log(emp[symbols[0]]); // 30
```

#### 2. 防止属性名冲突

使用Symbol可以避免在混合多个库或组件时的属性名冲突：

```javascript
// 库1
const lib1 = {
  id: Symbol('id'),
  initialize(obj) {
    obj[this.id] = 'lib1数据';
  }
};

// 库2
const lib2 = {
  id: Symbol('id'),
  initialize(obj) {
    obj[this.id] = 'lib2数据';
  }
};

// 使用这两个库
const obj = {};
lib1.initialize(obj);
lib2.initialize(obj);

console.log(obj[lib1.id]); // "lib1数据"
console.log(obj[lib2.id]); // "lib2数据"
// 没有冲突，即使两个库都使用了"id"作为属性名
```

#### 3. 实现常量枚举类型

Symbol可以用于创建唯一的常量值：

```javascript
// 使用Symbol作为枚举值
const COLOR = {
  RED: Symbol('红色'),
  GREEN: Symbol('绿色'),
  BLUE: Symbol('蓝色')
};

function getColorName(color) {
  switch (color) {
    case COLOR.RED:
      return '红色';
    case COLOR.GREEN:
      return '绿色';
    case COLOR.BLUE:
      return '蓝色';
    default:
      return '未知颜色';
  }
}

console.log(getColorName(COLOR.RED)); // "红色"

// 不可能误传入错误的字符串值
console.log(getColorName('RED')); // "未知颜色"
```

#### 4. 内置Symbol的应用

自定义对象行为：

```javascript
// 自定义instanceof行为
class MyArray {
  static [Symbol.hasInstance](instance) {
    return Array.isArray(instance);
  }
}

console.log([] instanceof MyArray); // true

// 自定义对象的字符串表示
class Person {
  constructor(name) {
    this.name = name;
  }

  [Symbol.toPrimitive](hint) {
    if (hint === 'string') {
      return this.name;
    }
    return null;
  }

  // 自定义对象的字符串表示
  [Symbol.toStringTag] = 'Person';
}

const person = new Person('张三');
console.log(String(person)); // "张三"
console.log(Object.prototype.toString.call(person)); // "[object Person]"
```

### 迭代器的应用场景

#### 1. 自定义数据结构的迭代

让自定义数据结构支持`for...of`循环：

```javascript
// 二叉树节点
class TreeNode {
  constructor(value) {
    this.value = value;
    this.left = null;
    this.right = null;
  }
}

// 二叉树类
class BinaryTree {
  constructor() {
    this.root = null;
  }

  // 插入值
  insert(value) {
    const node = new TreeNode(value);

    if (!this.root) {
      this.root = node;
      return;
    }

    const insertNode = (node, newNode) => {
      if (newNode.value < node.value) {
        if (!node.left) {
          node.left = newNode;
        } else {
          insertNode(node.left, newNode);
        }
      } else {
        if (!node.right) {
          node.right = newNode;
        } else {
          insertNode(node.right, newNode);
        }
      }
    };

    insertNode(this.root, node);
  }

  // 中序遍历的迭代器
  *[Symbol.iterator]() {
    function* traverse(node) {
      if (node) {
        yield* traverse(node.left);
        yield node.value;
        yield* traverse(node.right);
      }
    }

    yield* traverse(this.root);
  }
}

// 使用二叉树
const tree = new BinaryTree();
tree.insert(5);
tree.insert(3);
tree.insert(7);
tree.insert(2);
tree.insert(4);

// 使用for...of遍历树
for (const value of tree) {
  console.log(value); // 2, 3, 4, 5, 7 (中序遍历顺序)
}

// 使用扩展运算符
console.log([...tree]); // [2, 3, 4, 5, 7]
```

#### 2. 惰性计算和无限序列

使用生成器实现按需计算的序列：

```javascript
// 斐波那契数列生成器
function* fibonacci() {
  let [prev, curr] = [0, 1];
  while (true) {
    yield curr;
    [prev, curr] = [curr, prev + curr];
  }
}

// 获取前10个斐波那契数
const fib = fibonacci();
const results = [];
for (let i = 0; i < 10; i++) {
  results.push(fib.next().value);
}
console.log(results); // [1, 1, 2, 3, 5, 8, 13, 21, 34, 55]

// 使用解构获取指定数量的元素
function take(iterator, count) {
  const result = [];
  for (let i = 0; i < count; i++) {
    const next = iterator.next();
    if (next.done) break;
    result.push(next.value);
  }
  return result;
}

console.log(take(fibonacci(), 5)); // [1, 1, 2, 3, 5]
```

#### 3. 简化异步操作

生成器可以简化异步代码，让异步操作看起来更像同步代码：

```javascript
// 模拟异步操作
function fetchData(url) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(`来自 ${url} 的数据`);
    }, 1000);
  });
}

// 使用生成器简化异步操作
function* fetchSequence() {
  const result1 = yield fetchData('/api/data1');
  console.log(result1);

  const result2 = yield fetchData('/api/data2');
  console.log(result2);

  return '所有数据加载完成';
}

// 执行器函数
function runGenerator(generator) {
  const iterator = generator();

  function handle(result) {
    if (result.done) return Promise.resolve(result.value);

    return Promise.resolve(result.value)
      .then(res => handle(iterator.next(res)))
      .catch(err => handle(iterator.throw(err)));
  }

  return handle(iterator.next());
}

// 运行生成器
runGenerator(fetchSequence)
  .then(finalResult => console.log(finalResult))
  .catch(err => console.error(err));

// 输出 (每条间隔1秒):
// "来自 /api/data1 的数据"
// "来自 /api/data2 的数据"
// "所有数据加载完成"
```

这种模式是ES2017中`async/await`语法的前身，现在我们通常使用`async/await`来实现类似功能。

#### 4. 数据流处理

生成器可以用于处理大型数据流，实现数据转换管道：

```javascript
// 数据源生成器
function* dataSource() {
  yield* [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
}

// 转换函数
function* filter(iterable, predicate) {
  for (const item of iterable) {
    if (predicate(item)) {
      yield item;
    }
  }
}

function* map(iterable, transformer) {
  for (const item of iterable) {
    yield transformer(item);
  }
}

// 组合处理
function* pipeline() {
  // 获取偶数
  const evenNumbers = filter(dataSource(), x => x % 2 === 0);
  // 将偶数平方
  const squares = map(evenNumbers, x => x * x);
  yield* squares;
}

// 处理结果
console.log([...pipeline()]); // [4, 16, 36, 64, 100]
```

## 最佳实践与性能考虑

### Symbol最佳实践

1. **使用描述性标签**：为Symbol添加有意义的描述，便于调试

```javascript
// 好的实践
const EVENT_CLICK = Symbol('event.click');

// 不推荐
const EVENT_CLICK = Symbol();
```

2. **避免过度使用全局Symbol**：`Symbol.for()`创建的全局Symbol应谨慎使用，以防冲突

3. **考虑Symbol缺点**：Symbol不能序列化为JSON

```javascript
const obj = {
  name: '张三',
  [Symbol('id')]: 123
};

console.log(JSON.stringify(obj)); // '{"name":"张三"}' (Symbol被忽略)
```

### 迭代器最佳实践

1. **使用生成器简化迭代器创建**：尽可能使用生成器函数而非手动实现迭代器

```javascript
// 推荐：使用生成器
function* createRangeGenerator(start, end) {
  for (let i = start; i <= end; i++) {
    yield i;
  }
}

// 不推荐：手动实现迭代器
function createRangeIterator(start, end) {
  let current = start;
  return {
    [Symbol.iterator]() { return this; },
    next() {
      if (current <= end) {
        return { value: current++, done: false };
      } else {
        return { done: true };
      }
    }
  };
}
```

2. **提前终止迭代**：实现`return`方法允许迭代器被提前关闭

```javascript
function* createIteratorWithCleanup() {
  try {
    yield 1;
    yield 2;
    yield 3;
  } finally {
    console.log('迭代器被清理');
  }
}

const iterator = createIteratorWithCleanup();
console.log(iterator.next()); // { value: 1, done: false }
console.log(iterator.return('结束')); // 输出"迭代器被清理", 返回{ value: '结束', done: true }
```

3. **处理迭代器错误**：实现`throw`方法可以处理迭代过程中的错误

```javascript
function* generatorWithErrorHandling() {
  try {
    yield 1;
    yield 2;
  } catch (error) {
    console.log('捕获到错误:', error.message);
    yield '出错后的恢复值';
  }
}

const gen = generatorWithErrorHandling();
console.log(gen.next()); // { value: 1, done: false }
console.log(gen.throw(new Error('测试错误'))); // 输出"捕获到错误: 测试错误", 返回{ value: '出错后的恢复值', done: false }
```

### 性能考虑

1. **Symbol创建开销**：每次创建Symbol都会产生新的唯一值，在频繁创建时要注意性能

```javascript
// 不好的实践 - 循环中创建Symbol
function processItems(items) {
  return items.map(item => {
    // 每次迭代都创建新Symbol，性能不佳
    const id = Symbol('id');
    return { [id]: item };
  });
}

// 更好的做法
const ID_SYMBOL = Symbol('id');
function processItemsBetter(items) {
  return items.map(item => {
    // 重用已有Symbol
    return { [ID_SYMBOL]: item };
  });
}
```

2. **无限序列的内存考虑**：使用生成器创建无限序列时，确保有终止条件或限制数量

3. **迭代大数据集的性能**：迭代大型数据集时，考虑使用惰性求值和分批处理

```javascript
// 处理大型数据的生成器
function* processLargeData(data, batchSize = 1000) {
  // 假设data是非常大的数组
  for (let i = 0; i < data.length; i += batchSize) {
    // 每次处理一批数据
    const batch = data.slice(i, i + batchSize);
    // 可以在这里处理批次数据
    yield batch;
  }
}

// 使用
function processData(data) {
  const processor = processLargeData(data);

  // 处理下一批数据
  function processBatch() {
    const result = processor.next();
    if (!result.done) {
      // 处理这一批数据
      console.log(`处理了${result.value.length}条数据`);

      // 使用setTimeout避免阻塞UI线程
      setTimeout(processBatch, 0);
    } else {
      console.log('所有数据处理完成');
    }
  }

  processBatch();
}
```

## 浏览器兼容性

Symbol和迭代器在现代浏览器中得到了良好支持，包括Chrome 38+、Firefox 36+、Safari 9+、Edge 12+和Opera 25+。然而，Internet Explorer不支持Symbol和迭代器，需要使用polyfill。

## 面试常见问题

1. **Symbol的主要用途是什么？**
   - 创建唯一的标识符，避免命名冲突
   - 定义对象的私有或半私有属性
   - 实现特定的JavaScript行为（如可迭代协议）
   - 创建常量枚举值

2. **Symbol与字符串属性键的区别是什么？**
   - Symbol是唯一的，即使描述相同
   - Symbol不会出现在常规的对象属性枚举中
   - Symbol不会被JSON.stringify()序列化
   - Symbol提供了内置的行为定制功能

3. **什么是可迭代对象？如何实现？**
   - 实现了`Symbol.iterator`方法的对象
   - 该方法返回一个迭代器，迭代器包含next方法
   - 允许对象被`for...of`循环、解构赋值等语法使用
   - 通常使用生成器函数实现

4. **生成器函数与普通函数的区别是什么？**
   - 生成器函数使用`function*`语法定义
   - 生成器函数可以通过`yield`暂停和恢复执行
   - 生成器函数返回迭代器对象
   - 生成器函数可以使用`yield*`委托给其他可迭代对象

5. **生成器函数如何简化异步编程？**
   - 可以用于创建状态机处理异步操作
   - 使异步代码看起来更像同步代码
   - 可以顺序处理多个Promise
   - 是`async/await`语法的概念前身