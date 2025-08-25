/**
 * 将扁平数组转换为树形结构
 * @param {Array} flatArr - 包含id和parent_id的扁平数组
 * @param {number} [rootId=0] - 根节点的parent_id值
 * @returns {Array} 树形结构数组
 */
function buildTree(flatArr, rootId = 0) {
  // 使用Map存储节点引用，优化查找效率
  const nodeMap = new Map();
  const tree = [];

  // 第一次遍历：建立id到节点的映射，并初始化children数组
  flatArr.forEach((node) => {
    nodeMap.set(node.id, { ...node, children: [] });
  });

  // 第二次遍历：构建树形结构
  flatArr.forEach((node) => {
    const currentNode = nodeMap.get(node.id);
    const parentNode = nodeMap.get(node.parent_id);

    if (parentNode) {
      // 存在父节点，添加到父节点的children
      parentNode.children.push(currentNode);
    } else if (node.parent_id === rootId) {
      // 根节点直接添加到树
      tree.push(currentNode);
    }
  });

  return tree;
}

// 使用示例
const flatArr = [
  { id: 1, title: "title1", parent_id: 0 },
  { id: 2, title: "title2", parent_id: 0 },
  { id: 3, title: "title2-1", parent_id: 2 },
  { id: 4, title: "title3-1", parent_id: 3 },
  { id: 5, title: "title4-1", parent_id: 4 },
  { id: 6, title: "title3-2", parent_id: 3 },
];

const tree = buildTree(flatArr);
console.log(JSON.stringify(tree, null, 2));

function sort(arr) {
  return flatArr.sort((a, b) => {
    return a.parent_id - b.parent_id;
  });
}
function getObj(sortArr) {
  let obj = {};
  sortArr.forEach((item) => {
    if (!obj[item.parent_id]) {
      obj[item.parent_id] = sortArr.filter(
        (sitem) => sitem.parent_id == item.parent_id
      );
    }
  });
  return obj;
}
getObj(sort(flatArr));
console.log(getObj(sort(flatArr)));
let groupArrObj = getObj(sort(flatArr));

function getChild(initObjArr = groupArrObj[0]) {
  let arr = [];

  initObjArr.forEach((item) => {
    console.log(item, "item");

    if (groupArrObj[item.id]) {
      item.child = groupArrObj[item.id];
      getChild(groupArrObj[item.id]);
    }
    arr.push(item);
  });
  return arr;
}
console.log(getChild(), 1111);

/**
 * 将扁平数组转换为树形结构
 *
 * 核心思想：
 * 1. 先按parent_id分组，建立父子关系映射
 * 2. 从根节点开始，递归构建树形结构
 *
 * @param {Array} flatArr - 扁平数组
 * @param {number} rootParentId - 根节点的parent_id值
 * @returns {Array} 树形结构数组
 * @time O(n) - 只需遍历数组两次
 * @space O(n) - 需要额外的Map存储映射关系
 */
function buildTree(flatArr, rootParentId = 0) {
  // 1. 按parent_id分组，建立映射关系
  const groupMap = new Map();

  flatArr.forEach((item) => {
    const parentId = item.parent_id;
    if (!groupMap.has(parentId)) {
      groupMap.set(parentId, []);
    }
    groupMap.get(parentId).push({ ...item }); // 避免修改原数据
  });

  // 2. 递归构建树形结构
  function buildChildren(parentId) {
    const children = groupMap.get(parentId) || [];

    return children.map((item) => {
      const childNodes = buildChildren(item.id);

      // 只有存在子节点时才添加children属性
      if (childNodes.length > 0) {
        item.children = childNodes;
      }

      return item;
    });
  }

  return buildChildren(rootParentId);
}

function abMerge(a, b) {
  if (a[1] >= b[0]) {
    return [Math.min(a[0], b[0]), Math.max(a[1], b[1])];
  }
  return null; // 不能合并时返回null
}

function isMerge(a, b) {
  if (!b) return false; // 处理undefined情况
  return a[1] >= b[0];
}

