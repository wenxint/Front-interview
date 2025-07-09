/**
 * @description 第K大元素缓存实现问题演示与解决方案
 * @author 前端面试宝典
 * @date 2024
 */

console.log("🔍 第K大元素缓存实现问题分析");
console.log("=".repeat(50));

// ❌ 用户的错误实现（修复了拼写错误）
function cache(fn) {
  let map = new Map();
  return function (...arg) {
    let key = JSON.stringify(arg);
    if (map.has(key)) {
      console.log(`🎯 缓存命中: ${key}`);
      return map.get(key);
    }
    console.log(`🔄 计算中: ${key}`);
    let result = fn.apply(this, arg); // 修复了拼写错误
    map.set(key, result);
    return result;
  };
}

const findKthLargestWrong = cache(function (nums, k) {
  console.log(`    处理数组: [${nums}], k=${k}`);
  let max = -Infinity;
  let index;

  for (let i = 0; i < nums.length; i++) {
    if (nums[i] > max) {
      max = nums[i];
      index = i;
    }
  }

  if (k == 1) {
    return max;
  }
  if (k > 1) {
    nums.splice(index, 1); // ❌ 修改原始数组！
    return findKthLargestWrong(nums, k - 1);
  }
});

/**
 * @description 演示错误实现的问题
 */
function demonstrateProblems() {
  console.log("\n❌ 错误实现测试:");
  console.log("-".repeat(30));

  const testArray1 = [3, 2, 1, 5, 6, 4];
  const testArray2 = [3, 2, 1, 5, 6, 4]; // 相同的数组

  console.log(`原始数组1: [${testArray1}]`);
  console.log(`原始数组2: [${testArray2}]`);

  console.log("\n第一次调用 findKthLargest([3,2,1,5,6,4], 2):");
  const result1 = findKthLargestWrong(testArray1, 2);
  console.log(`结果: ${result1}`);
  console.log(`数组1被修改为: [${testArray1}]`);

  console.log("\n第二次调用 findKthLargest([3,2,1,5,6,4], 2):");
  const result2 = findKthLargestWrong(testArray2, 2);
  console.log(`结果: ${result2}`);
  console.log(`数组2状态: [${testArray2}]`);

  console.log(
    `\n⚠️  问题: 两次相同输入得到了${
      result1 === result2 ? "相同" : "不同"
    }的结果!`
  );
  console.log(`第二次调用直接返回了缓存，但原始数组已被修改，导致逻辑错误。`);
}

// ✅ 正确实现1: 创建数组副本
const findKthLargestCorrect1 = cache(function (nums, k) {
  // 创建数组副本，避免修改原始数组
  const numsCopy = [...nums];
  console.log(`    处理数组副本: [${numsCopy}], k=${k}`);

  let max = -Infinity;
  let index;

  for (let i = 0; i < numsCopy.length; i++) {
    if (numsCopy[i] > max) {
      max = numsCopy[i];
      index = i;
    }
  }

  if (k == 1) {
    return max;
  }
  if (k > 1) {
    numsCopy.splice(index, 1);
    return findKthLargestCorrect1(numsCopy, k - 1);
  }
});

// ✅ 正确实现2: 快速选择算法（更高效）
const findKthLargestQuickSelect = cache(function (nums, k) {
  console.log(`    快速选择算法: [${nums}], k=${k}`);
  const numsCopy = [...nums];
  const targetIndex = nums.length - k; // 第k大 = 排序后的第(length-k)个位置

  /**
   * @description 快速选择算法
   * @param {number[]} arr - 数组
   * @param {number} left - 左边界
   * @param {number} right - 右边界
   * @param {number} targetIdx - 目标索引
   * @return {number} 目标元素
   */
  function quickSelect(arr, left, right, targetIdx) {
    if (left === right) return arr[left];

    // 分区操作
    const pivotIndex = partition(arr, left, right);

    if (pivotIndex === targetIdx) {
      return arr[pivotIndex];
    } else if (pivotIndex < targetIdx) {
      return quickSelect(arr, pivotIndex + 1, right, targetIdx);
    } else {
      return quickSelect(arr, left, pivotIndex - 1, targetIdx);
    }
  }

  /**
   * @description 分区函数
   * @param {number[]} arr - 数组
   * @param {number} left - 左边界
   * @param {number} right - 右边界
   * @return {number} 分区点索引
   */
  function partition(arr, left, right) {
    const pivot = arr[right];
    let i = left;

    for (let j = left; j < right; j++) {
      if (arr[j] <= pivot) {
        [arr[i], arr[j]] = [arr[j], arr[i]];
        i++;
      }
    }

    [arr[i], arr[right]] = [arr[right], arr[i]];
    return i;
  }

  return quickSelect(numsCopy, 0, numsCopy.length - 1, targetIndex);
});

