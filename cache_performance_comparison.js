/**
 * @description 缓存性能对比测试
 * @author 前端面试宝典
 * @date 2024
 */

// 全局计数器
let wrongCallCount = 0;
let correctCallCount = 0;

/**
 * @description 缓存函数实现
 * @param {Function} fn - 要缓存的函数
 * @return {Function} 带缓存的函数
 */
function cache(fn) {
  const cacheMap = {};
  return function(...args) {
    const key = JSON.stringify(args);
    if (cacheMap.hasOwnProperty(key)) {
      return cacheMap[key];
    }
    const result = fn.apply(this, args);
    cacheMap[key] = result;
    return result;
  };
}

/**
 * @description 创建错误实现的斐波那契函数
 * @return {Function} 错误的缓存斐波那契函数
 */
function createWrongCachedFib() {
  wrongCallCount = 0; // 重置计数器

  function fib(n) {
    wrongCallCount++; // 统计调用次数
    if (n <= 1) return n;
    return fib(n - 1) + fib(n - 2);
  }

  return cache(fib);
}

/**
 * @description 创建正确实现的斐波那契函数
 * @return {Function} 正确的缓存斐波那契函数
 */
function createCorrectCachedFib() {
  correctCallCount = 0; // 重置计数器

  const cachedFib = cache(function(n) {
    correctCallCount++; // 统计调用次数
    if (n <= 1) return n;
    return cachedFib(n - 1) + cachedFib(n - 2);
  });

  return cachedFib;
}

/**
 * @description 重置计数器
 */
function resetCounters() {
  wrongCallCount = 0;
  correctCallCount = 0;
}

/**
 * @description 格式化数字显示
 * @param {number} num - 要格式化的数字
 * @return {string} 格式化后的字符串
 */
function formatNumber(num) {
  return num.toLocaleString();
}

/**
 * @description 测试函数性能
 * @param {Function} fn - 要测试的函数
 * @param {number} n - 测试参数
 * @param {string} name - 测试名称
 * @param {Function} getCallCount - 获取调用次数的函数
 * @return {Object} 测试结果
 */
function testPerformance(fn, n, name, getCallCount) {
  const startTime = performance.now();
  const result = fn(n);
  const endTime = performance.now();
  const executionTime = endTime - startTime;

  return {
    name,
    result,
    executionTime: executionTime.toFixed(3),
    callCount: getCallCount()
  };
}

/**
 * @description 运行性能对比测试
 * @param {number} n - 测试的斐波那契数列索引
 */
function runPerformanceTest(n) {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`🧮 斐波那契数列第 ${n} 项性能对比测试`);
  console.log(`${'='.repeat(60)}`);

  // 创建新的函数实例进行测试
  const wrongCachedFib = createWrongCachedFib();
  const correctCachedFib = createCorrectCachedFib();

  // 测试错误实现
  const wrongResult = testPerformance(wrongCachedFib, n, '错误缓存实现', () => wrongCallCount);

  // 测试正确实现
  const correctResult = testPerformance(correctCachedFib, n, '正确缓存实现', () => correctCallCount);

  // 输出结果
  console.log(`\n📊 测试结果对比:`);
  console.log(`┌─────────────────┬─────────────────┬─────────────────┬─────────────────┐`);
  console.log(`│ 实现方式        │ 计算结果        │ 执行时间(ms)    │ 函数调用次数    │`);
  console.log(`├─────────────────┼─────────────────┼─────────────────┼─────────────────┤`);
  console.log(`│ ${wrongResult.name.padEnd(13)} │ ${formatNumber(wrongResult.result).padEnd(13)} │ ${wrongResult.executionTime.padEnd(13)} │ ${formatNumber(wrongResult.callCount).padEnd(13)} │`);
  console.log(`│ ${correctResult.name.padEnd(13)} │ ${formatNumber(correctResult.result).padEnd(13)} │ ${correctResult.executionTime.padEnd(13)} │ ${formatNumber(correctResult.callCount).padEnd(13)} │`);
  console.log(`└─────────────────┴─────────────────┴─────────────────┴─────────────────┘`);

  // 性能差异分析
  const timeDiff = (parseFloat(wrongResult.executionTime) / parseFloat(correctResult.executionTime)).toFixed(1);
  const callDiff = (wrongResult.callCount / correctResult.callCount).toFixed(1);

  console.log(`\n📈 性能差异分析:`);
  console.log(`• 执行时间差异: 错误实现比正确实现慢 ${timeDiff} 倍`);
  console.log(`• 调用次数差异: 错误实现比正确实现多调用 ${callDiff} 倍`);
  console.log(`• 时间复杂度: 错误实现 O(2^n) vs 正确实现 O(n)`);

  if (timeDiff > 100) {
    console.log(`⚠️  警告: 性能差异极大，错误实现在大数值时会导致严重性能问题！`);
  }
}

