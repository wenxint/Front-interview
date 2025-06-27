/**
 * 前端高频手写题代码数据
 * 基于常看js.js内容完整生成
 */
window.CODE_DATA = [
  {
    id: "requestAnimationFrame",
    title: "requestAnimationFrame 动画",
    description: "使用 requestAnimationFrame 实现平滑动画",
    code: `/**
 * 使用 requestAnimationFrame 实现平滑动画
 *
 * requestAnimationFrame 是浏览器专门为动画设计的 API：
 * - 帧率与显示器刷新率同步，通常是 60fps
 * - 页面不可见时自动暂停，节省资源
 * - 比 setTimeout 性能更好，避免掉帧
 */

// 基础动画示例：元素移动
function animate() {
  const element = document.getElementById('movingBox');
  let position = 0;
  const speed = 2; // 每帧移动2px
  const maxPosition = 400; // 最大移动距离

  function step() {
    // 更新位置
    position += speed;
    element.style.left = position + 'px';

    // 检查是否达到终点
    if (position < maxPosition) {
      // 继续下一帧
      requestAnimationFrame(step);
    }
  }

  // 开始动画
  requestAnimationFrame(step);
}

// 启动动画（需要HTML中有id为'movingBox'的元素）
// animate();`,
  },
  {
    id: "curry",
    title: "函数柯里化",
    description: "实现函数柯里化功能",
    code: `/**
 * 函数柯里化实现
 * 柯里化是将多参数函数转换为单参数函数序列的技术
 */
function curry(fn) {
  // 收集参数的内部函数
  const collectArgs = (...args) => {
    // 如果已收集的参数达到原函数的参数个数，则执行原函数
    if (args.length >= fn.length) {
      return fn(...args);
    }
    // 否则返回新函数，继续收集参数
    return (...newArgs) => collectArgs(...args, ...newArgs);
  };

  return collectArgs;
}

// 使用示例
function add(a, b, c) {
  return a + b + c;
}

const curriedAdd = curry(add);
console.log(curriedAdd(1)(2)(3)); // 输出: 6
console.log(curriedAdd(1, 2)(3)); // 输出: 6
console.log(curriedAdd(1, 2, 3)); // 输出: 6`,
  },
  {
    id: "mySetInterval",
    title: "用 setTimeout 实现 setInterval",
    description: "使用 setTimeout 模拟 setInterval 功能",
    code: `/**
 * 用 setTimeout 实现 setInterval
 */
function mySetInterval(callback, delay) {
  let timerId;

  function interval() {
    timerId = setTimeout(() => {
      callback();
      interval(); // 递归调用，形成循环
    }, delay);
  }

  interval(); // 开始第一次调用

  // 返回清除函数
  return () => clearTimeout(timerId);
}

// 使用示例
const clear = mySetInterval(() => {
  console.log('定时执行');
}, 1000);

// 5秒后停止
setTimeout(clear, 5000);`,
  },
  {
    id: "lengthOfLongestSubstring",
    title: "无重复字符的最长子串",
    description: "求字符串中无重复字符的最长子串长度",
    code: `/**
 * 无重复字符的最长子串
 * 使用滑动窗口算法
 */
function lengthOfLongestSubstring(s) {
 // 1. 初始化数据结构
    const charIndex = new Map();  // 哈希表：记录字符最后出现位置
    let left = 0;                 // 窗口左边界
    let maxLength = 0;            // 记录找到的最大长度

    // 2. 遍历字符串，右边界不断向右移动
    for (let right = 0; right < s.length; right++) {
        const char = s[right];    // 当前处理的字符

        // 3. 检查是否出现重复字符
        if (charIndex.has(char) && charIndex.get(char) >= left) {
            // 重复了！需要移动左边界
            left = charIndex.get(char) + 1;
        }

        // 4. 更新字符位置和最大长度
        charIndex.set(char, right);                    // 记录当前字符位置
        maxLength = Math.max(maxLength, right - left + 1);  // 更新最大长度
    }

    return maxLength;
}

// 测试用例
console.log(lengthOfLongestSubstring("abcabcbb")); // 输出: 3 ("abc")
console.log(lengthOfLongestSubstring("bbbbb"));    // 输出: 1 ("b")
console.log(lengthOfLongestSubstring("pwwkew"));   // 输出: 3 ("wke")`,
  },

  {
    id: "cancelAxios",
    title: "取消axios请求",
    description: "取消axios请求",
    code: `const controller = new AbortController();
    axios.get("/foo/bar", { signal: controller.signal }).then(function (response) {
      //...
    });
    controller.abort();`,
  },
  {
    id: "thousandthplace",
    title: "千分位分隔符",
    description: "千分位分隔符正则表达式",
    code: `/**
 * 千分位分隔符正则表达式
 * 将数字转换为千分位格式
 */
function formatNumberWithCommas(num) {
  return num.toString().replace(/(?=(\\B\\d{3})+$)/g, ",");
}`,
  },
  {
    id: "floatEqual",
    title: "浮点数相等比较",
    description: "安全比较两个浮点数是否相等",
    code: `/**
 * 浮点数相等比较
 * 由于JavaScript浮点数精度问题，不能直接用 === 比较
 */
function floatEqual(a, b, epsilon = Number.EPSILON) {
  return Math.abs(a - b) < epsilon;
}

// 演示JavaScript浮点数精度问题
console.log(0.1 + 0.2 === 0.3); // 输出: false
console.log(0.1 + 0.2); // 输出: 0.30000000000000004

// 使用我们的函数
console.log(floatEqual(0.1 + 0.2, 0.3)); // 输出: true

// 更多示例
console.log(floatEqual(1.0000001, 1.0000002, 0.0001)); // 输出: true
console.log(floatEqual(1.1, 1.2, 0.05)); // 输出: false`,
  },

  {
    id: "myNew",
    title: "手写 New 方法",
    description: "自定义实现 New()",
    code: `
    // 手写new
function myNew(constructor, ...args) {
  // 1. 创建一个新的空对象，并将其原型指向构造函数的 prototype
  const obj = Object.create(constructor.prototype);

  // 2. 将构造函数的 this 绑定到这个新对象
  const result = constructor.apply(obj, args);

  // 3. 如果构造函数返回一个对象，则返回该对象；否则返回新创建的对象
  return result instanceof Object ? result : obj;
}

function Person(name, age) {
  this.name = name;
  this.age = age;
}

Person.prototype.sayHello = function () {
  console.log('Hello, my name is ' + this.name + ' and I\'m ' + this.age + ' years old.');
};

// 使用原生的 new
const person1 = new Person("Alice", 25);
person1.sayHello(); // 输出: Hello, my name is Alice and I'm 25 years old.

// 使用我们的 myNew
const person2 = myNew(Person, "Bob", 30);
person2.sayHello(); // 输出: Hello, my name is Bob and I'm 30 years old.
    `,
  },
  {
    id: "myCall",
    title: "手写 call 方法",
    description: "自定义实现 Function.prototype.call",
    code: `/**
 * @description 自定义实现call方法，改变函数的this指向并立即执行
 * @param {Object} context - 要绑定的this上下文对象
 * @param {...any} args - 要传递给函数的参数
 * @return {any} 函数执行的返回值
 */
Function.prototype.myCall = function (context, ...args) {
  // 处理context为null或undefined的情况，默认指向全局对象
  context = context || globalThis;

  // 创建一个唯一的属性名，避免覆盖原有属性
  const fnKey = Symbol('tempFunction');

  // 将当前函数作为context的临时属性
  context[fnKey] = this;

  // 调用函数并获取返回值
  const result = context[fnKey](...args);

  // 删除临时属性，保持context的纯净
  delete context[fnKey];

  // 返回函数执行结果
  return result;
};

// 使用示例
function greet(greeting, punctuation) {
  return \`\${greeting}, I'm \${this.name}\${punctuation}\`;
}

const person = { name: 'Alice' };
console.log(greet.myCall(person, 'Hello', '!')); // 输出: "Hello, I'm Alice!"`,
  },
  {
    id: "myApply",
    title: "手写 apply 方法",
    description: "自定义实现 Function.prototype.apply",
    code: `/**
 * @description 自定义实现apply方法，改变函数的this指向并立即执行
 * @param {Object} context - 要绑定的this上下文对象
 * @param {Array} argsArray - 要传递给函数的参数数组
 * @return {any} 函数执行的返回值
 */
Function.prototype.myApply = function (context, argsArray) {
  // 处理context为null或undefined的情况
  context = context || globalThis;

  // 处理参数数组为null或undefined的情况
  argsArray = argsArray || [];

  // 创建唯一的属性名
  const fnKey = Symbol('tempFunction');

  // 将当前函数绑定到context上
  context[fnKey] = this;

  // 调用函数并传入参数数组
  const result = context[fnKey](...argsArray);

  // 清理临时属性
  delete context[fnKey];

  return result;
};

// 使用示例
function calculate(operation, a, b) {
  return \`\${this.name} calculated: \${a} \${operation} \${b} = \${operation === '+' ? a + b : a - b}\`;
}

const calculator = { name: 'Calculator' };
console.log(calculate.myApply(calculator, ['+', 10, 5])); // 输出: "Calculator calculated: 10 + 5 = 15"`,
  },
  {
    id: "myBind",
    title: "手写 bind 方法",
    description: "自定义实现 Function.prototype.bind",
    code: `/**
 * @description 自定义实现bind方法，创建一个新函数，将this绑定到指定对象
 * @param {Object} context - 要绑定的this上下文对象
 * @param {...any} args - 预设的参数
 * @return {Function} 绑定后的新函数
 */
Function.prototype.myBind = function (context, ...args) {
  // 保存原函数引用（调用bind的函数）
  const self = this;
  // 返回新函数，支持后续传递新参数
  return function (...newArgs) {
    // 调用自定义的myCall方法，合并初始参数和新参数
    return self.myCall(context, ...args, ...newArgs);
  };
};

// 使用示例
function multiply(a, b, c) {
  return \`\${this.name}: \${a} * \${b} * \${c} = \${a * b * c}\`;
}

const math = { name: 'Math' };
const boundMultiply = multiply.myBind(math, 2); // 预设第一个参数为2
console.log(boundMultiply(3, 4)); // 输出: "Math: 2 * 3 * 4 = 24"`,
  },
  {
    id: "myInstanceof",
    title: "手写 instanceof",
    description: "自定义实现instanceof运算符",
    code: `/**
 * @description 自定义实现instanceof运算符，检测构造函数的prototype是否存在于对象的原型链中
 * @param {Object|Function} obj - 要检测的目标对象（注意：基本类型直接返回false）
 * @param {Function} constructor - 用于检测的构造函数
 * @return {boolean} 目标对象是否为构造函数的实例
 */
function myInstanceof(obj, constructor) {
  // 处理基本类型：基本类型没有原型链，直接返回false（null也在此处处理）
  if ((typeof obj !== "object" && typeof obj !== "function") || obj === null) {
    return false;
  }
  // 获取目标对象的原型（等同于obj.__proto__，但推荐使用标准方法）
  let proto = Object.getPrototypeOf(obj);
  // 遍历原型链，直到原型为null（原型链终点）
  while (proto !== null) {
    // 检查当前原型是否等于构造函数的prototype属性
    if (proto === constructor.prototype) {
      return true; // 找到匹配，返回true
    }
    // 继续向上查找原型链
    proto = Object.getPrototypeOf(proto);
  }
  // 遍历完整个原型链未找到匹配，返回false
  return false;
}

// 使用示例
function Animal() {}
const cat = new Animal();
console.log(myInstanceof(cat, Animal)); // 输出: true
console.log(myInstanceof(cat, Object)); // 输出: true
console.log(myInstanceof(123, Number)); // 输出: false（基本类型直接返回false）`,
  },
  {
    id: "deepClone",
    title: "深拷贝",
    description: "实现对象的深度拷贝",
    code: `/**
 * 深拷贝一个对象
 *
 * @param {any} obj 需要深拷贝的对象
 * @returns {any} 深拷贝后的对象
 */
function deepClone(obj) {
  if (obj === null || typeof obj !== "object") {
    // 如果是基本类型或 null，直接返回
    return obj;
  }

  if (obj instanceof Date) {
    // 如果是 Date 对象，返回一个新的 Date
    return new Date(obj);
  }

  if (obj instanceof RegExp) {
    // 如果是正则表达式，返回一个新的 RegExp
    return new RegExp(obj);
  }

  // 如果是数组或对象，递归拷贝
  const clone = Array.isArray(obj) ? [] : {};

  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      clone[key] = deepClone(obj[key]); // 递归拷贝每个属性
    }
  }

  return clone;
}

// 测试
const obj = {
  name: "Alice",
  age: 25,
  hobbies: ["reading", "coding"],
  address: {
    city: "Beijing",
    street: "Main St"
  },
  birthDate: new Date(),
  regex: /test/g
};

const deepCopy = deepClone(obj);

deepCopy.name = "Bob";
deepCopy.address.city = "Shanghai";
deepCopy.birthDate.setFullYear(2000); // 不会影响原对象

console.log(obj.name);          // "Alice"
console.log(deepCopy.name);     // "Bob"
console.log(obj.address.city);  // "Beijing"
console.log(deepCopy.address.city); // "Shanghai"
console.log(obj.birthDate.getFullYear());  // 原年份
console.log(deepCopy.birthDate.getFullYear()); // 2000
`,
  },
  {
    id: "simpleLimit",
    title: "并发控制",
    description: "控制固定数量异步任务的并发执行",
    code: `/**
 * 超简单版本：控制固定数量异步任务的并发执行
 * @param {number} limit - 最大并发数
 */
function simpleLimit(limit) {
  // 等待执行的任务队列
  const queue = [];
  // 当前正在执行的任务数量
  let activeCount = 0;

  // 执行队列中的下一个任务
  const runNext = () => {
    if (queue.length === 0) return;

    // 如果正在执行的任务数量小于限制，则执行下一个任务
    if (activeCount < limit) {
      // 从队列中取出一个任务
      const { fn, resolve, reject } = queue.shift();
      activeCount++;

      Promise.resolve(fn())
        .then(resolve)
        .catch(reject)
        .finally(() => {
          activeCount--;
          runNext(); // 任务完成后，尝试执行下一个任务
        });
    }
  };

  // 返回一个函数，用于添加任务
  return (fn) => {
    return new Promise((resolve, reject) => {
      queue.push({ fn, resolve, reject });
      runNext();
    });
  };
}

// 使用示例
const runTask = simpleLimit(2); // 最多同时执行2个任务

// 创建5个模拟的异步任务
const createTask = (id, delay) => () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log(\`任务\${id}完成，耗时\${delay}ms\`);
      resolve(\`任务\${id}的结果\`);
    }, delay);
  });
};

// 执行任务并获取结果
runTask(createTask(1, 1000)).then((result) => console.log(result));
runTask(createTask(2, 2000)).then((result) => console.log(result));
runTask(createTask(3, 1500)).then((result) => console.log(result));
runTask(createTask(4, 800)).then((result) => console.log(result));

  /**
   * 处理请求队列的异步函数，不断从队列中取出请求并执行，直到队列清空或达到最大并发数。
   */
  const processQueue = async () => {
    // 当队列中还有请求且当前并发数未达到最大值时，继续处理请求
    while (queue.length > 0 && running < maxConcurrency) {
      // 从队列头部取出一个请求
      const request = queue.shift();
      // 增加当前并发数
      running++;
      // 执行请求并等待其完成
      await request();
      // 减少当前并发数
      running--;
      // 递归调用自身，继续处理队列中的剩余请求
      processQueue();
    }
  };

  // 启动请求队列的处理过程
  processQueue();
}

// 示例：模拟 8 个请求，最多并发 2 个
// 使用 Array.from 方法创建一个包含 8 个请求函数的数组
const requests = Array.from(
  { length: 8 },
  // 为每个索引创建一个返回 Promise 的请求函数
  (_, i) => () =>
    new Promise((resolve) => {
      // 打印请求开始的日志
      console.log(\`Request \${i + 1} started\`);
      // 使用 setTimeout 模拟请求的耗时操作，随机延时 0 到 2000 毫秒
      setTimeout(() => {
        // 打印请求完成的日志
        console.log(\`Request \${i + 1} finished\`);
        // 标记 Promise 已完成
        resolve();
      }, Math.random() * 2000);
    })
);

// 调用 controlConcurrency 函数，传入请求数组和最大并发数
controlConcurrency(requests, 2);

`,
  },
  {
    id: "lazyLoad",
    title: "图片懒加载",
    description: "图片懒加载类的实现",
    code: `
const imgList = [...document.querySelectorAll('img')]

var io = new IntersectionObserver((entries) =>{
  entries.forEach(item => {
    // isIntersecting是一个Boolean值，判断目标元素当前是否可见
    if (item.isIntersecting) {
      item.target.src = item.target.dataset.src
      // 图片加载后即停止监听该元素
      io.unobserve(item.target)
    }
  })
}, {
  root: document.querySelector('.root')
})

// observe遍历监听所有img节点
imgList.forEach(img => io.observe(img))

/**
 * 图片懒加载类
 * @class LazyLoad
 */
class LazyLoad {
  /**
   * 创建懒加载实例
   * @param {Object} options - 配置选项
   * @param {string} options.selector - 懒加载图片的CSS选择器
   * @param {string} options.dataSrc - 存储真实图片地址的data属性名
   * @param {number} options.threshold - IntersectionObserver的阈值
   * @param {number} options.throttleDelay - 节流延迟时间（毫秒）
   */
  constructor(options = {}) {
    this.options = {
      selector: ".lazy-image",
      dataSrc: "data-src",
      threshold: 0.1,
      throttleDelay: 200,
      ...options,
    };

    this.images = [];
    this.observer = null;
    this.initialized = false;

    // 绑定方法的this
    this.throttledLoad = this.throttle(
      this.loadImages.bind(this),
      this.options.throttleDelay
    );
  }

  /**
   * 初始化懒加载
   */
  init() {
    if (this.initialized) return;

    this.images = Array.from(document.querySelectorAll(this.options.selector));

    if ("IntersectionObserver" in window) {
      this.initIntersectionObserver();
    } else {
      this.initLegacyLazyLoad();
    }

    this.initialized = true;
  }

  /**
   * 使用IntersectionObserver初始化
   */
  initIntersectionObserver() {
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            this.loadImage(entry.target);
            this.observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: this.options.threshold,
      }
    );

    this.images.forEach((image) => {
      if (image.hasAttribute(this.options.dataSrc)) {
        this.observer.observe(image);
      }
    });
  }

  /**
   * 加载单张图片
   * @param {HTMLImageElement} image - 要加载的图片元素
   */
  loadImage(image) {
    const src = image.getAttribute(this.options.dataSrc);
    if (!src) return;

    // 设置加载事件
    image.onload = () => {
      image.removeAttribute(this.options.dataSrc);
      image.classList.add("lazy-loaded");
    };

    // 设置错误处理
    image.onerror = () => {
      console.error(\`Failed to load image: \${src}\`);
      image.removeAttribute(this.options.dataSrc);
    };

    // 触发图片加载
    image.src = src;
  }

  /**
   * 节流函数
   * @param {Function} func - 要节流的函数
   * @param {number} delay - 延迟时间（毫秒）
   * @returns {Function} 节流后的函数
   */
  throttle(func, delay) {
    let lastCall = 0;
    return function (...args) {
      const now = Date.now();
      if (now - lastCall >= delay) {
        lastCall = now;
        func.apply(this, args);
      }
    };
  }
}

// 使用示例
const lazyLoader = new LazyLoad({
  selector: '.lazy-image',
  dataSrc: 'data-src',
  threshold: 0.1
});

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
  lazyLoader.init();
});`,
  },
  {
    id: "setOperations",
    title: "Set集合操作",
    description: "Set集合的交集、并集和差集操作",
    code: `/**
 * set集合操作交集、并集和差集
 */

const a = new Set([1, 2, 3]);
const b = new Set([2, 3, 4]);

// 并集
const union = new Set([...a, ...b]); // Set(4) {1, 2, 3, 4}

// 交集
const intersection = new Set([...a].filter((x) => b.has(x))); // Set(2) {2, 3}

// 差集 (a - b)
const difference = new Set([...a].filter((x) => !b.has(x))); // Set(1) {1}

console.log('集合a:', a);
console.log('集合b:', b);
console.log('并集:', union);
console.log('交集:', intersection);
console.log('差集 (a-b):', difference);

`,
  },

  {
    id: "iframe",
    title: "判断当前页面是否在 iframe 中",
    description: "手写reduce函数实现",
    code: `
    // 判断当前页面是否在 iframe 中
const isInIframe = window.self !== window.top;

if (isInIframe) {
  console.log("当前页面被嵌入在 iframe 中");
} else {
  console.log("当前页面是顶级窗口");
}`,
  },
  {
    id: "myReduce",
    title: "手写reduce函数",
    description: "手写reduce函数实现",
    code: `/**
 * 手写reduce函数实现
 */
Array.prototype.myReduce = function (callback, initialValue) {
  // 1. 检查回调函数是否为函数
  if (typeof callback !== "function") {
    throw new TypeError(callback + " is not a function");
  }

  const array = this; // 当前数组
  const length = array.length;
  let accumulator;
  let startIndex;

  // 2. 处理初始值
  if (arguments.length >= 2) {
    // 如果提供了初始值，从第 0 个元素开始
    accumulator = initialValue;
    startIndex = 0;
  } else {
    // 如果没有提供初始值，使用第一个元素作为初始值，并从第 1 个元素开始
    if (length === 0) {
      throw new TypeError("Reduce of empty array with no initial value");
    }
    accumulator = array[0];
    startIndex = 1;
  }

  // 3. 遍历数组，执行累加器函数
  for (let i = startIndex; i < length; i++) {
    accumulator = callback(accumulator, array[i], i, array);
  }

  // 4. 返回最终的累积值
  return accumulator;
};

// 使用示例
const numbers = [1, 2, 3, 4, 5];

// 求和
const sum = numbers.myReduce((acc, cur) => acc + cur, 0);
console.log('求和结果:', sum); // 输出: 15

// 求最大值
const max = numbers.myReduce((acc, cur) => Math.max(acc, cur));
console.log('最大值:', max); // 输出: 5

// 数组转对象
const fruits = ['apple', 'banana', 'orange'];
const fruitObj = fruits.myReduce((acc, fruit, index) => {
  acc[fruit] = index;
  return acc;
}, {});
console.log('数组转对象:', fruitObj); // 输出: {apple: 0, banana: 1, orange: 2}`,
  },
  {
    id: "fibonacciMemoized",
    title: "斐波那契数列（记忆化）",
    description: "带记忆功能的斐波那契数列实现",
    code: `/**
 * @description 带记忆功能的斐波那契数列实现
 * @param {number} n - 需要计算的斐波那契数列位置
 * @return {number} 斐波那契数列第n项的值
 */
function fibonacciMemoized() {
  // 创建缓存对象
  const cache = {};

  // 内部递归函数
  function fib(n) {
    // 检查缓存中是否已有计算结果
    if (n in cache) {
      return cache[n];
    }

    // 基本情况
    if (n <= 1) {
      return n;
    }

    // 计算结果并存入缓存
    cache[n] = fib(n - 1) + fib(n - 2);
    return cache[n];
  }

  // 返回内部函数
  return fib;
}

const fib = fibonacciMemoized();
console.log(fib(40)); // 输出: 102334155 (计算非常快)`,
  },
  {
    id: "treeTraversal",
    title: "深度优先和广度优先遍历",
    description: "深度优先遍历和广度优先遍历的实现代码",
    code: `//深度优先遍历和广度优先遍历的实现代码

/**
 * @description 树节点构造函数
 * @param {any} value - 节点值
 */
function TreeNode(value) {
  this.value = value;
  this.children = [];
}

/**
 * @description 深度优先遍历（DFS）
 * @param {TreeNode} node - 树节点
 * @param {function} callback - 处理节点的回调函数
 */
function depthFirstTraversal(node, callback) {
  // 基本情况：节点为null
  if (!node) return;

  // 处理当前节点
  callback(node.value);

  // 递归遍历所有子节点
  for (const child of node.children) {
    depthFirstTraversal(child, callback);
  }
}

/**
 * @description 广度优先遍历（BFS，使用队列，非递归实现）
 * @param {TreeNode} root - 根节点
 * @param {function} callback - 处理节点的回调函数
 */
function breadthFirstTraversal(root, callback) {
  if (!root) return;

  const queue = [root];

  while (queue.length > 0) {
    const node = queue.shift();
    callback(node.value); // 执行回调处理当前节点
    for (const child of node.children) {
      queue.push(child);
    }
  }
}

// 创建一个示例树
const root = new TreeNode("A");
const nodeB = new TreeNode("B");
const nodeC = new TreeNode("C");
const nodeD = new TreeNode("D");
const nodeE = new TreeNode("E");
const nodeF = new TreeNode("F");

root.children.push(nodeB, nodeC);
nodeB.children.push(nodeD, nodeE);
nodeC.children.push(nodeF);
// A
// / \\
// B   C
// / \\   |
// D  E   F
// 测试遍历
console.log("DFS遍历结果:");
depthFirstTraversal(root, (value) => console.log(value));
// 输出: A B D E C F

console.log("BFS遍历结果:");
breadthFirstTraversal(root, (value) => console.log(value));
// 输出: A B C D E F`,
  },
  {
    id: "arrayToTree",
    title: "数组转树形结构",
    description: "组织架构树形数据转换为树形结构",
    code: `//  组织架构树形数据转换为树形结构

const data = [
  { id: "01", name: "张大大", pid: "", job: "项目经理" },
  { id: "02", name: "小亮", pid: "01", job: "产品leader" },
  { id: "03", name: "小美", pid: "01", job: "UIleader" },
  { id: "04", name: "老马", pid: "01", job: "技术leader" },
  { id: "05", name: "老王", pid: "01", job: "测试leader" },
  { id: "06", name: "老李", pid: "01", job: "运维leader" },
  { id: "07", name: "小丽", pid: "02", job: "产品经理" },
  { id: "08", name: "大光", pid: "02", job: "产品经理" },
  { id: "09", name: "小高", pid: "03", job: "UI设计师" },
  { id: "10", name: "小刘", pid: "04", job: "前端工程师" },
  { id: "11", name: "小华", pid: "04", job: "后端工程师" },
  { id: "12", name: "小李", pid: "04", job: "后端工程师" },
  { id: "13", name: "小赵", pid: "05", job: "测试工程师" },
  { id: "14", name: "小强", pid: "05", job: "测试工程师" },
  { id: "15", name: "小涛", pid: "06", job: "运维工程师" },
];

function toTree(arr, parentId) {
  // 定义一个递归函数 loop，用于构建树结构
  function loop(parentId) {
    // 初始化结果数组
    let res = [];
    // 遍历数组 arr
    for (let i = 0; i < arr.length; i++) {
      let item = arr[i];

      // 如果当前项的父级 ID 不等于传入的 parentId，则跳过
      if (item.pid !== parentId) {
        continue;
      }

      // 递归调用 loop 函数，将当前项的 ID 作为父级 ID 传入，获取子节点
      item.children = loop(item.id);
      // 将当前项添加到结果数组中
      res.push(item);
    }
    // 返回结果数组
    return res;
  }
  // 调用递归函数 loop，并返回结果
  return loop(parentId);
}

const result = toTree(data, "");
console.log(JSON.stringify(result, null, 2));`,
  },
  {
    id: "restoreIpAddresses",
    title: "有效IP地址生成",
    description: "生成所有可能的有效IP地址",
    code: `/**
 * @description 生成所有可能的有效IP地址
 * @param {string} s - 输入的纯数字字符串
 * @return {string[]} 所有有效的IP地址数组
 */
function restoreIpAddresses(s) {
  const result = [];
  const len = s.length;

  // 回溯函数：当前段数、当前路径、当前位置
  const backtrack = (segCount, path, start) => {
    // 终止条件：已分割4段且遍历完所有字符
    if (segCount === 4) {
      if (start === len) {
        result.push(path.join("."));
      }
      return;
    }

    // 尝试取1-3位作为当前段
    for (let end = start + 1; end <= Math.min(start + 3, len); end++) {
      const segment = s.substring(start, end);
      // 检查当前段是否有效
      if (isValidSegment(segment)) {
        path.push(segment);
        backtrack(segCount + 1, path, end);
        path.pop(); // 回溯
      }
    }
  };

  /**
   * @description 检查段是否有效
   * @param {string} segment - 当前分割段
   * @return {boolean} 是否有效
   */
  const isValidSegment = (segment) => {
    // 长度超过3或前导零（非单零）
    if (segment.length > 3 || (segment.length > 1 && segment[0] === "0")) {
      return false;
    }
    // 数值超过255
    return parseInt(segment, 10) <= 255;
  };

  backtrack(0, [], 0);
  return result;
}

// 示例1
console.log(restoreIpAddresses("25525511135")); // 输出: ["255.255.11.135","255.255.111.35"]

// 示例2
console.log(restoreIpAddresses("0000")); // 输出: ["0.0.0.0"]

// 示例3
console.log(restoreIpAddresses("101023")); // 输出: ["1.0.10.23","1.0.102.3","10.1.0.23","10.10.2.3","101.0.2.3"]`,
  },
  {
    id: "memoize",
    title: "记忆化函数",
    description: "记忆化函数的实现",
    code: `/**
 * @description 记忆化函数的实现
 */
// 1. 基础记忆化
function memoize(fn) {
  const cache = new Map();
  return function (...args) {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      return cache.get(key);
    }
    const result = fn.apply(this, args);
    cache.set(key, result);
    return result;
  };
}

// 2. 实际应用：斐波那契数列
const fibonacci = memoize(function (n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
});

// 使用示例
console.log(fibonacci(40)); // 非常快
console.log(fibonacci(50)); // 依然很快

// 3. 记忆化的计算密集型函数
const expensiveCalculation = memoize(function(x, y) {
  console.log('执行复杂计算...'); // 只有第一次调用时才会打印
  return Math.pow(x, y) + Math.sqrt(x * y);
});

console.log(expensiveCalculation(10, 3)); // 执行计算
console.log(expensiveCalculation(10, 3)); // 从缓存返回`,
  },
  {
    id: "arrayChunk",
    title: "数组分块处理",
    description: "将数组分解为指定大小的块",
    code: `/**
 * @description 将数组分解为指定大小的块
 * @param {Array} array - 需要分块的数组
 * @param {number} chunkSize - 每块的大小
 * @return {Array} 分块后的二维数组
 */
function arrayChunk(array, chunkSize) {
  if (chunkSize <= 0) throw new Error('Chunk size must be greater than 0');

  const result = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    result.push(array.slice(i, i + chunkSize));
  }
  return result;
}

// 示例
console.log(arrayChunk([1, 2, 3, 4, 5, 6, 7, 8], 3)); // 输出: [[1, 2, 3], [4, 5, 6], [7, 8]]
console.log(arrayChunk(['a', 'b', 'c', 'd'], 2)); // 输出: [['a', 'b'], ['c', 'd']]`,
  },
  {
    id: "deepFlatten",
    title: "深度扁平化数组",
    description: "将嵌套数组完全扁平化",
    code: `/**
 * @description 将嵌套数组完全扁平化
 * @param {Array} arr - 需要扁平化的数组
 * @return {Array} 扁平化后的数组
 */
function deepFlatten(arr) {
  const result = [];

  for (let i = 0; i < arr.length; i++) {
    if (Array.isArray(arr[i])) {
      // 递归处理嵌套数组
      result.push(...deepFlatten(arr[i]));
    } else {
      result.push(arr[i]);
    }
  }

  return result;
}

// 测试
const nestedArray = [1, [2, 3], [4, [5, 6]], [[7, 8], 9]];
console.log(deepFlatten(nestedArray)); // 输出: [1, 2, 3, 4, 5, 6, 7, 8, 9]

// 使用ES6的实现
function deepFlattenES6(arr) {
  return arr.reduce((acc, val) =>
    Array.isArray(val) ? acc.concat(deepFlattenES6(val)) : acc.concat(val), []
  );
}
 let arr = [1, 2, [888, 555],[666,888], 111];
    function test(arr) {
      let a = [];
      for (let i = 0; i < arr.length; i++) {
        if (Array.isArray(arr[i])) {
         a=[...a,...test(arr[i])]
        } else {
          a.push(arr[i]);
        }
      }
      return a
    }
    console.log(test(arr));
`,
  },
  {
    id: "arrayUnique",
    title: "数组去重",
    description: "多种方式实现数组去重",
    code: `/**
 * @description 多种方式实现数组去重
 */

// 1. 使用Set（ES6）
function uniqueWithSet(arr) {
  return [...new Set(arr)];
}

// 2. 使用includes
function uniqueWithIncludes(arr) {
  const result = [];
  for (let i = 0; i < arr.length; i++) {
    if (!result.includes(arr[i])) {
      result.push(arr[i]);
    }
  }
  return result;
}

// 3. 使用Map（适用于对象数组去重）
function uniqueWithMap(arr, key) {
  const map = new Map();
  return arr.filter(item => {
    const keyValue = key ? item[key] : item;
    if (!map.has(keyValue)) {
      map.set(keyValue, true);
      return true;
    }
    return false;
  });
}

// 4. 复杂对象去重
function uniqueObjects(arr, key) {
  const seen = new Set();
  return arr.filter(item => {
    const k = item[key];
    if (seen.has(k)) {
      return false;
    }
    seen.add(k);
    return true;
  });
}

// 测试
const numbers = [1, 2, 2, 3, 4, 4, 5];
console.log(uniqueWithSet(numbers)); // [1, 2, 3, 4, 5]

const users = [
  { id: 1, name: 'Alice' },
  { id: 2, name: 'Bob' },
  { id: 1, name: 'Alice' },
  { id: 3, name: 'Charlie' }
];
console.log(uniqueObjects(users, 'id')); // [{ id: 1, name: 'Alice' }, { id: 2, name: 'Bob' }, { id: 3, name: 'Charlie' }]`,
  },
  {
    id: "isPlainObject",
    title: "判断纯对象",
    description: "判断是否为纯对象（plain object）",
    code: `/**
 * @description 判断是否为纯对象（plain object）
 * @param {any} obj - 需要判断的值
 * @return {boolean} 是否为纯对象
 */
function isPlainObject(obj) {
  // 如果不是对象或者是null，返回false
  if (typeof obj !== 'object' || obj === null) {
    return false;
  }

  // 如果原型为null，则是纯对象
  if (Object.getPrototypeOf(obj) === null) {
    return true;
  }

  // 检查原型链，直到找到Object.prototype
  let proto = obj;
  while (Object.getPrototypeOf(proto) !== null) {
    proto = Object.getPrototypeOf(proto);
  }

  // 如果对象的原型链最终指向Object.prototype，则是纯对象
  return Object.getPrototypeOf(obj) === proto;
}

// 测试用例
console.log(isPlainObject({})); // true
console.log(isPlainObject({ a: 1 })); // true
console.log(isPlainObject(Object.create(null))); // true
console.log(isPlainObject([])); // false
console.log(isPlainObject(new Date())); // false
console.log(isPlainObject(null)); // false
console.log(isPlainObject('string')); // false

class MyClass {}
console.log(isPlainObject(new MyClass())); // false

function MyFunction() {}
console.log(isPlainObject(new MyFunction())); // false`,
  },
  {
    id: "formatNumber",
    title: "数字格式化",
    description: "数字格式化（千分位分隔）",
    code: `/**
 * @description 数字格式化（千分位分隔）
 * @param {number|string} num - 需要格式化的数字
 * @return {string} 格式化后的字符串
 */
function formatNumber(num) {
  return num.toString().replace(/\\B(?=(\\d{3})+(?!\\d))/g, ',');
}

// 更完整的实现
function formatNumberAdvanced(num, options = {}) {
  const {
    locale = 'en-US',
    minimumFractionDigits = 0,
    maximumFractionDigits = 2,
    currency,
    style = 'decimal'
  } = options;

  const number = typeof num === 'string' ? parseFloat(num) : num;

  if (isNaN(number)) {
    throw new Error('Invalid number');
  }

  const formatOptions = {
    style,
    minimumFractionDigits,
    maximumFractionDigits
  };

  if (currency && style === 'currency') {
    formatOptions.currency = currency;
  }

  return new Intl.NumberFormat(locale, formatOptions).format(number);
}

// 测试
console.log(formatNumber(1234567)); // "1,234,567"
console.log(formatNumber(1234567.89)); // "1,234,567.89"

console.log(formatNumberAdvanced(1234567.89)); // "1,234,567.89"
console.log(formatNumberAdvanced(1234567.89, {
  style: 'currency',
  currency: 'USD'
})); // "$1,234,567.89"
console.log(formatNumberAdvanced(1234567.89, {
  locale: 'zh-CN',
  style: 'currency',
  currency: 'CNY'
})); // "¥1,234,567.89"`,
  },
  {
    id: "permute",
    title: "全排列算法",
    description: "使用回溯算法实现数组全排列",
    code: `/**
 * 回溯算法实现全排列
 * @param {number[]} nums - 要排列的数组
 * @returns {number[][]} - 所有可能的全排列
 */
function permute(nums) {
  const res = [];
  const used = new Array(nums.length).fill(false); // 标记数字是否被使用

  function backtrack(path) {
    if (path.length === nums.length) {
      res.push([...path]); // 当前路径完成，加入结果
      return;
    }

    for (let i = 0; i < nums.length; i++) {
      if (!used[i]) {
        used[i] = true; // 标记为已使用
        path.push(nums[i]); // 加入当前路径
        backtrack(path); // 递归选择下一个数字
        path.pop(); // 撤销选择（回溯）
        used[i] = false; // 恢复未使用状态
      }
    }
  }

  backtrack([]);
  return res;
}

// 测试
console.log(permute([1, 2, 3]));
// 输出: [[1,2,3], [1,3,2], [2,1,3], [2,3,1], [3,2,1], [3,1,2]]`,
  },
  {
    id: "lazyMan",
    title: "LazyMan 类实现",
    description:
      "实现支持链式调用的 LazyMan 类，支持 sleep、eat 和 sleepFirst 方法",
    code: `
function LazyMan(name) {
  // 实际返回一个类实例，隐藏实现细节
  return new _LazyManClass(name);
}


    /**
 * 设计思路：
 * 1. LazyMan本质是一个任务队列调度器，所有操作（如问候、sleep、eat等）都被封装为任务函数，按顺序依次执行。
 * 2. 每次调用sleep、eat等方法时，都是往队列中添加一个任务（函数）。sleepFirst则是插入到队列最前面。
 * 3. 构造时，问候语任务最先加入队列，并用setTimeout保证所有链式方法注册完毕后再开始执行。
 * 4. 每个任务执行完毕后，自动调用next方法执行下一个任务，实现链式异步调度。
 * 5. 通过类封装，保证每个LazyMan实例互不影响，支持多次链式调用。
 */

/**
 * @description 实现LazyMan，支持sleep、sleepFirst、eat链式调用
 * @param {string} name - 名字
 * @returns {Object} 支持链式调用的LazyMan实例
 */
    class LazyMan {
  constructor(name) {
    this.name = name;
    this.tasks = [];

    console.log(\`Hi! This is \${name}!\`);

    // 使用setTimeout确保所有任务在同步代码执行完后才开始
    setTimeout(() => {
      this.next();
    }, 0);

    return this;
  }

  next() {
    const task = this.tasks.shift();
    task && task();
  }

  sleep(time) {
    this.tasks.push(() => {
      setTimeout(() => {
        console.log(\`Wake up after \${time}\`);
        this.next();
      }, time * 1000);
    });
    return this;
  }

  sleepFirst(time) {
    this.tasks.unshift(() => {
      setTimeout(() => {
        console.log(\`Wake up after \${time}\`);
        this.next();
      }, time * 1000);
    });
    return this;
  }

  eat(food) {
    this.tasks.push(() => {
      console.log(\`Eat \${food}~\`);
      this.next();
    });
    return this;
  }
}

// 测试用例
// new LazyMan("Hank");
// new LazyMan("Hank").sleep(10).eat("dinner");
// new LazyMan("Hank").eat("dinner").eat("supper");
// new LazyMan("Hank").eat("supper").sleepFirst(5);`,
  },
  {
    id: "convertToDecimal",
    title: "数字进制转换",
    description: "将不同进制的数字转换为十进制",
    code: `/**
 * 将给定的数字或字符串转换为十进制数。
 * 如果传入的是数字，直接返回该数字；如果是字符串，则根据进制或字符串前缀进行转换。
 * 如果转换失败，返回 null。
 *
 * @param {number|string} num - 要转换的数字或字符串。
 * @param {number} [radix] - 可选参数，指定字符串的进制。如果未提供，将根据字符串前缀自动判断。
 * @returns {number|null} - 转换后的十进制数，如果转换失败则返回 null。
 */
function convertToDecimal(num, radix) {
  // 如果传入的是数字，直接返回该数字
  if (typeof num === 'number') {
    return num;
  }

  // 如果传入的是字符串
  if (typeof num === 'string') {
    // 如果未指定进制
    if (radix === undefined) {
      // 处理十六进制字符串
      if (num.startsWith('0x') || num.startsWith('0X')) {
        return parseInt(num, 16);
      }
      // 处理二进制字符串
      if (num.startsWith('0b') || num.startsWith('0B')) {
        return parseInt(num, 2);
      }
      // 处理八进制字符串
      if (num.startsWith('0o') || num.startsWith('0O')) {
        return parseInt(num, 8);
      }
      // 默认使用十进制
      radix = 10;
    }

    // 尝试使用 parseInt 进行转换
    const intResult = parseInt(num, radix);
    // 如果转换成功，返回转换结果
    if (!isNaN(intResult)) {
      return intResult;
    }

    // 若 parseInt 转换失败，尝试使用 parseFloat 进行转换
    const floatResult = parseFloat(num);
    // 如果 parseFloat 转换成功，返回转换结果；否则返回 null
    return isNaN(floatResult) ? null : floatResult;
  }

  // 如果传入的既不是数字也不是字符串，返回 null
  return null;
}

// 调用案例
console.log(convertToDecimal(123)); // 输出: 123，因为传入的是数字，直接返回
console.log(convertToDecimal('0x1A')); // 输出: 26，自动识别为十六进制字符串并转换
console.log(convertToDecimal('0b1010')); // 输出: 10，自动识别为二进制字符串并转换
console.log(convertToDecimal('0o12')); // 输出: 10，自动识别为八进制字符串并转换
console.log(convertToDecimal('123', 10)); // 输出: 123，指定十进制进行转换
console.log(convertToDecimal('12.3')); // 输出: 12.3，使用 parseFloat 转换
console.log(convertToDecimal('abc')); // 输出: null，转换失败`,
  },
  {
    id: "isPalindrome",
    title: "回文字符串判断",
    description: "使用双指针法判断字符串是否为回文",
    code: `/**
 * @description 使用双指针法判断字符串是否为回文
 * @param {string} str - 要判断的字符串
 * @return {boolean} 如果字符串是回文返回 true，否则返回 false
 */
function isPalindrome(str) {
  // 初始化左指针，指向字符串的起始位置
  let left = 0;
  // 初始化右指针，指向字符串的末尾位置
  let right = str.length - 1;

  while (left < right) {
    // 如果左右指针指向的字符不相等，则不是回文
    if (str[left] !== str[right]) {
      return false;
    }
    // 左指针右移
    left++;
    // 右指针左移
    right--;
  }

  // 遍历完所有字符都相等，说明是回文
  return true;
}

// 使用示例
console.log(isPalindrome('racecar')); // 输出: true
console.log(isPalindrome('hello')); // 输出: false

// 扩展：忽略大小写和非字母数字字符的回文判断
function isPalindromeAdvanced(str) {
  // 转换为小写并过滤掉非字母数字字符
  const cleanStr = str.toLowerCase().replace(/[^a-z0-9]/g, '');

  let left = 0;
  let right = cleanStr.length - 1;

  while (left < right) {
    if (cleanStr[left] !== cleanStr[right]) {
      return false;
    }
    left++;
    right--;
  }

  return true;
}

// 高级版本测试
console.log(isPalindromeAdvanced('A man, a plan, a canal: Panama')); // 输出: true
console.log(isPalindromeAdvanced('race a car')); // 输出: false`,
  },
  {
    id: "chunkArray",
    title: "数组分割",
    description: "将数组按指定大小分割成多个子数组",
    code: `/**
 * @description 将一个数组按指定大小分割成多个子数组
 * @param {Array} inputArr - 要分割的原始数组
 * @param {number} chunkSize - 每个子数组包含的元素数量
 * @return {Array} 分割后的子数组组成的新数组
 */
function chunkArray(inputArr, chunkSize) {
  // 参数验证
  if (!Array.isArray(inputArr)) {
    throw new Error('第一个参数必须是数组');
  }

  if (chunkSize <= 0 || !Number.isInteger(chunkSize)) {
    throw new Error('分割大小必须是正整数');
  }

  // 定义一个空数组，用于存储分割后的子数组
  let newArr = [];

  // 使用 for 循环遍历原始数组，步长为 chunkSize
  for (let i = 0; i < inputArr.length; i += chunkSize) {
    // 将从索引 i 开始，长度为 chunkSize 的子数组添加到 newArr 中
    newArr.push(inputArr.slice(i, i + chunkSize));
  }

  return newArr;
}

// 调用示例
const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
console.log('原数组:', arr);
console.log('按2分割:', chunkArray(arr, 2)); // [[1,2], [3,4], [5,6], [7,8], [9,10]]
console.log('按3分割:', chunkArray(arr, 3)); // [[1,2,3], [4,5,6], [7,8,9], [10]]
console.log('按4分割:', chunkArray(arr, 4)); // [[1,2,3,4], [5,6,7,8], [9,10]]

// 字符串数组示例
const fruits = ['apple', 'banana', 'cherry', 'date', 'elderberry'];
console.log('水果按2分组:', chunkArray(fruits, 2)); // [['apple','banana'], ['cherry','date'], ['elderberry']]`,
  },

];

