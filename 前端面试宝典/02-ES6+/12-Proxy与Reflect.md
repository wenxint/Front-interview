# Proxy与Reflect

Proxy（代理）和Reflect（反射）是ES6引入的两个强大特性，用于拦截和定制JavaScript对象的基本操作，提供了元编程（metaprogramming）的能力，使开发者能够自定义对象的行为。

## Proxy基础

### 概念

Proxy对象用于创建一个对象的代理，从而可以拦截和自定义对象的基本操作，如属性查找、赋值、枚举、函数调用等。Proxy充当了目标对象的"中间人"角色，允许你在访问对象之前进行拦截和处理。

### 基本语法

```javascript
const proxy = new Proxy(target, handler);
```

- `target`: 要代理的目标对象
- `handler`: 定义拦截行为的对象，包含各种可选的陷阱（trap）函数

### 常用陷阱（Traps）

Proxy可以拦截多种操作，每种操作对应一个陷阱函数：

#### get陷阱

拦截对象属性的读取操作：

```javascript
const person = {
  name: '张三',
  age: 30
};

const proxy = new Proxy(person, {
  get(target, property, receiver) {
    console.log(`正在获取${property}属性`);
    // target: 目标对象
    // property: 被获取的属性名
    // receiver: 代理对象或继承代理对象的对象

    // 自定义行为
    if (property === 'fullInfo') {
      return `${target.name}, ${target.age}岁`;
    }

    return target[property];
  }
});

console.log(proxy.name); // 正在获取name属性 张三
console.log(proxy.fullInfo); // 正在获取fullInfo属性 张三, 30岁
console.log(person.fullInfo); // undefined
```

#### set陷阱

拦截对象属性的设置操作：

```javascript
const person = {
  name: '张三',
  age: 30
};

const proxy = new Proxy(person, {
  set(target, property, value, receiver) {
    console.log(`正在设置${property}属性为${value}`);

    // 数据验证
    if (property === 'age') {
      if (!Number.isInteger(value)) {
        throw new TypeError('年龄必须是整数');
      }
      if (value < 0 || value > 150) {
        throw new RangeError('年龄必须在0-150之间');
      }
    }

    // 设置属性值
    target[property] = value;
    return true; // 表示设置成功
  }
});

proxy.name = '李四'; // 正在设置name属性为李四
proxy.age = 25; // 正在设置age属性为25
// proxy.age = -5; // 抛出RangeError: 年龄必须在0-150之间
// proxy.age = 'thirty'; // 抛出TypeError: 年龄必须是整数
```

#### has陷阱

拦截`in`操作符：

```javascript
const person = {
  name: '张三',
  age: 30,
  _password: '123456' // 假设这是私有属性
};

const proxy = new Proxy(person, {
  has(target, property) {
    console.log(`正在检查${property}是否存在`);

    // 隐藏以_开头的私有属性
    if (property.startsWith('_')) {
      return false;
    }

    return property in target;
  }
});

console.log('name' in proxy); // 正在检查name是否存在 true
console.log('_password' in proxy); // 正在检查_password是否存在 false
```

#### deleteProperty陷阱

拦截删除操作：

```javascript
const person = {
  name: '张三',
  age: 30,
  _password: '123456'
};

const proxy = new Proxy(person, {
  deleteProperty(target, property) {
    console.log(`正在删除${property}属性`);

    // 阻止删除以_开头的私有属性
    if (property.startsWith('_')) {
      return false;
    }

    delete target[property];
    return true;
  }
});

delete proxy.age; // 正在删除age属性
console.log(proxy.age); // undefined

delete proxy._password; // 正在删除_password属性
console.log(proxy._password); // 123456 (未被删除)
```

#### apply陷阱

拦截函数的调用：

```javascript
function sum(a, b) {
  return a + b;
}

const proxy = new Proxy(sum, {
  apply(target, thisArg, argumentsList) {
    console.log(`调用函数，参数：${argumentsList}`);

    // 参数验证
    if (argumentsList.some(arg => typeof arg !== 'number')) {
      throw new TypeError('所有参数必须是数字');
    }

    // 增强功能
    const result = target.apply(thisArg, argumentsList);
    return result * 2; // 返回计算结果的两倍
  }
});

console.log(proxy(1, 2)); // 调用函数，参数：1,2 6
// proxy(1, '2'); // 抛出TypeError: 所有参数必须是数字
```