/**
 * @description 测试缓存命中情况
 * @param {number} n - 测试参数
 */
function testCacheHit(n) {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`🎯 缓存命中测试 - 第 ${n} 项`);
  console.log(`${'='.repeat(60)}`);

  // 测试错误实现的缓存命中
  const wrongCachedFib = createWrongCachedFib();
  console.log(`\n❌ 错误实现缓存测试:`);
  console.log(`第一次调用 wrongCachedFib(${n}):`);
  console.time('错误实现-第一次');
  const wrongFirst = wrongCachedFib(n);
  console.timeEnd('错误实现-第一次');
  const wrongFirstCalls = wrongCallCount;
  console.log(`调用次数: ${formatNumber(wrongFirstCalls)}`);

  console.log(`\n第二次调用 wrongCachedFib(${n}):`);
  console.time('错误实现-第二次');
  const wrongSecond = wrongCachedFib(n);
  console.timeEnd('错误实现-第二次');
  console.log(`调用次数: ${formatNumber(wrongCallCount - wrongFirstCalls)} (新增)`);

  // 测试正确实现的缓存命中
  const correctCachedFib = createCorrectCachedFib();
  console.log(`\n✅ 正确实现缓存测试:`);
  console.log(`第一次调用 correctCachedFib(${n}):`);
  console.time('正确实现-第一次');
  const correctFirst = correctCachedFib(n);
  console.timeEnd('正确实现-第一次');
  const correctFirstCalls = correctCallCount;
  console.log(`调用次数: ${formatNumber(correctFirstCalls)}`);

  console.log(`\n第二次调用 correctCachedFib(${n}):`);
  console.time('正确实现-第二次');
  const correctSecond = correctCachedFib(n);
  console.timeEnd('正确实现-第二次');
  console.log(`调用次数: ${formatNumber(correctCallCount - correctFirstCalls)} (新增)`);

  console.log(`\n📝 缓存效果总结:`);
  console.log(`• 错误实现: 只有最外层调用被缓存，内部递归仍然重复计算`);
  console.log(`• 正确实现: 所有子问题都被缓存，避免重复计算`);
  console.log(`• 错误实现第一次调用: ${formatNumber(wrongFirstCalls)} 次函数调用`);
  console.log(`• 正确实现第一次调用: ${formatNumber(correctFirstCalls)} 次函数调用`);
  console.log(`• 性能提升: ${(wrongFirstCalls / correctFirstCalls).toFixed(0)} 倍效率提升`);
}

/**
 * @description 渐进式性能测试
 */
