// 递归模板函数测试

console.log('开始测试递归模板函数...');

// 原始递归模板函数
function recursiveTemplate(strings, ...values) {
  console.log('原始函数 - 输入字符串数组:', strings);
  console.log('原始函数 - 输入值:', values);

  return strings.reduce((result, str, i) => {
    const value = i < values.length ? values[i] : '';
    console.log(`原始函数 - 处理第${i}个字符串: "${str}" 和第${i}个值:`, value);

    // 递归处理数组
    if (Array.isArray(value)) {
      console.log('原始函数 - 发现数组，对每个元素处理');
      return result + str + value.map(item =>
        `<li>${typeof item === 'object' ? JSON.stringify(item) : item}</li>`
      ).join('');
    }

    // 处理对象
    if (value && typeof value === 'object') {
      console.log('原始函数 - 发现对象，转换为HTML');
      return result + str + Object.entries(value)
        .map(([key, val]) => `<div>${key}: ${val}</div>`)
        .join('');
    }

    console.log('原始函数 - 处理简单值');
    return result + str + value;
  }, '');
}

// 修复后的递归模板函数
function improvedRecursiveTemplate(strings, ...values) {
  console.log('改进函数 - 输入字符串数组:', strings);
  console.log('改进函数 - 输入值:', values);

  return strings.reduce((result, str, i) => {
    console.log(`改进函数 - 处理第${i}个字符串: "${str}"`);

    // 如果已经处理完所有值，只添加剩余字符串
    if (i >= values.length) {
      console.log('改进函数 - 已处理完所有值，只添加剩余字符串');
      return result + str;
    }

    const value = values[i];
    console.log(`改进函数 - 处理第${i}个值:`, value);

    // 递归处理数组，并确保生成的HTML结构正确
    if (Array.isArray(value)) {
      console.log('改进函数 - 发现数组，对每个元素处理');
      const listItems = value.map(item => {
        if (item === null || item === undefined) {
          return '<li>null</li>';
        } else if (typeof item === 'object') {
          return `<li>${JSON.stringify(item)}</li>`;
        } else {
          return `<li>${item}</li>`;
        }
      }).join('');
      return result + str + listItems;
    }

    // 处理对象，但需要处理null和检查是否真的是对象
    if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
      console.log('改进函数 - 发现对象，转换为HTML');
      const properties = Object.entries(value).map(([key, val]) => {
        // 处理嵌套对象和数组
        if (val === null || val === undefined) {
          return `<div>${key}: null</div>`;
        } else if (typeof val === 'object') {
          return `<div>${key}: ${JSON.stringify(val)}</div>`;
        } else {
          return `<div>${key}: ${val}</div>`;
        }
      }).join('');
      return result + str + properties;
    }

    // 处理null和undefined值
    console.log('改进函数 - 处理简单值');
    const displayValue = value === null || value === undefined ? '' : value;
    return result + str + displayValue;
  }, '');
}

// 测试数据
const user = { name: 'Alice', age: 28 };
const hobbies = ['reading', 'coding', { type: 'sports', name: 'tennis' }];
const complexObject = {
  info: { id: 1, active: true },
  preferences: null,
  tags: ['tag1', 'tag2']
};

// 测试原始函数
console.log('=== 原始函数测试 ===');
const output1 = recursiveTemplate`
  <div class="user-card">
    <h2>User Info</h2>
    <div class="details">
      ${user}
    </div>
    <h3>Hobbies</h3>
    <ul>
      ${hobbies}
    </ul>
  </div>
`;
console.log(output1);

// 测试修复后的函数
console.log('\n=== 修复后函数测试 ===');
const output2 = improvedRecursiveTemplate`
  <div class="user-card">
    <h2>User Info</h2>
    <div class="details">
      ${user}
    </div>
    <h3>Hobbies</h3>
    <ul>
      ${hobbies}
    </ul>
  </div>
`;
console.log(output2);

// 测试更复杂的情况
console.log('\n=== 复杂对象测试 ===');
const output3 = improvedRecursiveTemplate`
  <div class="complex-card">
    <h2>Complex Object</h2>
    <div class="complex-details">
      ${complexObject}
    </div>
    <div>空值测试: ${null}</div>
    <div>未定义测试: ${undefined}</div>
  </div>
`;
console.log(output3);

// 简化的测试用例
console.log('=== 简单测试 ===');
const simpleUser = { name: 'Bob' };
console.log('\n测试原始函数:');
const simpleOutput1 = recursiveTemplate`<div>${simpleUser}</div>`;
console.log('输出结果:', simpleOutput1);

console.log('\n测试改进函数:');
const simpleOutput2 = improvedRecursiveTemplate`<div>${simpleUser}</div>`;
console.log('输出结果:', simpleOutput2);

// 测试更复杂的情况
console.log('\n=== 空值测试 ===');
const nullOutput = improvedRecursiveTemplate`<div>空值测试: ${null}</div>`;
console.log('空值测试结果:', nullOutput);