#### construct陷阱

拦截`new`操作符：

```javascript
class Person {
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }
}

const PersonProxy = new Proxy(Person, {
  construct(target, args, newTarget) {
    console.log(`使用new操作符，参数：${args}`);

    // 参数验证
    if (args.length < 2) {
      throw new Error('必须提供name和age参数');
    }

    // 可以修改或增强构造过程
    const instance = Reflect.construct(target, args, newTarget);
    instance.createdAt = new Date();
    return instance;
  }
});

const person = new PersonProxy('张三', 30);
console.log(person.name); // 张三
console.log(person.createdAt); // 创建时间

// const invalidPerson = new PersonProxy('李四'); // 抛出Error: 必须提供name和age参数
```

### 其他常用陷阱

- `getPrototypeOf`: 拦截`Object.getPrototypeOf`
- `setPrototypeOf`: 拦截`Object.setPrototypeOf`
- `isExtensible`: 拦截`Object.isExtensible`
- `preventExtensions`: 拦截`Object.preventExtensions`
- `getOwnPropertyDescriptor`: 拦截`Object.getOwnPropertyDescriptor`
- `defineProperty`: 拦截`Object.defineProperty`
- `ownKeys`: 拦截`Object.getOwnPropertyNames`和`Object.getOwnPropertySymbols`

## Reflect基础

### 概念

Reflect是一个内置的对象，提供了用于拦截JavaScript操作的方法，这些方法与Proxy的处理程序方法相同。Reflect的所有方法都是静态的，不能通过new操作符调用，而是直接在Reflect对象上调用。

Reflect API被设计成与Proxy API对应，使Proxy更易于使用和实现。

### 基本方法

Reflect对象提供了与Proxy处理程序一一对应的静态方法：

```javascript
// 获取属性
Reflect.get(target, propertyKey[, receiver])

// 设置属性
Reflect.set(target, propertyKey, value[, receiver])

// 判断属性是否存在
Reflect.has(target, propertyKey)

// 删除属性
Reflect.deleteProperty(target, propertyKey)

// 调用函数
Reflect.apply(target, thisArgument, argumentsList)

// 构造实例
Reflect.construct(target, argumentsList[, newTarget])

// 其他方法...
```

### Reflect的使用示例

```javascript
const obj = {
  name: '张三',
  age: 30
};

// 获取属性
console.log(Reflect.get(obj, 'name')); // 张三

// 设置属性
Reflect.set(obj, 'gender', '男');
console.log(obj.gender); // 男

// 检查属性是否存在
console.log(Reflect.has(obj, 'age')); // true

// 删除属性
Reflect.deleteProperty(obj, 'gender');
console.log(obj.gender); // undefined

// 获取所有属性
console.log(Reflect.ownKeys(obj)); // ['name', 'age']

// 阻止对象扩展
Reflect.preventExtensions(obj);
console.log(Reflect.isExtensible(obj)); // false

// 通过反射调用函数
function greet(greeting) {
  return `${greeting}, ${this.name}`;
}
console.log(Reflect.apply(greet, obj, ['你好'])); // 你好, 张三
```

### Reflect与传统方法对比

Reflect提供了更加函数式的API，相比传统方法有以下优势：

```javascript
// 传统方法
'name' in obj
delete obj.name
Object.defineProperty(obj, 'name', { value: '张三' })

// Reflect方法
Reflect.has(obj, 'name')
Reflect.deleteProperty(obj, 'name')
Reflect.defineProperty(obj, 'name', { value: '张三' })
```

Reflect方法的主要优势：

1. 返回值更加合理（如`Reflect.defineProperty`返回布尔值而不是对象）
2. 操作更加函数化，便于函数式编程
3. 与Proxy API保持一致，便于组合使用

## Proxy与Reflect的结合使用

Proxy和Reflect通常结合使用，特别是在创建"透明代理"时：