function merge(arr) {
  if (arr.length <= 1) return arr;

  const sortArr = arr.sort((a, b) => a[0] - b[0]);
  let pre = sortArr[0];
  let res = [];

  for (let i = 0; i < sortArr.length - 1; i++) {
    // 注意边界
    const next = sortArr[i + 1]; // 使用sortArr而不是arr

    if (isMerge(pre, next)) {
      pre = abMerge(pre, next);
    } else {
      res.push(pre);
      pre = next;
    }
  }

  // 关键：添加最后一个区间
  res.push(pre);

  return res;
}

// 测试
console.log(
  merge([
    [1, 4],
    [4, 5],
  ])
); // [[1,5]]
console.log(
  merge([
    [1, 3],
    [2, 6],
    [8, 10],
    [15, 18],
  ])
); // [[1,6],[8,10],[15,18]]

//如何快速找到数组中长度最长的字符串？​
const arr = ["bab", "aba"];
const longest = arr.reduce(
  (max, current) => (current.length > max.length ? current : max),
  "" // 初始值（空字符串）
);

let longest2 = "";
for (const str of arr) {
  if (str.length > longest.length) {
    longest = str;
  }
}

console.log(longest); // "bab" 或 "aba"
console.log(longest); // "bab" 或 "aba"（两者长度相同）

const longest3 = arr.sort((a, b) => b.length - a.length)[0];

console.log(longest); // "bab" 或 "aba"

/**
 * @description 缓存优化：使用闭包封装私有缓存

 * @example
 *
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

const fibonacci2 = (function () {
  // 私有缓存，外部无法直接访问
  const cache = new Map(); // 或者用普通对象：{}

  return function (n) {
    // 如果缓存中已有结果，直接返回
    if (cache.has(n)) {
      return cache.get(n);
    }

    // 基本情况
    if (n <= 1) {
      const result = n;
      cache.set(n, result); // 存入缓存
      return result;
    }

    // 递归计算并缓存结果
    const result = fibonacci2(n - 1) + fibonacci2(n - 2);
    cache.set(n, result); // 存入缓存
    return result;
  };
})();

// 测试
console.log(fibonacci2(10)); // 55
// console.log(fibonacci.cache); // 报错，cache 是私有的，无法直接访问
function ListNode(val, next) {
  this.val = val === undefined ? 0 : val;
  this.next = next === undefined ? null : next;
}
let l1 = [1, 2, 4];

function createList(list) {
  let dummy = new ListNode(0); // 创建一个哑节点
  let current = dummy; // 使用current指针来移动

  while (list.length) {
    let val = list.shift();
    current.next = new ListNode(val);
    current = current.next; // 移动指针到新节点
  }
  // console.log(dummy);

  return dummy.next; // 返回哑节点的下一个节点，即真正的头节点
}

console.log(createList(l1));

function reverseList(head) {
  let prev = null; // 前驱指针，初始为 null
  let current = head; // 当前指针，初始为头节点

  while (current !== null) {
    const next = current.next; // 保存下一个节点（关键！避免丢失后续链表）
    current.next = prev; // 翻转当前节点的指针（指向 prev）
    prev = current; // 前驱指针后移
    current = next; // 当前指针后移
  }

  return prev; // 最终 prev 是新链表的头节点
}

/**
 * 深度优先搜索标记安全区域
 * @param {number} row - 当前行
 * @param {number} col - 当前列
 */
function dfs(row, col) {
  // 边界检查和有效性检查
  if (row < 0 || row >= m || col < 0 || col >= n || board[row][col] !== "O") {
    return;
  }

  // 标记当前单元格为安全区域
  board[row][col] = "#";

  // 递归搜索四个方向
  dfs(row - 1, col); // 上
  dfs(row + 1, col); // 下
  dfs(row, col - 1); // 左
  dfs(row, col + 1); // 右
}

const flat = [
  { id: 1, name: "部门1", pid: 0 },
  { id: 2, name: "部门2", pid: 1 },
  { id: 3, name: "部门3", pid: 1 },
  { id: 4, name: "部门4", pid: 3 },
  { id: 5, name: "部门5", pid: 4 },
];

