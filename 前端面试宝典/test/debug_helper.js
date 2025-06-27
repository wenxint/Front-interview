/**
 * 调试辅助函数 - 检测特定数组状态
 * @param {any[]} currentArray - 当前数组状态
 * @param {any[]} targetArray - 目标数组状态
 * @param {string} label - 调试标签
 */
function debugWhen(currentArray, targetArray, label = '调试点') {
  if (JSON.stringify(currentArray) === JSON.stringify(targetArray)) {
    console.log(`🚀 ${label}:`, currentArray);
    debugger; // 触发断点
    return true;
  }
  return false;
}

/**
 * 更灵活的调试函数 - 支持多种匹配条件
 * @param {any[]} currentArray
 * @param {object} conditions - 条件对象
 */
function debugOnCondition(currentArray, conditions) {
  const {
    exactMatch,     // 精确匹配数组
    length,         // 数组长度
    contains,       // 包含特定元素
    startsWith,     // 以特定元素开始
    endsWith,       // 以特定元素结束
    label = '调试点'
  } = conditions;

  let shouldBreak = false;

  // 精确匹配
  if (exactMatch && JSON.stringify(currentArray) === JSON.stringify(exactMatch)) {
    shouldBreak = true;
  }

  // 长度匹配
  if (length && currentArray.length === length) {
    shouldBreak = true;
  }

  // 包含特定元素
  if (contains && currentArray.includes(contains)) {
    shouldBreak = true;
  }

  // 以特定元素开始
  if (startsWith && currentArray[0] === startsWith) {
    shouldBreak = true;
  }

  // 以特定元素结束
  if (endsWith && currentArray[currentArray.length - 1] === endsWith) {
    shouldBreak = true;
  }

  if (shouldBreak) {
    console.log(`🎯 ${label}:`, currentArray);
    debugger;
    return true;
  }

  return false;
}

// 使用示例：
// debugWhen(path, [2, 1, 3], '找到目标排列');
// debugOnCondition(path, { exactMatch: [2, 1, 3], label: '目标排列' });
// debugOnCondition(path, { length: 2, startsWith: 2, label: '以2开始的长度为2的路径' });