```javascript
const target = {
  name: '张三',
  age: 30
};

const handler = {
  get(target, property, receiver) {
    console.log(`获取${property}属性`);
    return Reflect.get(target, property, receiver);
  },
  set(target, property, value, receiver) {
    console.log(`设置${property}属性为${value}`);
    return Reflect.set(target, property, value, receiver);
  }
};

const proxy = new Proxy(target, handler);

proxy.name = '李四'; // 设置name属性为李四
console.log(proxy.name); // 获取name属性 李四
console.log(target.name); // 获取name属性 李四
```

使用Reflect的好处：

1. 保持原始行为的同时添加新功能
2. 正确传递`this`值（`receiver`参数）
3. 处理原型链上的属性

### 2. 正确传递this值（receiver参数）示例

在继承场景中，Proxy通过Reflect传递`receiver`参数可以确保方法中的`this`指向正确的对象：

```javascript
// 父类
class Parent {
  sayHello() {
    return `Hello, ${this.name}`; // this应指向子类实例
  }
}

// 子类
class Child extends Parent {
  constructor(name) {
    super();
    this.name = name;
  }
}

// 创建子类实例
const child = new Child('小明');

// 错误场景：未使用Reflect.get传递receiver时
const badHandler = {
  get(target, prop) {
    // 直接访问目标对象的属性，未传递receiver
    return target[prop];
  }
};
const badProxy = new Proxy(child, badHandler);

// 调用原型方法时，this会指向原始对象（child实例）吗？
console.log('错误场景输出：', badProxy.sayHello()); // 输出：Hello, 小明（看似正确？）

// 但如果代理对象有同名属性覆盖
badProxy.name = '代理小明';
console.log('错误场景覆盖后输出：', badProxy.sayHello()); // 输出：Hello, 小明（未获取到代理的name）

// 正确场景：使用Reflect.get传递receiver
const handler = {
  get(target, prop, receiver) {
    // 通过Reflect.get传递receiver（代理对象）
    return Reflect.get(target, prop, receiver);
  }
};
const proxy = new Proxy(child, handler);

// 调用原型方法时，this会正确指向代理对象
proxy.name = '代理小明';
console.log('正确场景输出：', proxy.sayHello()); // 输出：Hello, 代理小明

// 关键区别：Reflect.get会将receiver作为this传递给属性访问器
// 错误场景中直接使用target[prop]，导致方法中的this指向原始对象而非代理对象
```

### 面试试题

### 1. Proxy中的this指向问题及解决方案

**问**：在使用Proxy时可能遇到什么this指向问题？如何正确解决？

**答**：
Proxy中的this指向问题主要出现在代理对象访问原型链上的方法时，如果不正确处理receiver参数，会导致方法内部的this指向原始对象而非代理对象，从而无法访问到代理对象上的属性或拦截行为。

**问题演示**：

```javascript
// 基础对象
const target = {
  name: '原始对象',
  getName() {
    return this.name; // this应该指向代理对象还是原始对象？
  }
};

// 错误的代理实现
const wrongProxy = new Proxy(target, {
  get(target, prop) {
    console.log(`访问属性: ${prop}`);
    // 直接返回目标对象的属性，未传递receiver
    return target[prop];
  },
  set(target, prop, value) {
    console.log(`设置属性: ${prop} = ${value}`);
    target[prop] = value;
    return true;
  }
});

// 设置代理对象的name属性
wrongProxy.name = '代理对象';
console.log('代理对象name:', wrongProxy.name); // 输出: 代理对象

// 调用方法时的this指向问题
console.log('错误实现结果:', wrongProxy.getName()); // 输出: 原始对象
// 问题：getName方法中的this指向了原始对象，而不是代理对象
```

**正确的解决方案**：

```javascript
// 正确的代理实现
const correctProxy = new Proxy(target, {
  get(target, prop, receiver) {
    console.log(`访问属性: ${prop}`);

    // 使用Reflect.get并传递receiver参数
    // receiver是代理对象本身，确保方法中的this指向代理对象
    return Reflect.get(target, prop, receiver);
  },
  set(target, prop, value, receiver) {
    console.log(`设置属性: ${prop} = ${value}`);

    // 使用Reflect.set并传递receiver参数
    return Reflect.set(target, prop, value, receiver);
  }
});

// 设置代理对象的name属性
correctProxy.name = '代理对象';
console.log('代理对象name:', correctProxy.name); // 输出: 代理对象

// 调用方法时this正确指向代理对象
console.log('正确实现结果:', correctProxy.getName()); // 输出: 代理对象
```

