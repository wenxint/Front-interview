# 手写Promise

## 概念介绍

Promise 是 JavaScript 中用于处理异步操作的对象，它代表了一个尚未完成但最终会完成的操作，并且可以获取其结果。Promise 有三种状态：pending（进行中）、fulfilled（已成功）和 rejected（已失败）。一旦状态改变，就不会再变，状态只能从 pending 变为 fulfilled 或者从 pending 变为 rejected。

## 基本语法

原生 Promise 的基本使用如下：
```javascript
const promise = new Promise((resolve, reject) => {
  // 异步操作
  setTimeout(() => {
    const success = true;
    if (success) {
      resolve('操作成功');
    } else {
      reject('操作失败');
    }
  }, 1000);
});

promise.then((result) => {
  console.log(result);
}).catch((error) => {
  console.error(error);
});
```

## 核心特性

### 链式调用
Promise 可以通过 `.then()` 方法进行链式调用，每个 `.then()` 方法都会返回一个新的 Promise 对象，从而实现异步操作的顺序执行。

### 错误处理
可以使用 `.catch()` 方法捕获 Promise 链中的错误，也可以在 `.then()` 方法的第二个参数中处理错误。

## 实战案例

以下是一个手写 Promise 的实现：
```javascript
class MyPromise {
  /**
   * 自定义Promise构造函数
   * @param {Function} executor - 执行器函数（立即执行），参数为resolve和reject
   */
  constructor(executor) {
    this.state = 'pending';    // Promise状态：pending（进行中）、fulfilled（已成功）、rejected（已失败）
    this.value = undefined;    // 成功时保存的返回值
    this.reason = undefined;   // 失败时保存的错误原因
    this.onResolvedCallbacks = [];  // 保存成功回调的数组（处理异步情况）
    this.onRejectedCallbacks = [];  // 保存失败回调的数组（处理异步情况）

    /**
     * 成功时的状态变更函数
     * @param {*} value - 成功时传递的值
     */
    const resolve = (value) => {
      if (this.state === 'pending') {  // 仅当状态为pending时可变更
        this.state = 'fulfilled';       // 变更为成功状态
        this.value = value;             // 保存成功值
        this.onResolvedCallbacks.forEach((fn) => fn());  // 执行所有成功回调
      }
    };

    /**
     * 失败时的状态变更函数
     * @param {*} reason - 失败时传递的错误原因
     */
    const reject = (reason) => {
      if (this.state === 'pending') {  // 仅当状态为pending时可变更
        this.state = 'rejected';        // 变更为失败状态
        this.reason = reason;           // 保存错误原因
        this.onRejectedCallbacks.forEach((fn) => fn());  // 执行所有失败回调
      }
    };

    try {
      executor(resolve, reject);  // 立即执行执行器函数
    } catch (error) {
      reject(error);  // 执行器内部出错时直接拒绝
    }
  }

  /**
   * 注册成功/失败回调
   * @param {Function} onFulfilled - 成功回调（可选）
   * @param {Function} onRejected - 失败回调（可选）
   * @returns {MyPromise} 新的Promise实例（实现链式调用）
   */
  then(onFulfilled, onRejected) {
    // 处理非函数参数：成功回调默认透传值，失败回调默认抛错误
    onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : (value) => value;
    onRejected = typeof onRejected === 'function' ? onRejected : (reason) => { throw reason; };

    const newPromise = new MyPromise((resolve, reject) => {
      /** 处理成功回调的执行逻辑 */
      const handleFulfilled = () => {
        try {
          const x = onFulfilled(this.value);  // 执行成功回调获取返回值
          resolvePromise(newPromise, x, resolve, reject);  // 解析返回值以决定新Promise状态
        } catch (error) {
          reject(error);  // 回调执行出错时拒绝新Promise
        }
      };

      /** 处理失败回调的执行逻辑 */
      const handleRejected = () => {
        try {
          const x = onRejected(this.reason);  // 执行失败回调获取返回值
          resolvePromise(newPromise, x, resolve, reject);  // 解析返回值以决定新Promise状态
        } catch (error) {
          reject(error);  // 回调执行出错时拒绝新Promise
        }
      };

      // 根据当前状态立即执行或存储回调
      if (this.state === 'fulfilled') {
        setTimeout(handleFulfilled, 0);  // 异步执行保证微任务顺序（模拟原生Promise）
      } else if (this.state === 'rejected') {
        setTimeout(handleRejected, 0);  // 异步执行保证微任务顺序（模拟原生Promise）
      } else if (this.state === 'pending') {
        // 状态未确定时存储回调（处理异步操作）
        this.onResolvedCallbacks.push(() => setTimeout(handleFulfilled, 0));
        this.onRejectedCallbacks.push(() => setTimeout(handleRejected, 0));
      }
    });

    return newPromise;
  }

  /**
   * 注册失败回调（语法糖）
   * @param {Function} onRejected - 失败回调
   * @returns {MyPromise} 新的Promise实例
   */
  catch(onRejected) {
    return this.then(null, onRejected);  // 复用then方法，仅传递失败回调
  }

  /**
   * 静态方法：创建一个已解决的Promise
   * @param {*} value - 要解决的值（若为Promise则直接返回）
   * @returns {MyPromise} 已解决的Promise实例
   */
  static resolve(value) {
    return new MyPromise((resolve) => {
      resolve(value);  // 立即执行resolve
    });
  }

  /**
   * 静态方法：创建一个已拒绝的Promise
   * @param {*} reason - 拒绝的原因
   * @returns {MyPromise} 已拒绝的Promise实例
   */
  static reject(reason) {
    return new MyPromise((_, reject) => {
      reject(reason);  // 立即执行reject
    });
  }
}

/**
 * 解析Promise回调的返回值，确保链式调用的正确性
 * @param {MyPromise} promise - 新的Promise实例（当前then返回的Promise）
 * @param {*} x - 回调函数的返回值
 * @param {Function} resolve - 新Promise的resolve函数
 * @param {Function} reject - 新Promise的reject函数
 */
function resolvePromise(promise, x, resolve, reject) {
  // 防止循环引用（如return this）
  if (promise === x) {
    return reject(new TypeError('Chaining cycle detected for promise'));
  }

  // 若x是MyPromise实例，递归解析其状态
  if (x instanceof MyPromise) {
    x.then((value) => resolvePromise(promise, value, resolve, reject), reject);
  } else if (x !== null && (typeof x === 'object' || typeof x === 'function')) {
    // 处理thenable对象（具有then方法的对象/函数）
    try {
      const then = x.then;
      if (typeof then === 'function') {
        let called = false;  // 防止多次调用resolve/reject
        then.call(
          x,
          (y) => {
            if (called) return;
            called = true;
          },
          (r) => {
            if (called) return;
            called = true;
            reject(r);
          }
        );
      } else {
        resolve(x);  // x是对象/函数但无then方法，直接resolve
      }
    } catch (error) {
      if (called) return;
      reject(error);  // 获取then方法出错时拒绝
    }
  } else {
    resolve(x);  // x是普通值，直接resolve
  }
}
```

