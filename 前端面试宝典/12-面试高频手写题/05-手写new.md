# 手写new

## 概念介绍

`new` 操作符用于创建一个用户定义的对象类型的实例或具有构造函数的内置对象的实例。其核心作用是：创建一个新对象，将构造函数的`this`指向该对象，执行构造函数并绑定原型链，最后返回该对象（若构造函数无返回值）。

## 基本语法

原生`new`的使用：

```javascript
function Person(name) {
  this.name = name;
}
const person = new Person('Alice');
console.log(person.name); // 输出: Alice
```

## 核心特性

- 创建一个空对象，继承构造函数的原型。
- 将构造函数的`this`指向新对象，并执行构造函数。
- 若构造函数返回对象，则返回该对象；否则返回新创建的对象。

## 实战案例

手写`new`的实现：

```javascript
/**
 * @description 模拟new操作符的实现
 * @param {Function} constructor - 构造函数
 * @param {...any} args - 构造函数的参数
 * @returns {Object} 新创建的实例对象（或构造函数返回的对象）
 */
function myNew(constructor, ...args) {
    // 1. 创建一个空对象，并继承构造函数的原型
    const obj = Object.create(constructor.prototype);

    // 2. 执行构造函数，绑定this为新对象，并传递参数
    const result = constructor.apply(obj, args);

    // 3. 处理返回值：如果构造函数返回对象，则返回该对象；否则返回新创建的对象
    return typeof result === 'object' && result !== null ? result : obj;
}

// 测试用例1：构造函数无显式返回
function Person(name) {
    this.name = name;
}
const person = myNew(Person, 'Alice');
console.log(person.name); // 输出: Alice
console.log(person instanceof Person); // 输出: true

// 测试用例2：构造函数返回对象
function Car(brand) {
    this.brand = brand;
    return { color: 'red' };
}
const car = myNew(Car, 'BMW');
console.log(car.brand); // 输出: undefined（返回的是构造函数的对象）
console.log(car.color); // 输出: red

// 测试用例3：构造函数返回基本类型
function Animal(type) {
    this.type = type;
    return 'dog';
}
const animal = myNew(Animal, 'mammal');
console.log(animal.type); // 输出: 'mammal'（返回新创建的实例）
console.log(animal instanceof Animal); // 输出: true
```


## 面试常见问题

### 1. `new`操作符的执行过程是怎样的？

`new`操作符的执行过程可以分为以下几个步骤：

1. **创建新对象**：在内存中创建一个空的对象。
2. **原型链绑定**：将新对象的`[[Prototype]]`（原型）指向构造函数的`prototype`属性，从而继承构造函数的原型方法。
3. **执行构造函数**：将构造函数的`this`指向新对象，并传递参数执行构造函数，为新对象添加属性和方法。
4. **处理返回值**：如果构造函数返回一个对象，则`new`操作符返回该对象；否则返回新创建的对象。

### 2. 手写`new`操作符时需要注意哪些关键点？

手写`new`时需要注意以下核心点：

- **原型继承**：必须通过`Object.create(constructor.prototype)`来正确设置新对象的原型，确保实例能访问构造函数原型上的方法。
- **`this`绑定**：使用`apply`或`call`将构造函数的`this`指向新对象，确保构造函数中的属性正确添加到新对象上。
- **返回值处理**：构造函数可能返回对象（如返回另一个对象），此时应返回该对象而非新创建的对象；若返回基本类型，则忽略返回值，仍返回新对象。

### 3. 如果构造函数返回了一个对象，`new`操作符会如何处理？

当构造函数返回一个对象时，`new`操作符会返回该对象，而不是新创建的实例。例如：

```javascript
function Person(name) {
  this.name = name;
  // 构造函数返回一个新对象
  return { age: 20 };
}

const person = new Person('Alice');
console.log(person.name); // 输出: undefined（因为返回的是{ age: 20 }）
console.log(person.age);  // 输出: 20
```

若构造函数返回基本类型（如字符串、数值、布尔值），则`new`操作符会忽略返回值，仍返回新创建的实例：

```javascript
function Animal(type) {
  this.type = type;
  return 'dog'; // 返回基本类型
}

const animal = new Animal('mammal');
console.log(animal.type); // 输出: 'mammal'（返回新创建的实例）
```

## 兼容性说明

`new` 是ES3引入的特性，所有现代浏览器及IE6+均支持，无需额外兼容处理。

## 面试常见问题

### 1. `new` 操作符的执行过程是怎样的？

**答案**：步骤包括：创建空对象、设置原型链、执行构造函数绑定`this`、处理返回值（若构造函数返回对象则返回该对象，否则返回新对象）。

### 2. 手写`new` 操作符需要注意哪些点？

**答案**：需要正确继承原型链（使用`Object.create`）、处理构造函数的返回值（区分对象和基本类型）、正确传递参数。

### 3. 如果构造函数返回`null`，`new` 会返回什么？

**答案**：返回新创建的对象，因为`null`是基本类型，不属于对象类型。
