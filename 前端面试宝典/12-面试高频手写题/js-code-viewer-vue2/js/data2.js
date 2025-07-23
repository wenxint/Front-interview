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
  { id: 1, title: "title1", parent_id: 0 },
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


];

//如果需要与原data.js合并，可以这样使用：
window.CODE_DATA = [...(window.CODE_DATA || []), ...window.CODE_DATA_2];
