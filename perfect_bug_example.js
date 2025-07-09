/**
 * @description 使用用户的完美例子来演示缓存问题
 * @author 前端面试宝典
 * @date 2024
 *
 * 这个例子完美展示了修改原数组导致的缓存问题
 */

console.log("🎯 完美的缓存错误演示 - 用户提供的例子");
console.log("=".repeat(60));

// 缓存装饰器
function cache(fn) {
  const cacheMap = new Map();
  return function(...args) {
    const key = JSON.stringify(args);

    if (cacheMap.has(key)) {
      console.log(`🎯 缓存命中! key: ${key}`);
      console.log(`📋 直接返回缓存值: ${cacheMap.get(key)}`);
      return cacheMap.get(key);
    }

    console.log(`🔄 缓存未命中 key: ${key}`);
    const result = fn.apply(this, args);
    cacheMap.set(key, result);
    console.log(`💾 结果 ${result} 已缓存到 key: ${key}`);
    return result;
  };
}

/**
 * @description 用户提供的错误例子
 */
function demonstrateUserExample() {
  console.log("\n" + "=".repeat(60));
  console.log("❌ 用户的例子：修改原数组的问题");
  console.log("=".repeat(60));

  console.log("\n📝 代码：");
  console.log(`const cacheFn = cache(function (arr, k) {
    console.log("计算中:", arr);
    if (k === 1) return arr[0];
    arr.splice(0, 1); // ❌ 修改原数组
    return cacheFn(arr, k - 1);
});`);

  const cacheFn = cache(function (arr, k) {
    console.log("  计算中:", arr); // 打印实际传入的 arr
    if (k === 1) return arr[0];
    arr.splice(0, 1); // 修改 arr
    return cacheFn(arr, k - 1);
  });

  console.log("\n🔍 第一次调用: cacheFn([1, 2, 3], 2)");
  console.log("-".repeat(40));
  const result1 = cacheFn([1, 2, 3], 2);
  console.log(`✅ 第一次结果: ${result1}`);

  console.log("\n🔍 第二次调用: cacheFn([1, 2, 3], 2) - 相同输入");
  console.log("-".repeat(40));
  const result2 = cacheFn([1, 2, 3], 2);
  console.log(`❌ 第二次结果: ${result2}`);

  console.log("\n💥 问题分析:");
  console.log(`• 两次调用输入相同: [1, 2, 3], 2`);
  console.log(`• 第一次结果: ${result1}`);
  console.log(`• 第二次结果: ${result2} (缓存命中，没有重新计算)`);
  console.log(`• 但第一次调用时实际处理的数组被修改了！`);
}

/**
 * @description 详细分析第一次调用的执行过程
 */
function analyzeFirstCallExecution() {
  console.log("\n" + "=".repeat(60));
  console.log("🔬 第一次调用的详细执行过程分析");
  console.log("=".repeat(60));

  console.log("\n📊 执行步骤分解:");
  console.log("1. 调用 cacheFn([1, 2, 3], 2)");
  console.log("2. 缓存key: JSON.stringify([[1, 2, 3], 2]) = '[[1,2,3],2]'");
  console.log("3. 缓存未命中，开始执行函数");
  console.log("4. 执行过程:");
  console.log("   • 传入参数 arr=[1, 2, 3], k=2");
  console.log("   • k !== 1，执行 arr.splice(0, 1)");
  console.log("   • arr 变为 [2, 3] (原始数组被修改！)");
  console.log("   • 递归调用 cacheFn([2, 3], 1)");
  console.log("   • 新的缓存key: '[[2,3],1]'");
  console.log("   • k === 1，返回 arr[0] = 2");
  console.log("5. 最终结果 2 被缓存到 key '[[1,2,3],2]'");

  console.log("\n⚠️  关键问题:");
  console.log("缓存的key是基于调用时的参数 [1,2,3],2");
  console.log("但实际计算时使用的是被修改后的数组！");
}

/**
 * @description 正确的实现对比
 */
function demonstrateCorrectVersion() {
  console.log("\n" + "=".repeat(60));
  console.log("✅ 正确的实现对比");
  console.log("=".repeat(60));

  console.log("\n📝 正确的代码：");
  console.log(`const cacheFnCorrect = cache(function (arr, k) {
    console.log("计算中:", arr);
    if (k === 1) return arr[0];
    const newArr = [...arr]; // ✅ 创建副本
    newArr.splice(0, 1);
    return cacheFnCorrect(newArr, k - 1);
});`);

  const cacheFnCorrect = cache(function (arr, k) {
    console.log("  计算中:", arr);
    if (k === 1) return arr[0];
    const newArr = [...arr]; // 创建副本
    newArr.splice(0, 1);
    return cacheFnCorrect(newArr, k - 1);
  });

  console.log("\n🔍 第一次调用: cacheFnCorrect([1, 2, 3], 2)");
  const result1 = cacheFnCorrect([1, 2, 3], 2);
  console.log(`✅ 第一次结果: ${result1}`);

  console.log("\n🔍 第二次调用: cacheFnCorrect([1, 2, 3], 2)");
  const result2 = cacheFnCorrect([1, 2, 3], 2);
  console.log(`✅ 第二次结果: ${result2} (缓存命中)`);

  console.log("\n🎉 正确实现的优势:");
  console.log(`• 两次调用结果一致: ${result1 === result2 ? '是' : '否'}`);
  console.log(`• 原始数组未被修改`);
  console.log(`• 缓存工作正常`);
  console.log(`• 函数行为可预测`);
}