// ✅ 正确实现3: 堆算法
const findKthLargestHeap = cache(function (nums, k) {
  console.log(`    堆算法: [${nums}], k=${k}`);

  // 构建最小堆
  const minHeap = [];

  /**
   * @description 向上调整堆
   * @param {number[]} heap - 堆数组
   * @param {number} index - 当前索引
   */
  function heapifyUp(heap, index) {
    const parentIndex = Math.floor((index - 1) / 2);
    if (parentIndex >= 0 && heap[parentIndex] > heap[index]) {
      [heap[parentIndex], heap[index]] = [heap[index], heap[parentIndex]];
      heapifyUp(heap, parentIndex);
    }
  }

  /**
   * @description 向下调整堆
   * @param {number[]} heap - 堆数组
   * @param {number} index - 当前索引
   */
  function heapifyDown(heap, index) {
    const leftChild = 2 * index + 1;
    const rightChild = 2 * index + 2;
    let smallest = index;

    if (leftChild < heap.length && heap[leftChild] < heap[smallest]) {
      smallest = leftChild;
    }
    if (rightChild < heap.length && heap[rightChild] < heap[smallest]) {
      smallest = rightChild;
    }

    if (smallest !== index) {
      [heap[index], heap[smallest]] = [heap[smallest], heap[index]];
      heapifyDown(heap, smallest);
    }
  }

  // 维护大小为k的最小堆
  for (const num of nums) {
    if (minHeap.length < k) {
      minHeap.push(num);
      heapifyUp(minHeap, minHeap.length - 1);
    } else if (num > minHeap[0]) {
      minHeap[0] = num;
      heapifyDown(minHeap, 0);
    }
  }

  return minHeap[0];
});

/**
 * @description 测试正确实现
 */
function testCorrectImplementations() {
  console.log("\n✅ 正确实现测试:");
  console.log("-".repeat(30));

  const testCases = [
    { nums: [3, 2, 1, 5, 6, 4], k: 2 },
    { nums: [3, 2, 3, 1, 2, 4, 5, 5, 6], k: 4 },
    { nums: [1], k: 1 },
    { nums: [7, 10, 4, 3, 20, 15], k: 3 },
  ];

  testCases.forEach((testCase, index) => {
    console.log(`\n测试案例 ${index + 1}: [${testCase.nums}], k=${testCase.k}`);

    const nums1 = [...testCase.nums];
    const nums2 = [...testCase.nums];
    const nums3 = [...testCase.nums];

    const result1 = findKthLargestCorrect1(nums1, testCase.k);
    const result2 = findKthLargestQuickSelect(nums2, testCase.k);
    const result3 = findKthLargestHeap(nums3, testCase.k);

    console.log(`数组副本法: ${result1}`);
    console.log(`快速选择法: ${result2}`);
    console.log(`堆算法: ${result3}`);
    console.log(`原始数组未被修改: [${testCase.nums}]`);
    console.log(
      `结果一致: ${result1 === result2 && result2 === result3 ? "✅" : "❌"}`
    );
  });
}

/**
 * @description 性能对比测试
 */
function performanceComparison() {
  console.log("\n📊 性能对比测试:");
  console.log("-".repeat(30));

  // 生成大数组进行测试
  const largeArray = Array.from({ length: 1000 }, () =>
    Math.floor(Math.random() * 10000)
  );
  const k = 100;

  console.log(`测试数据: 长度${largeArray.length}的随机数组，查找第${k}大元素`);

  // 测试各种实现的性能
  const implementations = [
    { name: "数组副本法", fn: findKthLargestCorrect1 },
    { name: "快速选择法", fn: findKthLargestQuickSelect },
    { name: "堆算法", fn: findKthLargestHeap },
  ];

  implementations.forEach((impl) => {
    const startTime = performance.now();
    const result = impl.fn([...largeArray], k);
    const endTime = performance.now();

    console.log(
      `${impl.name}: ${(endTime - startTime).toFixed(3)}ms, 结果: ${result}`
    );
  });
}

/**
 * @description 缓存命中测试
 */
function cacheHitTest() {
  console.log("\n🎯 缓存命中测试:");
  console.log("-".repeat(30));

  const testArray = [3, 2, 1, 5, 6, 4];

  console.log("第一次调用各实现:");
  findKthLargestCorrect1([...testArray], 2);
  findKthLargestQuickSelect([...testArray], 2);
  findKthLargestHeap([...testArray], 2);

  console.log("\n第二次调用相同参数 (应该命中缓存):");
  findKthLargestCorrect1([...testArray], 2);
  findKthLargestQuickSelect([...testArray], 2);
  findKthLargestHeap([...testArray], 2);
}

/**
 * @description 主函数
 */
function main() {
  // 演示问题
//   demonstrateProblems();

//   // 测试正确实现
//   testCorrectImplementations();

//   // 性能对比
//   performanceComparison();

  // 缓存命中测试
  cacheHitTest();

  console.log("\n" + "=".repeat(50));
  console.log("📋 总结分析:");
  console.log("=".repeat(50));
  console.log("❌ 原实现问题:");
  console.log("  1. 修改原始数组导致缓存失效");
  console.log("  2. 时间复杂度 O(k*n) 不是最优");
  console.log("  3. 代码存在拼写错误");
  console.log("  4. 缺少边界条件检查");

  console.log("\n✅ 正确实现要点:");
  console.log("  1. 避免副作用 - 创建数组副本");
  console.log("  2. 选择高效算法 - 快速选择 O(n) 或堆 O(n log k)");
  console.log("  3. 缓存纯函数 - 相同输入总是相同输出");
  console.log("  4. 处理边界情况");

  console.log("\n💡 关键教训:");
  console.log("  • 缓存只适用于纯函数（无副作用）");
  console.log("  • 修改输入参数会破坏缓存的正确性");
  console.log("  • 算法优化比缓存更重要");
  console.log("  • 对于可能的副作用要格外小心");
}

// 运行测试
main();
