# 全局This (globalThis)

全局This (globalThis) 是ECMAScript 2020 (ES11) 引入的一个特性，它提供了一个标准的方式来访问全局对象，无论当前的执行环境是什么。在引入 globalThis 之前，JavaScript 开发者需要根据不同的环境使用不同的方式来获取全局对象，而 globalThis 统一了这一过程，使代码更加简洁和可移植。

## 全局对象的历史问题

在 JavaScript 中，访问全局对象的方式因执行环境而异，这导致了跨环境编写一致代码的困难：

- 在浏览器中，全局对象是 `window` 或 `self`（在 Web Workers 中）或 `frames`
- 在 Node.js 中，全局对象是 `global`
- 在 Web Workers 中，全局对象是 `self`
- 在某些运行时（例如一些特定的嵌入式环境）可能使用其他名称

这种不一致性使得开发者不得不编写额外的检测代码来获取全局对象：

```javascript
// 在ES2020之前，获取全局对象的常见方法
const getGlobalObject = function() {
  if (typeof globalThis !== 'undefined') return globalThis;
  if (typeof self !== 'undefined') return self;
  if (typeof window !== 'undefined') return window;
  if (typeof global !== 'undefined') return global;
  throw new Error('无法找到全局对象');
};

const globalObj = getGlobalObject();
```

## globalThis 的引入

ES2020 引入 globalThis 旨在解决上述问题，为所有环境提供一个统一的、标准化的全局对象引用。无论代码在何处运行，`globalThis` 始终指向全局对象：

```javascript
// 使用 globalThis 统一访问全局对象
console.log(globalThis); // 在任何环境中都能访问全局对象
```

## 各环境中 globalThis 的等价物

为了更好地理解 globalThis，下面展示了它在不同环境中的等价物：

### 浏览器环境

在浏览器中，globalThis 等同于 window 对象（在常规浏览器上下文中）：

```javascript
// 在浏览器中
console.log(globalThis === window); // true
```

### Web Workers 中

在 Web Workers 中，globalThis 等同于 self 对象：

```javascript
// 在 Web Worker 中
console.log(globalThis === self); // true
```

### Node.js 环境

在 Node.js 中，globalThis 等同于 global 对象：

```javascript
// 在 Node.js 中
console.log(globalThis === global); // true
```

## globalThis 的使用场景

### 1. 跨环境代码

globalThis 最大的优势是允许编写能够在不同 JavaScript 环境中一致运行的代码，而无需环境检测：

```javascript
// 在任何环境中添加全局变量
globalThis.myGlobalVar = 'Hello, world!';

// 在任何环境中都可以访问
console.log(globalThis.myGlobalVar); // "Hello, world!"
```

### 2. 库和框架开发

对于库和框架开发者，globalThis 简化了代码兼容性处理：

```javascript
// 库代码示例
(function(global) {
  // 库的逻辑...
  global.MyLibrary = {
    version: '1.0.0',
    doSomething() {
      return 'Something done!';
    }
  };
})(globalThis);

// 然后在任何环境中使用
console.log(MyLibrary.version); // "1.0.0"
```

### 3. 特性检测

globalThis 也常用于安全地进行特性检测：

```javascript
// 检查环境是否支持 Fetch API
if (globalThis.fetch) {
  // 使用 fetch
} else {
  // 使用备选方案，例如 XMLHttpRequest
}

// 检查是否在浏览器环境中
const isBrowser = typeof globalThis.document !== 'undefined';
```

### 4. 模块系统兼容性

在处理不同模块系统时，globalThis 有助于实现统一的全局引用：

```javascript
// 在模块化系统中导出对象
(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD
    define(['dependency'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS
    module.exports = factory(require('dependency'));
  } else {
    // 浏览器全局变量
    root.MyModule = factory(root.Dependency);
  }
})(globalThis, function(Dependency) {
  // 模块代码...
  return {
    // 模块导出...
  };
});
```

## globalThis 与其他全局访问方式的比较

下面比较了 globalThis 与其他常见的全局对象访问方式：

### 与 this 在顶层上下文中的区别

在非严格模式的脚本顶层，this 通常指向全局对象。但在严格模式或模块中，情况有所不同：

```javascript
// 非严格模式下的常规脚本
console.log(this === window); // 在浏览器中为 true

// 严格模式或模块中
'use strict';
console.log(this === undefined); // true，严格模式下顶层 this 为 undefined
console.log(globalThis === window); // 在浏览器中仍为 true
```

### 与 self 和 window 的区别

self 和 window 仅在浏览器和 Web Workers 中有定义，而在其他环境（如 Node.js）中不存在：

```javascript
// 浏览器中
console.log(self === window); // true
console.log(globalThis === window); // true

// Node.js 中
// console.log(self); // ReferenceError: self is not defined
// console.log(window); // ReferenceError: window is not defined
console.log(globalThis === global); // true
```

### 与全局变量的区别

全局变量会成为全局对象的属性，但访问方式和行为有所不同：

