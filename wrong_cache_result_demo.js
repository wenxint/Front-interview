/**
 * @description 演示缓存返回错误结果的真正问题
 * @author 前端面试宝典
 * @date 2024
 *
 * 核心问题：不是速度快慢，而是结果的正确性！
 * 修改原数组导致缓存返回错误答案
 */

console.log("🚨 错误缓存结果演示 - 关键不是速度，而是正确性！");
console.log("=".repeat(70));

// 缓存装饰器
function cache(fn) {
  const cacheMap = new Map();
  return function(...args) {
    const key = JSON.stringify(args);

    if (cacheMap.has(key)) {
      console.log(`🎯 缓存命中! 直接返回: ${cacheMap.get(key)}`);
      return cacheMap.get(key);
    }

    console.log(`🔄 缓存未命中，开始计算...`);
    const result = fn.apply(this, args);
    cacheMap.set(key, result);
    console.log(`💾 结果 ${result} 已缓存`);
    return result;
  };
}

// ❌ 有问题的实现
const findKthLargestWrong = cache(function(nums, k) {
  console.log(`  执行中: [${nums}], k=${k}`);

  if (k === 1) {
    const max = Math.max(...nums);
    console.log(`  找到第1大: ${max}`);
    return max;
  }

  const max = Math.max(...nums);
  const maxIndex = nums.indexOf(max);
  nums.splice(maxIndex, 1); // ❌ 修改原数组
  console.log(`  删除${max}后: [${nums}]`);

  return findKthLargestWrong(nums, k - 1);
});

// ✅ 正确的实现
const findKthLargestCorrect = cache(function(nums, k) {
  console.log(`  执行中: [${nums}], k=${k}`);

  if (k === 1) {
    const max = Math.max(...nums);
    console.log(`  找到第1大: ${max}`);
    return max;
  }

  const numsCopy = [...nums]; // ✅ 创建副本
  const max = Math.max(...numsCopy);
  const maxIndex = numsCopy.indexOf(max);
  numsCopy.splice(maxIndex, 1);
  console.log(`  删除${max}后副本: [${numsCopy}], 原数组: [${nums}]`);

  return findKthLargestCorrect(numsCopy, k - 1);
});

/**
 * @description 手动验证正确答案
 */
function getCorrectAnswerManually(nums, k) {
  console.log(`\n🧮 手动验证 [${nums}] 的第${k}大元素：`);
  const sorted = [...nums].sort((a, b) => b - a);
  console.log(`  排序后: [${sorted}]`);
  console.log(`  第${k}大元素: ${sorted[k-1]}`);
  return sorted[k-1];
}

/**
 * @description 演示错误结果的案例
 */
function demonstrateWrongResults() {
  console.log("\n" + "=".repeat(70));
  console.log("💥 问题演示：缓存返回错误结果！");
  console.log("=".repeat(70));

  // 测试数据：[3, 2, 1, 5, 6, 4]，第2大应该是5
  const testArray = [3, 2, 1, 5, 6, 4];
  const k = 2;

  console.log(`\n📊 测试数据: [${testArray}]，找第${k}大元素`);

  // 首先确认正确答案
  const correctAnswer = getCorrectAnswerManually(testArray, k);

  console.log(`\n✅ 正确答案应该是: ${correctAnswer}`);
  console.log("=".repeat(50));

  // 测试错误版本
  console.log(`\n❌ 错误版本测试:`);
  const array1 = [...testArray]; // 第一个测试数组
  console.log(`第一次调用 findKthLargestWrong([${array1}], ${k}):`);
  const wrongResult1 = findKthLargestWrong(array1, k);
  console.log(`结果: ${wrongResult1} ${wrongResult1 === correctAnswer ? '✅' : '❌'}`);
  console.log(`数组状态: [${array1}] (被修改了！)`);

  // 第二次调用 - 这里会看到缓存的问题
  console.log(`\n第二次调用 findKthLargestWrong([${testArray}], ${k}):`);
  const array2 = [...testArray]; // 新的相同数组
  const wrongResult2 = findKthLargestWrong(array2, k);
  console.log(`结果: ${wrongResult2} ${wrongResult2 === correctAnswer ? '✅' : '❌'}`);
  console.log(`数组状态: [${array2}] (未被修改，因为缓存命中)`);

  console.log(`\n🔍 分析:`);
  console.log(`• 正确答案: ${correctAnswer}`);
  console.log(`• 错误版本返回: ${wrongResult1} 和 ${wrongResult2}`);
  console.log(`• 两次调用结果相同: ${wrongResult1 === wrongResult2 ? '是' : '否'}`);
  console.log(`• 但结果正确吗: ${wrongResult1 === correctAnswer ? '是' : '否'}`);

  if (wrongResult1 === correctAnswer) {
    console.log(`\n⚠️  在这个特定例子中，错误版本"碰巧"返回了正确答案`);
    console.log(`   但这是偶然的，让我们看一个会出错的例子...`);
  }
}