### 调用示例

#### 1. 基本使用（异步场景）
```javascript
// 创建手写Promise实例
const asyncPromise = new MyPromise((resolve, reject) => {
  setTimeout(() => {
    const success = true;
    if (success) {
      resolve('异步操作成功');
    } else {
      reject('异步操作失败');
    }
  }, 1000);
});

// 注册回调
asyncPromise
  .then((result) => console.log('成功:', result))
  .catch((error) => console.error('失败:', error));
```
**执行结果**（1秒后输出）：
```
成功: 异步操作成功
```

#### 2. 链式调用（同步场景）
```javascript
const syncPromise = new MyPromise((resolve) => {
  resolve('初始值');
});

// 链式调用处理同步值
syncPromise
  .then((value) => `${value} -> 第一次处理`)
  .then((value) => `${value} -> 第二次处理`)
  .then((value) => console.log('最终结果:', value));
```
**执行结果**（立即输出）：
```
最终结果: 初始值 -> 第一次处理 -> 第二次处理
```

#### 3. 错误处理
```javascript
const errorPromise = new MyPromise((resolve, reject) => {
  reject('故意抛出的错误');
});

// 使用catch捕获错误
errorPromise
  .then((value) => console.log('不会执行:', value))
  .catch((error) => console.error('捕获错误:', error));
```
**执行结果**（立即输出）：
```
捕获错误: 故意抛出的错误
```

#### 4. 混合异步+链式调用
```javascript
new MyPromise((resolve) => {
  setTimeout(() => resolve('异步数据'), 1000);
})
  .then((data) => `${data} -> 加工后`)
  .then((processed) => console.log('最终输出:', processed));
```
**执行结果**（1秒后输出）：
```
最终输出: 异步数据 -> 加工后
```

以上示例验证了手写Promise的核心功能：异步处理、链式调用、错误捕获以及同步/异步场景的兼容性。            resolvePromise(promise, y, resolve, reject);  // 递归解析y
          },
          (r) => {
            if (called) return;
            called = true;
            reject(r);  // 直接拒绝
          }
        );
      } else {
        resolve(x);  // 普通对象/函数（无then方法）直接resolve
      }
    } catch (error) {
      if (called) return;
      called = true;
      reject(error);  // 取then方法出错时拒绝
    }
  } else {
    resolve(x);  // 普通值（非对象/函数）直接resolve
  }
}
```

## 兼容性说明

Promise 是 ES6 引入的特性，现代浏览器基本都支持，但在一些旧版本的浏览器（如 IE）中不支持。可以使用 Babel 等工具进行转译，或者引入第三方库（如 bluebird）来提供兼容支持。

## 面试常见问题

### 1. 什么是 Promise 的状态机？
**答案**：Promise 有三种状态：pending（进行中）、fulfilled（已成功）和 rejected（已失败）。状态只能从 pending 变为 fulfilled 或者从 pending 变为 rejected，一旦状态改变，就不会再变。

### 2. 如何实现 Promise 的链式调用？
**答案**：每个 `.then()` 方法都会返回一个新的 Promise 对象，通过这种方式可以实现链式调用。在 `.then()` 方法中，根据前一个 Promise 的状态执行相应的回调函数，并将结果传递给下一个 Promise。

### 3. 如何处理 Promise 链中的错误？
**答案**：可以使用 `.catch()` 方法捕获 Promise 链中的错误，也可以在 `.then()` 方法的第二个参数中处理错误。错误会沿着 Promise 链向后传递，直到遇到第一个 `.catch()` 方法。