```javascript
// 定义全局变量
var myGlobalVar = 'Global Variable';

// 使用 globalThis 访问
console.log(globalThis.myGlobalVar); // "Global Variable"

// 但对于 let 和 const 定义的变量，情况有所不同
let myLetVar = 'Let Variable';
console.log(globalThis.myLetVar); // undefined，因为 let 不会添加到全局对象上
```

## globalThis 的实现原理

globalThis 的内部实现根据不同的 JavaScript 引擎和环境有所不同，但基本原理是提供对现有全局对象的别名。以下是一个近似的模拟实现：

```javascript
// 这只是一个模拟实现，用于解释原理
(function() {
  // 获取真正的全局对象的技巧
  function getGlobalObject() {
    // 通过间接调用 Function 构造函数来获取全局对象
    return Function('return this')();
  }

  // 获取当前执行环境的全局对象
  const global = getGlobalObject();

  // 如果 globalThis 尚未定义，则将其定义为全局对象
  if (typeof global.globalThis === 'undefined') {
    // 在支持 Object.defineProperty 的环境中
    if (Object.defineProperty) {
      Object.defineProperty(global, 'globalThis', {
        configurable: true,
        enumerable: false,
        value: global,
        writable: true
      });
    } else {
      // 在不支持 Object.defineProperty 的环境中直接赋值
      global.globalThis = global;
    }
  }
})();

// 现在可以在任何地方使用 globalThis
```

## 浏览器兼容性

globalThis 是 ES2020 的特性，在所有现代浏览器中都得到了支持，但在旧浏览器中可能需要 polyfill：

- Chrome: 71+
- Firefox: 65+
- Safari: 12.1+
- Edge: 79+
- Node.js: 12.0.0+

对于不支持 globalThis 的环境，可以使用以下 polyfill：

```javascript
// globalThis polyfill
(function() {
  if (typeof globalThis === 'undefined') {
    Object.defineProperty(Object.prototype, '__magic__', {
      get: function() {
        return this;
      },
      configurable: true
    });

    // 取得实际的全局对象
    __magic__.globalThis = __magic__;

    // 删除临时属性
    delete Object.prototype.__magic__;
  }
})();
```

## 安全性考虑

使用 globalThis 需要注意一些安全问题：

### 全局命名空间污染

向 globalThis 添加属性等同于污染全局命名空间，可能导致命名冲突：

```javascript
// 不推荐的做法
globalThis.commonName = 'My Value';

// 更好的做法是使用命名空间对象
globalThis.myNamespace = globalThis.myNamespace || {};
myNamespace.commonName = 'My Value';
```

### 原型链污染

通过操作 globalThis 可能导致原型链污染：

```javascript
// 危险的代码
globalThis.Object.prototype.maliciousMethod = function() {
  // 恶意代码...
};

// 现在所有对象都有这个方法
const obj = {};
obj.maliciousMethod(); // 这可能导致安全问题
```

### 跨域和CSP限制

在浏览器环境中，globalThis 仍然受到同源策略和内容安全策略（CSP）的限制：

```javascript
// 在受限的环境中
try {
  // 这可能会因为 CSP 限制而失败
  globalThis.eval('console.log("Eval executed")');
} catch (e) {
  console.error('CSP 阻止了 eval 的执行:', e);
}
```

## 最佳实践

在使用 globalThis 时，以下是一些最佳实践：

### 1. 避免过度使用全局变量

尽管 globalThis 提供了便捷的全局访问，但应该避免过度依赖全局变量：

```javascript
// 不推荐
globalThis.counter = 0;

// 推荐
// 使用模块化方式管理状态
import { counter } from './counter.js';
```

### 2. 使用命名空间避免冲突

如果必须使用全局变量，应创建命名空间以避免冲突：

```javascript
// 创建命名空间
globalThis.MyApp = globalThis.MyApp || {};
MyApp.Utils = MyApp.Utils || {};

// 在命名空间中添加功能
MyApp.Utils.formatDate = function(date) {
  // 格式化日期的代码...
};
```

### 3. 用于特性检测而非数据存储

将 globalThis 主要用于特性检测，而非数据存储：

```javascript
// 推荐用法：特性检测
if (globalThis.IntersectionObserver) {
  // 使用 IntersectionObserver
} else {
  // 提供降级方案
}

// 不推荐用法：数据存储
globalThis.appData = { users: [] }; // 应避免这种做法
```

### 4. 谨慎处理敏感信息

避免将敏感信息存储在 globalThis 中：

```javascript
// 不推荐
globalThis.userCredentials = { username: 'user', password: 'pass' };

// 推荐使用更安全的存储机制，如闭包
const getUserCredentials = (function() {
  const credentials = { username: 'user', password: 'pass' };
  return function() {
    return {...credentials}; // 返回副本
  };
})();
```

## 应用场景示例

### 跨环境日志工具

使用 globalThis 创建一个在任何 JavaScript 环境中都能工作的日志工具：

