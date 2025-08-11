# Vue 2 Diff原理详解

## 一、diff算法的基本概念

diff算法是前端框架中用于比较虚拟DOM树差异并高效更新真实DOM的核心算法。当组件状态发生变化时，Vue会重新渲染虚拟DOM树，然后通过diff算法找出新旧虚拟DOM树之间的差异，最后只更新有差异的部分到真实DOM，避免了全量DOM操作，显著提升了性能。

## 二、Vue 2 diff的核心思想

Vue 2的diff算法基于以下核心思想：

1. 同层比较 ：只比较同一层级的节点，不会跨层级比较
2. 节点标识 ：通过 key 属性识别相同节点，提高复用效率
3. 深度优先遍历 ：按照深度优先的顺序遍历和比较节点
4. 最小化DOM操作 ：尽量复用现有节点，只进行必要的创建、删除和移动操作

## 三、Vue 2 diff的具体实现

### 1. 节点对比策略

Vue 2采用五种节点比较策略来高效处理列表更新：
(1) 头头比较
比较新旧列表的头部节点，如果是相同节点（通过 key 判断），则直接复用并更新，然后将两个指针都向后移动一位。

```javascript
// 伪代码示例 - 头头比较
while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
  if (isSameNode(oldStartVnode, newStartVnode)) {
    // 复用并更新节点
    patchVnode(oldStartVnode, newStartVnode);
    // 移动指针
    oldStartIdx++;
    newStartIdx++;
  } else {
    // 退出循环，尝试其他比较策略
    break;
  }
}
```

(2) 尾尾比较
比较新旧列表的尾部节点，如果是相同节点，则直接复用并更新，然后将两个指针都向前移动一位。

```javascript
// 伪代码示例 - 尾尾比较
while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
  if (isSameNode(oldEndVnode, newEndVnode)) {
    // 复用并更新节点
    patchVnode(oldEndVnode, newEndVnode);
    // 移动指针
    oldEndIdx--;
    newEndIdx--;
  } else {
    // 退出循环，尝试其他比较策略
    break;
  }
}
```

(3) 头尾比较
比较旧列表的头部节点和新列表的尾部节点，如果是相同节点，则复用该节点并将其移动到新列表尾部位置，然后更新相应指针。

```javascript
// 伪代码示例 - 头尾比较
while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
  if (isSameNode(oldStartVnode, newEndVnode)) {
    // 复用并更新节点
    patchVnode(oldStartVnode, newEndVnode);
    // 移动节点到新列表尾部
    insertBefore(parentElm, oldStartVnode.elm, newEndVnode.elm.nextSibling);
    // 移动指针
    oldStartIdx++;
    newEndIdx--;
  } else {
    // 退出循环，尝试其他比较策略
    break;
  }
}
```

(4) 尾头比较
比较旧列表的尾部节点和新列表的头部节点，如果是相同节点，则复用该节点并将其移动到新列表头部位置，然后更新相应指针。

```javascript
// 伪代码示例 - 尾头比较
while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
  if (isSameNode(oldEndVnode, newStartVnode)) {
    // 复用并更新节点
    patchVnode(oldEndVnode, newStartVnode);
    // 移动节点到新列表头部
    insertBefore(parentElm, oldEndVnode.elm, oldStartVnode.elm);
    // 移动指针
    oldEndIdx--;
    newStartIdx++;
  } else {
    // 退出循环，尝试其他比较策略
    break;
  }
}
```

(5) 索引比较
如果以上四种比较都不匹配，则使用 key 建立的映射表查找旧列表中是否存在与新列表当前节点相同的节点。如果找到，则移动该节点到正确位置；如果没找到，则创建新节点。

```javascript
// 伪代码示例 
// 建立key到索引的映射 
const keyMap = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx); 
// 查找新节点在旧列表中的位置 
const idxInOld = keyMap.get(newStartVnode.key); 

if (idxInOld !== undefined) { 
  // 找到相同节点，移动到正确位置 
  const elmToMove = oldCh[idxInOld]; 
  patchVnode(elmToMove, newStartVnode); 
  oldCh[idxInOld] = undefined; // 标记为已处理 
  insertBefore(parentElm, elmToMove.elm, oldStartVnode.elm); 
} 
else { 
  // 未找到相同节点，创建新节点 
  createElm(newStartVnode, parentElm, oldStartVnode.elm); 
} 
newStartIdx++; 
```

### 2. patchVnode函数

当找到相同节点时，Vue会调用 patchVnode 函数来更新节点内容，包括：

- 更新文本内容
- 更新属性
- 递归比较子节点

### 3. 处理剩余节点

当完成上述比较后，如果旧列表还有剩余节点，则删除它们；如果新列表还有剩余节点，则创建它们。

