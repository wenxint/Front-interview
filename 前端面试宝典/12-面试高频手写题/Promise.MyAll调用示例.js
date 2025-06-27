/**
 * @description Promise.MyAll方法的完整调用示例
 * 展示如何使用自定义的MyAll方法处理多个Promise
 */

// 首先，让我们回顾一下MyAll的实现
Promise.MyAll = function (promises) {
  // 存储所有 Promise 的结果
  let arr = [],
    // 计数器,记录已完成的 Promise 数量
    count = 0;

  // 返回一个新的 Promise
  return new Promise((resolve, reject) => {
    // 处理空数组的情况
    if (promises.length === 0) {
      resolve([]);
      return;
    }

    // 遍历传入的 promises 数组
    promises.forEach((item, i) => {
      // 将每个项转为 Promise 对象并执行
      Promise.resolve(item).then(
        (res) => {
          // 按照原始顺序存储结果
          arr[i] = res;
          // 完成计数加1
          count += 1;
          // 当所有 Promise 都完成时,返回结果数组
          if (count === promises.length) resolve(arr);
        },
        // 任何一个 Promise 失败时直接 reject
        reject
      );
    });
  });
};

// ==================== 调用示例 ====================

/**
 * 示例1: 处理全部成功的Promise
 */
console.log('\n===== 示例1: 全部成功的Promise =====');

// 创建多种类型的Promise
const promise1 = Promise.resolve(1);                      // 立即解决的Promise
const promise2 = new Promise(resolve => setTimeout(() => resolve(2), 1000)); // 延迟解决的Promise
const promise3 = 3;                                       // 非Promise值(会被自动转换为Promise)
const promise4 = new Promise(resolve => setTimeout(() => resolve(4), 500));  // 另一个延迟解决的Promise

// 使用自定义的MyAll方法
console.log('开始执行MyAll...');
const startTimeMyAll = Date.now();

Promise.MyAll([promise1, promise2, promise3, promise4])
  .then(results => {
    const endTimeMyAll = Date.now();
    console.log('MyAll结果:', results);
    console.log('MyAll执行时间:', endTimeMyAll - startTimeMyAll, 'ms');
    console.log('MyAll结果类型:', Object.prototype.toString.call(results));
    console.log('MyAll保持了原始顺序，即使promise2(1000ms)比promise4(500ms)晚完成');
  })
  .catch(error => {
    console.error('MyAll错误:', error);
  });

// // 使用原生Promise.all进行对比
// console.log('开始执行原生Promise.all...');
// const startTimeAll = Date.now();

// Promise.all([promise1, promise2, promise3, promise4])
//   .then(results => {
//     const endTimeAll = Date.now();
//     console.log('原生Promise.all结果:', results);
//     console.log('原生Promise.all执行时间:', endTimeAll - startTimeAll, 'ms');
//   })
//   .catch(error => {
//     console.error('原生Promise.all错误:', error);
//   });

// /**
//  * 示例2: 处理包含失败Promise的情况
//  */
// console.log('\n===== 示例2: 包含失败Promise的情况 =====');

// const successPromise1 = Promise.resolve('成功1');
// const failPromise = Promise.reject('失败原因'); // 一个会失败的Promise
// const successPromise2 = new Promise(resolve => setTimeout(() => resolve('成功2'), 1000));

// // 使用自定义的MyAll方法
// console.log('开始执行包含失败Promise的MyAll...');

// Promise.MyAll([successPromise1, failPromise, successPromise2])
//   .then(results => {
//     console.log('这行不会执行，因为有Promise失败了');
//     console.log('MyAll结果:', results);
//   })
//   .catch(error => {
//     console.error('MyAll捕获到错误:', error);
//     console.log('MyAll在任一Promise失败时立即reject，不会等待其他Promise完成');
//   });

// // 使用原生Promise.all进行对比
// console.log('开始执行包含失败Promise的原生Promise.all...');

// Promise.all([successPromise1, failPromise, successPromise2])
//   .then(results => {
//     console.log('这行不会执行，因为有Promise失败了');
//     console.log('原生Promise.all结果:', results);
//   })
//   .catch(error => {
//     console.error('原生Promise.all捕获到错误:', error);
//   });

