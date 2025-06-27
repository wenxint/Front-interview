# Set与Map数据结构

## 1. Set基础

Set是ES6引入的新的数据结构，类似于数组，但成员的值都是唯一的，没有重复的值。

### 1.1 Set的创建与基本用法

```javascript
// 创建一个空Set
const s = new Set();

// 创建时传入可迭代对象
const s1 = new Set([1, 2, 3, 4, 4, 5]); // Set(5) {1, 2, 3, 4, 5}

// 使用字符串创建
const s2 = new Set('hello'); // Set(4) {"h", "e", "l", "o"}
```

### 1.2 Set的常用方法和属性

```javascript
const mySet = new Set();

// 添加元素
mySet.add(1);
mySet.add(5);
mySet.add('text');
mySet.add({a: 1, b: 2});

// 检查元素是否存在
console.log(mySet.has(1)); // true
console.log(mySet.has(3)); // false

// 删除元素
mySet.delete(5);

// 获取Set大小
console.log(mySet.size); // 3

// 清空Set
mySet.clear();
console.log(mySet.size); // 0
```

### 1.3 Set的遍历

```javascript
const mySet = new Set([1, 2, 3, 4, 5]);

// for...of循环
for (const item of mySet) {
  console.log(item);
}

// forEach方法
mySet.forEach((value, key, set) => {
  console.log(value); // key和value是相同的
});

// 通过keys()、values()和entries()方法遍历
// 注意：keys()和values()方法返回的是相同的值
for (const key of mySet.keys()) {
  console.log(key);
}

for (const value of mySet.values()) {
  console.log(value);
}

for (const [key, value] of mySet.entries()) {
  console.log(key, value); // key和value是相同的
}
```

### 1.4 Set的应用场景

#### 数组去重

```javascript
const arr = [1, 2, 3, 3, 4, 4, 5];
const uniqueArr = [...new Set(arr)]; // [1, 2, 3, 4, 5]
```

#### 字符串去重

```javascript
const str = "aabbcc";
const uniqueStr = [...new Set(str)].join(''); // "abc"
```

#### 并集、交集和差集

```javascript
const a = new Set([1, 2, 3]);
const b = new Set([2, 3, 4]);

// 并集
const union = new Set([...a, ...b]); // Set(4) {1, 2, 3, 4}

// 交集
const intersection = new Set([...a].filter(x => b.has(x))); // Set(2) {2, 3}

// 差集 (a - b)
const difference = new Set([...a].filter(x => !b.has(x))); // Set(1) {1}
```

## 2. WeakSet

WeakSet与Set类似，但有以下区别：
1. WeakSet的成员只能是对象，不能是其他类型的值
2. WeakSet中的对象都是弱引用，不计入垃圾回收机制的引用计数
3. WeakSet不可遍历，没有size属性和forEach方法

### 2.1 WeakSet的基本用法

```javascript
const ws = new WeakSet();
const obj1 = {};
const obj2 = {};

// 添加对象
ws.add(obj1);
ws.add(obj2);

// 检查对象是否存在
console.log(ws.has(obj1)); // true

// 删除对象
ws.delete(obj1);
console.log(ws.has(obj1)); // false
```

### 2.2 WeakSet的应用场景

#### 存储DOM节点

```javascript
const disabledElements = new WeakSet();
const btn = document.getElementById('btn');

// 标记按钮为禁用状态
disabledElements.add(btn);

// 检查按钮是否被禁用
if (disabledElements.has(btn)) {
  console.log('按钮已禁用');
}
```

#### 确保实例方法只能在实例上调用

```javascript
const foos = new WeakSet();

class Foo {
  constructor() {
    foos.add(this);
  }

  method() {
    if (!foos.has(this)) {
      throw new TypeError('该方法只能在Foo实例上调用');
    }
    return 'Foo方法被调用';
  }
}

const foo = new Foo();
console.log(foo.method()); // Foo方法被调用

// 以下会抛出错误
const method = foo.method;
// method(); // TypeError: 该方法只能在Foo实例上调用
```

## 3. Map基础

Map是ES6提供的新的数据结构，类似于对象，但键的范围不限于字符串，各种类型的值（包括对象）都可以当作键。

