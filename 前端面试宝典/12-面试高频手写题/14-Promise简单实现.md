# Promise简单实现

> Promise是JavaScript中处理异步操作的重要模式，它解决了回调地狱问题，提供了更优雅的异步代码编写方式。本文将详细分析一个简化版Promise实现的核心原理。

## 概念介绍

Promise是一个表示异步操作最终完成或失败的对象。它有三种状态：

- **pending**：初始状态，既不是成功也不是失败
- **fulfilled**：操作成功完成
- **rejected**：操作失败

一旦状态从pending变为fulfilled或rejected，就会凝固，不会再发生变化。Promise提供了then()方法来注册状态变化后的回调函数。

## 基本语法

```javascript
const promise = new Promise((resolve, reject) => {
  // 异步操作
  if (/* 操作成功 */) {
    resolve(value);
  } else {
    reject(reason);
  }
});

promise.then(
  value => { /* 成功回调 */ },
  reason => { /* 失败回调 */ }
);
```

## 完整代码实现

```javascript
// 自定义 Promise 类，用于模拟原生 Promise 的基本功能
class MyPromise {
  // 构造函数，接收一个执行器函数 executor
  constructor(executor) {
    // 初始状态为 pending（等待中）
    this.state = 'pending'; 
    // 成功时的值，状态变为 fulfilled 后会被赋值
    this.value = undefined; 
    // 失败时的原因，状态变为 rejected 后会被赋值
    this.reason = undefined; 
    // 用于存放 fulfilled 状态下的回调函数队列
    this.onFulfilledCallbacks = []; 
    // 用于存放 rejected 状态下的回调函数队列
    this.onRejectedCallbacks = []; 

    // 定义 resolve 函数，用于将 Promise 状态置为 fulfilled
    const resolve = (value) => {
      // 只有状态为 pending 时才能改变状态
      if (this.state === 'pending') {
        this.state = 'fulfilled'; // 更新状态为 fulfilled
        this.value = value; // 保存成功的值
        // 执行所有在 fulfilled 状态下等待的回调函数
        this.onFulfilledCallbacks.forEach(fn => fn());
      }
    };

    // 定义 reject 函数，用于将 Promise 状态置为 rejected
    const reject = (reason) => {
      // 只有状态为 pending 时才能改变状态
      if (this.state === 'pending') {
        this.state = 'rejected'; // 更新状态为 rejected
        this.reason = reason; // 保存失败的原因
        // 执行所有在 rejected 状态下等待的回调函数
        this.onRejectedCallbacks.forEach(fn => fn());
      }
    };

    try {
      // 立即执行 executor 函数，并传入 resolve 和 reject 方法
      // 注意：executor 可能是同步的，也可能抛出异常
      executor(resolve, reject);
    } catch (err) {
      // 如果 executor 执行过程中抛出错误，则捕获并调用 reject
      reject(err);
    }
  }

  // then 方法是 Promise 的核心，用于注册 fulfilled 和 rejected 状态的回调
  // 并返回一个新的 Promise，以支持链式调用
  then(onFulfilled, onRejected) {
    // 处理值穿透：如果 then 的参数不是函数，则提供一个默认函数实现值穿透
    // 比如：promise.then(123) 应该把 123 直接传递给下一个 then
    onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : value => value;
    onRejected = typeof onRejected === 'function' ? onRejected : reason => { throw reason; };

    // then 方法必须返回一个新的 Promise，以实现链式调用
    const promise2 = new MyPromise((resolve, reject) => {
      // 封装公共的回调处理逻辑，避免重复代码
      // callback: 当前状态的回调函数（onFulfilled 或 onRejected）
      // valueOrReason: 回调函数的输入，可能是 this.value 或 this.reason
      // resolve, reject: 用于控制新 Promise（promise2）的状态
      const handleCallback = (callback, valueOrReason, resolve, reject) => {
        // 使用 setTimeout 模拟异步执行（微任务，真实 Promise 是微任务，这里用 setTimeout 模拟宏任务）
        setTimeout(() => {
          try {
            // 执行用户传入的回调函数，并得到返回值 x
            const x = callback(valueOrReason);
            // 尝试 resolve 新的 Promise（这里简化处理，真实情况需要处理 thenable 和 promise）
            resolve(x);
          } catch (err) {
            // 如果回调执行出错，则 reject 新的 Promise
            reject(err);
          }
        }, 0);
      };

      // 如果当前 Promise 的状态已经是 fulfilled
      if (this.state === 'fulfilled') {
        // 异步执行 onFulfilled 回调，并处理返回值和新的 Promise
        handleCallback(onFulfilled, this.value, resolve, reject);
      } 
      // 如果当前 Promise 的状态已经是 rejected
      else if (this.state === 'rejected') {
        // 异步执行 onRejected 回调，并处理返回值和新的 Promise
        handleCallback(onRejected, this.reason, resolve, reject);
      } 
      // 如果当前 Promise 的状态还是 pending（即 executor 是异步的，还未调用 resolve/reject）
      else if (this.state === 'pending') {
        // 将 onFulfilled 回调推入队列，等状态变成 fulfilled 后再执行
        this.onFulfilledCallbacks.push(() => {
          handleCallback(onFulfilled, this.value, resolve, reject);
        });
        // 将 onRejected 回调推入队列，等状态变成 rejected 后再执行
        this.onRejectedCallbacks.push(() => {
          handleCallback(onRejected, this.reason, resolve, reject);
        });
      }
    });

    // then 方法必须返回一个新的 Promise 对象
    return promise2;
  }
}
```

