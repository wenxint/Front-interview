/**
 * 前端高频手写题代码数据 - 第二批
 * 基于常看2js.js内容完整生成
 */
window.CODE_DATA_2 = [
  {
    id: "buildTreeFromFlat",
    title: "扁平数组转树形结构",
    description: "将包含id和parent_id的扁平数组转换为树形结构",
    code: `/**
 * @description 将扁平数组转换为树形结构
 * @param {Array} flatArr - 包含id和parent_id的扁平数组
 * @param {number} [rootId=0] - 根节点的parent_id值
 * @returns {Array} 树形结构数组
 * @time O(n) - 只需遍历数组两次
 * @space O(n) - 需要额外的Map存储映射关系
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
  { id: 1, title: "title1", parent_id: 0 }
  { id: 2, title: "title2", parent_id: 0 },
  { id: 3, title: "title2-1", parent_id: 2 },
  { id: 4, title: "title3-1", parent_id: 3 },
  { id: 5, title: "title4-1", parent_id: 4 },
  { id: 6, title: "title3-2", parent_id: 3 },
];

const tree = buildTree(flatArr);
console.log(JSON.stringify(tree, null, 2));
// 输出树形结构，每个节点包含其子节点的children数组`
  },

  {
    id: "buildTreeOptimized",
    title: "扁平数组转树形结构（优化版）",
    description: "使用分组映射优化的树形结构转换算法",
    code: `/**
 * @description 将扁平数组转换为树形结构（优化版）
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
function buildTreeOptimized(flatArr, rootParentId = 0) {
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

// 使用示例
const flatData = [
  { id: 1, title: "根节点1", parent_id: 0 },
  { id: 2, title: "根节点2", parent_id: 0 },
  { id: 3, title: "子节点2-1", parent_id: 2 },
  { id: 4, title: "子节点3-1", parent_id: 3 },
  { id: 5, title: "子节点4-1", parent_id: 4 },
  { id: 6, title: "子节点3-2", parent_id: 3 },
];

const optimizedTree = buildTreeOptimized(flatData);
console.log('优化版树形结构:', JSON.stringify(optimizedTree, null, 2));`
  },

  {
    id: "mergeIntervals",
    title: "区间合并算法",
    description: "合并重叠的区间，返回合并后的区间数组",
    code: `/**
 * @description 区间合并算法
 * @param {number[][]} intervals - 区间数组，每个区间为[start, end]
 * @return {number[][]} 合并后的区间数组
 * @time O(n log n) - 主要是排序的时间复杂度
 * @space O(1) - 不考虑输出数组的空间复杂度
 */

/**
 * @description 合并两个区间
 * @param {number[]} a - 第一个区间
 * @param {number[]} b - 第二个区间
 * @return {number[]|null} 合并后的区间，无法合并时返回null
 */
function abMerge(a, b) {
  if (a[1] >= b[0]) {
    return [Math.min(a[0], b[0]), Math.max(a[1], b[1])];
  }
  return null; // 不能合并时返回null
}

/**
 * @description 判断两个区间是否可以合并
 * @param {number[]} a - 第一个区间
 * @param {number[]} b - 第二个区间
 * @return {boolean} 是否可以合并
 */
function isMerge(a, b) {
  if (!b) return false; // 处理undefined情况
  return a[1] >= b[0];
}

/**
 * @description 合并重叠区间
 * @param {number[][]} arr - 区间数组
 * @return {number[][]} 合并后的区间数组
 */
function merge(arr) {
  if (arr.length <= 1) return arr;

  // 按起始位置排序
  const sortArr = arr.sort((a, b) => a[0] - b[0]);
  let pre = sortArr[0];
  let res = [];

  for (let i = 0; i < sortArr.length - 1; i++) {
    const next = sortArr[i + 1];

    if (isMerge(pre, next)) {
      // 可以合并，更新当前区间
      pre = abMerge(pre, next);
    } else {
      // 不能合并，将当前区间加入结果
      res.push(pre);
      pre = next;
    }
  }

  // 关键：添加最后一个区间
  res.push(pre);

  return res;
}

// 测试用例
console.log(merge([[1, 4], [4, 5]])); // 输出: [[1, 5]]
console.log(merge([[1, 3], [2, 6], [8, 10], [15, 18]]));
// 输出: [[1, 6], [8, 10], [15, 18]]

// 更多测试案例
console.log(merge([[1, 3], [2, 6], [8, 10], [15, 18]]));
console.log(merge([[1, 4], [0, 4]])); // [[0, 4]]
console.log(merge([[1, 4], [2, 3]])); // [[1, 4]]`
  },

  {
    id: "findLongestString",
    title: "查找数组中最长字符串",
    description: "使用多种方法快速找到数组中长度最长的字符串",
    code: `/**
 * @description 如何快速找到数组中长度最长的字符串
 * 提供多种实现方法，包括reduce、for循环和sort方法
 */

// 测试数组
const stringArray = ["hello", "javascript", "world", "programming", "code"];

/**
 * @description 方法1：使用reduce方法
 * @param {string[]} arr - 字符串数组
 * @return {string} 最长的字符串
 * @time O(n) - 遍历一次数组
 * @space O(1) - 常数空间复杂度
 */
function findLongestByReduce(arr) {
  return arr.reduce(
    (max, current) => (current.length > max.length ? current : max),
    "" // 初始值（空字符串）
  );
}

/**
 * @description 方法2：使用for循环
 * @param {string[]} arr - 字符串数组
 * @return {string} 最长的字符串
 * @time O(n) - 遍历一次数组
 * @space O(1) - 常数空间复杂度
 */
function findLongestByLoop(arr) {
  let longest = "";
  for (const str of arr) {
    if (str.length > longest.length) {
      longest = str;
    }
  }
  return longest;
}

/**
 * @description 方法3：使用sort方法
 * @param {string[]} arr - 字符串数组
 * @return {string} 最长的字符串
 * @time O(n log n) - 排序的时间复杂度
 * @space O(n) - 可能需要额外空间进行排序
 */
function findLongestBySort(arr) {
  return [...arr].sort((a, b) => b.length - a.length)[0];
}

/**
 * @description 方法4：获取所有最长字符串（如果有多个相同长度）
 * @param {string[]} arr - 字符串数组
 * @return {string[]} 所有最长的字符串数组
 */
function findAllLongest(arr) {
  if (arr.length === 0) return [];

  const maxLength = Math.max(...arr.map(str => str.length));
  return arr.filter(str => str.length === maxLength);
}

// 使用示例和性能对比
console.log('测试数组:', stringArray);
console.log('Reduce方法结果:', findLongestByReduce(stringArray)); // "programming"
console.log('循环方法结果:', findLongestByLoop(stringArray)); // "programming"
console.log('排序方法结果:', findLongestBySort(stringArray)); // "programming"
console.log('所有最长字符串:', findAllLongest(stringArray)); // ["programming"]

// 性能测试
console.time('Reduce方法');
for(let i = 0; i < 10000; i++) {
  findLongestByReduce(stringArray);
}
console.timeEnd('Reduce方法');

console.time('循环方法');
for(let i = 0; i < 10000; i++) {
  findLongestByLoop(stringArray);
}
console.timeEnd('循环方法');

console.time('排序方法');
for(let i = 0; i < 10000; i++) {
  findLongestBySort(stringArray);
}
console.timeEnd('排序方法');`
  },

  {
    id: "memoizeFunction",
    title: "函数记忆化（缓存优化）",
    description: "使用记忆化技术优化函数性能，包括基础版本和闭包封装版本",
    code: `/**
 * @description 函数记忆化（Memoization）- 缓存优化技术
 *
 * 记忆化是一种将函数调用结果缓存起来的优化技术，
 * 当再次调用相同参数的函数时，直接返回缓存的结果，避免重复计算。
 */

/**
 * @description 基础记忆化实现
 * @param {Function} fn - 需要记忆化的函数
 * @return {Function} 记忆化后的函数
 * @time O(1) - 缓存命中时，O(原函数时间复杂度) - 缓存未命中时
 * @space O(n) - n为不同参数组合的数量
 */
function memoize(fn) {
  const cache = new Map();

  return function (...args) {
    // 将参数序列化为键
    const key = JSON.stringify(args);

    // 检查缓存中是否已有结果
    if (cache.has(key)) {
      console.log(\`缓存命中: \${key}\`);
      return cache.get(key);
    }

    // 计算结果并存入缓存
    console.log(\`计算中: \${key}\`);
    const result = fn.apply(this, args);
    cache.set(key, result);
    return result;
  };
}

/**
 * @description 斐波那契数列（使用基础记忆化）
 */
const fibonacci = memoize(function (n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
});

/**
 * @description 斐波那契数列（使用闭包封装私有缓存）
 * 优势：缓存完全私有，外部无法访问或修改
 */
const fibonacciPrivate = (function() {
  // 私有缓存，外部无法直接访问
  const cache = new Map(); // 或者用普通对象：{}

  return function(n) {
    // 如果缓存中已有结果，直接返回
    if (cache.has(n)) {
      console.log(\`私有缓存命中: fibonacci(\${n})\`);
      return cache.get(n);
    }

    console.log(\`私有缓存计算: fibonacci(\${n})\`);

    // 基本情况
    if (n <= 1) {
      const result = n;
      cache.set(n, result); // 存入缓存
      return result;
    }

    // 递归计算并缓存结果
    const result = fibonacciPrivate(n - 1) + fibonacciPrivate(n - 2);
    cache.set(n, result); // 存入缓存
    return result;
  };
})();

/**
 * @description 带过期时间的记忆化
 * @param {Function} fn - 需要记忆化的函数
 * @param {number} ttl - 缓存过期时间（毫秒）
 * @return {Function} 记忆化后的函数
 */
function memoizeWithTTL(fn, ttl = 5000) {
  const cache = new Map();

  return function(...args) {
    const key = JSON.stringify(args);
    const now = Date.now();

    // 检查缓存是否存在且未过期
    if (cache.has(key)) {
      const { value, timestamp } = cache.get(key);
      if (now - timestamp < ttl) {
        console.log(\`TTL缓存命中: \${key}\`);
        return value;
      } else {
        console.log(\`TTL缓存过期: \${key}\`);
        cache.delete(key);
      }
    }

    // 计算结果并缓存
    console.log(\`TTL计算中: \${key}\`);
    const result = fn.apply(this, args);
    cache.set(key, { value: result, timestamp: now });
    return result;
  };
}

// 使用示例
console.log('=== 基础记忆化测试 ===');
console.log(fibonacci(10)); // 计算过程会显示缓存命中情况
console.log(fibonacci(10)); // 第二次调用直接从缓存返回

console.log('\\n=== 私有缓存测试 ===');
console.log(fibonacciPrivate(8)); // 显示私有缓存的工作过程
console.log(fibonacciPrivate(8)); // 缓存命中

console.log('\\n=== TTL缓存测试 ===');
const expensiveOperation = memoizeWithTTL((x, y) => {
  return Math.pow(x, y) + Math.sqrt(x * y);
}, 3000); // 3秒过期

console.log(expensiveOperation(10, 3)); // 首次计算
console.log(expensiveOperation(10, 3)); // 缓存命中
// 3秒后再次调用会重新计算

// 性能对比示例
console.log('\\n=== 性能对比 ===');
function slowFibonacci(n) {
  if (n <= 1) return n;
  return slowFibonacci(n - 1) + slowFibonacci(n - 2);
}

console.time('未优化版本');
console.log('结果:', slowFibonacci(35));
console.timeEnd('未优化版本');

console.time('记忆化版本');
console.log('结果:', fibonacci(35));
console.timeEnd('记忆化版本');`
  },



  { id: "reverseList",
    title: "反转链表",
    description: "单链表反转的实现",
    code: `/**
 * @description 反转单链表
 * @param {ListNode} head - 链表头节点
 * @return {ListNode} 反转后的链表头节点
 * @time O(n) - 只需遍历一次链表
 * @space O(1) - 使用常数级额外空间
 */
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
}`
  },
  {
    id: "dfsTraversal",
    title: "深度优先搜索（DFS）二维数组边界",
    description: "深度优先搜索遍历二维数组",
    code: `/**
 * @description 深度优先搜索标记安全区域
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
}`
  },
  {
    id: "buildTreeAndTraverse",
    title: "树形结构构建与遍历",
    description: "将扁平数组转换为树形结构并实现DFS和BFS遍历",
    code: `/**
 * @description 将扁平数组转换为树形结构
 * @param {Array} data - 包含id和pid的扁平数组
 * @return {Array} 树形结构数组
 */
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

/**
 * @description 深度优先前序遍历
 * @param {Object} root - 树的根节点
 * @return {Array} 遍历结果数组
 */
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

/**
 * @description 广度优先遍历
 * @param {Object} root - 树的根节点
 * @return {Array} 遍历结果数组
 */
function bfsTree(root) {
  if (!root) return [];

  const result = [];
  const queue = [root]; // 初始化队列，根节点入队

  while (queue.length > 0) {
    const currentNode = queue.shift(); // 队头节点出队
    result.push(currentNode); // 处理当前节点

    // 将当前节点的子节点按顺序入队
    if (currentNode.child && currentNode.child.length > 0) {
      queue.push(...currentNode.child);
    }
  }

  return result; // 返回遍历顺序的节点数组
}`
  },
  {
    id: "promiseRace",
    title: "Promise.race 实现",
    description: "实现Promise.race方法，返回第一个完成的Promise结果",
    code: `/**
 * @description 实现Promise.race
 * @param {Promise[]} promises - Promise数组
 * @return {Promise} 新的Promise实例
 * @time O(1) - 立即返回Promise
 * @space O(1) - 常数级空间复杂度
 */
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
}`
  },
  {
    id: "promiseAny",
    title: "Promise.any 实现",
    description: "实现Promise.any方法，返回第一个成功的Promise结果",
    code: `/**
 * @description 实现Promise.any
 * @param {Promise[]} arr - Promise数组
 * @return {Promise} 新的Promise实例
 * @time O(1) - 立即返回Promise
 * @space O(n) - 存储错误信息的数组
 */
function myPromiseAny(arr) {
  if (!Array.isArray(arr)) {
    return Promise.reject(new TypeError("Argument must be an array"));
  }
  if (arr.length === 0) {
    return Promise.reject(new AggregateError([], "All promises were rejected"));
  }

  let rejectCount = 0;
  const errors = []; // 存储所有失败错误

  return new Promise((resolve, reject) => {
    arr.forEach((item) => {
      Promise.resolve(item)
        .then((data) => {
          resolve(data); // 任一成功立即返回
        })
        .catch((error) => {
          errors.push(error); // 收集错误
          rejectCount++;
          if (rejectCount === arr.length) {
            reject(new AggregateError(errors, "All promises were rejected"));
          }
        });
    });
  });
}`
  },
  // 以下是从常看2js.js文件424-589行添加的代码
  {
    id: "compareVersions",
    title: "版本号比较",
    description: "比较两个版本号字符串的大小",
    code: `/**
 * @description 比较两个版本号字符串的大小
 * @param {string} version1 - 第一个版本号
 * @param {string} version2 - 第二个版本号
 * @return {number} 比较结果：1表示version1>version2，-1表示version1<version2，0表示相等
 * @time O(max(m,n)) - m和n分别是两个版本号的长度
 * @space O(m+n) - 存储分割后的数组
 */
function compareVersions(version1, version2) {
  // 将版本号按.分割成数组
  const v1Parts = version1.split('.');
  const v2Parts = version2.split('.');
  
  // 获取较长数组的长度
  const maxLength = Math.max(v1Parts.length, v2Parts.length);
  
  // 逐位比较版本号的每个部分
  for (let i = 0; i < maxLength; i++) {
    // 如果某个版本号的部分不存在，视为0
    const v1Num = parseInt(v1Parts[i] || '0', 10);
    const v2Num = parseInt(v2Parts[i] || '0', 10);
    
    // 比较数字大小
    if (v1Num > v2Num) return 1;
    if (v1Num < v2Num) return -1;
  }
  
  // 所有部分都相等
  return 0;
}

// 测试用例
console.log(compareVersions('1.2.3', '1.2.4')); // -1
console.log(compareVersions('1.2.3', '1.2.3')); // 0
console.log(compareVersions('1.2.4', '1.2.3')); // 1
console.log(compareVersions('1.2', '1.2.0')); // 0
console.log(compareVersions('1.10', '1.2')); // 1`  
  },
  {
    id: "addLargeNumbers",
    title: "大数相加",
    description: "实现两个大数字符串的相加运算",
    code: `/**
 * @description 实现两个大数字符串的相加运算
 * @param {string} num1 - 第一个大数字符串
 * @param {string} num2 - 第二个大数字符串
 * @return {string} 相加结果字符串
 * @time O(max(m,n)) - m和n分别是两个数字字符串的长度
 * @space O(max(m,n)) - 存储结果数组
 */
function bigNumberAdd(num1, num2) {
  let i = num1.length - 1; // 从 num1 的最低位开始
  let j = num2.length - 1; // 从 num2 的最低位开始
  let carry = 0;           // 进位标志
  let result = '';         // 存储最终结果

  // 从最低位到最高位逐位相加
  while (i >= 0 || j >= 0 || carry > 0) {
    // 获取当前位的数字（若已遍历完某数字，则补 0）
    const digit1 = i >= 0 ? parseInt(num1[i--], 10) : 0;
    const digit2 = j >= 0 ? parseInt(num2[j--], 10) : 0;

    // 当前位相加 + 进位
    const sum = digit1 + digit2 + carry;

    // 计算当前位的值（取个位数）和新的进位
    result = (sum % 10) + result; // 当前位结果
    carry = Math.floor(sum / 10); // 新的进位
  }

  return result; // 返回最终结果字符串
}

// 测试用例
console.log(addLargeNumbers('123456789', '987654321')); // 1111111110
console.log(addLargeNumbers('999', '1')); // 1000
console.log(addLargeNumbers('0', '0')); // 0`  
  },
  {
    id: "sum",
    title: "数组求和",
    description: "实现数组元素的求和运算",
    code: `/**
 * @description 实现数组元素的求和运算
 * @param {number[]} arr - 数字数组
 * @return {number} 数组元素的和
 * @time O(n) - 需要遍历数组一次
 * @space O(1) - 只使用常数级额外空间
 */
function sum(arr) {
  // 检查输入是否为数组
  if (!Array.isArray(arr)) {
    throw new Error('Input must be an array');
  }
  
  // 使用reduce方法计算数组元素的和
  return arr.reduce((accumulator, currentValue) => {
    // 检查数组元素是否为数字
    if (typeof currentValue !== 'number') {
      throw new Error('Array elements must be numbers');
    }
    return accumulator + currentValue;
  }, 0); // 初始值为0
}

// 测试用例
console.log(sum([1, 2, 3, 4, 5])); // 15
console.log(sum([10, -5, 3])); // 8
console.log(sum([])); // 0

// 错误情况测试
try {
  sum('not an array');
} catch (error) {
  console.log(error.message); // Input must be an array
}

try {
  sum([1, 2, '3', 4]);
} catch (error) {
  console.log(error.message); // Array elements must be numbers
}`  
  },
  {
    id: "retryRequest",
    title: "请求重试机制",
    description: "实现带有重试机制的HTTP请求",
    code: `/**
 * @description 实现带有重试机制的HTTP请求
 * @param {string} url - 请求URL
 * @param {Object} options - 请求选项
 * @param {number} maxRetries - 最大重试次数
 * @return {Promise} 请求Promise
 * @time O(n) - n为重试次数
 * @space O(1) - 常数级空间复杂度
 */
async function retryRequest(url, options = {}, maxRetries = 3) {
  for (let i = 0; i <= maxRetries; i++) {
    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        throw new Error(\`HTTP error! status: \${response.status}\`);
      }
      return response;
    } catch (error) {
      console.log(\`Request failed, attempt \${i + 1}: \${error.message}\`);
      
      // 如果是最后一次尝试，抛出错误
      if (i === maxRetries) {
        throw new Error(\`Request failed after \${maxRetries + 1} attempts: \${error.message}\`);
      }
      
      // 等待一段时间再重试（指数退避）
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000));
    }
  }
}

// 使用示例
// retryRequest('https://api.example.com/data')
//   .then(response => response.json())
//   .then(data => console.log(data))
//   .catch(error => console.error('Final error:', error));`  
  },
  {
    id: "xmlHttpRequestExample",
    title: "XMLHttpRequest示例",
    description: "使用原生XMLHttpRequest发送HTTP请求的示例",
    code: `/**
 * @description 使用原生XMLHttpRequest发送HTTP请求的示例
 * @param {string} method - HTTP方法（GET、POST等）
 * @param {string} url - 请求URL
 * @param {Object} data - 请求数据（用于POST请求）
 * @return {Promise} 请求Promise
 */
function xmlHttpRequestExample(method, url, data) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    
    // 配置请求
    xhr.open(method, url);
    
    // 设置请求头
    if (method === 'POST' && data) {
      xhr.setRequestHeader('Content-Type', 'application/json');
    }
    
    // 处理响应
    xhr.onload = function() {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(JSON.parse(xhr.responseText));
      } else {
        reject(new Error(\`Request failed with status \${xhr.status}: \${xhr.statusText}\`));
      }
    };
    
    // 处理网络错误
    xhr.onerror = function() {
      reject(new Error('Network error'));
    };
    
    // 发送请求
    if (method === 'POST' && data) {
      xhr.send(JSON.stringify(data));
    } else {
      xhr.send();
    }
  });
}

// 使用示例
// xmlHttpRequestExample('GET', 'https://api.example.com/data')
//   .then(data => console.log(data))
//   .catch(error => console.error(error));
// 
// xmlHttpRequestExample('POST', 'https://api.example.com/data', { key: 'value' })
//   .then(data => console.log(data))
//   .catch(error => console.error(error));`  
  },
  {
    id: "promiseFinally",
    title: "Promise.prototype.finally实现",
    description: "实现Promise.prototype.finally方法",
    code: `/**
 * @description 实现Promise.prototype.finally方法
 * @param {Function} callback - finally回调函数
 * @return {Promise} 新的Promise实例
 */
Promise.prototype.myFinally = function(callback) {
  // 获取当前Promise实例
  const P = this.constructor;
  
  // 返回一个新的Promise
  return this.then(
    // 当原Promise成功时执行
    value => P.resolve(callback()).then(() => value),
    // 当原Promise失败时执行
    reason => P.resolve(callback()).then(() => { throw reason; })
  );
};

// 使用示例
// Promise.resolve(42)
//   .myFinally(() => {
//     console.log('Promise completed');
//   })
//   .then(value => {
//     console.log('Resolved with value:', value);
//   });
// 
// Promise.reject(new Error('Something went wrong'))
//   .myFinally(() => {
//     console.log('Promise completed');
//   })
//   .catch(error => {
//     console.log('Rejected with error:', error.message);
//   });`  
  },
  {
    id: "runGenerator",
    title: "Generator自动执行器",
    description: "模拟async/await原理，自动执行Generator函数",
    code: `/**
 * @description 自动执行器：用Promise驱动Generator执行，模拟async/await
 * @param {Function} generatorFunc - Generator函数
 * @return {Promise} Promise实例
 */
function runGenerator(generatorFunc) {
  const generator = generatorFunc(); // 调用Generator函数，返回生成器对象

  function handle(result) {
    if (result.done) return; // 如果Generator已执行完毕，结束

    const value = result.value;

    // 如果yield出来的是一个Promise
    if (value instanceof Promise) {
      value
        .then((res) => {
          // Promise完成，将结果传回Generator，并继续执行下一步
          handle(generator.next(res));
        })
        .catch((err) => {
          // Promise被拒绝，将错误抛回Generator（可被内部try/catch捕获）
          handle(generator.throw(err));
        });
    } else {
      // 如果不是Promise，也继续执行（但通常我们yield的是Promise）
      handle(generator.next(value));
    }
  }

  // 启动执行
  try {
    handle(generator.next());
  } catch (err) {
    console.error("Generator执行出错:", err);
  }
}

// 定义一个Generator函数，模拟async函数逻辑
function* getDataGenerator() {
  try {
    const res1 = yield Promise.resolve("Hello");
    const res2 = yield Promise.resolve("World");
    console.log(res1, res2); // 输出: Hello World
  } catch (err) {
    console.error("捕获到错误:", err);
  }
}

// 使用自动执行器来运行这个Generator
runGenerator(getDataGenerator);`
  },
  {
    id: "myCreate",
    title: "Object.create实现",
    description: "模拟Object.create方法的实现",
    code: `/**
 * @description 模拟Object.create实现
 * @param {Object} proto - 作为新创建对象的原型的对象
 * @param {Object} propertiesObject - 可选，添加到新创建对象的可枚举属性
 * @return {Object} 新创建的对象
 */
function myCreate(proto, propertiesObject) {
  // 1. 创建一个空函数（构造函数）
  function F() {}

  // 2. 将该函数的prototype指向传入的proto对象
  F.prototype = proto;

  // 3. 通过new调用该构造函数，创建一个新对象，其[[Prototype]]指向proto
  const obj = new F();

  // 4. （可选）如果传入了propertiesObject，则处理属性描述符
  if (propertiesObject) {
    // 使用Object.defineProperties添加属性
    Object.defineProperties(obj, propertiesObject);
  }

  // 5. 返回新对象
  return obj;
}

// 原型对象
const person = {
  greet() {
    console.log(\`Hello, I'm \${this.name}\`);
  },
};

// 使用手写的myCreate创建新对象
const john = myCreate(person);
john.name = "John";
john.greet(); // 输出: Hello, I'm John

// 检查原型链
console.log(Object.getPrototypeOf(john) === person); // true`
  },
  {
    id: "myBind",
    title: "Function.prototype.bind实现",
    description: "模拟Function.prototype.bind方法的实现",
    code: `/**
 * @description 模拟Function.prototype.bind方法实现
 * @param {Object} thisArg - 绑定的this值
 * @param {...any} bindArgs - 预设的参数
 * @return {Function} 绑定后的新函数
 */
Function.prototype.myBind = function(thisArg, ...bindArgs) {
  // 保存原函数（this是调用myBind的函数）
  const originalFunc = this;
  
  // 定义绑定函数（返回的函数）
  function boundFunc(...callArgs) {
    // 合并绑定参数和调用参数
    const allArgs = bindArgs.concat(callArgs);
    
    // 判断是否通过new调用（关键逻辑）
    if (new.target === boundFunc) {
      // new调用时，原函数作为构造函数，this指向新实例
      return new originalFunc(...allArgs);
    } else {
      // 普通调用时，使用绑定的thisArg作为上下文
      return originalFunc.apply(thisArg, allArgs);
    }
  }
  
  // 绑定函数的prototype指向原函数的prototype（保证原型链正确）
  // 注意：必须通过Object.create来继承，避免共享原型的引用
  boundFunc.prototype = Object.create(originalFunc.prototype);
  
  return boundFunc;
};

// 使用示例
const person2 = { name: 'Alice' };
function greet(msg) {
  return \`\${msg}, \${this.name}\`;
}

const boundGreet = greet.myBind(person2, 'Hello');
console.log(boundGreet()); // 输出："Hello, Alice"（this正确绑定）

// 构造函数绑定示例
function User(age) {
  this.age = age;
  this.intro = function() {
    return \`I'm \${this.name}, \${this.age} years old\`;
  };
}
User.prototype.name = 'Default';

const BoundUser = User.myBind({ name: 'Bob' }); // 绑定thisArg为{ name: 'Bob' }
const user = new BoundUser(20); // new调用，thisArg被忽略

console.log(user.age); // 输出：20（构造函数正确初始化）
console.log(user.intro()); // 输出："I'm Default, 20 years old"（this指向新实例，原型链正确）`
  },
  {
    id: "batchInsert",
    title: "高性能DOM批量插入",
    description: "使用requestAnimationFrame实现高性能DOM批量插入",
    code: `/**
 * @description 分批插入DOM
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

// 使用示例
// const container = document.getElementById('container');
// const largeDataset = Array.from({ length: 10000 }, (_, i) => \`Item \${i}\`);
// batchInsert(largeDataset, container, 500);`
  },
  {
    id: "myPromise",
    title: "Promise实现",
    description: "实现符合Promise/A+规范的基本Promise类",
    code: `/**
 * @description 自定义Promise类，模拟原生Promise的基本功能
 */
class MyPromise {
  // 构造函数，接收一个执行器函数executor
  constructor(executor) {
    // 初始状态为pending（等待中）
    this.state = 'pending'; 
    // 成功时的值，状态变为fulfilled后会被赋值
    this.value = undefined; 
    // 失败时的原因，状态变为rejected后会被赋值
    this.reason = undefined; 
    // 用于存放fulfilled状态下的回调函数队列
    this.onFulfilledCallbacks = []; 
    // 用于存放rejected状态下的回调函数队列
    this.onRejectedCallbacks = []; 

    // 定义resolve函数，用于将Promise状态置为fulfilled
    const resolve = (value) => {
      // 只有状态为pending时才能改变状态
      if (this.state === 'pending') {
        this.state = 'fulfilled'; // 更新状态为fulfilled
        this.value = value; // 保存成功的值
        // 执行所有在fulfilled状态下等待的回调函数
        this.onFulfilledCallbacks.forEach(fn => fn());
      }
    };

    // 定义reject函数，用于将Promise状态置为rejected
    const reject = (reason) => {
      // 只有状态为pending时才能改变状态
      if (this.state === 'pending') {
        this.state = 'rejected'; // 更新状态为rejected
        this.reason = reason; // 保存失败的原因
        // 执行所有在rejected状态下等待的回调函数
        this.onRejectedCallbacks.forEach(fn => fn());
      }
    };

    try {
      // 立即执行executor函数，并传入resolve和reject方法
      // 注意：executor可能是同步的，也可能抛出异常
      executor(resolve, reject);
    } catch (err) {
      // 如果executor执行过程中抛出错误，则捕获并调用reject
      reject(err);
    }
  }

  // then方法是Promise的核心，用于注册fulfilled和rejected状态的回调
  // 并返回一个新的Promise，以支持链式调用
  then(onFulfilled, onRejected) {
    // 处理值穿透：如果then的参数不是函数，则提供一个默认函数实现值穿透
    // 比如：promise.then(123)应该把123直接传递给下一个then
    onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : value => value;
    onRejected = typeof onRejected === 'function' ? onRejected : reason => { throw reason; };

    // then方法必须返回一个新的Promise，以实现链式调用
    const promise2 = new MyPromise((resolve, reject) => {
      // 封装公共的回调处理逻辑，避免重复代码
      const handleCallback = (callback, valueOrReason, resolve, reject) => {
        // 使用setTimeout模拟异步执行
        setTimeout(() => {
          try {
            // 执行用户传入的回调函数，并得到返回值x
            const x = callback(valueOrReason);
            // 尝试resolve新的Promise
            resolve(x);
          } catch (err) {
            // 如果回调执行出错，则reject新的Promise
            reject(err);
          }
        }, 0);
      };

      // 如果当前Promise的状态已经是fulfilled
      if (this.state === 'fulfilled') {
        // 异步执行onFulfilled回调，并处理返回值和新的Promise
        handleCallback(onFulfilled, this.value, resolve, reject);
      } 
      // 如果当前Promise的状态已经是rejected
      else if (this.state === 'rejected') {
        // 异步执行onRejected回调，并处理返回值和新的Promise
        handleCallback(onRejected, this.reason, resolve, reject);
      } 
      // 如果当前Promise的状态还是pending（即executor是异步的，还未调用resolve/reject）
      else if (this.state === 'pending') {
        // 将onFulfilled回调推入队列，等状态变成fulfilled后再执行
        this.onFulfilledCallbacks.push(() => {
          handleCallback(onFulfilled, this.value, resolve, reject);
        });
        // 将onRejected回调推入队列，等状态变成rejected后再执行
        this.onRejectedCallbacks.push(() => {
          handleCallback(onRejected, this.reason, resolve, reject);
        });
      }
    });

    // then方法必须返回一个新的Promise对象
    return promise2;
  }
}

// 使用示例
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
});`
  },
  {
    id: "findThreeSum",
    title: "三数之和问题",
    description: "找出数组中三个数之和等于目标值的组合",
    code: `/**
 * @description 找出数组中三个数之和等于目标值的组合
 * @param {number[]} nums - 数字数组
 * @param {number} target - 目标和
 * @return {number[]} 三个数的数组，或空数组
 * @time O(n²) - 排序O(nlogn) + 双指针O(n²)
 * @space O(1) - 不考虑排序的空间，只使用常数级额外空间
 */
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

  // 如果没有找到，返回空数组
  return [];
}

// 示例测试
const nums = [1, 5, 8, 10, 12];
const target = 19;

const result = findThreeSum(nums, target);
console.log(result); // 输出: [1, 8, 10]`
  }
];

//如果需要与原data.js合并，可以这样使用：
window.CODE_DATA = [...(window.CODE_DATA || []), ...window.CODE_DATA_2];