// 新增的代码片段
const additionalCodeData = [
  {
    id: "binarySearch",
    title: "二分查找算法",
    description: "在已排序数组中快速查找目标值",
    code: `/**
 * @description 二分查找算法
 * @param {number[]} arr - 已排序的输入数组（升序）
 * @param {number} target - 目标值
 * @return {number} 目标值的索引（未找到返回-1）
 */
function binarySearch(arr, target) {
  // 初始化左右指针，定义搜索范围的边界
  // 时间复杂度：O(1) - 常数时间的初始化操作
  let left = 0; // 搜索范围的左边界，初始为数组第一个元素
  let right = arr.length - 1; // 搜索范围的右边界，初始为数组最后一个元素

  // 当左指针小于等于右指针时，搜索范围内还有元素，继续搜索
  // 循环最多执行log₂n次，因为每次迭代都将搜索范围缩小一半
  while (left <= right) {
    // 计算中间位置，使用Math.floor确保得到整数索引
    // 使用(left + right) / 2可能导致大数溢出，更安全的写法是：left + Math.floor((right - left) / 2)
    const mid = Math.floor((left + right) / 2);

    // 找到目标值，直接返回索引位置（最好情况：O(1)）
    if (arr[mid] === target) return mid;

    // 中间值小于目标值，说明目标在右半部分
    // 将左边界移到中间位置的右侧，缩小搜索范围为右半部分
    if (arr[mid] < target) {
      left = mid + 1; // 排除了mid及左侧的所有元素
    } else {
      // 中间值大于目标值，说明目标在左半部分
      // 将右边界移到中间位置的左侧，缩小搜索范围为左半部分
      right = mid - 1; // 排除了mid及右侧的所有元素
    }
  }

  // 搜索范围为空仍未找到目标值，返回-1表示不存在
  return -1;
}

// 调用示例
const sortedArr2 = [2, 5, 8, 12, 16, 23, 38, 56, 72, 91]; // 创建一个已排序的数组
console.log(binarySearch(sortedArr2, 23)); // 输出: 5，表示23在数组中的索引位置
console.log(binarySearch(sortedArr2, 10)); // 输出: -1，表示10不在数组中`,
  },
  {
    id: "bubbleSort",
    title: "冒泡排序算法",
    description: "通过相邻元素交换实现数组排序",
    code: `/**
 * @description 冒泡排序算法
 * @param {number[]} arr - 输入数组
 * @return {number[]} 排序后的数组
 */
function bubbleSort(arr) {
  // 获取数组长度，用于控制循环次数
  // 时间复杂度：O(1)，常数时间操作
  const len = arr.length;

  // 外层循环：控制排序轮数，最多需要n-1轮（n为数组长度）
  // 时间复杂度：O(n)，最多执行n-1次
  for (let i = 0; i < len - 1; i++) {
    // 优化标志：记录本轮是否发生交换，用于提前终止
    // 如果一轮中没有交换，说明数组已经有序
    let swapped = false;

    // 内层循环：比较并交换相邻元素
    // 每轮比较次数递减，因为每轮结束后最大的元素已经到达正确位置
    // 时间复杂度：O(n-i-1)，随着i增加而减少
    for (let j = 0; j < len - 1 - i; j++) {
      // 比较相邻元素，如果前一个大于后一个，则交换位置
      // 这确保较大的元素逐渐"冒泡"到数组末尾
      if (arr[j] > arr[j + 1]) {
        // 使用ES6解构赋值语法交换元素，无需临时变量
        // 时间复杂度：O(1)，常数时间操作
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]]; // 交换相邻元素
        swapped = true; // 标记本轮发生了交换
      }
    }

    // 优化：如果本轮没有发生交换，说明数组已经有序，可以提前终止
    // 最好情况下（已排序数组），时间复杂度降至O(n)
    if (!swapped) break; // 提前终止：若本轮无交换则已排序完成
  }

  // 返回排序后的数组（原地排序，返回原数组的引用）
  // 总体时间复杂度：O(n²)，因为有两层嵌套循环
  // 空间复杂度：O(1)，只使用了少量额外变量
  return arr;
}

// 调用示例
const messyArr = [5, 3, 8, 4, 6]; // 创建一个未排序的数组
console.log(bubbleSort(messyArr)); // 输出: [3, 4, 5, 6, 8]，展示排序后的结果`,
  },
  {
    id: "insertionSort",
    title: "插入排序算法",
    description: "将元素逐个插入到已排序部分的正确位置",
    code: `/**
 * 插入排序
 *
 * 核心思想：
 * 类似于整理扑克牌，将每张牌插入到手中已排序牌的正确位置。
 * 将数组分为已排序和未排序两部分，逐个将未排序元素插入到已排序部分的适当位置。
 *
 * 算法步骤：
 * 1. 从第二个元素开始，将其作为待插入元素
 * 2. 将待插入元素与已排序部分的元素从后向前比较
 * 3. 找到合适位置后插入
 * 4. 重复步骤1-3直到所有元素处理完毕
 *
 * @param {Array} arr 待排序数组
 * @param {Function} compareFn 比较函数
 * @returns {Array} 排序后的数组
 * @time O(n²) 平均和最坏情况，O(n) 最好情况（已排序）
 * @space O(1) 原地排序
 */
function insertionSort(arr, compareFn = (a, b) => a - b) {
  const result = [...arr];

  for (let i = 1; i < result.length; i++) {
    const current = result[i]; // 当前要插入的元素
    let j = i - 1;

    // 在已排序部分找到插入位置
    while (j >= 0 && compareFn(result[j], current) > 0) {
      result[j + 1] = result[j]; // 被插入元素后移
      j--;
    }

    result[j + 1] = current; // 插入到正确位置
  }

  return result;
}

// 使用示例
const selectionSortarr = [5, 2, 9, 1, 5, 6];
console.log(insertionSort(selectionSortarr)); // [1, 2, 5, 5, 6, 9]`,
  },
  {
    id: "quickSort",
    title: "快速排序算法",
    description: "基于分治策略的高效排序算法",
    code: `/**
 * @description 快速排序算法
 * @param {number[]} arr - 输入数组
 * @return {number[]} 排序后的数组
 */
function quickSort(arr) {
  // 基准情况：如果数组长度小于等于1，已经是排序状态，直接返回
  // 这是递归终止条件，确保算法最终会结束
  if (arr.length <= 1) return arr; // 基准情况：长度≤1直接返回

  // 选择中间元素作为基准值（pivot）
  // 选择策略影响算法效率，中间元素通常比首尾元素更平衡
  // 更好的做法是随机选择基准值，以避免最坏情况
  const pivot = arr[Math.floor(arr.length / 2)]; // 选择中间元素作为基准值

  // 创建三个数组，分别存储小于、等于和大于基准值的元素
  // 空间复杂度：O(n)，需要额外空间存储这些数组
  const left = []; // 存储所有小于基准值的元素
  const middle = []; // 存储所有等于基准值的元素
  const right = []; // 存储所有大于基准值的元素

  // 遍历原数组，将每个元素放入对应的分区
  // 时间复杂度：O(n)，需要遍历数组中的每个元素一次
  for (const num of arr) {
    // 根据元素与基准值的比较结果，将其放入对应数组
    // 每次比较和push操作的时间复杂度都是O(1)
    if (num < pivot) left.push(num); // 小于基准值，放入left数组
    else if (num === pivot) middle.push(num); // 等于基准值，放入middle数组
    else right.push(num); // 大于基准值，放入right数组
  }

  // 递归地对left和right数组进行排序，并与middle数组合并
  // 这是分治算法的核心：将问题分解为更小的子问题，解决后合并结果
  // 时间复杂度：T(n) = 2T(n/2) + O(n)，根据主定理，解为O(n log n)
  // 最坏情况（如已排序数组）：T(n) = T(n-1) + O(n)，解为O(n²)
  return [...quickSort(left), ...middle, ...quickSort(right)];
}

// 调用示例
const unsortedArr = [34, 12, 45, 6, 89, 23]; // 创建一个未排序的数组
console.log(quickSort(unsortedArr)); // 输出: [6, 12, 23, 34, 45, 89]，展示排序后的结果`,
  },
  {
    id: "heapSort",
    title: "堆排序算法",
    description: "基于堆数据结构的排序算法",
    code: `/**
 * 堆排序
 *
 * 核心思想：
 * 1. 建堆：将无序数组构造成最大堆，最大堆的特点是每个节点的值都大于或等于其子节点的值。
 * 2. 排序：反复提取堆顶（即数组的第一个元素）的最大元素，将其放到数组的末尾。
 * 3. 调整：每次提取堆顶元素后，重新调整堆结构，使其继续保持最大堆的性质。
 *
 * @param {Array} arr 待排序数组，数组中的元素应为可比较大小的类型，如数字或字符串。
 * @returns {Array} 排序后的数组，原数组会被直接修改，返回的是排序后的原数组引用。
 * @time O(n log n) 所有情况，无论数组初始状态如何，堆排序的时间复杂度都是 O(n log n)。
 * @space O(1) 原地排序，只需要常数级的额外空间，不需要额外的数组来存储排序结果。
 */
function heapSort(arr) {
  // 获取数组的长度，后续建堆和排序过程会用到这个长度信息。
  const n = arr.length;

  // 建堆阶段：从最后一个非叶子节点开始，逐步向上调整每个节点，构建最大堆。
  // 最后一个非叶子节点的索引为 Math.floor(n / 2) - 1，因为叶子节点不需要调整。
  // 从这个节点开始，依次对每个非叶子节点调用 heapify 函数进行调整。
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    // 调用 heapify 函数，对以索引 i 为根节点的子树进行调整，使其满足最大堆的性质。
    heapify(arr, n, i);
  }

  // 排序阶段：反复提取堆顶元素（即数组的第一个元素，它是当前堆中的最大值），并将其放到数组的末尾。
  // 每提取一次堆顶元素，堆的大小就减 1，直到堆中只剩下一个元素。
  for (let i = n - 1; i > 0; i--) {
    // 调用 swap 函数，将堆顶元素（索引为 0）和当前未排序部分的最后一个元素（索引为 i）交换位置。
    // 这样，当前的最大值就被放到了数组的末尾，成为已排序部分的一部分。
    swap(arr, 0, i);
    // 交换后，堆的结构可能被破坏，需要重新调整堆。
    // 此时，堆的大小变为 i，因为最后一个元素已经是排序好的，不需要再参与堆的调整。
    // 从根节点（索引为 0）开始调用 heapify 函数，重新构建最大堆。
    heapify(arr, i, 0);
  }

  // 返回排序后的数组，由于排序过程是在原数组上进行的，所以返回的是原数组的引用。
  return arr;
}

/**
 * 堆调整函数，用于将以索引 i 为根节点的子树调整为最大堆。
 * @param {Array} arr 数组，包含待调整的元素。
 * @param {number} n 堆的大小，即当前参与堆调整的元素个数。
 * @param {number} i 要调整的节点索引，从该节点开始向下调整，使其满足最大堆的性质。
 */
function heapify(arr, n, i) {
  // 假设当前节点（索引为 i）是父节点和其子节点中的最大值。
  let largest = i;
  // 计算当前节点的左子节点的索引，在完全二叉树中，左子节点的索引为 2 * i + 1。
  const left = 2 * i + 1;
  // 计算当前节点的右子节点的索引，在完全二叉树中，右子节点的索引为 2 * i + 2。
  const right = 2 * i + 2;

  // 检查左子节点是否存在（即左子节点的索引小于堆的大小），并且左子节点的值是否大于当前假设的最大值节点的值。
  // 如果满足条件，则更新最大值节点的索引为左子节点的索引。
  if (left < n && arr[left] > arr[largest]) {
    largest = left;
  }

  // 检查右子节点是否存在（即右子节点的索引小于堆的大小），并且右子节点的值是否大于当前假设的最大值节点的值。
  // 如果满足条件，则更新最大值节点的索引为右子节点的索引。
  if (right < n && arr[right] > arr[largest]) {
    largest = right;
  }

  // 如果最大值节点的索引不等于当前节点的索引，说明当前节点不是父节点和其子节点中的最大值。
  // 此时需要交换当前节点和最大值节点的值，并递归调用 heapify 函数，继续调整以最大值节点为根的子树。
  if (largest !== i) {
    // 调用 swap 函数，交换当前节点（索引为 i）和最大值节点（索引为 largest）的值。
    swap(arr, i, largest);
    // 递归调用 heapify 函数，对以最大值节点（索引为 largest）为根的子树进行调整，确保其满足最大堆的性质。
    heapify(arr, n, largest);
  }
}

/**
 * 交换数组中两个元素的位置
 * @param {Array} arr 数组
 * @param {number} i 第一个元素的索引
 * @param {number} j 第二个元素的索引
 */
function swap(arr, i, j) {
  [arr[i], arr[j]] = [arr[j], arr[i]];
}

// 调用案例
const unsortedArray = [34, 12, 45, 6, 89, 23];
console.log("排序前的数组:", unsortedArray);
const sortedArray = heapSort([...unsortedArray]); // 使用副本避免修改原数组
console.log("排序后的数组:", sortedArray);`,
  }
];

// 合并到主数组
window.CODE_DATA = [...window.CODE_DATA, ...additionalCodeData];