### 3.1 Map的创建与基本用法

```javascript
// 创建一个空Map
const m = new Map();

// 创建时传入键值对数组
const m1 = new Map([
  ['name', '张三'],
  ['age', 25]
]);
console.log(m1.get('name')); // 张三

// 使用对象作为键
const obj = { id: 1 };
const m2 = new Map();
m2.set(obj, '一个对象');
console.log(m2.get(obj)); // 一个对象
```

### 3.2 Map的常用方法和属性

```javascript
const myMap = new Map();

// 添加键值对
myMap.set('key1', 'value1');
myMap.set(1, 'number value');
myMap.set(true, 'boolean value');
myMap.set({name: 'obj'}, 'object value');

// 获取值
console.log(myMap.get('key1')); // value1
console.log(myMap.get(1)); // number value

// 检查键是否存在
console.log(myMap.has('key1')); // true
console.log(myMap.has('key2')); // false

// 删除键值对
myMap.delete('key1');
console.log(myMap.has('key1')); // false

// 获取Map大小
console.log(myMap.size); // 3

// 清空Map
myMap.clear();
console.log(myMap.size); // 0
```

### 3.3 Map的遍历

```javascript
const myMap = new Map([
  ['name', '张三'],
  ['age', 25],
  ['city', '北京']
]);

// for...of循环
for (const [key, value] of myMap) {
  console.log(key, value);
}

// forEach方法
myMap.forEach((value, key, map) => {
  console.log(key, value);
});

// 通过keys()、values()和entries()方法遍历
for (const key of myMap.keys()) {
  console.log(key);
}

for (const value of myMap.values()) {
  console.log(value);
}

for (const [key, value] of myMap.entries()) {
  console.log(key, value);
}
```

### 3.4 Map与对象的转换

```javascript
// Map转对象
function mapToObject(map) {
  const obj = {};
  for (const [key, value] of map) {
    // 只有字符串和Symbol可以作为对象的键
    if (typeof key === 'string' || typeof key === 'symbol') {
      obj[key] = value;
    }
  }
  return obj;
}

// 对象转Map
function objectToMap(obj) {
  return new Map(Object.entries(obj));
}

const obj = { name: '张三', age: 25 };
const map = objectToMap(obj);
console.log(map); // Map(2) {"name" => "张三", "age" => 25}

const newObj = mapToObject(map);
console.log(newObj); // {name: "张三", age: 25}
```

### 3.5 Map的应用场景

#### 缓存函数结果

```javascript
function memoize(fn) {
  const cache = new Map();
  return function(...args) {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      return cache.get(key);
    }
    const result = fn.apply(this, args);
    cache.set(key, result);
    return result;
  };
}

// 使用示例
const fibonacci = memoize(function(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
});

console.log(fibonacci(40)); // 计算快速，因为中间结果被缓存
```

#### 存储DOM节点与相关数据

```javascript
const nodeData = new Map();

document.querySelectorAll('div').forEach(div => {
  nodeData.set(div, {
    clickCount: 0,
    content: div.textContent
  });
});

document.addEventListener('click', function(event) {
  if (event.target.tagName === 'DIV') {
    const data = nodeData.get(event.target);
    if (data) {
      data.clickCount++;
      console.log(`该DIV被点击了${data.clickCount}次`);
    }
  }
});
```

## 4. WeakMap

WeakMap与Map类似，但有以下区别：
1. WeakMap只接受对象作为键名（null除外）
2. WeakMap的键名所指向的对象不计入垃圾回收机制的引用计数
3. WeakMap不可遍历，没有size属性和forEach方法

### 4.1 WeakMap的基本用法

```javascript
const wm = new WeakMap();
const obj1 = {};
const obj2 = {};

// 添加键值对
wm.set(obj1, '值1');
wm.set(obj2, '值2');

// 获取值
console.log(wm.get(obj1)); // 值1

// 检查键是否存在
console.log(wm.has(obj1)); // true

// 删除键值对
wm.delete(obj1);
console.log(wm.has(obj1)); // false
```

### 4.2 WeakMap的应用场景

#### 在DOM元素上存储私有数据