**更复杂的继承场景**：

```javascript
class Animal {
  constructor(name) {
    this.name = name;
  }

  speak() {
    return `${this.name} makes a sound`;
  }

  get info() {
    return `Animal: ${this.name}, age: ${this.age || 'unknown'}`;
  }
}

class Dog extends Animal {
  constructor(name, breed) {
    super(name);
    this.breed = breed;
  }

  speak() {
    return `${this.name} barks`;
  }
}

const dog = new Dog('旺财', '金毛');

// 创建代理以监控属性访问
const dogProxy = new Proxy(dog, {
  get(target, prop, receiver) {
    console.log(`获取属性: ${prop}`);

    // 正确传递receiver，确保原型链方法中的this指向代理对象
    return Reflect.get(target, prop, receiver);
  },
  set(target, prop, value, receiver) {
    console.log(`设置属性: ${prop} = ${value}`);

    // 数据验证
    if (prop === 'age' && value < 0) {
      throw new Error('年龄不能为负数');
    }

    return Reflect.set(target, prop, value, receiver);
  }
});

// 测试代理对象
dogProxy.age = 3;
console.log(dogProxy.speak()); // 输出: 旺财 barks
console.log(dogProxy.info); // 输出: Animal: 旺财, age: 3

// 如果不使用Reflect传递receiver，getter中的this.age将无法获取到代理设置的age值
```

**关键要点**：
1. 在get陷阱中使用`Reflect.get(target, prop, receiver)`而不是`target[prop]`
2. 在set陷阱中使用`Reflect.set(target, prop, value, receiver)`而不是`target[prop] = value`
3. receiver参数确保方法调用时this指向代理对象
4. 这对于访问器属性（getter/setter）和原型链方法特别重要

### 2. 使用Proxy实现Vue数据绑定

**问**：如何使用Proxy实现类似Vue的响应式数据绑定？

**答**：
Vue 3使用Proxy来实现响应式系统，通过拦截对象的读取和修改操作来追踪依赖和触发更新。以下是一个简化版的实现：

**基础响应式系统**：

```javascript
/**
 * @description 简化版的响应式系统实现
 */

// 当前正在执行的副作用函数
let activeEffect = null;

// 存储依赖关系的WeakMap
// 结构：target -> key -> Set<effect>
const targetMap = new WeakMap();

/**
 * 依赖收集函数
 * @param {Object} target - 目标对象
 * @param {string|symbol} key - 属性键
 */
function track(target, key) {
  if (!activeEffect) return;

  // 获取target对应的依赖映射
  let depsMap = targetMap.get(target);
  if (!depsMap) {
    depsMap = new Map();
    targetMap.set(target, depsMap);
  }

  // 获取key对应的依赖集合
  let deps = depsMap.get(key);
  if (!deps) {
    deps = new Set();
    depsMap.set(key, deps);
  }

  // 收集当前副作用函数
  deps.add(activeEffect);
}

/**
 * 触发更新函数
 * @param {Object} target - 目标对象
 * @param {string|symbol} key - 属性键
 */
function trigger(target, key) {
  const depsMap = targetMap.get(target);
  if (!depsMap) return;

  const deps = depsMap.get(key);
  if (!deps) return;

  // 执行所有相关的副作用函数
  deps.forEach(effect => effect());
}

/**
 * 创建响应式对象
 * @param {Object} target - 要转换为响应式的对象
 * @return {Proxy} 响应式代理对象
 */
function reactive(target) {
  return new Proxy(target, {
    get(target, key, receiver) {
      console.log(`读取属性: ${key}`);

      // 依赖收集
      track(target, key);

      // 使用Reflect确保正确的this指向
      return Reflect.get(target, key, receiver);
    },

    set(target, key, value, receiver) {
      console.log(`设置属性: ${key} = ${value}`);

      // 获取旧值
      const oldValue = target[key];

      // 设置新值
      const result = Reflect.set(target, key, value, receiver);

      // 如果值发生变化，触发更新
      if (oldValue !== value) {
        trigger(target, key);
      }

      return result;
    }
  });
}

/**
 * 副作用函数包装器
 * @param {Function} fn - 副作用函数
 */
function effect(fn) {
  const effectFn = () => {
    activeEffect = effectFn;
    fn(); // 执行副作用函数时会触发依赖收集
    activeEffect = null;
  };

  effectFn();
  return effectFn;
}
```

