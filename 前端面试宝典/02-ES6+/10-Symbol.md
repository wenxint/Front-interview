# Symbol

Symbol是ES6引入的一种原始数据类型，它表示唯一的、不可变的值，主要用于创建对象属性的唯一标识符，避免属性名冲突，尤其在库和框架开发中非常有用。

## Symbol基础

### 创建Symbol

```javascript
// 创建一个Symbol
const sym1 = Symbol();
const sym2 = Symbol();

console.log(sym1 === sym2); // false，每个Symbol都是唯一的

// 可以添加描述（仅用于调试）
const sym3 = Symbol('描述');
console.log(sym3.toString()); // "Symbol(描述)"
console.log(sym3.description); // "描述"
```

### Symbol作为对象属性

Symbol可以用作对象的属性键，确保属性不会被意外覆盖或访问。

```javascript
const mySymbol = Symbol('privateData');
const obj = {};

// 使用Symbol作为属性键
obj[mySymbol] = 'Hello Symbol';

// 访问Symbol属性
console.log(obj[mySymbol]); // "Hello Symbol"

// Symbol属性不会出现在常规的属性遍历中
console.log(Object.keys(obj)); // []
console.log(Object.getOwnPropertyNames(obj)); // []

// 获取Symbol属性需要特殊方法
console.log(Object.getOwnPropertySymbols(obj)); // [Symbol(privateData)]
```

### 使用Symbol定义常量

Symbol可以用来定义常量，确保值的唯一性：

```javascript
// 使用Symbol定义状态常量
const STATUS = {
  PENDING: Symbol('pending'),
  FULFILLED: Symbol('fulfilled'),
  REJECTED: Symbol('rejected')
};

function handleStatus(status) {
  switch (status) {
    case STATUS.PENDING:
      console.log('任务待处理');
      break;
    case STATUS.FULFILLED:
      console.log('任务已完成');
      break;
    case STATUS.REJECTED:
      console.log('任务已拒绝');
      break;
    default:
      console.log('未知状态');
  }
}

handleStatus(STATUS.FULFILLED); // 任务已完成
```

## Symbol.for() 和 Symbol.keyFor()

### Symbol.for()

`Symbol.for(key)`方法会在全局Symbol注册表中搜索指定key的Symbol。如果存在，则返回已有的Symbol；否则创建一个新的Symbol并注册到全局Symbol注册表中。

```javascript
// 创建或获取全局Symbol
const globalSym1 = Symbol.for('globalKey');
const globalSym2 = Symbol.for('globalKey');

console.log(globalSym1 === globalSym2); // true，因为它们引用同一个全局Symbol

// 普通Symbol总是不相等
const sym1 = Symbol('key');
const sym2 = Symbol('key');
console.log(sym1 === sym2); // false
```

### Symbol.keyFor()

`Symbol.keyFor(sym)`方法返回全局Symbol注册表中Symbol的key。

```javascript
const globalSym = Symbol.for('globalSymbol');
console.log(Symbol.keyFor(globalSym)); // "globalSymbol"

const localSym = Symbol('localSymbol');
console.log(Symbol.keyFor(localSym)); // undefined，因为它不在全局注册表中
```

## 内置的Symbol常量

ES6定义了一些内置的Symbol常量（也称为"众所周知的Symbol"或"well-known Symbols"），用于控制对象的行为。

### Symbol.iterator

`Symbol.iterator`用于定义对象的默认迭代器，使对象可以被`for...of`循环遍历。

```javascript
const myCollection = {
  items: ['item1', 'item2', 'item3'],

  // 定义迭代器
  [Symbol.iterator]() {
    let index = 0;
    const items = this.items;

    return {
      next() {
        return {
          done: index >= items.length,
          value: items[index++]
        };
      }
    };
  }
};

// 现在可以使用for...of循环遍历对象
for (const item of myCollection) {
  console.log(item);
}
// 输出:
// "item1"
// "item2"
// "item3"
```

### Symbol.hasInstance

`Symbol.hasInstance`用于自定义`instanceof`操作符的行为。

```javascript
class MyArray {
  static [Symbol.hasInstance](instance) {
    return Array.isArray(instance);
  }
}

console.log([] instanceof MyArray); // true
```

### Symbol.toPrimitive

`Symbol.toPrimitive`用于定义对象转换为原始值的行为。

```javascript
const user = {
  name: '张三',
  age: 30,
  [Symbol.toPrimitive](hint) {
    switch (hint) {
      case 'number':
        return this.age;
      case 'string':
        return `${this.name}, ${this.age}岁`;
      default: // 'default'
        return `${this.name}`;
    }
  }
};

console.log(+user); // 30 (数字转换)
console.log(`${user}`); // "张三, 30岁" (字符串转换)
console.log(user + ''); // "张三" (默认转换)
```

### Symbol.toStringTag

`Symbol.toStringTag`用于自定义`Object.prototype.toString()`方法的返回值。

```javascript
class ValidatorClass {
  get [Symbol.toStringTag]() {
    return 'Validator';
  }
}

const validator = new ValidatorClass();
console.log(Object.prototype.toString.call(validator)); // "[object Validator]"
```

### 其他内置Symbol

- `Symbol.match`：配置对象作为正则表达式使用的行为
- `Symbol.replace`：替换匹配字符串的子串的方法
- `Symbol.search`：返回字符串中正则表达式匹配的索引
- `Symbol.split`：在匹配正则表达式的索引处拆分字符串
- `Symbol.species`：用于创建派生对象的构造函数
- `Symbol.unscopables`：指定对象值不包含在关联对象的`with`环境绑定中