## 核心特性分析

### 1. 状态不可逆性

Promise的状态一旦从pending变为fulfilled或rejected，就再也不能改变。这是通过在resolve和reject方法中先检查状态实现的：

```javascript
if (this.state === 'pending') {
  // 只有状态为pending时才能修改状态
  this.state = 'fulfilled';
  // ...
}
```

### 2. 异步执行机制

虽然原生Promise使用的是微任务队列，但这个简化实现使用setTimeout模拟异步，将回调函数放入宏任务队列。这就是为什么即使Promise立即resolve，then中的回调也会异步执行。

### 3. 链式调用

then方法返回一个新的Promise实例，使得我们可以进行链式调用：

```javascript
new MyPromise((resolve) => {
  resolve(1);
})
.then(value => value + 1)
.then(value => console.log(value)); // 输出: 2
```

### 4. 错误冒泡

如果在then方法中发生错误，会被catch捕获并传递给下一个Promise的rejected状态：

```javascript
new MyPromise((resolve, reject) => {
  reject(new Error('出错了'));
})
.then(null, reason => { throw reason; }) // 显式抛出错误
.then(
  () => {},
  reason => console.log(reason.message) // 捕获错误: "出错了"
);
```

## 实战案例

### 基本使用示例

```javascript
// 创建Promise实例
const promise = new MyPromise((resolve, reject) => {
  console.log('执行executor');
  setTimeout(() => {
    if (Math.random() > 0.5) {
      resolve('操作成功');
    } else {
      reject(new Error('操作失败'));
    }
  }, 1000);
});

// 注册回调
promise.then(
  value => console.log('成功:', value),
  reason => console.log('失败:', reason.message)
);

console.log('Promise已创建');

// 执行顺序:
// 1. "执行executor"
// 2. "Promise已创建"
// 3. 1秒后输出: "成功: 操作成功" 或 "失败: 操作失败"
```

### 链式调用示例

#### 基础链式调用

以下示例展示了基本的Promise链式调用，包含异步resolve和值传递机制：

```javascript
const p = new MyPromise((resolve, reject) => {
  setTimeout(() => {
    resolve("成功！"); // 2秒后resolve
  }, 2000);
});

p.then(
  (value) => {
    console.log(value); // 输出: "成功！"
    return "新的值"; // 返回新值，传递给下一个then
  },
  (reason) => {
    console.error(reason); // 不会执行
  }
).then((value) => {
  console.log(value); // 输出: "新的值"（链式调用）
});
```