```javascript
const privateData = new WeakMap();

function processElement(element) {
  let data = privateData.get(element);
  if (!data) {
    data = { counter: 0 };
    privateData.set(element, data);
  }
  data.counter++;
  return data.counter;
}

// 使用示例
const div = document.createElement('div');
console.log(processElement(div)); // 1
console.log(processElement(div)); // 2
```

#### 实现私有属性和方法

```javascript
const privateProperties = new WeakMap();

class MyClass {
  constructor() {
    privateProperties.set(this, {
      privateValue: 42
    });
  }

  getPrivateValue() {
    return privateProperties.get(this).privateValue;
  }

  setPrivateValue(value) {
    privateProperties.get(this).privateValue = value;
  }
}

const instance = new MyClass();
console.log(instance.getPrivateValue()); // 42
instance.setPrivateValue(100);
console.log(instance.getPrivateValue()); // 100
```

## 5. Set、Map、WeakSet、WeakMap的性能比较

数据结构的选择应该基于具体的使用场景和性能需求：

| 数据结构 | 键类型 | 值类型 | 键引用 | 可迭代 | 适用场景 |
|---------|-------|-------|-------|-------|---------|
| Object  | 字符串/Symbol | 任何值 | 强引用 | 是 | 简单的键值存储，键为字符串 |
| Map     | 任何值 | 任何值 | 强引用 | 是 | 需要非字符串键，或需要保持插入顺序 |
| Set     | N/A   | 任何值 | 强引用 | 是 | 需要唯一值集合，高效的成员检查 |
| WeakMap | 对象   | 任何值 | 弱引用 | 否 | 将数据关联到对象而不阻止GC回收对象 |
| WeakSet | N/A   | 对象   | 弱引用 | 否 | 存储对象引用而不阻止GC回收对象 |

### 性能考虑因素

1. **查找效率**：Map和Set的查找操作（has、get）时间复杂度为O(1)，与Array的indexOf（O(n)）相比有显著优势

2. **内存使用**：WeakMap和WeakSet允许键被垃圾回收，适合关联临时对象的数据

3. **遍历顺序**：Map保持插入顺序，Object在ES2015+中通常也保持插入顺序（但不保证）

## 6. 面试常见问题

### 6.1 Set与数组的区别

- Set中的值是唯一的，数组中的值可以重复
- Set有has方法直接判断值是否存在，数组需要使用indexOf或includes
- 数组是有序结构，可以通过索引访问，Set是无序结构
- Set的遍历顺序是插入顺序

### 6.2 Map与Object的区别

- Map的键可以是任何类型，Object的键只能是字符串或Symbol
- Map会保留键的插入顺序，Object在ES2015+也基本保持插入顺序但不保证
- Map设计用于频繁添加/删除键值对的场景，性能更好
- Map可以直接迭代，Object需要先获取键数组

### 6.3 WeakSet/WeakMap的应用场景

- 存储DOM元素：当元素从DOM中移除时，对应的数据会自动被垃圾回收
- 实现私有属性/方法：将私有数据关联到实例而不阻止实例被回收
- 缓存计算结果：可以缓存计算结果而不阻止输入对象被回收
- 关联临时数据：将元数据关联到对象而不影响对象的生命周期

### 6.4 如何检测Map中是否存在循环引用？

```javascript
function hasCircularReference(map) {
  // 创建一个新的Set来存储已经访问过的对象
  const visited = new Set();

  function detect(value) {
    // 如果值不是对象或null，就不会有循环引用
    if (value === null || typeof value !== 'object') {
      return false;
    }

    // 如果这个对象已经访问过，说明存在循环引用
    if (visited.has(value)) {
      return true;
    }

    // 将当前对象标记为已访问
    visited.add(value);

    // 检查对象的所有属性
    for (const key in value) {
      if (detect(value[key])) {
        return true;
      }
    }

    return false;
  }

  // 检查Map中的所有值
  for (const [key, value] of map) {
    // 检查键是否指向值
    if (key === value) {
      return true;
    }

    // 检查值本身是否有循环引用
    if (detect(value)) {
      return true;
    }
  }

  return false;
}

// 使用示例
const map = new Map();
const obj = { name: '循环引用示例' };
obj.self = obj; // 创建循环引用
map.set('key', obj);

console.log(hasCircularReference(map)); // true
```

