/**
 * 找到字符串中无重复字符的最长子串长度
 * 核心思想：滑动窗口 + 哈希表记录字符位置
 */
function lengthOfLongestSubstring(s) {
  const charIndex = new Map();  // 记录字符最后出现的位置
  let left = 0;                 // 窗口左边界
  let maxLength = 0;            // 最大长度

  for (let right = 0; right < s.length; right++) {
      const char = s[right];

      // 如果字符已存在且在当前窗口内
      if (charIndex.has(char) && charIndex.get(char) >= left) {
          left = charIndex.get(char) + 1;  // 移动左边界
      }

      charIndex.set(char, right);          // 更新字符位置
      maxLength = Math.max(maxLength, right - left + 1);
      let str = s.substring(left, right + 1);
      console.log(str);
      
  }

  return maxLength;
}

// 调用示例
console.log(lengthOfLongestSubstring("abba"));  // 3 ("abc")
// console.log(lengthOfLongestSubstring("bbbbb"));     // 1 ("b")
// console.log(lengthOfLongestSubstring("pwwkew"));    // 3 ("wke")