function toTree(data) {
  let res = [];
  let map = new Map();
  data.forEach((element) => {
    element.child = [];
    map.set(element.id, element);
  });
  data.forEach((element) => {
    let current = element;
    let parent = map.get(current.pid);
    if (parent) {
      parent.child.push(current);
    } else {
      res.push(current);
    }
  });
  return res;
}
function dfsPreOrder(root) {
  const result = [];

  function traverse(node) {
    if (!node) return;
    result.push(node); // 先访问根节点
    if (node.child && node.child.length > 0) {
      node.child.forEach((child) => traverse(child)); // 递归访问子节点
    }
  }

  traverse(root);
  return result;
}
function bfsTree(root) {
  if (!root) return [];

  const result = [];
  const queue = [root]; // 初始化队列，根节点入队

  while (queue.length > 0) {
    const currentNode = queue.shift(); // 队头节点出队
    result.push(currentNode); // 处理当前节点（可自定义操作）

    // 将当前节点的子节点按顺序入队
    if (currentNode.child && currentNode.child.length > 0) {
      queue.push(...currentNode.child);
    }
  }

  return result; // 返回遍历顺序的节点数组
}

// 示例调用
const tree2 = toTree(flat); // 使用之前实现的toTree函数生成树
console.log("BFS遍历结果:", bfsTree(tree[0])); // tree[0]是根节点
// 示例调用
console.log("DFS前序遍历结果:", dfsPreOrder(tree[0]));

function promiseRace(promises) {
  if (!Array.isArray(promises)) {
    throw new Error("promises must be an array");
  }
  return new Promise(function (resolve, reject) {
    promises.forEach((p) =>
      Promise.resolve(p).then(
        (data) => {
          resolve(data);
        },
        (err) => {
          reject(err);
        }
      )
    );
  });
}
// 一旦 resolve(data) 或 reject(err) 被调用，Promise 的状态就会固定（fulfilled 或 rejected），后续的 resolve/reject 调用会被静默忽略。
// 因此，即使 forEach 遍历了所有 Promise，​只有第一个完成的 Promise 的回调会真正生效，后续的调用不会改变结果。
function myPromiseAny(arr) {
  if (!Array.isArray(arr)) {
    return Promise.reject(new TypeError("Argument must be an array")); // 更规范的错误类型
  }
  if (arr.length === 0) {
    return Promise.reject(new AggregateError([], "All promises were rejected")); // 空数组直接失败
  }

  let rejectCount = 0;
  const errors = []; // 存储所有失败错误

  return new Promise((resolve, reject) => {
    arr.forEach((item) => {
      Promise.resolve(item) // 确保处理非 Promise 值
        .then((data) => {
          resolve(data); // 任一成功立即返回
        })
        .catch((error) => {
          errors.push(error); // 收集错误
          rejectCount++;
          if (rejectCount === arr.length) {
            reject(new AggregateError(errors, "All promises were rejected")); // 传递所有错误
          }
        });
    });
  });
}

versions = ["0.1.1", "2.3.3", "0.302.1", "4.2", "4.3.5", "4.3.4.5"];
function compareVersions(versions) {
  return versions.sort((a, b) => {
    const tempA = a.split(".");
    const tempB = b.split(".");
    const maxLen = Math.max(tempA.length, tempB.length);
    for (let i = 0; i < maxLen; i++) {
      const valueA = +tempA[i] || 0;
      const valueB = +tempB[i] || 0;
      if (valueA === valueB) {
        continue;
      }
      return valueA - valueB;
    }
    return 0;
  });
}
function addLargeNumbers(a, b) {
  let alen = a.length - 1;
  let blen = b.length - 1;
  let result = "";
  let carry = 0; // 更清晰的变量名：nextOne -> carry

  while (alen >= 0 || blen >= 0 || carry) {
    // 安全获取当前位的数字（如果已遍历完则补0）
    const aDigit = a[alen] ? parseInt(a[alen], 10) : 0;
    const bDigit = b[blen] ? parseInt(b[blen], 10) : 0;

    // 计算当前位的和（包括进位）
    let sum = aDigit + bDigit + carry;

    // 处理进位
    if (sum > 9) {
      sum = sum % 10;
      carry = 1;
    } else {
      carry = 0;
    }

    // 将当前位结果拼接到最前面
    result = sum + result;

    // 移动指针
    alen--;
    blen--;
  }

  console.log(result);
}