/**
 * @description 创建一个能明显暴露错误的场景
 */
function createObviousErrorCase() {
  console.log("\n" + "=".repeat(60));
  console.log("🔥 让错误更明显的场景");
  console.log("=".repeat(60));

  // 创建一个新的函数实例来避免之前的缓存干扰
  const cacheFnBug = cache(function (arr, k) {
    console.log(`  处理数组: [${arr}], 取第${k}个`);
    if (k === 1) {
      console.log(`  返回第1个元素: ${arr[0]}`);
      return arr[0];
    }
    console.log(`  删除第一个元素 ${arr[0]}`);
    arr.splice(0, 1); // 修改原数组
    console.log(`  数组变为: [${arr}]`);
    return cacheFnBug(arr, k - 1);
  });

  console.log("\n📋 测试场景：多次调用相同参数");

  // 多次调用相同参数来暴露问题
  console.log("\n1️⃣ 第一次调用 cacheFnBug([5, 4, 3, 2, 1], 3):");
  console.log("期望：应该返回第3个元素，即 3");
  const test1 = [5, 4, 3, 2, 1];
  const result1 = cacheFnBug([...test1], 3); // 传入副本避免外部影响
  console.log(`结果: ${result1}`);

  console.log("\n2️⃣ 第二次调用 cacheFnBug([5, 4, 3, 2, 1], 3):");
  console.log("期望：应该还是返回第3个元素，即 3");
  const test2 = [5, 4, 3, 2, 1];
  const result2 = cacheFnBug([...test2], 3); // 传入副本
  console.log(`结果: ${result2} (缓存命中)`);

  // 验证正确答案
  const correctAnswer = [5, 4, 3, 2, 1][2]; // 第3个元素(索引2)
  console.log(`\n🧮 正确答案应该是: ${correctAnswer}`);
  console.log(`第一次结果: ${result1} ${result1 === correctAnswer ? '✅' : '❌'}`);
  console.log(`第二次结果: ${result2} ${result2 === correctAnswer ? '✅' : '❌'}`);

  if (result1 === result2 && result1 === correctAnswer) {
    console.log("\n🤔 这个例子结果碰巧正确，但过程是错误的");
    console.log("让我们看看如果函数逻辑稍有不同会发生什么...");
  }
}

/**
 * @description 展示修改原数组在实际场景中的危险
 */
function showRealWorldDanger() {
  console.log("\n" + "=".repeat(60));
  console.log("💀 实际场景中的危险性");
  console.log("=".repeat(60));

  console.log("\n🏪 场景：电商购物车处理");

  const processCart = cache(function(cart, operation) {
    console.log(`  处理购物车: [${cart.join(', ')}], 操作: ${operation}`);

    if (operation === 'getFirst') {
      return cart[0];
    }

    if (operation === 'removeFirst') {
      const removed = cart[0];
      cart.splice(0, 1); // ❌ 修改原购物车！
      console.log(`  移除商品: ${removed}, 剩余: [${cart.join(', ')}]`);
      return removed;
    }

    return null;
  });

  console.log("\n👤 用户A的购物车操作：");
  const userACart = ['iPhone', 'iPad', 'AirPods'];
  console.log(`原始购物车: [${userACart.join(', ')}]`);

  console.log("\n🔍 调用 processCart(['iPhone', 'iPad', 'AirPods'], 'removeFirst'):");
  const removed = processCart(['iPhone', 'iPad', 'AirPods'], 'removeFirst');
  console.log(`返回值: ${removed}`);

  console.log("\n👤 用户B的相同操作 (缓存命中)：");
  const userBCart = ['iPhone', 'iPad', 'AirPods'];
  console.log(`用户B购物车: [${userBCart.join(', ')}]`);

  console.log("\n🔍 调用 processCart(['iPhone', 'iPad', 'AirPods'], 'removeFirst'):");
  const removed2 = processCart(['iPhone', 'iPad', 'AirPods'], 'removeFirst');
  console.log(`返回值: ${removed2} (缓存命中，没有实际执行)`);

  console.log("\n💥 问题分析：");
  console.log("• 用户A的操作：实际执行了移除逻辑");
  console.log("• 用户B的操作：直接返回缓存结果，但：");
  console.log("  - 用户B的购物车没有被实际修改");
  console.log("  - 系统认为商品已被移除，但实际没有");
  console.log("  - 导致数据不一致的严重问题！");

  console.log("\n🚨 这就是为什么绝对不能修改输入参数的原因！");
}

/**
 * @description 主函数
 */
function main() {
  demonstrateUserExample();
  analyzeFirstCallExecution();
  demonstrateCorrectVersion();
  createObviousErrorCase();
  showRealWorldDanger();

  console.log("\n" + "=".repeat(60));
  console.log("🎯 总结：用户例子完美展示了问题");
  console.log("=".repeat(60));
  console.log("✨ 用户提供的例子是一个经典的反面教材：");
  console.log("❌ arr.splice(0, 1) 直接修改了传入的数组");
  console.log("🔥 这导致缓存基于错误的计算过程");
  console.log("💡 解决方案：const newArr = [...arr]; newArr.splice(0, 1);");
  console.log("\n🏆 核心原则：永远不要修改函数的输入参数！");
}

// 运行演示
main();