## 四、Vue 2列表Diff算法的策略选择机制详解 
 ## 策略选择的核心逻辑 
 Vue 2的列表Diff算法采用了 双指针技术 和 优先级比较策略 来高效处理列表更新。其核心逻辑是： 
 
 1. 维护两个指针分别指向旧列表的头部( oldStartIdx )和尾部( oldEndIdx ) 
 2. 同时维护两个指针分别指向新列表的头部( newStartIdx )和尾部( newEndIdx ) 
 3. 按照特定顺序依次尝试五种比较策略 
 4. 每找到一组匹配的节点，就更新DOM并调整相应指针 
 5. 当无法通过前四种策略匹配时，才使用第五种索引比较策略 
 ## 五种策略的应用场景与判断条件 
 ### 1. 头头比较策略 
 - 判断条件 ： isSameNode(oldStartVnode, newStartVnode) 
 - 适用场景 ：列表头部元素没有变化 
 - 操作 ：如果匹配，更新节点内容，两个头部指针都向后移动一位 
 ### 2. 尾尾比较策略 
 - 判断条件 ： isSameNode(oldEndVnode, newEndVnode) 
 - 适用场景 ：列表尾部元素没有变化 
 - 操作 ：如果匹配，更新节点内容，两个尾部指针都向前移动一位 
 ### 3. 头尾比较策略 
 - 判断条件 ： isSameNode(oldStartVnode, newEndVnode) 
 - 适用场景 ：旧列表的头部元素移动到了新列表的尾部 
 - 操作 ：如果匹配，更新节点内容，将旧头部节点移动到新尾部位置，旧头部指针后移，新尾部指针前移 
 ### 4. 尾头比较策略 
 - 判断条件 ： isSameNode(oldEndVnode, newStartVnode) 
 - 适用场景 ：旧列表的尾部元素移动到了新列表的头部 
 - 操作 ：如果匹配，更新节点内容，将旧尾部节点移动到新头部位置，旧尾部指针前移，新头部指针后移 
 ### 5. 索引比较策略 
 - 判断条件 ：当以上四种策略都无法匹配时 
 - 适用场景 ：元素位置发生任意变化或有新元素插入/删除 
 - 操作 ：通过 key 建立的映射表查找匹配节点，找到则移动，找不到则创建新节点 
 ## 完整示例演示 
 假设我们有以下列表更新场景： 
 
 旧列表 ： [A, B, C, D, E] （key分别为A、B、C、D、E） 新列表 ： [B, C, F, D, E, A] （key分别为B、C、F、D、E、A） 
 
 让我们看看Vue 2如何应用这五种策略： 
 
 1. 初始状态 ： 
 
 - 旧列表指针： oldStartIdx=0 (A), oldEndIdx=4 (E) 
 - 新列表指针： newStartIdx=0 (B), newEndIdx=5 (A) 
 2. 尝试头头比较 ：A vs B → 不匹配 
 3. 尝试尾尾比较 ：E vs A → 不匹配 
 4. 尝试头尾比较 ：A vs A → 匹配！ 
 
 - 操作：将A移动到新列表尾部 
 - 指针更新： oldStartIdx=1 (B), newEndIdx=4 (E) 
 5. 新的比较 ： 
 
 - 旧列表指针： oldStartIdx=1 (B), oldEndIdx=4 (E) 
 - 新列表指针： newStartIdx=0 (B), newEndIdx=4 (E) 
 6. 尝试头头比较 ：B vs B → 匹配！ 
 
 - 操作：更新B，无需移动 
 - 指针更新： oldStartIdx=2 (C), newStartIdx=1 (C) 
 7. 尝试头头比较 ：C vs C → 匹配！ 
 
 - 操作：更新C，无需移动 
 - 指针更新： oldStartIdx=3 (D), newStartIdx=2 (F) 
 8. 尝试头头比较 ：D vs F → 不匹配 
 9. 尝试尾尾比较 ：E vs E → 匹配！ 
 
 - 操作：更新E，无需移动 
 - 指针更新： oldEndIdx=3 (D), newEndIdx=3 (D) 
 10. 尝试头头比较 ：D vs D → 匹配！ 
 
 - 操作：更新D，无需移动 
 - 指针更新： oldStartIdx=4 > oldEndIdx=3 ，旧列表处理完毕 
 11. 处理新列表剩余节点 ： 
 
 - 新列表还剩F( newStartIdx=2 ) 
 - 创建新节点F并插入到对应位置 
 ## 策略选择的优势 
 1. 高效性 ：通过优先级比较策略，大多数常见的列表操作（如头部/尾部添加、删除、排序）都能在O(1)或O(n)时间内完成 
 2. 最小化DOM操作 ：优先尝试简单匹配，减少复杂的节点查找和移动操作 
 3. 适用性广 ：五种策略的组合能够处理各种列表更新场景，包括添加、删除、排序、替换等 
 4. 性能稳定 ： worst-case时间复杂度为O(n)，远优于传统的O(n³)树形diff算法 
 ## 五、时间复杂度分析

Vue 2的diff算法时间复杂度为O(n)，其中n是节点数量。这是因为：

- 只进行同层比较，避免了跨层遍历
- 使用 key 属性建立映射表，使得查找操作接近O(1)
- 通过五种比较策略，最大限度地减少了DOM移动操作
  相比传统的树形结构diff算法（如递归全量比较，时间复杂度为O(n³)），Vue 2的diff算法效率显著提高。

## 五、实际应用和优化

1. 合理设置key ：为列表项设置唯一且稳定的 key ，避免使用索引作为 key （特别是当列表项可能被重新排序时）
2. 避免不必要的节点更新 ：通过 shouldComponentUpdate 或 Vue.mixin 优化组件渲染
3. 批量更新 ：Vue内部使用异步队列批量处理DOM更新，减少重绘和回流
4. 虚拟滚动 ：对于长列表，可使用虚拟滚动技术（如 vue-virtual-scroller ）只渲染可视区域内的节点

## 总结

Vue 2的diff算法通过同层比较、节点标识、深度优先遍历和最小化DOM操作等核心思想，实现了高效的虚拟DOM更新。五种节点比较策略的组合应用，使得在大多数场景下都能达到最优性能。理解diff原理有助于开发者编写更高效的Vue应用，避免常见的性能陷阱。