**使用示例**：

```javascript
// 创建响应式数据
const data = reactive({
  name: '张三',
  age: 25,
  address: {
    city: '北京',
    street: '长安街'
  }
});

// 创建副作用函数（类似Vue的computed或watch）
effect(() => {
  console.log(`姓名: ${data.name}, 年龄: ${data.age}`);
});
// 初始输出: 姓名: 张三, 年龄: 25

effect(() => {
  console.log(`地址: ${data.address.city}`);
});
// 初始输出: 地址: 北京

// 修改数据会自动触发相关的副作用函数
data.name = '李四';
// 输出: 姓名: 李四, 年龄: 25

data.age = 30;
// 输出: 姓名: 李四, 年龄: 30

// 注意：嵌套对象需要递归处理才能实现深度响应式
data.address.city = '上海'; // 这不会触发更新，因为address对象本身不是响应式的
```

**增强版实现（支持嵌套对象）**：

```javascript
/**
 * 增强版响应式系统，支持嵌套对象
 */
function reactiveEnhanced(target) {
  // 避免重复代理
  if (target.__isReactive) {
    return target;
  }

  return new Proxy(target, {
    get(target, key, receiver) {
      // 标记为响应式对象
      if (key === '__isReactive') {
        return true;
      }

      track(target, key);

      const result = Reflect.get(target, key, receiver);

      // 如果是对象，递归转换为响应式
      if (typeof result === 'object' && result !== null) {
        return reactiveEnhanced(result);
      }

      return result;
    },

    set(target, key, value, receiver) {
      const oldValue = target[key];
      const result = Reflect.set(target, key, value, receiver);

      if (oldValue !== value) {
        trigger(target, key);
      }

      return result;
    },

    has(target, key) {
      track(target, key);
      return Reflect.has(target, key);
    },

    deleteProperty(target, key) {
      const hadKey = Reflect.has(target, key);
      const result = Reflect.deleteProperty(target, key);

      if (hadKey && result) {
        trigger(target, key);
      }

      return result;
    }
  });
}
```

**完整的Vue风格组件示例**：

```javascript
// 简化的组件类
class Component {
  constructor(options) {
    this.data = reactiveEnhanced(options.data());
    this.render = options.render;
    this.el = document.querySelector(options.el);

    // 创建渲染副作用
    effect(() => {
      this.update();
    });
  }

  update() {
    const vdom = this.render.call(this.data);
    this.el.innerHTML = vdom;
  }
}

// 使用组件
const app = new Component({
  el: '#app',
  data() {
    return {
      count: 0,
      message: 'Hello Vue!'
    };
  },
  render() {
    return `
      <div>
        <h1>${this.message}</h1>
        <p>计数: ${this.count}</p>
        <button onclick="app.data.count++">增加</button>
      </div>
    `;
  }
});

// 数据变化会自动触发重新渲染
setTimeout(() => {
  app.data.message = 'Hello Proxy!';
  app.data.count = 10;
}, 2000);
```

**核心实现要点**：

1. **依赖收集**：在get陷阱中使用track函数收集依赖关系
2. **触发更新**：在set陷阱中使用trigger函数触发相关的副作用函数
3. **嵌套响应式**：递归处理对象属性，确保深层对象也是响应式的
4. **避免重复代理**：通过标记避免对同一对象重复创建代理
5. **性能优化**：使用WeakMap存储依赖关系，避免内存泄漏

**与Vue 2的区别**：
- Vue 2使用Object.defineProperty，只能拦截已存在的属性
- Vue 3使用Proxy，可以拦截任何属性操作，包括新增和删除
- Proxy支持数组的直接索引操作和length属性变化
- Proxy的性能在大多数场景下优于Object.defineProperty