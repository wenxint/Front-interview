# Class类

Class是ES6引入的语法糖，它提供了一种更清晰、更面向对象的方式来创建和使用JavaScript中的构造函数和原型继承。虽然它的底层实现仍然基于原型链，但其语法更接近传统的面向对象编程，使代码更易读易维护。

## 基本语法

```javascript
class Person {
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }

  sayHello() {
    console.log(`你好，我是${this.name}，今年${this.age}岁。`);
  }
}

const person = new Person('张三', 25);
person.sayHello(); // 输出: 你好，我是张三，今年25岁。
```

## Class与构造函数对比

在ES6之前，我们使用构造函数创建类：

```javascript
// ES5构造函数写法
function Person(name, age) {
  this.name = name;
  this.age = age;
}

Person.prototype.sayHello = function() {
  console.log(`你好，我是${this.name}，今年${this.age}岁。`);
};

var person = new Person('张三', 25);
person.sayHello(); // 输出: 你好，我是张三，今年25岁。
```

ES6的Class提供了更简洁明了的语法，但其底层实现与构造函数是相同的。

## 构造函数

构造函数`constructor`是类的默认方法，通过`new`命令创建对象实例时自动调用该方法。一个类必须有`constructor`方法，如果没有显式定义，JavaScript会自动添加一个空的`constructor`方法。

```javascript
class Person {
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }
}

// 等同于
class Person {
}

// JavaScript会默认添加
class Person {
  constructor() {}
}
```

## 实例属性和方法

### 实例属性

实例属性可以在构造函数中定义，也可以在类体中直接定义（ES2022新特性）：

```javascript
// 构造函数中定义实例属性
class Person {
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }
}

// 类体中直接定义实例属性（ES2022）
class Person {
  name = '';
  age = 0;

  constructor(name, age) {
    this.name = name;
    this.age = age;
  }
}
```

### 实例方法

实例方法定义在类的原型对象上，所有实例共享同一个方法：

```javascript
class Person {
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }

  // 实例方法
  sayHello() {
    console.log(`你好，我是${this.name}，今年${this.age}岁。`);
  }

  getInfo() {
    return {
      name: this.name,
      age: this.age
    };
  }
}
```

## 静态方法与静态属性

### 静态方法

静态方法使用`static`关键字定义，这些方法不会被实例继承，而是直接通过类来调用：

注意

1. \*\*`static` 方法中的 `this` = 类本身\*\*（构造函数）。

```javascript
class Person {
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }

  // 静态方法
  static create(name, age) {
    return new Person(name, age);
  }

  static isAdult(age) {
    return age >= 18;
  }
}

const person = Person.create('张三', 25);
console.log(Person.isAdult(25)); // true
```

### 静态属性

静态属性是类本身的属性，不需要实例化：

```javascript
// ES2022前的写法
class Person {
  // ... 其他代码
}
Person.MAX_AGE = 120;

// ES2022的写法
class Person {
  static MAX_AGE = 120;
  static MIN_AGE = 0;

  // ... 其他代码
}

console.log(Person.MAX_AGE); // 120
```

## 类的继承

ES6使用`extends`关键字实现继承，比ES5通过修改原型链实现继承更加清晰：

```javascript
class Animal {
  constructor(name) {
    this.name = name;
  }

  speak() {
    console.log(`${this.name}发出声音`);
  }
}

class Dog extends Animal {
  constructor(name, breed) {
    // 调用父类构造函数
    super(name);
    this.breed = breed;
  }

  speak() {
    // 调用父类方法
    super.speak();
    console.log(`${this.name}汪汪叫`);
  }

  fetch() {
    console.log(`${this.name}去捡球`);
  }
}

const dog = new Dog('旺财', '金毛');
dog.speak();
// 输出:
// 旺财发出声音
// 旺财汪汪叫

dog.fetch(); // 输出: 旺财去捡球
```

### super关键字

`super`关键字有两种用法：

1. 作为函数调用时，代表父类的构造函数。
2. 作为对象时，指向父类的原型对象。

```javascript
class A {
  constructor() {
    this.x = 1;
  }

  print() {
    console.log(this.x);
  }
}

class B extends A {
  constructor() {
    super(); // 调用父类的constructor()
    this.x = 2;
    super.x = 3; // 给父类原型对象上的x赋值（无效操作）
    console.log(super.x); // undefined，父类原型上没有x属性
  }

  print() {
    super.print(); // 调用父类的print()方法
  }
}

let b = new B();
b.print(); // 2
```

注意：在子类构造函数中，必须先调用`super()`，然后才能使用`this`关键字，否则会报错。

## 私有字段与方法

### 私有字段

ES2022引入了真正的私有字段，使用`#`前缀声明，只能在类内部访问：

```javascript
class Person {
  // 私有字段声明
  #name;
  #age;

  constructor(name, age) {
    this.#name = name;
    this.#age = age;
  }

  getInfo() {
    return {
      name: this.#name,
      age: this.#age
    };
  }

  #privateMethod() {
    return `${this.#name}的私有方法`;
  }

  publicMethod() {
    // 内部可以调用私有方法
    return this.#privateMethod();
  }
}