/**
 * @description 演示明显错误结果的案例
 */
function demonstrateObviousWrongCase() {
  console.log("\n" + "=".repeat(70));
  console.log("🔥 更明显的错误案例");
  console.log("=".repeat(70));

  // 特意设计一个会产生错误结果的例子
  const testArray = [10, 9, 8, 7, 6];
  const k = 3;

  console.log(`\n📊 测试数据: [${testArray}]，找第${k}大元素`);

  // 正确答案
  const correctAnswer = getCorrectAnswerManually(testArray, k);

  console.log(`\n✅ 正确答案: ${correctAnswer}`);
  console.log("=".repeat(50));

  // 清除之前的缓存，重新创建函数实例
  const findKthWrongNew = cache(function(nums, k) {
    console.log(`  执行: [${nums}], k=${k}`);

    if (k === 1) {
      const max = Math.max(...nums);
      console.log(`  第1大: ${max}`);
      return max;
    }

    const max = Math.max(...nums);
    const maxIndex = nums.indexOf(max);
    nums.splice(maxIndex, 1);
    console.log(`  删除${max}: [${nums}]`);

    return findKthWrongNew(nums, k - 1);
  });

  console.log(`\n❌ 错误版本测试:`);

  // 第一次调用
  const array1 = [...testArray];
  console.log(`第一次: findKthWrongNew([${array1}], ${k})`);
  const result1 = findKthWrongNew(array1, k);
  console.log(`结果: ${result1}`);
  console.log(`原数组变成: [${array1}]`);

  // 第二次调用相同输入
  console.log(`\n第二次: findKthWrongNew([${testArray}], ${k})`);
  const array2 = [...testArray];
  const result2 = findKthWrongNew(array2, k);
  console.log(`结果: ${result2} (缓存命中)`);
  console.log(`原数组状态: [${array2}]`);

  console.log(`\n📈 结果对比:`);
  console.log(`正确答案: ${correctAnswer}`);
  console.log(`第一次结果: ${result1} ${result1 === correctAnswer ? '✅' : '❌'}`);
  console.log(`第二次结果: ${result2} ${result2 === correctAnswer ? '✅' : '❌'}`);
  console.log(`两次一致: ${result1 === result2 ? '是' : '否'}`);

  if (result1 !== correctAnswer) {
    console.log(`\n💥 问题暴露！错误版本返回了错误答案！`);
  }
}

/**
 * @description 演示正确版本的对比
 */
