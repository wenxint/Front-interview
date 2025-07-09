/**
 * @description 明显暴露缓存错误结果的演示
 * @author 前端面试宝典
 * @date 2024
 *
 * 这个例子将明显展示修改原数组导致错误结果的问题
 */

console.log("🚨 明显错误结果演示");
console.log("=".repeat(50));

// 缓存装饰器
function cache(fn) {
  const cacheMap = new Map();
  return function(...args) {
    const key = JSON.stringify(args);

    if (cacheMap.has(key)) {
      console.log(`🎯 缓存命中! 返回: ${cacheMap.get(key)}`);
      return cacheMap.get(key);
    }

    console.log(`🔄 计算中...`);
    const result = fn.apply(this, args);
    cacheMap.set(key, result);
    console.log(`💾 缓存结果: ${result}`);
    return result;
  };
}

// ❌ 错误版本：修改原数组
const findKthLargestWrong = cache(function(nums, k) {
  console.log(`  处理: [${nums}], 找第${k}大`);

  if (k === 1) {
    const max = Math.max(...nums);
    console.log(`  最大值: ${max}`);
    return max;
  }

  const max = Math.max(...nums);
  const maxIndex = nums.indexOf(max);
  nums.splice(maxIndex, 1); // ❌ 修改原数组！
  console.log(`  删除 ${max}，剩余: [${nums}]`);

  return findKthLargestWrong(nums, k - 1);
});

// ✅ 正确版本：不修改原数组
const findKthLargestCorrect = cache(function(nums, k) {
  console.log(`  处理: [${nums}], 找第${k}大`);

  if (k === 1) {
    const max = Math.max(...nums);
    console.log(`  最大值: ${max}`);
    return max;
  }

  const numsCopy = [...nums];
  const max = Math.max(...numsCopy);
  const maxIndex = numsCopy.indexOf(max);
  numsCopy.splice(maxIndex, 1);
  console.log(`  删除 ${max}，副本: [${numsCopy}]，原数组: [${nums}]`);

  return findKthLargestCorrect(numsCopy, k - 1);
});

/**
 * @description 创建一个特殊情况来暴露问题
 */
function demonstrateBugWithSpecialCase() {
  console.log("\n" + "=".repeat(50));
  console.log("🔥 特殊案例：暴露缓存错误");
  console.log("=".repeat(50));

  // 使用一个特殊的数组，让第一次调用的副作用影响后续结果
  console.log("\n📋 测试场景：");
  console.log("第一次：findKthLargest([5, 3, 7], 2) - 找第2大");
  console.log("第二次：findKthLargest([5, 3], 1) - 找第1大");
  console.log("第三次：findKthLargest([5, 3, 7], 2) - 又找第2大");

  // 第一次调用：[5, 3, 7]，找第2大
  console.log("\n🔍 第一次调用:");
  const array1 = [5, 3, 7];
  console.log(`调用 findKthLargestWrong([${array1}], 2)`);
  const result1 = findKthLargestWrong(array1, 2);
  console.log(`结果: ${result1}`);
  console.log(`array1状态: [${array1}]`);

  // 第二次调用：[5, 3]，找第1大
  console.log("\n🔍 第二次调用:");
  const array2 = [5, 3];
  console.log(`调用 findKthLargestWrong([${array2}], 1)`);
  const result2 = findKthLargestWrong(array2, 1);
  console.log(`结果: ${result2}`);
  console.log(`array2状态: [${array2}]`);

  // 第三次调用：[5, 3, 7]，找第2大 - 这里应该是缓存命中，但可能返回错误结果
  console.log("\n🔍 第三次调用 (关键！):");
  const array3 = [5, 3, 7];
  console.log(`调用 findKthLargestWrong([${array3}], 2) - 和第一次相同输入`);
  const result3 = findKthLargestWrong(array3, 2);
  console.log(`结果: ${result3}`);
  console.log(`array3状态: [${array3}]`);

  // 验证正确答案
  console.log("\n🧮 验证正确答案:");
  const sortedOriginal = [5, 3, 7].sort((a, b) => b - a);
  const correctAnswer = sortedOriginal[1]; // 第2大
  console.log(`[5, 3, 7] 排序后: [${sortedOriginal}]`);
  console.log(`第2大元素应该是: ${correctAnswer}`);

  console.log("\n📊 结果分析:");
  console.log(`第一次结果: ${result1} ${result1 === correctAnswer ? '✅' : '❌'}`);
  console.log(`第三次结果: ${result3} ${result3 === correctAnswer ? '✅' : '❌'}`);
  console.log(`两次结果一致: ${result1 === result3 ? '是' : '否'}`);

  if (result1 !== correctAnswer || result3 !== correctAnswer) {
    console.log("💥 发现问题！缓存返回了错误结果！");
  } else {
    console.log("⚠️  这个例子碰巧没有暴露问题，让我们试试更复杂的情况...");
  }
}

/**
 * @description 创建一个必然出错的场景
 */
