/**
 * @description 数组修改导致缓存问题的详细演示
 * @author 前端面试宝典
 * @date 2024
 *
 * 这个文件专门演示为什么修改原始数组会导致缓存问题
 * 关键问题：缓存的key是基于输入参数生成的，但函数内部修改了这些参数
 */

console.log("🚨 数组修改导致缓存问题演示");
console.log("=".repeat(60));

// 缓存装饰器
function cache(fn) {
  const cacheMap = new Map();
  return function(...args) {
    const key = JSON.stringify(args);

    if (cacheMap.has(key)) {
      console.log(`🎯 缓存命中! key: ${key}`);
      console.log(`📋 返回缓存结果: ${cacheMap.get(key)}`);
      return cacheMap.get(key);
    }

    console.log(`🔄 缓存未命中，开始计算 key: ${key}`);
    const result = fn.apply(this, args);
    cacheMap.set(key, result);
    console.log(`💾 结果已缓存: ${result}`);
    return result;
  };
}

// ❌ 错误版本：修改原始数组
const findKthLargestWrong = cache(function(nums, k) {
  console.log(`  --> 函数开始执行，nums: [${nums}], k: ${k}`);

  if (k === 1) {
    const max = Math.max(...nums);
    console.log(`  --> 找到最大值: ${max}`);
    return max;
  }

  // 找到最大值并删除
  const max = Math.max(...nums);
  const maxIndex = nums.indexOf(max);
  console.log(`  --> 找到最大值 ${max}，准备删除索引 ${maxIndex}`);

  nums.splice(maxIndex, 1); // ❌ 修改原始数组！
  console.log(`  --> 数组修改后: [${nums}]`);

  return findKthLargestWrong(nums, k - 1); // 递归调用
});

// ✅ 正确版本：不修改原始数组
const findKthLargestCorrect = cache(function(nums, k) {
  console.log(`  --> 函数开始执行，nums: [${nums}], k: ${k}`);

  if (k === 1) {
    const max = Math.max(...nums);
    console.log(`  --> 找到最大值: ${max}`);
    return max;
  }

  // 创建副本，不修改原始数组
  const numsCopy = [...nums];
  const max = Math.max(...numsCopy);
  const maxIndex = numsCopy.indexOf(max);
  console.log(`  --> 找到最大值 ${max}，准备删除索引 ${maxIndex}`);

  numsCopy.splice(maxIndex, 1);
  console.log(`  --> 副本修改后: [${numsCopy}]，原数组未变: [${nums}]`);

  return findKthLargestCorrect(numsCopy, k - 1);
});

/**
 * @description 演示错误实现的问题
 */
function demonstrateArrayMutationProblem() {
  console.log("\n" + "=".repeat(60));
  console.log("❌ 问题演示：修改原始数组导致的缓存问题");
  console.log("=".repeat(60));

  console.log("\n📝 场景设置：");
  console.log("两个完全相同的数组 [3, 2, 1, 5, 6, 4]，都要找第2大元素");

  const array1 = [3, 2, 1, 5, 6, 4];
  const array2 = [3, 2, 1, 5, 6, 4]; // 完全相同的数组

  console.log(`数组1: [${array1}]`);
  console.log(`数组2: [${array2}]`);
  console.log(`两个数组是否相等: ${JSON.stringify(array1) === JSON.stringify(array2)}`);

  console.log("\n🔍 第一次调用 findKthLargestWrong(array1, 2)：");
  console.log("-".repeat(40));
  const result1 = findKthLargestWrong(array1, 2);
  console.log(`✅ 第一次调用结果: ${result1}`);
  console.log(`⚠️  注意：array1现在变成了: [${array1}]`);

  console.log("\n🔍 第二次调用 findKthLargestWrong(array2, 2)：");
  console.log("-".repeat(40));
  const result2 = findKthLargestWrong(array2, 2);
  console.log(`❌ 第二次调用结果: ${result2}`);
  console.log(`数组2的状态: [${array2}]`);

  console.log("\n💥 问题分析：");
  console.log(`• 两次输入看起来相同: [3, 2, 1, 5, 6, 4], k=2`);
  console.log(`• 缓存key相同: ${JSON.stringify([[3, 2, 1, 5, 6, 4], 2])}`);
  console.log(`• 但第二次直接返回缓存值 ${result1}，这是错误的！`);
  console.log(`• 正确答案应该通过完整计算得出`);
}

/**
 * @description 深度分析缓存key生成时机
 */