function demonstrateCorrectVersion() {
  console.log("\n" + "=".repeat(70));
  console.log("✅ 正确版本对比");
  console.log("=".repeat(70));

  const testArray = [10, 9, 8, 7, 6];
  const k = 3;

  console.log(`\n📊 相同测试: [${testArray}]，第${k}大元素`);

  const correctAnswer = getCorrectAnswerManually(testArray, k);

  // 创建新的正确版本函数
  const findKthCorrectNew = cache(function(nums, k) {
    console.log(`  执行: [${nums}], k=${k}`);

    if (k === 1) {
      return Math.max(...nums);
    }

    const numsCopy = [...nums];
    const max = Math.max(...numsCopy);
    const maxIndex = numsCopy.indexOf(max);
    numsCopy.splice(maxIndex, 1);
    console.log(`  删除${max}，副本: [${numsCopy}]，原数组: [${nums}]`);

    return findKthCorrectNew(numsCopy, k - 1);
  });

  console.log(`\n✅ 正确版本测试:`);

  // 第一次调用
  const array1 = [...testArray];
  console.log(`第一次: findKthCorrectNew([${array1}], ${k})`);
  const result1 = findKthCorrectNew(array1, k);
  console.log(`结果: ${result1} ${result1 === correctAnswer ? '✅' : '❌'}`);
  console.log(`原数组: [${array1}] (未被修改)`);

  // 第二次调用
  console.log(`\n第二次: findKthCorrectNew([${testArray}], ${k})`);
  const array2 = [...testArray];
  const result2 = findKthCorrectNew(array2, k);
  console.log(`结果: ${result2} ${result2 === correctAnswer ? '✅' : '❌'} (缓存命中)`);
  console.log(`原数组: [${array2}] (未被修改)`);

  console.log(`\n🎉 正确版本总结:`);
  console.log(`• 正确答案: ${correctAnswer}`);
  console.log(`• 第一次: ${result1} ✅`);
  console.log(`• 第二次: ${result2} ✅`);
  console.log(`• 结果正确且一致`);
  console.log(`• 原数组始终未被修改`);
}

/**
 * @description 性能不是关键，正确性才是关键
 */
function explainWhyCorrectnessMatters() {
  console.log("\n" + "=".repeat(70));
  console.log("🎯 为什么正确性比速度更重要");
  console.log("=".repeat(70));

  console.log(`\n🤔 你的观点："第二次调用更快返回5，不是很好吗？"`);
  console.log(`\n💡 关键问题：`);
  console.log(`1. 速度快不代表结果对！`);
  console.log(`2. 错误的快速答案比慢的正确答案更危险`);
  console.log(`3. 在某些数据下，缓存会返回完全错误的结果`);
  console.log(`4. 这种bug很难发现，因为：`);
  console.log(`   • 有时候结果看起来是对的（巧合）`);
  console.log(`   • 缓存命中让问题被掩盖`);
  console.log(`   • 只有特定输入才会暴露问题`);

  console.log(`\n🚨 实际开发中的风险：`);
  console.log(`• 用户看到错误的搜索结果`);
  console.log(`• 财务系统计算错误的金额`);
  console.log(`• 推荐算法推荐错误的内容`);
  console.log(`• 排序功能返回错误的顺序`);

  console.log(`\n✅ 正确的做法：`);
  console.log(`• 先保证正确性，再优化性能`);
  console.log(`• 缓存基于纯函数才能正常工作`);
  console.log(`• 永远不要修改输入参数`);
  console.log(`• 副作用是bug的温床`);
}

/**
 * @description 主函数
 */
function main() {
  demonstrateWrongResults();
  demonstrateObviousWrongCase();
  demonstrateCorrectVersion();
  explainWhyCorrectnessMatters();

  console.log("\n" + "=".repeat(70));
  console.log("📋 最终总结");
  console.log("=".repeat(70));
  console.log(`❌ 问题不在于速度，而在于正确性！`);
  console.log(`🔥 修改原数组 = 破坏函数纯度 = 缓存失效 = 错误结果`);
  console.log(`✅ 复制数组 = 保持函数纯度 = 缓存正确 = 正确结果`);
  console.log(`\n💰 记住：错误的快答案 < 正确的慢答案 < 正确的快答案`);
}

// 运行演示
main();