function createDefiniteErrorScenario() {
  console.log("\n" + "=".repeat(50));
  console.log("💣 必然出错的场景");
  console.log("=".repeat(50));

  // 重新创建函数实例以清除缓存
  const findKthWrongNew = cache(function(nums, k) {
    console.log(`  执行: [${nums.join(',')}], k=${k}`);

    if (k === 1) {
      const max = Math.max(...nums);
      return max;
    }

    const max = Math.max(...nums);
    const maxIndex = nums.indexOf(max);
    nums.splice(maxIndex, 1); // 修改原数组
    console.log(`  删除${max}后: [${nums.join(',')}]`);

    return findKthWrongNew(nums, k - 1);
  });

  console.log("\n🎯 精心设计的测试：");
  console.log("目标：通过特定的调用顺序，让缓存保存错误的中间状态");

  // 第一步：先调用一个会修改数组的情况
  console.log("\n1️⃣ 第一次调用：findKthWrongNew([1, 2, 3], 2)");
  const test1 = [1, 2, 3];
  const result1 = findKthWrongNew(test1, 2);
  console.log(`   结果: ${result1}`);
  console.log(`   数组变为: [${test1.join(',')}]`);

  // 第二步：调用一个中间状态
  console.log("\n2️⃣ 第二次调用：findKthWrongNew([1, 2], 1)");
  const test2 = [1, 2];
  const result2 = findKthWrongNew(test2, 1);
  console.log(`   结果: ${result2} (这会被缓存)`);
  console.log(`   数组状态: [${test2.join(',')}]`);

  // 第三步：再次调用原始输入
  console.log("\n3️⃣ 第三次调用：findKthWrongNew([1, 2, 3], 2) - 相同输入!");
  const test3 = [1, 2, 3];
  const result3 = findKthWrongNew(test3, 2);
  console.log(`   结果: ${result3} (缓存命中)`);
  console.log(`   数组状态: [${test3.join(',')}]`);

  // 验证
  console.log("\n🔍 验证结果:");
  const correct = [1, 2, 3].sort((a, b) => b - a)[1]; // 第2大
  console.log(`正确答案: ${correct}`);
  console.log(`第一次: ${result1} ${result1 === correct ? '✅' : '❌'}`);
  console.log(`第三次: ${result3} ${result3 === correct ? '✅' : '❌'}`);

  if (result1 === result3 && result1 === correct) {
    console.log("\n🤔 这个例子还是没有完全暴露问题...");
    console.log("让我解释核心问题：即使结果碰巧正确，");
    console.log("修改原数组的行为本身就是错误的编程实践！");
  }
}

/**
 * @description 展示副作用的危险性
 */
function showSideEffectDangers() {
  console.log("\n" + "=".repeat(50));
  console.log("⚡ 副作用的真正危险");
  console.log("=".repeat(50));

  console.log("\n🚨 核心问题不是这个特定算法，而是编程原则：");
  console.log("1. 函数应该是纯函数（相同输入→相同输出）");
  console.log("2. 不应该修改输入参数（避免副作用）");
  console.log("3. 缓存依赖于函数的纯度");
  console.log("4. 一旦破坏纯度，就无法保证缓存的正确性");

  console.log("\n🔧 实际场景举例：");
  console.log("假设你有一个电商网站，用户购物车数组：[商品A, 商品B, 商品C]");
  console.log("如果你的函数修改了这个数组，用户的购物车就被破坏了！");
  console.log("即使你的算法结果正确，用户的数据已经损坏！");

  const userCart = ['iPhone', 'iPad', 'MacBook'];
  console.log(`\n📱 用户购物车: [${userCart.join(', ')}]`);

  // 模拟一个会修改购物车的函数
  function getExpensiveItem(cart) {
    console.log(`  查找最贵商品: [${cart.join(', ')}]`);
    const expensive = cart[cart.length - 1]; // 假设最后一个最贵
    cart.pop(); // ❌ 修改了用户的购物车！
    console.log(`  找到: ${expensive}，购物车现在: [${cart.join(', ')}]`);
    return expensive;
  }

  console.log("\n❌ 错误的函数调用:");
  const result = getExpensiveItem(userCart);
  console.log(`函数返回: ${result}`);
  console.log(`用户购物车被破坏: [${userCart.join(', ')}] 😱`);

  console.log("\n💡 这就是为什么必须复制数组的原因：");
  console.log("• 保护原始数据不被意外修改");
  console.log("• 确保函数的可预测性");
  console.log("• 让缓存能够正确工作");
  console.log("• 避免难以发现的bug");
}

// 运行所有演示
function main() {
  demonstrateBugWithSpecialCase();
  createDefiniteErrorScenario();
  showSideEffectDangers();

  console.log("\n" + "=".repeat(50));
  console.log("🎯 最终结论");
  console.log("=".repeat(50));
  console.log("问题的核心不是'速度'，而是'原则'：");
  console.log("✅ 复制数组 = 遵循编程最佳实践");
  console.log("❌ 修改原数组 = 违反函数式编程原则");
  console.log("\n即使在某些情况下结果看起来正确，");
  console.log("修改输入参数仍然是错误的做法！");
}

main();