## 7. 实战案例

### 7.1 使用Set实现任务去重队列

```javascript
class TaskQueue {
  constructor() {
    this.tasks = new Set();
  }

  /**
   * 添加任务到队列，如果任务已存在则不添加
   * @param {Function} task 任务函数
   * @return {boolean} 是否成功添加
   */
  addTask(task) {
    if (this.tasks.has(task)) {
      return false;
    }
    this.tasks.add(task);
    return true;
  }

  /**
   * 执行所有任务并清空队列
   */
  async runTasks() {
    const promises = [];
    for (const task of this.tasks) {
      promises.push(Promise.resolve().then(() => task()));
    }
    this.tasks.clear();
    return Promise.all(promises);
  }
}

// 使用示例
const queue = new TaskQueue();

function task1() {
  console.log('执行任务1');
  return 'task1 result';
}

function task2() {
  console.log('执行任务2');
  return 'task2 result';
}

queue.addTask(task1);
queue.addTask(task2);
queue.addTask(task1); // 重复任务不会被添加

queue.runTasks().then(results => {
  console.log('所有任务结果:', results);
});
```

### 7.2 使用Map实现LRU缓存

LRU (Least Recently Used) 缓存是一种常用的缓存策略，当缓存达到容量上限时，会优先删除最久未使用的项。

```javascript
class LRUCache {
  constructor(capacity) {
    this.capacity = capacity;
    this.cache = new Map();
  }

  /**
   * 获取缓存中的值，如果存在则将其移到最近使用的位置
   * @param {any} key 键
   * @return {any} 值，如果不存在则返回-1
   */
  get(key) {
    if (!this.cache.has(key)) {
      return -1;
    }

    // 将访问的键值对删除并重新添加，使其成为最近使用的
    const value = this.cache.get(key);
    this.cache.delete(key);
    this.cache.set(key, value);

    return value;
  }

  /**
   * 设置缓存，如果键已存在则更新值，否则添加新键值对
   * 如果缓存达到容量上限，删除最久未使用的项
   * @param {any} key 键
   * @param {any} value 值
   */
  put(key, value) {
    // 如果键已存在，先删除
    if (this.cache.has(key)) {
      this.cache.delete(key);
    }
    // 如果缓存已满，删除最久未使用的项（Map的第一个项）
    else if (this.cache.size >= this.capacity) {
      // 获取并删除Map中的第一个键（最久未使用的）
      const oldestKey = this.cache.keys().next().value;
      this.cache.delete(oldestKey);
    }

    // 添加新项到缓存末尾（最近使用的位置）
    this.cache.set(key, value);
  }
}

// 使用示例
const cache = new LRUCache(2);

cache.put(1, 1); // 缓存是 {1=1}
cache.put(2, 2); // 缓存是 {1=1, 2=2}
console.log(cache.get(1)); // 返回 1，缓存变为 {2=2, 1=1}
cache.put(3, 3); // 缓存已满，删除最久未使用的键2，缓存变为 {1=1, 3=3}
console.log(cache.get(2)); // 返回 -1（未找到）
cache.put(4, 4); // 缓存已满，删除最久未使用的键1，缓存变为 {3=3, 4=4}
console.log(cache.get(1)); // 返回 -1（未找到）
console.log(cache.get(3)); // 返回 3，缓存变为 {4=4, 3=3}
console.log(cache.get(4)); // 返回 4，缓存变为 {3=3, 4=4}
```

## 8. 总结

ES6+ 引入的Set、Map、WeakSet和WeakMap这四种数据结构极大丰富了JavaScript的数据处理能力：

1. **Set** 提供了高效的值唯一性检查和基本集合操作（并集、交集、差集）
2. **Map** 扩展了键值存储的能力，使任何类型都可以作为键
3. **WeakSet** 和 **WeakMap** 通过弱引用提供了内存友好的对象引用存储方案

这些数据结构的合理使用可以：
- 提高代码的性能和可读性
- 简化复杂数据的管理
- 避免内存泄漏
- 提供更优雅的API设计方案

在实际开发中，应根据具体需求选择合适的数据结构，充分利用它们各自的优势。