```javascript
// 定义全局的日志工具
(function(global) {
  const Logger = {
    levels: {
      DEBUG: 0,
      INFO: 1,
      WARN: 2,
      ERROR: 3
    },
    currentLevel: 1, // 默认为 INFO 级别

    debug(...args) {
      if (this.currentLevel <= this.levels.DEBUG) {
        console.debug('[DEBUG]', ...args);
      }
    },

    info(...args) {
      if (this.currentLevel <= this.levels.INFO) {
        console.info('[INFO]', ...args);
      }
    },

    warn(...args) {
      if (this.currentLevel <= this.levels.WARN) {
        console.warn('[WARN]', ...args);
      }
    },

    error(...args) {
      if (this.currentLevel <= this.levels.ERROR) {
        console.error('[ERROR]', ...args);
      }
    },

    setLevel(level) {
      this.currentLevel = this.levels[level] || this.currentLevel;
    }
  };

  // 将日志工具添加到全局对象
  global.Logger = Logger;
})(globalThis);

// 在任何环境中使用
Logger.setLevel('DEBUG');
Logger.debug('这是一条调试消息');
Logger.info('这是一条信息消息');
Logger.warn('这是一条警告消息');
Logger.error('这是一条错误消息');
```

### 环境检测工具

创建一个使用 globalThis 检测当前运行环境的工具：

```javascript
const Environment = {
  isBrowser: typeof globalThis.document !== 'undefined',
  isNode: typeof globalThis.process !== 'undefined' &&
          typeof globalThis.process.versions !== 'undefined' &&
          typeof globalThis.process.versions.node !== 'undefined',
  isWebWorker: typeof globalThis.WorkerGlobalScope !== 'undefined' &&
               globalThis instanceof WorkerGlobalScope,
  isDeno: typeof globalThis.Deno !== 'undefined',

  getDetails() {
    if (this.isBrowser) {
      return {
        type: 'browser',
        userAgent: globalThis.navigator.userAgent,
        window: {
          width: globalThis.innerWidth,
          height: globalThis.innerHeight
        }
      };
    } else if (this.isNode) {
      return {
        type: 'node',
        version: globalThis.process.versions.node,
        platform: globalThis.process.platform
      };
    } else if (this.isWebWorker) {
      return {
        type: 'webworker'
      };
    } else if (this.isDeno) {
      return {
        type: 'deno',
        version: globalThis.Deno.version
      };
    } else {
      return {
        type: 'unknown'
      };
    }
  }
};

console.log(Environment.getDetails());
```

## 面试常见问题

### 1. 什么是 globalThis，它解决了什么问题？

globalThis 是 ES2020 引入的全局对象引用，它提供了一个统一的方式来访问全局对象，无论代码运行在什么环境中。在此之前，开发者需要根据环境使用不同的引用（window、global、self 等），导致代码不够通用和可移植。globalThis 解决了跨环境编程时对全局对象引用不一致的问题。

### 2. globalThis 与 window 对象有什么区别？

在浏览器环境中，globalThis 通常等同于 window 对象。但关键区别在于 globalThis 在所有 JavaScript 环境中都可用，而 window 只在浏览器环境中存在。这意味着使用 globalThis 编写的代码可以在 Node.js、Web Worker 或其他非浏览器环境中运行而无需修改。

### 3. 如何在 ES2020 之前获取全局对象？

在 ES2020 之前，获取全局对象通常需要使用以下方法：

```javascript
const getGlobalObject = function() {
  if (typeof window !== 'undefined') return window;
  if (typeof global !== 'undefined') return global;
  if (typeof self !== 'undefined') return self;
  if (typeof this === 'object') return this;
  throw new Error('无法找到全局对象');
};
```

或者使用 Function 构造函数：

```javascript
const globalObject = Function('return this')();
```

### 4. 为什么直接使用 var 声明的变量会成为全局对象的属性，而 let 和 const 不会？

在全局作用域中，使用 var 声明的变量会自动成为全局对象的属性，这是 JavaScript 历史遗留的行为。而 ES6 引入的 let 和 const 遵循块级作用域规则，它们声明的变量不会被添加为全局对象的属性，即使在全局作用域中声明也是如此。这是为了减少全局命名空间污染和提供更可预测的变量行为。

### 5. globalThis 能否在严格模式和模块中正常工作？

是的，globalThis 在严格模式（'use strict'）和 ES 模块中都能正常工作。这是它相比于全局上下文中的 this 关键字的主要优势之一。在严格模式或模块的顶层上下文中，this 的值为 undefined，而 globalThis 始终指向全局对象。

## 总结

globalThis 提供了一种标准化的方式来在任何 JavaScript 环境中访问全局对象，解决了跨环境编程中的一个长期存在的问题。它使代码更加简洁、可移植，减少了为不同环境编写不同代码的需要。

主要优点包括：
- 统一的全局对象引用，适用于所有 JavaScript 环境
- 简化了跨环境代码的编写
- 提高了代码的可移植性和可维护性
- 为特性检测提供了一致的机制

然而，使用 globalThis 时应当谨慎，避免过度依赖全局状态和污染全局命名空间。在现代 JavaScript 开发中，模块化方法通常是更好的选择，globalThis 主要应用于需要兼容多环境的代码和特性检测场景。