## Symbol在实际开发中的应用

### 私有属性实现

在ES6之前，JavaScript没有真正的私有属性。Symbol提供了模拟私有属性的方法：

```javascript
// 模拟私有属性
const _counter = Symbol('counter');
const _action = Symbol('action');

class Countdown {
  constructor(counter, action) {
    this[_counter] = counter;
    this[_action] = action;
  }

  dec() {
    if (this[_counter] < 1) return;
    this[_counter]--;
    if (this[_counter] === 0) {
      this[_action]();
    }
  }
}

const c = new Countdown(2, () => console.log('完成!'));
c.dec();
c.dec(); // 输出: 完成!

// 无法直接访问私有属性
console.log(c._counter); // undefined
console.log(c._action); // undefined
```

### 防止属性名冲突

当开发库或框架时，Symbol可以防止属性名冲突：

```javascript
// 库A
const lib1 = {
  id: Symbol('id'),
  init(obj) {
    obj[this.id] = 'library1 data';
  }
};

// 库B (使用相同的属性名)
const lib2 = {
  id: Symbol('id'),
  init(obj) {
    obj[this.id] = 'library2 data';
  }
};

// 使用这两个库
const obj = {};
lib1.init(obj);
lib2.init(obj);

// 两个库都可以安全地使用'id'属性
console.log(obj[lib1.id]); // "library1 data"
console.log(obj[lib2.id]); // "library2 data"
```

### 自定义迭代器实现

```javascript
class Range {
  constructor(start, end) {
    this.start = start;
    this.end = end;
  }

  // 自定义迭代器
  [Symbol.iterator]() {
    let current = this.start;
    const end = this.end;

    return {
      next() {
        return current <= end
          ? { done: false, value: current++ }
          : { done: true };
      }
    };
  }
}

// 使用自定义迭代器
const range = new Range(1, 5);
for (const num of range) {
  console.log(num);
}
// 输出: 1, 2, 3, 4, 5

// 也可以用扩展运算符
console.log([...range]); // [1, 2, 3, 4, 5]
```

### 元编程应用

Symbol可以用于元编程，允许开发者自定义对象的行为：

```javascript
const collection = {
  items: [],
  add(item) {
    this.items.push(item);
    return this;
  },
  // 自定义对象的 + 运算符行为
  [Symbol.toPrimitive](hint) {
    if (hint === 'number') {
      return this.items.reduce((sum, item) => sum + item, 0);
    }
    return this.items.join(', ');
  }
};

collection.add(1).add(2).add(3);

console.log(+collection); // 6 (求和)
console.log(`${collection}`); // "1, 2, 3" (字符串化)
```

## 注意事项和限制

### Symbol作为属性的特性

- Symbol属性不会出现在`for...in`循环中
- `Object.keys()`不会返回Symbol属性
- `Object.getOwnPropertyNames()`不会返回Symbol属性
- `JSON.stringify()`会忽略Symbol属性

```javascript
const obj = {
  [Symbol('id')]: 123,
  name: '示例'
};

for (let key in obj) {
  console.log(key); // 只输出 "name"
}

console.log(Object.keys(obj)); // ["name"]
console.log(JSON.stringify(obj)); // {"name":"示例"}
```

### 获取对象的Symbol属性

要获取对象的Symbol属性，可以使用：

```javascript
// 获取对象的所有Symbol属性
const symbolKeys = Object.getOwnPropertySymbols(obj);

// 获取对象的所有属性，包括Symbol属性
const allKeys = Reflect.ownKeys(obj);
```

### Symbol与类型转换

Symbol不能自动转换为字符串或数字：

```javascript
const sym = Symbol('example');

// 错误用法
alert(sym); // TypeError: Cannot convert a Symbol value to a string
console.log(sym + ''); // TypeError: Cannot convert a Symbol value to a string
console.log(sym + 0); // TypeError: Cannot convert a Symbol value to a number

// 正确用法
alert(String(sym)); // "Symbol(example)"
console.log(sym.toString()); // "Symbol(example)"
console.log(sym.description); // "example"
```

## 浏览器兼容性

Symbol是ES6的特性，在所有现代浏览器中都得到了支持。对于旧版浏览器，可能需要使用Babel等工具进行转译或使用polyfill。

## 面试常见问题

1. **Symbol是什么？它的主要用途是什么？**
   - Symbol是ES6引入的原始数据类型，表示唯一的值
   - 主要用于创建对象的唯一属性键，避免命名冲突
   - 还用于定义对象的特殊行为（如迭代器）

2. **Symbol.for()和直接使用Symbol()有什么区别？**
   - Symbol()每次调用都创建一个新的唯一Symbol
   - Symbol.for(key)首先检查全局Symbol注册表，如果key已存在则返回对应Symbol，否则创建新的Symbol并注册

3. **如何遍历对象中的Symbol属性？**
   - 使用Object.getOwnPropertySymbols()获取所有Symbol属性
   - 使用Reflect.ownKeys()获取所有属性，包括字符串键和Symbol键

4. **Symbol能解决哪些实际开发问题？**
   - 创建私有或半私有属性
   - 防止库或框架中的属性名冲突
   - 通过内置Symbol定制对象行为（迭代器、类型转换等）
   - 创建唯一的常量值

5. **Symbol属性能被JSON.stringify()序列化吗？**
   - 不能，JSON.stringify()会忽略对象的Symbol属性
   - 如果需要序列化Symbol属性，需要自定义序列化逻辑
```