# 字符串的replace与match方法

## 概念介绍

JavaScript的`String`原型提供了`replace`和`match`两个核心方法，分别用于字符串替换和模式匹配。它们是处理文本操作的重要工具，广泛应用于数据清洗、格式校验、内容替换等场景。

## 基本语法

### 1. String.prototype.replace()

**作用**：替换字符串中的匹配项，支持普通字符串匹配或正则表达式匹配，是文本处理中最灵活的替换工具。

**语法**：
```javascript
str.replace(regexp|substr, newSubstr|function)
```

#### 参数详解
- **参数1（匹配模式）**：
  - 类型1：正则表达式（`RegExp`）。可携带标志位（如`g`全局匹配、`i`忽略大小写、`m`多行模式、`s`点匹配换行等）。
  - 类型2：普通字符串（`String`）。仅匹配第一个出现的子串（除非使用`replaceAll`方法）。

- **参数2（替换内容）**：
  - 类型1：替换字符串（`String`）。支持特殊占位符（如`$&`表示匹配的子串，`$n`表示第n个捕获组，`$$`表示`$`符号等）。
  - 类型2：替换函数（`Function`）。函数参数依次为：匹配的子串、捕获组（多个）、匹配的偏移量、原字符串，返回替换后的字符串。

**示例（正则标志位）**：
```javascript
// 忽略大小写（i标志）并全局替换（g标志）
const str = 'Hello, HELLO!';
const replaced = str.replace(/hello/gi, 'Hi');
console.log(replaced); // 输出: 'Hi, Hi!'
```

### 2. String.prototype.match()

**作用**：根据正则表达式检索字符串中的匹配结果，返回包含匹配信息的数组或`null`（无匹配时）。

**语法**：
```javascript
str.match(regexp)
```

#### 参数与返回值
- **参数**：正则表达式对象（`RegExp`）。若传入非正则表达式（如字符串），会隐式转换为`RegExp`（等价于`new RegExp(str)`）。
- **返回值**：
  - 若正则无`g`标志：返回数组（包含完整匹配、捕获组），并携带`index`（匹配位置）和`input`（原字符串）属性。
  - 若正则有`g`标志：仅返回所有匹配子串的数组（不含捕获组和额外属性）。
  - 无匹配时返回`null`。

**示例（无g标志）**：
```javascript
const str = '版本：v1.0, v2.5';
const regex = /v(\d+)\.(\d+)/; // 无g标志
const result = str.match(regex);
console.log(result);
// 输出: ['v1.0', '1', '0', index: 3, input: '版本：v1.0, v2.5']
```

**示例（有g标志）**：
```javascript
const regexG = /v(\d+)\.(\d+)/g; // 有g标志
const resultG = str.match(regexG);
console.log(resultG); // 输出: ['v1.0', 'v2.5']
```

## 核心特性

### replace() 的高级用法

#### （1）正则表达式与全局匹配

使用正则表达式的`g`标志可实现全局替换，`i`标志可忽略大小写：
```javascript
const str = 'Hello, hello!';
// 全局替换（不区分大小写）
const replaced = str.replace(/hello/gi, 'Hi');
console.log(replaced); // 输出: 'Hi, Hi!'
```

#### （2）替换函数

通过传入函数，可动态生成替换内容，函数参数依次为：匹配的子串、捕获组（多个）、匹配的偏移量、原字符串，返回替换后的字符串：