// /**
//  * 示例3: 处理空数组
//  */
// console.log('\n===== 示例3: 处理空数组 =====');

// // 使用自定义的MyAll方法
// console.log('开始执行空数组的MyAll...');

// Promise.MyAll([])
//   .then(results => {
//     console.log('MyAll空数组结果:', results);
//     console.log('MyAll空数组结果类型:', Object.prototype.toString.call(results));
//   })
//   .catch(error => {
//     console.error('MyAll空数组错误:', error);
//   });

// // 使用原生Promise.all进行对比
// console.log('开始执行空数组的原生Promise.all...');

// Promise.all([])
//   .then(results => {
//     console.log('原生Promise.all空数组结果:', results);
//     console.log('原生Promise.all空数组结果类型:', Object.prototype.toString.call(results));
//   })
//   .catch(error => {
//     console.error('原生Promise.all空数组错误:', error);
//   });

// /**
//  * 示例4: 实际应用场景 - 并行加载多个资源
//  */
// console.log('\n===== 示例4: 实际应用场景 - 并行加载多个资源 =====');

// // 模拟异步加载资源的函数
// function loadUser(id) {
//   return new Promise((resolve, reject) => {
//     console.log(`开始加载用户${id}数据...`);
//     setTimeout(() => {
//       if (id > 0) {
//         resolve({ id, name: `用户${id}`, age: 20 + id });
//       } else {
//         reject(`用户ID${id}无效`);
//       }
//     }, 300 * id);
//   });
// }

// function loadUserPosts(userId) {
//   return new Promise((resolve) => {
//     console.log(`开始加载用户${userId}的文章...`);
//     setTimeout(() => {
//       resolve([`文章${userId}-1`, `文章${userId}-2`]);
//     }, 500);
//   });
// }

// function loadUserFriends(userId) {
//   return new Promise((resolve) => {
//     console.log(`开始加载用户${userId}的好友...`);
//     setTimeout(() => {
//       resolve([`好友A`, `好友B`]);
//     }, 800);
//   });
// }

// // 使用MyAll并行加载用户的所有相关数据
// const userId = 2;

// Promise.MyAll([
//   loadUser(userId),
//   loadUserPosts(userId),
//   loadUserFriends(userId)
// ])
//   .then(([user, posts, friends]) => {
//     console.log('所有数据加载完成!');
//     console.log('用户信息:', user);
//     console.log('用户文章:', posts);
//     console.log('用户好友:', friends);

//     // 使用解构赋值直接获取结果数组中的各项数据
//     const userData = {
//       ...user,
//       posts,
//       friends
//     };

//     console.log('整合后的用户数据:', userData);
//   })
//   .catch(error => {
//     console.error('加载数据过程中出错:', error);
//   });

// // 错误处理示例 - 加载无效用户ID
// Promise.MyAll([
//   loadUser(-1),  // 这个会失败
//   loadUserPosts(1),
//   loadUserFriends(1)
// ])
//   .then(results => {
//     console.log('这行不会执行，因为loadUser(-1)会失败');
//   })
//   .catch(error => {
//     console.error('加载无效用户时捕获到错误:', error);
//   });

/**
 * 执行结果分析：
 *
 * 1. MyAll和原生Promise.all行为一致：
 *    - 所有Promise成功时，按原始顺序返回结果数组
 *    - 任一Promise失败时，立即reject并返回错误原因
 *    - 空数组时，返回空数组
 *
 * 2. MyAll的特点：
 *    - 保持原始顺序：即使后面的Promise先完成，结果仍按原始顺序排列
 *    - 自动转换：非Promise值会被自动转换为已解决的Promise
 *    - 错误传递：任一Promise失败，整个MyAll立即失败
 *
 * 3. 实际应用：
 *    - 并行加载多个资源，提高加载效率
 *    - 使用解构赋值可以方便地获取各个Promise的结果
 *    - 统一的错误处理机制简化了异常处理流程
 */