## 执行过程分析

#### 代码执行流程图

```
创建Promise实例p
├─ 执行executor函数
│  └─ 调用setTimeout，设置2秒后执行resolve
├─ 调用p.then()，注册成功/失败回调
│  └─ Promise状态为pending，回调函数进入onFulfilledCallbacks队列
│     └─ onFulfilledCallbacks = [第一个then的成功回调包装函数]
└─ 2秒后
   ├─ setTimeout回调执行
   │  └─ 调用resolve("成功！")
   │     ├─ p状态变为fulfilled
   │     ├─ p.value = "成功！"
   │     └─ 遍历执行onFulfilledCallbacks队列中的所有回调
   ├─ 执行第一个then()的成功回调
   │  ├─ 打印"成功！"
   │  ├─ 返回"新的值"
   │  └─ 创建新的Promise实例p2
   │     └─ resolve("新的值")
   │        ├─ p2状态变为fulfilled
   │        ├─ p2.value = "新的值"
   │        └─ p2的onFulfilledCallbacks队列初始化
   └─ 触发p2的onFulfilledCallbacks队列
      └─ 执行第二个then()的成功回调
         └─ 打印"新的值"
```

#### 详细执行步骤

1. **创建Promise实例**

   - 立即执行executor函数
   - 调用`setTimeout`，设置2秒后执行resolve函数
   - Promise实例p初始状态为`pending`
   - `p.onFulfilledCallbacks = []`（初始化成功回调队列）
2. **注册回调函数**

   - 调用`then()`方法，传入成功和失败回调
   - 由于p状态为`pending`，成功回调被包装并添加到`p.onFulfilledCallbacks`队列
   - 此时`p.onFulfilledCallbacks = [包装后的成功回调函数]`
   - `then()`方法返回一个新的Promise实例p2
   - `p2.onFulfilledCallbacks = []`（初始化p2的成功回调队列）
3. **异步操作完成**

   - 2秒后，`setTimeout`回调执行
   - 调用`resolve("成功！")`，将p的状态改为`fulfilled`并设置value
   - 遍历`p.onFulfilledCallbacks`队列，执行所有回调函数
   - 执行完毕后`p.onFulfilledCallbacks`队列变为空
4. **执行第一个then()回调**

   - 接收p的结果值"成功！"并打印
   - 返回"新的值"，创建新的Promise实例p2
   - 调用resolve("新的值")，将p2状态改为`fulfilled`
   - `p2.value = "新的值"`
   - 遍历`p2.onFulfilledCallbacks`队列，执行所有回调函数
5. **执行第二个then()回调**

   - 接收p2的结果值"新的值"并打印
   - 完成整个链式调用流程

#### 关键执行时序


| 时间点   | 事件                  | 状态变化      | 数据传递             | onFulfilledCallbacks状态          |
| -------- | --------------------- | ------------- | -------------------- | --------------------------------- |
| 0ms      | 创建Promise实例p      | p: pending    | -                    | p: []                             |
| 0ms      | 调用p.then()          | p: pending    | 回调函数入队         | p: [包装后的成功回调]             |
| 2000ms   | 执行resolve("成功！") | p: fulfilled  | p.value = "成功！"   | p: [包装后的成功回调]（即将执行） |
| 2000ms+  | 执行第一个then回调    | p2: fulfilled | p2.value = "新的值"  | p: []（已执行完毕），p2: []       |
| 2000ms++ | 执行第二个then回调    | p3: fulfilled | p3.value = undefined | p2: []（已执行完毕）              |

### 错误处理示例