```javascript
// 替换函数完整参数示例
const htmlStr = '<div class="container">文本内容</div>';

// 使用替换函数展示所有可能的参数
const result = htmlStr.replace(/<(\w+)\s+class="([^"]+)">(.*?)<\/\1>/g,
  function(match, tag, className, content, offset, string) {
    console.log('完整匹配:', match);         // 输出: '<div class="container">文本内容</div>'
    console.log('第1个捕获组:', tag);        // 输出: 'div'
    console.log('第2个捕获组:', className);  // 输出: 'container'
    console.log('第3个捕获组:', content);    // 输出: '文本内容'
    console.log('匹配的偏移量:', offset);     // 输出: 0
    console.log('原字符串:', string);        // 输出: '<div class="container">文本内容</div>'
    
    // 关键说明：非贪婪匹配的实际行为
    // 虽然第三个捕获组使用了非贪婪量词`*?`，但由于后续需要匹配`</\1>`（即标签结束部分），
    // 因此`.*?`会匹配到最近的能让`</\1>`成功匹配的位置。在此示例中，只有匹配完整的"文本内容"
    // 才能让`</div>`正确匹配，因此最终捕获组获取的是完整内容而非部分内容。
    
    // 返回替换后的内容
    return `<${tag} class="${className}-modified">${content.toUpperCase()}</${tag}>`;
  }
);

console.log(result); // 输出: '<div class="container-modified">文本内容</div>'

// 实际应用示例：将美元价格转换为欧元（假设汇率1:0.9）
const priceStr = 'Price: $100, $200';
const euroStr = priceStr.replace(/\$(\d+)/g, (match, amount, offset, string) => {
  console.log('匹配的子串:', match);     // 例如: '$100'
  console.log('捕获组(金额):', amount);   // 例如: '100'
  console.log('匹配的偏移量:', offset);   // 例如: 7 (对于第一个匹配)
  console.log('原字符串:', string);      // 'Price: $100, $200'
  
  const euroAmount = (parseInt(amount) * 0.9).toFixed(2);
  return `€${euroAmount}`;
});

console.log(euroStr); // 输出: 'Price: €90.00, €180.00'
```

替换函数的参数解释：
- **match**: 匹配的子字符串
- **p1, p2, ...**: 正则表达式中的捕获组匹配的字符串（如果有的话）
- **offset**: 匹配到的子字符串在原字符串中的偏移量
- **string**: 被检索的原始字符串

替换函数必须有返回值，该返回值将作为替换字符串使用。

### match() 的匹配结果

- 若正则无`g`标志，返回包含完整匹配和捕获组的数组，并带有`index`和`input`属性。
- 若有`g`标志，仅返回所有匹配的子串数组（无捕获组信息）。

```javascript
const str = '日期：2023-10-01，2024-05-15';
const regexWithoutG = /(\d{4})-(\d{2})-(\d{2})/;
const regexWithG = /(\d{4})-(\d{2})-(\d{2})/g;

console.log(str.match(regexWithoutG));
// 输出: [ '2023-10-01', '2023', '10', '01', index: 3, input: '日期：2023-10-01，2024-05-15' ]

console.log(str.match(regexWithG));
// 输出: [ '2023-10-01', '2024-05-15' ]
```

## `replace()` 特殊替换模式

当`replace()`方法的第二个参数是字符串时，可以使用一些特殊的字符序列来指代匹配到的内容：

- `$$`：插入一个美元符号 `$`。
- `$&`：插入匹配到的子字符串。
- `$`：插入当前匹配之前的子字符串。
- `$'`：插入当前匹配之后的子字符串。
- `$n`：如果第一个参数是正则表达式，并且`n`是一个1到99之间的整数，那么插入第`n`个捕获组匹配的字符串。如果正则表达式中没有第`n`个捕获组，或者`n`是0，那么会插入`$n`这个字面量。

```javascript
const str = 'abc123def456';

// 插入美元符号
console.log(str.replace(/\d+/, '$$$$')); // 输出: abc$$123def456 (注意需要两个$$来表示一个$)

// 插入匹配到的子字符串
console.log(str.replace(/\d+/, '$&-$&')); // 输出: abc123-123def456

// 插入匹配之前的子字符串
console.log(str.replace(/\d+/, 'prefix-$`')); // 输出: abcprefix-abcdef456

// 插入匹配之后的子字符串
console.log(str.replace(/\d+/, "suffix-$'")); // 输出: abcsuffix-def456def456

const nameStr = 'John Doe';
// 使用捕获组
console.log(nameStr.replace(/(\w+)\s(\w+)/, '$2, $1')); // 输出: Doe, John

// 另一个捕获组替换示例
var str_example = '1adkk';
var reg_example = /(\d)([a-z]*)/gi;
var result_example = str_example.replace(reg_example, "$2$2");
console.log(result_example); // 输出: adkkadkk
// 在这个例子中，$2 对应正则表达式中的第二个捕获组 ([a-z]*)，即 "adkk"。
// 替换字符串 "$2$2" 表示将匹配到的内容替换为第二个捕获组的内容两次。
```

## `String.prototype.matchAll()`

**作用**：返回一个包含所有匹配正则表达式的结果的迭代器，包括捕获组。这与`match()`使用`g`标志时的行为不同，`match()`在有`g`标志时只返回匹配的子串数组，不包含捕获组信息。

**语法**：
```javascript
str.matchAll(regexp)
```

- **参数**：一个正则表达式对象。必须带有全局标志 `g`，否则会抛出 `TypeError`。

**返回值**：一个迭代器（`iterator`），每个迭代项是一个与 `match()` 在非全局模式下返回结果格式相同的数组（包含完整匹配、捕获组、`index`和`input`属性）。

```javascript
const str = '日期：2023-10-01，2024-05-15';
const regexWithG = /(\d{4})-(\d{2})-(\d{2})/g;