bigAdd("2223", "7890"); // 输出 "10113"
function sum(...initialArgs) {
  // 存储所有传入的参数
  let args = [...initialArgs];

  // 定义一个可以继续接受参数的函数
  function nextSum(...nextArgs) {
    args = args.concat(nextArgs);
    return nextSum; // 返回自身以支持链式调用
  }

  // 添加 sumOf 方法来计算总和
  nextSum.sumOf = function () {
    return args.reduce((total, num) => total + num, 0);
  };

  // 初始调用时也返回 nextSum 函数以支持链式调用
  return nextSum;
}

// 测试用例
console.log(sum(1, 2).sumOf()); // 3
console.log(sum(1, 2)(3).sumOf()); // 6
console.log(sum(1)(2, 3, 4).sumOf()); // 10
console.log(sum(1, 2)(3, 4)(5).sumOf()); // 15

/**
 * 带重试机制的异步请求函数
 * @param {Function} requestFn - 需要执行的异步请求函数（返回 Promise）
 * @returns {Promise} - 返回最终结果（成功或失败）
 */
function retryRequest(requestFn) {
  // 最大重试次数（2次：200ms 和 500ms）
  const maxRetries = 2;
  // 重试延迟时间（毫秒）
  const retryDelays = [200, 500];
  // 当前重试次数
  let retryCount = 0;

  // 定义一个递归函数来执行请求和重试
  function executeRequest() {
    return requestFn()
      .then((result) => {
        // 请求成功，直接返回结果
        return result;
      })
      .catch((error) => {
        // 请求失败，检查是否还有重试机会
        if (retryCount < maxRetries) {
          retryCount++;
          const delay = retryDelays[retryCount - 1];
          console.log(`请求失败，${delay}ms 后重试...（第 ${retryCount} 次）`);
          // 延迟后再次尝试
          return new Promise((resolve) => {
            setTimeout(() => {
              resolve(executeRequest());
            }, delay);
          });
        } else {
          // 重试次数用完，返回失败
          console.log("重试次数用完，返回失败");
          throw error; // 抛出错误，让调用方处理
        }
      });
  }

  // 开始执行
  return executeRequest();
}

// --- 测试用例 ---
// 模拟一个可能失败的异步请求函数
function mockRequest() {
  return new Promise((resolve, reject) => {
    const shouldFail = Math.random() > 0.3; // 70% 概率失败
    if (shouldFail) {
      reject(new Error("请求失败"));
    } else {
      resolve("请求成功");
    }
  });
}

// 调用 retryRequest 测试
retryRequest(mockRequest)
  .then((result) => {
    console.log("最终结果:", result);
  })
  .catch((error) => {
    console.error("最终失败:", error.message);
  });

const xhr = new XMLHttpRequest();
xhr.open("POST", "https://api.example.com/data", true);
xhr.setRequestHeader("Content-Type", "application/json");
xhr.onreadystatechange = function () {
  if (xhr.readyState === 4) {
    if (xhr.status === 200) {
      console.log("响应数据:", xhr.responseText);
    } else {
      console.error("请求失败，状态码:", xhr.status);
    }
  }
};
xhr.send(JSON.stringify({ key: "value" }));

Promise.prototype.myFinally = function (callback) {
  // 返回一个新的 Promise，确保链式调用
  return this.then(
    // 成功时，先执行 callback，再返回原结果
    (value) => Promise.resolve(callback()).then(() => value),
    // 失败时，先执行 callback，再返回原错误
    (error) => Promise.resolve(callback()).then(() => Promise.reject(error))
  );
};
// 自动执行器：用 Promise 驱动 Generator 执行，模拟 async/await
function runGenerator(generatorFunc) {
  const generator = generatorFunc(); // 调用 Generator 函数，返回生成器对象

  function handle(result) {
    if (result.done) return; // 如果 Generator 已执行完毕，结束

    const value = result.value;

    // 如果 yield 出来的是一个 Promise
    if (value instanceof Promise) {
      value
        .then((res) => {
          // Promise 完成，将结果传回 Generator，并继续执行下一步
          handle(generator.next(res));
        })
        .catch((err) => {
          // Promise 被拒绝，将错误抛回 Generator（可被内部 try/catch 捕获）
          handle(generator.throw(err));
        });
    } else {
      // 如果不是 Promise，也继续执行（但通常我们 yield 的是 Promise）
      handle(generator.next(value));
    }
  }

  // 启动执行
  try {
    handle(generator.next());
  } catch (err) {
    console.error("Generator 执行出错:", err);
  }
}
// 定义一个 Generator 函数，模拟 async 函数逻辑
function* getDataGenerator() {
  try {
    const res1 = yield Promise.resolve("Hello");
    const res2 = yield Promise.resolve("World");
    console.log(res1, res2); // 输出: Hello World
  } catch (err) {
    console.error("捕获到错误:", err);
  }
}

