# 箭头函数this指向专题测试卷

## 一、选择题（共8题，每题5分）

### 1. 以下关于箭头函数和普通函数中this的描述，正确的是（ ）

A. 箭头函数中的this指向定义时的外层作用域
B. 普通函数中的this指向调用时的上下文
C. 箭头函数中的this可以通过call()、apply()、bind()改变
D. 普通函数中的this永远指向window对象

**答案：AB**
**解析**：箭头函数没有自己的this，它的this指向定义时的外层作用域；普通函数的this指向调用时的上下文；箭头函数的this不能通过call()、apply()、bind()改变；普通函数在全局作用域中调用时this指向window，但在其他情况下可能指向其他对象。

### 2. 以下代码执行后输出的结果是（ ）

```javascript
const obj = {
  name: 'obj',
  func1: function() {
    console.log(this.name);
  },
  func2: () => {
    console.log(this.name);
  }
  func3:function(){
  const innerArrow = () => {
            console.log(this); // `this` 继承自 `func3` 的 `this`（即 `obj`）
        };
        innerArrow();
 }

};

global.name = 'global';
obj.func1();
obj.func2();
```

A. obj, obj
B. obj, global
C. global, obj
D. global, global

**答案：B**
**解析**：func1是普通函数，调用时this指向obj；func2是箭头函数，定义时外层作用域是全局作用域，所以this指向global。

### 3. 以下代码执行后输出的结果是（ ）

```javascript
const obj = {
  name: 'obj',
  func: function() {
    const innerFunc = () => {
      console.log(this.name);
    };
    innerFunc();
  }
};

obj.func();
```

A. obj
B. undefined
C. window
D. 抛出错误

**答案：A**
**解析**：innerFunc是箭头函数，定义时外层作用域是func函数的作用域，而func函数调用时this指向obj，所以innerFunc的this也指向obj。

### 4. 以下哪种情况下，箭头函数的this不会指向全局对象（ ）

A. 在全局作用域中定义的箭头函数
B. 在普通函数中定义的箭头函数，且该普通函数作为对象的方法调用
C. 在构造函数中定义的箭头函数
D. 在定时器回调中使用的箭头函数

**答案：B**
**解析**：在普通函数中定义的箭头函数，其this指向普通函数的this，当普通函数作为对象的方法调用时，this指向该对象，而不是全局对象。

### 5. 以下代码执行后输出的结果是（ ）

```javascript
function Person() {
  this.age = 0;
  setInterval(() => {
    this.age++;
    console.log(this.age);
  }, 1000);
}

const p = new Person();
```

A. 每隔1秒输出递增的数字，从1开始
B. 每隔1秒输出0
C. 报错，因为this未定义
D. 输出undefined

**答案：A**
**解析**：setInterval的回调函数是箭头函数，它的this指向定义时的外层作用域，即Person构造函数的实例对象p，所以this.age++会正确递增p对象的age属性。

### 6. 以下代码执行后输出的结果是（ ）

```javascript
const obj = {
  name: 'obj',
  func: () => {
    console.log(this.name);
  }
};

const newObj = {
  name: 'newObj'
};

obj.func.call(newObj);
```

A. obj
B. newObj
C. undefined
D. window（浏览器环境）或global（Node环境）

**答案：D**
**解析**：箭头函数的this不能通过call()方法改变，它始终指向定义时的外层作用域，这里是全局作用域，所以输出window.name或global.name，通常是undefined，但如果全局作用域中有name属性，则输出该属性值。

### 7. 以下关于箭头函数的说法，错误的是（ ）

A. 箭头函数不能作为构造函数使用
B. 箭头函数没有自己的arguments对象
C. 箭头函数可以使用yield关键字
D. 箭头函数不绑定this

**答案：C**
**解析**：箭头函数不能作为生成器函数，不能使用yield关键字；其他选项均正确。

### 8. 以下代码执行后输出的结果是（ ）

```javascript
const obj = {
  name: 'obj',
  func: function() {
    return () => {
      console.log(this.name);
    };
  }
};

const newObj = {
  name: 'newObj'
};

const arrowFunc = obj.func();
arrowFunc.call(newObj);
```

A. obj
B. newObj
C. undefined
D. window

**答案：A**
**解析**：obj.func()返回一个箭头函数，该箭头函数定义时的外层作用域是func函数的作用域，而func函数调用时this指向obj，所以箭头函数的this也指向obj，且不能通过call()方法改变。

## 二、判断题（共5题，每题4分）

### 9. 箭头函数中的this指向调用时的上下文。（ ）

**答案：×**
**解析**：箭头函数中的this指向定义时的外层作用域，而不是调用时的上下文。

### 10. 箭头函数可以作为构造函数使用。（ ）

**答案：×**
**解析**：箭头函数没有自己的this，不能作为构造函数使用，使用new关键字调用箭头函数会抛出错误。

### 11. 在对象方法中使用箭头函数，this指向该对象。（ ）