const matches = str.matchAll(regexWithG);

for (const match of matches) {
  console.log(match);
}
// 输出:
// [ '2023-10-01', '2023', '10', '01', index: 3, input: '日期：2023-10-01，2024-05-15', groups: undefined ]
// [ '2024-05-15', '2024', '05', '15', index: 14, input: '日期：2023-10-01，2024-05-15', groups: undefined ]
```

`matchAll()` 特别适用于需要获取所有匹配项及其捕获组的场景，例如解析结构化文本。

## 实战案例

### 案例1：敏感信息脱敏（replace）

将手机号中间4位替换为`****`：
```javascript
function maskPhone(phone) {
  return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
}
console.log(maskPhone('13812345678')); // 输出: '138****5678'
```

### 案例2：提取HTML标签内容（matchAll）

从HTML字符串中提取所有`<a>`标签的链接和文本内容：
```javascript
const html = '<p>链接：<a href="https://example.com">示例1</a> 和 <a href="https://test.org">测试2</a></p>';
const anchorRegex = /<a\s+href="([^"]+)"[^>]*>([^<]+)<\/a>/gi;

const links = [];
for (const match of html.matchAll(anchorRegex)) {
  links.push({ href: match[1], text: match[2] });
}
console.log(links);
// 输出:
// [
//   { href: 'https://example.com', text: '示例1' },
//   { href: 'https://test.org', text: '测试2' }
// ]
```

### 案例3：URL参数解析（matchAll 或 replace）

将URL查询字符串解析为对象：
```javascript
function parseQueryString(url) {
  const queryString = url.split('?')[1];
  if (!queryString) return {};

  const params = {};
  // 使用 matchAll
  // const paramRegex = /([^&=]+)=([^&]*)/g;
  // for (const match of queryString.matchAll(paramRegex)) {
  //   params[decodeURIComponent(match[1])] = decodeURIComponent(match[2]);
  // }

  // 或者使用 replace 的函数回调
  queryString.replace(/([^&=]+)=([^&]*)/g, (match, key, value) => {
    params[decodeURIComponent(key)] = decodeURIComponent(value);
    return ''; // 返回空字符串，因为我们只关心副作用（填充params对象）
  });

  return params;
}

console.log(parseQueryString('https://example.com?name=Alice&age=30&city=New%20York'));
// 输出: { name: 'Alice', age: '30', city: 'New York' }
```

## 性能考量与最佳实践

- **避免不必要的全局匹配**：如果只需要找到第一个匹配项，不要使用`g`标志，这可以提高性能。
- **预编译正则表达式**：如果一个正则表达式会被多次使用，最好将其存储在变量中，而不是每次都重新创建。
- **简单字符串替换优先**：如果只是替换固定的子字符串，直接使用字符串作为第一个参数通常比使用正则表达式更快。
  ```javascript
  'hello world'.replace('world', 'JavaScript'); // 比 /world/.replace('world', 'JavaScript') 可能更快
  ```
- **注意`matchAll`的迭代器特性**：`matchAll`返回的是迭代器，如果需要数组，可以使用`Array.from()`或扩展运算符`[...str.matchAll(regex)]`进行转换，但这会消耗更多内存来存储所有匹配结果。
- **复杂替换逻辑使用函数回调**：对于复杂的替换规则，函数回调提供了最大的灵活性和可读性。
- **警惕正则表达式的性能陷阱**：某些复杂的正则表达式（如包含过多回溯的模式）可能导致性能问题，甚至引发 ReDoS (Regular Expression Denial of Service) 攻击。测试和优化复杂的正则表达式非常重要。

## 总结

`replace()` 和 `match()` (以及 `matchAll()`) 是 JavaScript 中处理字符串的强大工具。理解它们的特性、参数以及不同场景下的最佳用法，对于编写高效、健壮的文本处理代码至关重要。通过结合正则表达式，可以实现各种复杂的字符串查找、替换和提取任务。