// 使用自动执行器来运行这个 Generator
runGenerator(getDataGenerator);

function myCreate(proto, propertiesObject) {
  // 1. 创建一个空函数（构造函数）
  function F() {}

  // 2. 将该函数的 prototype 指向传入的 proto 对象
  F.prototype = proto;

  // 3. 通过 new 调用该构造函数，创建一个新对象，其 [[Prototype]] 指向 proto
  const obj = new F();

  // 4. （可选）如果传入了 propertiesObject，则处理属性描述符（暂不实现）
  if (propertiesObject) {
    // 这里可以后续扩展，使用 Object.defineProperties(obj, propertiesObject)
    Object.defineProperties(obj, propertiesObject);
  }

  // 5. 返回新对象
  return obj;
}

// 原型对象
const person = {
  greet() {
    console.log(`Hello, I'm ${this.name}`);
  },
};

// 使用手写的 myCreate 创建新对象
const john = myCreate(person);
john.name = "John";
john.greet(); // 输出: Hello, I'm John

// 检查原型链
console.log(Object.getPrototypeOf(john) === person); // true


Function.prototype.myBind = function(thisArg, ...bindArgs) {
  // 保存原函数（this 是调用 myBind 的函数）
  const originalFunc = this;

  // 定义绑定函数（返回的函数）
  function boundFunc(...callArgs) {
    // 合并绑定参数和调用参数
    const allArgs = bindArgs.concat(callArgs);

    // 判断是否通过 new 调用（关键逻辑）
    if (new.target === boundFunc) {
      // new 调用时，原函数作为构造函数，this 指向新实例
      // 使用 Reflect.construct 等价于 new originalFunc(...allArgs)
      return new originalFunc(...allArgs);
    } else {
      // 普通调用时，使用绑定的 thisArg 作为上下文
      return originalFunc.apply(thisArg, allArgs);
    }
  }

  // 绑定函数的 prototype 指向原函数的 prototype（保证原型链正确）
  // 注意：必须通过 Object.create 来继承，避免共享原型的引用
  boundFunc.prototype = Object.create(originalFunc.prototype);

  return boundFunc;
};
const person2 = { name: 'Alice' };
function greet(msg) {
  return `${msg}, ${this.name}`;
}

const boundGreet = greet.myBind(person, 'Hello');
console.log(boundGreet()); // 输出："Hello, Alice"（this 正确绑定）

function User(age) {
  this.age = age;
  this.intro = function() {
    return `I'm ${this.name}, ${this.age} years old`;
  };
}
User.prototype.name = 'Default';

const BoundUser = User.myBind({ name: 'Bob' }); // 绑定 thisArg 为 { name: 'Bob' }
const user = new BoundUser(20); // new 调用，thisArg 被忽略

console.log(user.age); // 输出：20（构造函数正确初始化）
console.log(user.intro()); // 输出："I'm Default, 20 years old"（this 指向新实例，原型链正确）
function Car(brand) {
  this.brand = brand;
  return { type: 'vehicle' }; // 构造函数返回对象
}
const BoundCar = Car.myBind(null);
const car = new BoundCar('Tesla');

console.log(car); // 输出：{ type: 'vehicle' }（new 调用返回原函数的返回值）

/**
 * 分批插入DOM
 * @param {Array} data - 数据数组
 * @param {HTMLElement} container - 容器元素
 * @param {number} batchSize - 每批插入数量
 */