```javascript
new MyPromise((resolve, reject) => {
  reject(new Error('原始错误'));
})
.then(
  value => console.log('成功:', value),
  // 处理第一个错误
  reason => {
    console.log('第一个错误:', reason.message);
    throw new Error('第二个错误'); // 抛出新错误
  }
)
.then(
  () => {},
  reason => {
    console.log('第二个错误:', reason.message);
    return '错误已处理'; // 返回成功值
  }
)
.then(value => {
  console.log('恢复成功:', value); // 输出: "恢复成功: 错误已处理"
});
```

## 与原生Promise的差异

这个简化实现与原生Promise有几个主要区别：

1. **微任务vs宏任务**：原生Promise使用微任务队列，而此实现使用setTimeout模拟（宏任务）
2. **缺少静态方法**：没有实现Promise.resolve、Promise.reject、Promise.all等静态方法
3. **缺少catch方法**：原生Promise有单独的catch方法用于错误处理
4. **未实现Promise决议过程**：完整的Promise实现需要处理返回Promise的情况
5. **错误处理**：原生Promise对未处理的拒绝有更完善的错误提示

## 面试常见问题

### Q1: Promise的三种状态是什么？它们之间如何转换？

A1: Promise有三种状态：pending（初始状态）、fulfilled（成功状态）和rejected（失败状态）。状态转换规则：

- pending -> fulfilled: 当调用resolve()时
- pending -> rejected: 当调用reject()时
- 一旦状态变为fulfilled或rejected，就不能再改变

### Q2: 为什么Promise能解决回调地狱问题？

A2: Promise通过以下机制解决回调地狱：

1. 链式调用：then方法返回新的Promise实例，可以链式调用
2. 错误冒泡：错误会沿着链式传递，只需在末尾处理一次错误
3. 代码扁平化：相比嵌套回调，链式调用使代码结构更扁平

### Q3: Promise.then()的返回值是什么？为什么？

A3: then()方法返回一个全新的Promise实例。这是为了实现链式调用，每个then都可以基于前一个Promise的结果进行操作。新Promise的状态由then回调函数的返回值决定：

- 如果返回普通值，新Promise变为fulfilled状态
- 如果返回Promise，新Promise会等待该Promise决议
- 如果抛出错误，新Promise变为rejected状态

### Q4: Promise的异步性体现在哪里？

A4: Promise的异步性主要体现在then方法的回调函数会被异步执行，即使Promise立即resolve：

```javascript
console.log('start');
new Promise(resolve => {
  console.log('executor');
  resolve();
}).then(() => {
  console.log('then回调');
});
console.log('end');

// 输出顺序:
// start
// executor
// end
// then回调
```

这是因为.then()中的回调函数会被放入任务队列，等待主线程空闲时执行。

### Q5: 如何实现Promise.all()方法？

A5: Promise.all()接收一个Promise数组，当所有Promise都成功时返回结果数组，有一个失败则立即返回失败原因：

```javascript
MyPromise.all = function(promises) {
  return new MyPromise((resolve, reject) => {
    if (!Array.isArray(promises)) {
      return reject(new TypeError('参数必须是数组'));
    }

    const results = [];
    let completed = 0;

    if (promises.length === 0) {
      return resolve(results);
    }

    promises.forEach((promise, index) => {
      // 确保每个元素都是Promise
      MyPromise.resolve(promise).then(
        value => {
          results[index] = value;
          completed++;

          if (completed === promises.length) {
            resolve(results);
          }
        },
        reason => reject(reason) // 有一个失败则整体失败
      );
    });
  });
};
```

## 总结

这个简化版Promise实现虽然不如原生Promise完整，但已经包含了核心功能：状态管理、异步回调、链式调用和错误处理。通过分析这个实现，我们可以深入理解Promise的工作原理，包括状态转换机制、异步执行模型和链式调用实现。

在实际开发中，我们应该使用原生Promise或成熟的Promise库，它们提供了更完善的功能和更好的错误处理机制。但理解Promise的实现原理，对于编写高质量的异步代码和应对面试都非常有帮助。