**答案：×**
**解析**：在对象方法中使用箭头函数，this指向定义时的外层作用域，通常是全局对象，而不是该对象。

### 12. 箭头函数的this不能通过call()、apply()、bind()方法改变。（ ）

**答案：√**
**解析**：箭头函数的this在定义时就已经确定，不能通过call()、apply()、bind()方法改变。

### 13. 在事件监听器中使用箭头函数，this指向触发事件的元素。（ ）

**答案：×**
**解析**：在事件监听器中使用箭头函数，this指向定义时的外层作用域，而不是触发事件的元素。如果要获取触发事件的元素，可以使用event.target。

## 三、代码分析题（共2题，每题10分）

### 14. 分析以下代码，写出执行结果并解释原因。

```javascript
const obj = {
  name: 'obj',
  func1: function() {
    console.log('func1:', this.name);
    const func2 = () => {
      console.log('func2:', this.name);
    };
    func2();
  },
  func3: () => {
    console.log('func3:', this.name);
    const func4 = function() {
      console.log('func4:', this.name);
    };
    func4();
  }
};

global.name = 'global';
obj.func1();
obj.func3();
```

**答案**：

```
func1: obj
func2: obj
func3: global
func4: global
```

**解析**：

- func1是普通函数，调用时this指向obj，所以输出'func1: obj'；
- func2是箭头函数，定义时外层作用域是func1函数的作用域，this指向obj，所以输出'func2: obj'；
- func3是箭头函数，定义时外层作用域是全局作用域，this指向global，所以输出'func3: global'；
- func4是普通函数，在全局作用域中调用（因为func3是箭头函数，其内部的this指向global，而func4作为普通函数直接调用时this指向global），所以输出'func4: global'。

### 15. 分析以下代码，写出执行结果并解释原因。

```javascript
function Person(name) {
  this.name = name;
  this.func1 = function() {
    console.log('func1:', this.name);
  };
  this.func2 = () => {
    console.log('func2:', this.name);
  };
}

const p1 = new Person('p1');
const p2 = {
  name: 'p2'
};

p1.func1.call(p2);
p1.func2.call(p2);
```

**答案**：

```
func1: p2
func2: p1
```

**解析**：

- func1是普通函数，通过call()方法调用时this指向p2，所以输出'func1: p2'；
- func2是箭头函数，定义时外层作用域是Person构造函数的作用域，this指向p1，且不能通过call()方法改变，所以输出'func2: p1'。

### 16. 分析以下代码，写出执行结果并解释原因。

```javascript
const obj = {
  name: 'obj',
  func1: function() {
    console.log('func1:', this.name);
    const func2 = () => {
      console.log('func2:', this.name);
      const func3 = () => {
        console.log('func3:', this.name);
      };
      func3();
    };
    func2();
  }
};

global.name = 'global';
obj.func1();
```

**答案**：

```
func1: obj
func2: obj
func3: obj
```

**解析**：

- func1是普通函数，调用时this指向obj，所以输出'func1: obj'；
- func2是箭头函数，定义时外层作用域是func1函数的作用域，this指向obj，所以输出'func2: obj'；
- func3是箭头函数，定义时外层作用域是func2箭头函数的作用域，而箭头函数的this继承自外层作用域，所以this仍然指向obj，输出'func3: obj'。

### 17. 分析以下代码，写出执行结果并解释原因。

```javascript
const button = {
  text: 'Click me',
  addEventListener: function() {
    // 模拟事件监听
    const callback = () => {
      console.log('Button text:', this.text);
    };
    // 模拟点击事件触发
    setTimeout(callback, 100);
  }
};

global.text = 'global';
button.addEventListener();
```

**答案**：

```
Button text: Click me
```

**解析**：

- addEventListener是普通函数，调用时this指向button对象，所以其内部的callback箭头函数定义时外层作用域的this指向button；
- 虽然callback是在setTimeout中执行的，但作为箭头函数，它的this不会改变，仍然指向button对象，所以输出'Button text: Click me'。

### 18. 分析以下代码，写出执行结果并解释原因。

```javascript
function Timer() {
  this.seconds = 0;
  setInterval(() => {
    this.seconds++;
    console.log('Seconds:', this.seconds);
  }, 1000);
}

const timer = new Timer();
// 等待3秒后查看结果
setTimeout(() => {
  console.log('Final seconds:', timer.seconds);
}, 3500);
```

**答案**：

```
Seconds: 1
Seconds: 2
Seconds: 3
Final seconds: 3
```

**解析**：

- Timer是构造函数，通过new调用时，this指向新创建的timer对象；
- setInterval的回调函数是箭头函数，定义时外层作用域是Timer构造函数的作用域，this指向timer对象；
- 因此，每次回调执行时，都会正确地递增timer对象的seconds属性；
- 3秒后，timer.seconds的值为3，所以输出'Final seconds: 3'。