function progressiveTest() {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`📊 渐进式性能测试`);
  console.log(`${'='.repeat(60)}`);

  const testCases = [10, 15, 20, 25, 30];

  console.log(`\n测试不同规模下的性能表现:`);
  console.log(`┌─────────┬─────────────────┬─────────────────┬─────────────────┬─────────────────┐`);
  console.log(`│ 数列项  │ 错误实现时间(ms)│ 正确实现时间(ms)│ 错误调用次数    │ 正确调用次数    │`);
  console.log(`├─────────┼─────────────────┼─────────────────┼─────────────────┼─────────────────┤`);

  testCases.forEach(n => {
    // 测试错误实现
    const wrongCachedFib = createWrongCachedFib();
    const wrongStart = performance.now();
    wrongCachedFib(n);
    const wrongTime = (performance.now() - wrongStart).toFixed(3);
    const wrongCalls = wrongCallCount;

    // 测试正确实现
    const correctCachedFib = createCorrectCachedFib();
    const correctStart = performance.now();
    correctCachedFib(n);
    const correctTime = (performance.now() - correctStart).toFixed(3);
    const correctCalls = correctCallCount;

    console.log(`│ fib(${n.toString().padEnd(2)}) │ ${wrongTime.padEnd(13)} │ ${correctTime.padEnd(13)} │ ${formatNumber(wrongCalls).padEnd(13)} │ ${formatNumber(correctCalls).padEnd(13)} │`);
  });

  console.log(`└─────────┴─────────────────┴─────────────────┴─────────────────┴─────────────────┘`);
}

/**
 * @description 复杂度增长演示
 */
function complexityGrowthDemo() {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`📈 复杂度增长演示`);
  console.log(`${'='.repeat(60)}`);

  console.log(`\n观察调用次数随输入规模的增长模式:`);
  console.log(`┌─────────┬─────────────────┬─────────────────┬─────────────────┐`);
  console.log(`│ 输入 n  │ 错误实现调用次数│ 正确实现调用次数│ 效率提升倍数    │`);
  console.log(`├─────────┼─────────────────┼─────────────────┼─────────────────┤`);

  for (let n = 5; n <= 30; n += 5) {
    const wrongCachedFib = createWrongCachedFib();
    wrongCachedFib(n);
    const wrongCalls = wrongCallCount;

    const correctCachedFib = createCorrectCachedFib();
    correctCachedFib(n);
    const correctCalls = correctCallCount;

    const improvement = (wrongCalls / correctCalls).toFixed(0);

    console.log(`│ ${n.toString().padEnd(7)} │ ${formatNumber(wrongCalls).padEnd(13)} │ ${formatNumber(correctCalls).padEnd(13)} │ ${improvement.padEnd(13)} │`);
  }

  console.log(`└─────────┴─────────────────┴─────────────────┴─────────────────┘`);

  console.log(`\n📊 复杂度分析:`);
  console.log(`• 错误实现: 调用次数呈指数增长 O(2^n)`);
  console.log(`• 正确实现: 调用次数呈线性增长 O(n)`);
  console.log(`• 效率提升: 随着n增大，提升倍数呈指数增长`);
}

/**
 * @description 主测试函数
 */
function main() {
  console.log(`🚀 缓存性能对比测试开始`);
  console.log(`测试目标: 对比错误缓存实现 vs 正确缓存实现`);

  // 渐进式测试
  progressiveTest();

  // 复杂度增长演示
  complexityGrowthDemo();

  // 详细性能测试
  runPerformanceTest(25);

  // 缓存命中测试
  testCacheHit(20);

  console.log(`\n${'='.repeat(60)}`);
  console.log(`🎯 测试总结`);
  console.log(`${'='.repeat(60)}`);
  console.log(`✅ 正确实现的优势:`);
  console.log(`  • 时间复杂度: O(n) - 每个子问题只计算一次`);
  console.log(`  • 空间复杂度: O(n) - 缓存存储所有子问题结果`);
  console.log(`  • 性能稳定: 即使在大数值时也能快速计算`);
  console.log(`\n❌ 错误实现的问题:`);
  console.log(`  • 时间复杂度: O(2^n) - 大量重复计算`);
  console.log(`  • 只缓存最外层调用，内部递归无法受益`);
  console.log(`  • 在大数值时性能急剧下降`);
  console.log(`\n💡 关键教训:`);
  console.log(`  • 缓存递归函数时，必须确保递归调用也使用缓存版本`);
  console.log(`  • 函数内部的递归调用不会自动使用外层包装的缓存`);
  console.log(`  • 这是面试中常见的陷阱，需要特别注意！`);
}

// 运行测试
main();