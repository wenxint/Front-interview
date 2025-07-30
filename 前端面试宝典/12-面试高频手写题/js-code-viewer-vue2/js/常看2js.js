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
function addLargeNumbers(num1, num2) {
  let result = ""; // 存储结果
  let carry = 0; // 进位
  let i = num1.length - 1; // num1 的索引
  let j = num2.length - 1; // num2 的索引

  // 从后向前逐位相加
  while (i >= 0 || j >= 0 || carry > 0) {
    const digit1 = i >= 0 ? parseInt(num1[i]) : 0; // 获取 num1 当前位数字
    const digit2 = j >= 0 ? parseInt(num2[j]) : 0; // 获取 num2 当前位数字

    // 计算当前位的和
    const sum = digit1 + digit2 + carry;
    carry = Math.floor(sum / 10); // 计算进位
    result = (sum % 10) + result; // 当前位的结果

    i--; // 移动到 num1 的前一位
    j--; // 移动到 num2 的前一位
  }

  return result; // 返回最终结果
}
function sum(...initialArgs) {
  // 存储所有传入的参数
  let args = [...initialArgs];
  
  // 定义一个可以继续接受参数的函数
  function nextSum(...nextArgs) {
    args = args.concat(nextArgs);
    return nextSum; // 返回自身以支持链式调用
  }
  
  // 添加 sumOf 方法来计算总和
  nextSum.sumOf = function() {
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