function batchInsert(data, container, batchSize = 500) {
  let index = 0;

  function insertBatch() {
    const fragment = document.createDocumentFragment();
    const end = Math.min(index + batchSize, data.length);

    for (; index < end; index++) {
      const div = document.createElement('div');
      div.textContent = data[index];
      fragment.appendChild(div);
    }

    container.appendChild(fragment);

    if (index < data.length) {
      requestAnimationFrame(insertBatch);
    }
  }

  insertBatch();
}

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

const p = new MyPromise((resolve, reject) => {
  setTimeout(() => {
    resolve('成功啦！');
  }, 1000);
});

p.then(
  value => {
    console.log(value); // 1秒后输出：成功啦！
    return '链式调用';
  },
  reason => {
    console.error(reason);
  }
).then(value => {
  console.log(value); // 输出：链式调用
});

function findThreeSum(nums, target) {
  const n = nums.length;

  // 1. 先排序（便于双指针操作）
  nums.sort((a, b) => a - b);

  for (let i = 0; i < n - 2; i++) {
    const current = nums[i];
    const need = target - current;

    let left = i + 1;
    let right = n - 1;

    while (left < right) {
      const sum = nums[left] + nums[right];

      if (sum === need) {
        // 找到一个解就返回
        return [current, nums[left], nums[right]];
      } else if (sum < need) {
        left++; // 需要更大的数
      } else {
        right--; // 需要更小的数
      }
    }
  }

  // 如果没有找到，返回空数组或 null
  return []; // 或者 return null;
}

// 示例测试
const nums = [1, 5, 8, 10, 12];
const target = 19;

const result = findThreeSum(nums, target);
console.log(result); // 输出可能是 [1, 8, 10] 或 [5, 8, 6]（但这里正好是 [1, 8, 10] = 19）


class AnalyzeWebpackPlugin {
  apply(compiler) {
      //  markdown表格的头部
      let content = `| filename | size |
| --- | --- |
`
      // 注册emit钩子
      compiler.hooks.emit.tap('AnalyzeWebpackPlugin', (compliaction) => {
          const arr = []
          // 获取所有即将输出的资源
          Object.keys(compliaction.assets).forEach(filename => {
              const file = compliaction.assets[filename]
              // 资源大小转换为kb
              const obj = { filename, size: Math.ceil(file.size() / 1024) }
              arr.push(obj)
          })
          // 降序
          arr.sort((a, b) => b.size - a.size)
          arr.forEach(item => {
              const { filename, size } = item
              const str = `| ${filename} | ${size}kb |`
              content += str + "\n"
          })
          // 输出markdown文件
          compliaction.assets['analyze.md'] = {
              source() {
                  return content
              },
              size() {
                  return content.length
              }
          }
      })
  }
}

module.exports = AnalyzeWebpackPlugin



// ws 表示非加密，wss 表示加密（类似 https）
const socket = new WebSocket('ws://localhost:8080/ws');
socket.addEventListener('open', (event) => {
  console.log('WebSocket 连接已建立');
  socket.send('Hello, Server!');
});

socket.addEventListener('message', (event) => {
  console.log('收到服务器消息:', event.data);
});
socket.addEventListener('close', (event) => {
  console.log('WebSocket 连接已关闭');
});

Promise.myAllSettled = function(promises) {
  return new Promise((resolve) => {
    // 如果传入的不是可迭代对象，直接返回 resolved promise
    if (promises == null || typeof promises[Symbol.iterator] !== 'function') {
      return resolve([]);
    }
    
    const results = [];
    let completedCount = 0;
    const promisesArray = Array.from(promises);
    const total = promisesArray.length;
    
    // 如果传入空数组，直接返回空结果
    if (total === 0) {
      return resolve([]);
    }
    
    promisesArray.forEach((promise, index) => {
      // 确保每个值都是 Promise
      Promise.resolve(promise)
        .then(value => {
          results[index] = {
            status: 'fulfilled',
            value: value
          };
        })
        .catch(reason => {
          results[index] = {
            status: 'rejected',
            reason: reason
          };
        })
        .finally(() => {
          completedCount++;
          // 所有 Promise 都已完成
          if (completedCount === total) {
            resolve(results);
          }
        });
    });
  });
};