function analyzeCacheKeyTiming() {
  console.log("\n" + "=".repeat(60));
  console.log("🔬 深度分析：缓存key生成时机和问题根源");
  console.log("=".repeat(60));

  // 重新创建一个带详细日志的缓存函数
  function cacheWithDetailedLog(fn) {
    const cacheMap = new Map();
    return function(...args) {
      console.log(`\n📊 缓存检查开始：`);
      console.log(`   输入参数: ${JSON.stringify(args)}`);

      const key = JSON.stringify(args);
      console.log(`   生成的key: ${key}`);
      console.log(`   当前缓存状态: ${cacheMap.size}个条目`);

      if (cacheMap.has(key)) {
        console.log(`   🎯 在缓存中找到匹配的key！`);
        console.log(`   📋 直接返回缓存值: ${cacheMap.get(key)}`);
        return cacheMap.get(key);
      }

      console.log(`   ❌ 缓存中没有找到该key，需要计算`);
      const result = fn.apply(this, args);
      cacheMap.set(key, result);
      console.log(`   💾 计算完成，结果 ${result} 已存入缓存`);
      console.log(`   📈 缓存大小现在是: ${cacheMap.size}个条目`);
      return result;
    };
  }

  const testFunc = cacheWithDetailedLog(function(nums, k) {
    console.log(`     🔧 函数执行中: nums=[${nums}], k=${k}`);

    if (k === 1) {
      const max = Math.max(...nums);
      console.log(`     ✅ 找到最大值: ${max}`);
      return max;
    }

    const max = Math.max(...nums);
    const maxIndex = nums.indexOf(max);
    console.log(`     🗑️  删除最大值 ${max} (索引${maxIndex})`);

    nums.splice(maxIndex, 1); // 修改原数组
    console.log(`     📝 数组变为: [${nums}]`);

    return testFunc(nums, k - 1);
  });

  console.log("\n🧪 测试相同输入的缓存行为：");

  const testArray1 = [5, 3, 7];
  const testArray2 = [5, 3, 7];

  console.log("第一次调用 testFunc([5, 3, 7], 2):");
  const result1 = testFunc(testArray1, 2);

  console.log("\n第二次调用 testFunc([5, 3, 7], 2):");
  const result2 = testFunc(testArray2, 2);

  console.log(`\n🏁 最终结果对比:`);
  console.log(`第一次结果: ${result1}`);
  console.log(`第二次结果: ${result2}`);
  console.log(`结果是否一致: ${result1 === result2 ? "是" : "否"}`);
}

/**
 * @description 演示正确实现
 */
function demonstrateCorrectImplementation() {
  console.log("\n" + "=".repeat(60));
  console.log("✅ 正确实现：不修改原始数组");
  console.log("=".repeat(60));

  const array1 = [3, 2, 1, 5, 6, 4];
  const array2 = [3, 2, 1, 5, 6, 4];

  console.log(`测试数组1: [${array1}]`);
  console.log(`测试数组2: [${array2}]`);

  console.log("\n🔍 第一次调用 findKthLargestCorrect(array1, 2)：");
  const result1 = findKthLargestCorrect([...array1], 2); // 传入副本
  console.log(`✅ 第一次结果: ${result1}`);
  console.log(`原数组1状态: [${array1}] (未被修改)`);

  console.log("\n🔍 第二次调用 findKthLargestCorrect(array2, 2)：");
  const result2 = findKthLargestCorrect([...array2], 2); // 传入副本
  console.log(`✅ 第二次结果: ${result2}`);
  console.log(`原数组2状态: [${array2}] (未被修改)`);

  console.log("\n🎉 正确实现的优势：");
  console.log(`• 两次调用都能正确命中缓存`);
  console.log(`• 结果一致: ${result1 === result2 ? "是" : "否"}`);
  console.log(`• 原始数组未被破坏`);
  console.log(`• 函数行为可预测`);
}

/**
 * @description 核心问题解释
 */
function explainCoreIssue() {
  console.log("\n" + "=".repeat(60));
  console.log("🎯 核心问题解释：为什么修改原数组是错误的");
  console.log("=".repeat(60));

  console.log("\n📚 问题本质：");
  console.log("1. 缓存是基于输入参数的 JSON.stringify() 结果作为key");
  console.log("2. 相同的输入应该总是产生相同的输出（纯函数特性）");
  console.log("3. 修改原数组破坏了这个约定");

  console.log("\n🔄 执行流程分析：");
  console.log("第一次调用 findKthLargest([3,2,1,5,6,4], 2):");
  console.log("  ├─ key = '[3,2,1,5,6,4],2'");
  console.log("  ├─ 缓存未命中，开始计算");
  console.log("  ├─ 递归过程中修改了传入的数组");
  console.log("  ├─ 计算结果并缓存");
  console.log("  └─ 原数组被永久修改为 [3,2,1,6,4]");

  console.log("\n第二次调用 findKthLargest([3,2,1,5,6,4], 2):");
  console.log("  ├─ key = '[3,2,1,5,6,4],2' (看起来和第一次相同)");
  console.log("  ├─ 缓存命中！直接返回之前的结果");
  console.log("  └─ ❌ 但这个结果是基于被修改过的数组计算的！");

  console.log("\n💡 解决方案：");
  console.log("• 在函数内部创建数组副本: [...nums]");
  console.log("• 只修改副本，保持原数组不变");
  console.log("• 确保函数是纯函数：相同输入→相同输出");
  console.log("• 这样缓存才能正确工作");

  console.log("\n🚫 常见误解：");
  console.log('误解：修改原数组会产生新的key');
  console.log('事实：缓存key是在函数调用时就确定的，基于调用时的参数');
  console.log('     函数执行过程中的修改不会影响已经生成的key');
}

/**
 * @description 主函数
 */
function main() {
  demonstrateArrayMutationProblem();
  analyzeCacheKeyTiming();
  demonstrateCorrectImplementation();
  explainCoreIssue();

  console.log("\n" + "=".repeat(60));
  console.log("📋 总结");
  console.log("=".repeat(60));
  console.log("❌ 修改原数组的问题：");
  console.log("  • 破坏了函数的纯度");
  console.log("  • 导致相同输入产生不同输出");
  console.log("  • 缓存返回错误结果");
  console.log("  • 难以调试和预测");

  console.log("\n✅ 正确做法：");
  console.log("  • 创建数组副本进行操作");
  console.log("  • 保持原始输入不变");
  console.log("  • 确保函数纯度");
  console.log("  • 缓存能正确工作");
}

// 运行演示
main();