const person = new Person('张三', 25);
console.log(person.getInfo()); // { name: '张三', age: 25 }

// 错误：无法访问私有字段或方法
// console.log(person.#name); // SyntaxError
// console.log(person.#privateMethod()); // SyntaxError
```

## Getter和Setter

类可以定义getter和setter方法来控制属性的读取和赋值行为：

```javascript
class Person {
  constructor(firstName, lastName) {
    this.firstName = firstName;
    this.lastName = lastName;
  }

  // getter
  get fullName() {
    return `${this.firstName} ${this.lastName}`;
  }

  // setter
  set fullName(name) {
    const parts = name.split(' ');
    this.firstName = parts[0];
    this.lastName = parts[1];
  }
}

const person = new Person('张', '三');
console.log(person.fullName); // 输出: 张 三

person.fullName = '李 四';
console.log(person.firstName); // 输出: 李
console.log(person.lastName); // 输出: 四
```

## 类表达式

类也可以使用表达式的形式定义：

```javascript
// 匿名类表达式
const Person = class {
  constructor(name) {
    this.name = name;
  }

  sayName() {
    console.log(this.name);
  }
};

// 命名类表达式
const Person = class PersonClass {
  constructor(name) {
    this.name = name;
  }
};

// 立即调用的类表达式
const person = new (class {
  constructor(name) {
    this.name = name;
  }

  getName() {
    return this.name;
  }
})('张三');

console.log(person.getName()); // 输出: 张三
```

## 实际应用场景

### 组件封装

在前端框架中封装组件：

```javascript
class Carousel {
  #slides = [];
  #currentIndex = 0;

  constructor(container, slides) {
    this.container = document.querySelector(container);
    this.#slides = slides;
    this.#init();
  }

  #init() {
    this.#render();
    this.#bindEvents();
  }

  #render() {
    // 渲染轮播图
  }

  #bindEvents() {
    // 绑定事件
  }

  next() {
    // 下一张
  }

  prev() {
    // 上一张
  }
}

// 使用
const carousel = new Carousel('#container', ['image1.jpg', 'image2.jpg']);
```

### 数据管理

创建数据模型：

```javascript
class UserModel {
  #apiUrl = 'https://api.example.com/users';

  async getUsers() {
    try {
      const response = await fetch(this.#apiUrl);
      return await response.json();
    } catch (error) {
      console.error('获取用户失败:', error);
      throw error;
    }
  }

  async getUserById(id) {
    try {
      const response = await fetch(`${this.#apiUrl}/${id}`);
      return await response.json();
    } catch (error) {
      console.error(`获取用户 ${id} 失败:`, error);
      throw error;
    }
  }
}

const userModel = new UserModel();
userModel.getUsers().then(users => console.log(users));
```

### 单例模式实现

```javascript
class Singleton {
  static #instance;

  constructor() {
    if (Singleton.#instance) {
      return Singleton.#instance;
    }

    this.timestamp = Date.now();
    Singleton.#instance = this;
  }

  getData() {
    return {
      timestamp: this.timestamp
    };
  }

  static getInstance() {
    if (!Singleton.#instance) {
      Singleton.#instance = new Singleton();
    }
    return Singleton.#instance;
  }
}

const instance1 = new Singleton();
const instance2 = new Singleton();

console.log(instance1 === instance2); // true
console.log(instance1.getData()); // { timestamp: 1632402345678 }
```

## 浏览器兼容性

现代浏览器基本都已支持ES6的Class语法，但私有字段等特性是ES2022的规范，可能需要使用Babel等工具进行转译以兼容旧版浏览器。

## 面试常见问题

1. **Class与构造函数的区别是什么？**

   - Class是ES6引入的语法糖，底层仍基于原型
   - Class不会提升，而函数声明会被提升
   - Class中的代码自动运行在严格模式下
   - Class内部的方法不可枚举
   - 必须使用new调用Class，不能作为普通函数调用
2. **为什么在子类构造函数中必须先调用super()?**

   - 子类的this对象是通过父类的构造函数创建的，必须先调用super()来创建this对象，然后再通过this添加新属性
3. **私有字段有什么应用场景？**

   - 封装内部实现细节，防止外部直接访问和修改
   - 避免属性名冲突
   - 提高代码的安全性和可维护性
4. **如何实现类的混入(Mixin)模式？**

   ```javascript
   // 定义混入对象
   const CanEat = {
     eat() {
       console.log('吃东西');
     }
   };

   const CanSleep = {
     sleep() {
       console.log('睡觉');
     }
   };

   // 使用混入
   class Person {
     constructor(name) {
       this.name = name;
     }
   }

   // 将混入对象的方法复制到Person.prototype
   Object.assign(Person.prototype, CanEat, CanSleep);

   const person = new Person('张三');
   person.eat(); // 吃东西
   person.sleep(); // 睡觉
   ```
5. **如何确保一个类的方法不会被子类覆盖？**

   - 可以使用私有方法或Symbol定义方法名：

   ```javascript
   const _privateMethod = Symbol('privateMethod');

   class Parent {
     [_privateMethod]() {
       console.log('私有方法');
     }

     publicMethod() {
       this[_privateMethod]();
     }
   }
   ```

```

```
