# Promise与异步编程

## Promise基础

### 问题：什么是Promise？它如何解决回调地狱问题？

**Promise**是ES6引入的一种异步编程解决方案，用于处理异步操作的最终完成（或失败）及其结果值。它代表一个异步操作的最终结果，有三种状态：

- **待定（pending）**：初始状态，既没有被兑现，也没有被拒绝
- **已兑现（fulfilled）**：操作成功完成
- **已拒绝（rejected）**：操作失败

**Promise的基本用法：**

```javascript
// 创建Promise
const myPromise = new Promise((resolve, reject) => {
  // 异步操作
  const success = true;

  if (success) {
    resolve('操作成功'); // 成功时调用resolve
  } else {
    reject(new Error('操作失败')); // 失败时调用reject
  }
});

// 使用Promise
myPromise
  .then(result => {
    console.log(result); // '操作成功'
  })
  .catch(error => {
    console.error(error); // 错误处理
  })
  .finally(() => {
    console.log('无论成功或失败都会执行'); // 清理工作
  });
```

**Promise如何解决回调地狱问题：**

回调地狱（Callback Hell）是指在JavaScript中嵌套多层回调函数导致的代码难以阅读和维护的问题。

**回调地狱示例：**

```javascript
// 使用传统回调的异步操作
function fetchUserData(userId, callback) {
  setTimeout(() => {
    const user = { id: userId, name: 'User ' + userId };
    callback(null, user);
  }, 1000);
}

function fetchUserPosts(userId, callback) {
  setTimeout(() => {
    const posts = ['Post 1', 'Post 2'];
    callback(null, posts);
  }, 1000);
}

function fetchPostComments(postId, callback) {
  setTimeout(() => {
    const comments = ['Comment 1', 'Comment 2'];
    callback(null, comments);
  }, 1000);
}

// 回调地狱
fetchUserData(1, (error, user) => {
  if (error) {
    console.error('获取用户信息失败:', error);
    return;
  }

  console.log('用户信息:', user);

  fetchUserPosts(user.id, (error, posts) => {
    if (error) {
      console.error('获取用户文章失败:', error);
      return;
    }

    console.log('用户文章:', posts);

    fetchPostComments(posts[0], (error, comments) => {
      if (error) {
        console.error('获取评论失败:', error);
        return;
      }

      console.log('文章评论:', comments);

      // 更多嵌套...
    });
  });
});
```

**使用Promise解决回调地狱：**

```javascript
// 使用Promise重构异步函数
function fetchUserData(userId) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const user = { id: userId, name: 'User ' + userId };
      resolve(user);
    }, 1000);
  });
}

function fetchUserPosts(userId) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const posts = ['Post 1', 'Post 2'];
      resolve(posts);
    }, 1000);
  });
}

function fetchPostComments(postId) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const comments = ['Comment 1', 'Comment 2'];
      resolve(comments);
    }, 1000);
  });
}

// Promise链式调用
fetchUserData(1)
  .then(user => {
    console.log('用户信息:', user);
    return fetchUserPosts(user.id);
  })
  .then(posts => {
    console.log('用户文章:', posts);
    return fetchPostComments(posts[0]);
  })
  .then(comments => {
    console.log('文章评论:', comments);
    // 可以继续链式调用
  })
  .catch(error => {
    console.error('出错了:', error);
  });
```

**Promise解决回调地狱的优势：**

1. **扁平化代码结构**：链式调用替代了嵌套回调，使代码更加扁平和可读
2. **统一的错误处理**：通过.catch()集中处理错误，而不是在每个回调中重复错误处理逻辑
3. **流程控制清晰**：每个.then()表示一个明确的异步步骤，使异步流程更加清晰
4. **值的传递**：前一个Promise的结果自动传递给下一个.then()
5. **可组合性**：Promise可以轻松组合和复用

## Promise链与组合

### 问题：Promise的链式调用和组合方法有哪些？如何管理多个异步操作？

**Promise的链式调用：**

```javascript
// 基本链式调用示例
fetchData(url)
  .then(data => processData(data))
  .then(processed => saveData(processed))
  .then(result => {
    console.log('操作成功:', result);
    return result;
  })
  .catch(error => {
    console.error('操作失败:', error);
    // 可以返回默认值或重新抛出错误
    return defaultValue; // 返回默认值继续链
    // 或 throw error; // 重新抛出错误
  })
  .finally(() => {
    console.log('清理工作');
    // 注意：这里返回的值不会传递给下一个then
  });
```

**链式调用中的值传递：**

```javascript
// 值的传递与转换
Promise.resolve(1)
  .then(value => {
    console.log(value); // 1
    return value + 1;
  })
  .then(value => {
    console.log(value); // 2
    return Promise.resolve(value + 1); // 返回一个Promise
  })
  .then(value => {
    console.log(value); // 3
    // 不返回任何值
  })
  .then(value => {
    console.log(value); // undefined
    throw new Error('出错了!');
  })
  .catch(error => {
    console.error(error.message); // '出错了!'
    return 'recovered';
  })
  .then(value => {
    console.log(value); // 'recovered'
  });
```

**Promise的组合方法：**

1. **Promise.all()**：并行执行多个Promise，全部完成后统一处理结果

```javascript
// 同时请求多个资源
const promise1 = fetch('/api/users');
const promise2 = fetch('/api/posts');
const promise3 = fetch('/api/comments');

Promise.all([promise1, promise2, promise3])
  .then(([usersResponse, postsResponse, commentsResponse]) => {
    // 所有请求都成功完成
    // 数组顺序与Promise数组顺序一致
    return Promise.all([
      usersResponse.json(),
      postsResponse.json(),
      commentsResponse.json()
    ]);
  })
  .then(([users, posts, comments]) => {
    console.log({ users, posts, comments });
  })
  .catch(error => {
    // 任何一个Promise失败都会进入此处
    console.error('至少有一个请求失败:', error);
  });
```

2. **Promise.allSettled()**：等待所有Promise完成，无论是否成功

结果 ：一个数组，每个元素是描述对应Promise结果的对象，包含两个属性：

- status ： 'fulfilled' （成功）或 'rejected' （失败）；
- value （仅成功时存在）：Promise成功的返回值；
- reason （仅失败时存在）：Promise失败的原因。

```javascript
const promises = [
  Promise.resolve(1),
  Promise.reject(new Error('出错了')),
  Promise.resolve(3)
];

Promise.allSettled(promises)
  .then(results => {
    // 返回每个Promise的结果和状态
    results.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        console.log(`Promise ${index + 1} 成功:`, result.value);
      } else {
        console.log(`Promise ${index + 1} 失败:`, result.reason);
      }
    });
  });
// 输出:
// Promise 1 成功: 1
// Promise 2 失败: Error: 出错了
// Promise 3 成功: 3
```

3. **Promise.race()**：返回最先完成的Promise结果（无论成功或失败）

```javascript
// 带超时的请求示例
function fetchWithTimeout(url, timeout = 5000) {
  const fetchPromise = fetch(url);

  const timeoutPromise = new Promise((_, reject) => {
    setTimeout(() => {
      reject(new Error('请求超时'));
    }, timeout);
  });

  return Promise.race([fetchPromise, timeoutPromise]);
}

fetchWithTimeout('/api/data', 3000)
  .then(response => response.json())
  .then(data => console.log('数据:', data))
  .catch(error => console.error('错误:', error.message));
```

4. **Promise.any()**：返回第一个成功的Promise结果（ES2021引入）

```javascript
// 尝试从多个源获取数据
const mirrors = [
  'https://mirror1.example.com/api',
  'https://mirror2.example.com/api',
  'https://mirror3.example.com/api'
];

const fetchPromises = mirrors.map(url =>
  fetch(url).then(response => {
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  })
);

Promise.any(fetchPromises)
  .then(data => {
    console.log('成功从其中一个镜像获取数据:', data);
  })
  .catch(error => {
    // 所有Promise都失败时，这里接收到一个AggregateError
    console.error('所有镜像源都失败了:', error.errors);
  });
```

**管理多个异步操作的高级模式：**

1. **序列执行一组Promise：**

```javascript
// 顺序执行一组异步操作
function sequential(promiseFns) {
  return promiseFns.reduce(
    (promise, fn) => promise.then(result => fn().then(Array.prototype.concat.bind(result))),
    Promise.resolve([])
  );
}

// 使用示例
const tasks = [
  () => new Promise(resolve => setTimeout(() => resolve('Task 1'), 1000)),
  () => new Promise(resolve => setTimeout(() => resolve('Task 2'), 500)),
  () => new Promise(resolve => setTimeout(() => resolve('Task 3'), 800))
];

sequential(tasks).then(results => {
  console.log('所有任务已按顺序完成:', results);
});
```

2. **控制并发数量：**

```javascript
// 控制并发数量的Promise执行器
async function runWithConcurrencyLimit(tasks, concurrencyLimit) {
  const results = [];
  const executing = [];

  for (const [index, task] of tasks.entries()) {
    // 创建Promise并记录它的位置
    const p = Promise.resolve().then(() => task());
    results[index] = p;

    // 如果达到并发限制
    if (tasks.length >= concurrencyLimit) {
      // 将执行中的Promise加入跟踪数组
      const e = p.then(() => executing.splice(executing.indexOf(e), 1));
      executing.push(e);

      // 一旦并发数达到限制，等待一个完成再继续
      if (executing.length >= concurrencyLimit) {
        await Promise.race(executing);
      }
    }
  }

  // 等待所有结果完成
  return Promise.all(results);
}

// 使用示例
const tasks = Array(10).fill().map((_, i) => () => {
  return new Promise(resolve => {
    const time = Math.random() * 1000;
    setTimeout(() => {
      console.log(`Task ${i + 1} completed after ${time.toFixed(0)}ms`);
      resolve(i);
    }, time);
  });
});

runWithConcurrencyLimit(tasks, 3)
  .then(results => console.log('All completed:', results));
```

3. **取消Promise**（尽管Promise本身不可取消）：

```javascript
// 创建可取消的Promise包装
function makeCancellable(promise) {
  let isCancelled = false;

  const wrappedPromise = new Promise((resolve, reject) => {
    promise
      .then(value => {
        if (!isCancelled) {
          resolve(value);
        }
      })
      .catch(error => {
        if (!isCancelled) {
          reject(error);
        }
      });
  });

  return {
    promise: wrappedPromise,
    cancel() {
      isCancelled = true;
    }
  };
}

// 使用示例
const { promise, cancel } = makeCancellable(
  new Promise(resolve => {
    setTimeout(() => resolve('操作完成'), 5000);
  })
);

promise
  .then(value => console.log(value))
  .catch(error => console.error(error));

// 5秒之前取消
setTimeout(() => {
  cancel();
  console.log('已取消');
}, 2000);
```

## Promise错误处理与最佳实践

### 问题：Promise中错误处理的最佳实践有哪些？如何避免常见的Promise陷阱？

**Promise错误处理最佳实践：**

1. **始终添加错误处理**

```javascript
// 不好的做法：未处理的Promise拒绝
fetch('/api/data')
  .then(response => response.json())
  .then(data => {
    // 使用数据
  });
  // 如果发生错误，没有处理它！

// 好的做法：添加错误处理
fetch('/api/data')
  .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  })
  .then(data => {
    // 使用数据
  })
  .catch(error => {
    console.error('获取数据失败:', error);
    // 可以显示错误消息给用户
    showErrorToUser(error.message);
  });
```

2. **适当使用finally**

```javascript
// 使用finally进行清理工作
showLoadingIndicator();

fetchData()
  .then(data => {
    processData(data);
  })
  .catch(error => {
    handleError(error);
  })
  .finally(() => {
    // 无论成功或失败都会执行
    hideLoadingIndicator();
  });
```

3. **错误转换与过滤**

```javascript
// 转换错误以提供更多上下文
fetchUserData(userId)
  .catch(error => {
    // 添加上下文信息后重新抛出
    throw new Error(`获取用户(ID: ${userId})数据失败: ${error.message}`);
  })
  .then(userData => {
    // 处理用户数据
  })
  .catch(error => {
    // 这里可以捕获到转换后的错误
    console.error(error.message);
  });

// 选择性处理特定错误
function handleSelectiveErrors(promise) {
  return promise.catch(error => {
    if (error instanceof NetworkError) {
      // 处理网络错误
      showOfflineMessage();
      return defaultData; // 返回默认数据继续链
    }
    // 其他类型的错误重新抛出
    throw error;
  });
}

handleSelectiveErrors(fetchData())
  .then(data => {
    // 处理数据或默认数据
  })
  .catch(error => {
    // 处理除NetworkError外的其他错误
  });
```

4. **错误堆栈保留**

```javascript
// 不好的做法：丢失原始错误堆栈
asyncOperation()
  .catch(error => {
    throw new Error('操作失败'); // 丢失了原始错误信息和堆栈
  });

// 好的做法：保留原始错误
asyncOperation()
  .catch(error => {
    // 方法1：添加上下文并保留原始错误
    const enhancedError = new Error(`操作失败: ${error.message}`);
    enhancedError.stack = error.stack;
    enhancedError.originalError = error;
    throw enhancedError;

    // 方法2：使用Error.cause（ES2022）
    throw new Error('操作失败', { cause: error });
  });
```

**避免的Promise陷阱：**

1. **忘记返回Promise**

```javascript
// 错误：在then中忘记返回值
function processUserData(userId) {
  return fetchUser(userId)
    .then(user => {
      // 忘记返回这个Promise！
      processUserOrders(user.id);
    })
    .then(orders => {
      // orders是undefined，因为上一个then没有返回值
      console.log(orders); // undefined
    });
}

// 正确：确保返回Promise
function processUserData(userId) {
  return fetchUser(userId)
    .then(user => {
      // 返回Promise以继续链式调用
      return processUserOrders(user.id);
    })
    .then(orders => {
      console.log(orders); // 正确接收到订单数据
    });
}
```

2. **Promise嵌套（回到回调地狱）**

```javascript
// 错误：Promise嵌套
fetchUser(userId)
  .then(user => {
    fetchUserPosts(user.id)
      .then(posts => {
        // 嵌套的Promise，回到了回调地狱
        console.log(user, posts);
      });
  });

// 正确：平铺Promise链
fetchUser(userId)
  .then(user => {
    // 存储user并返回下一个Promise
    currentUser = user;
    return fetchUserPosts(user.id);
  })
  .then(posts => {
    // 这里可以访问外部变量currentUser
    console.log(currentUser, posts);
  });

// 更好：使用Promise.all组合相关请求
function getUserWithDetails(userId) {
  return fetchUser(userId)
    .then(user => {
      return Promise.all([
        Promise.resolve(user), // 传递user到结果数组
        fetchUserPosts(user.id),
        fetchUserFollowers(user.id)
      ]);
    })
    .then(([user, posts, followers]) => {
      // 所有数据现在都可用
      return { user, posts, followers };
    });
}
```

3. **错误吞没**

```javascript
// 错误：在catch中吞没错误
function fetchData() {
  return fetch('/api/data')
    .then(response => response.json())
    .catch(error => {
      console.log('出错了:', error);
      // 没有重新抛出错误，也没有返回一个被拒绝的Promise
      // 调用方无法知道发生了错误
    });
}

// 正确：适当处理错误
function fetchData() {
  return fetch('/api/data')
    .then(response => response.json())
    .catch(error => {
      console.log('出错了:', error);

      // 选项1：重新抛出错误，让调用方知道有错误发生
      throw error;

      // 选项2：返回特殊值，表明发生了错误
      return { error: true, message: error.message };

      // 选项3：返回默认数据
      return { data: [], error: error.message };
    });
}
```

4. **忽略Promise的异步性质**

```javascript
// 错误：试图同步使用异步结果
let userData;
fetchUserData()
  .then(data => {
    userData = data;
  });

console.log(userData); // undefined，因为Promise还未解决

// 正确：在Promise链中处理异步数据
fetchUserData()
  .then(data => {
    // 在这里处理数据
    console.log(data);
    return processData(data);
  })
  .then(result => {
    // 处理处理后的结果
  });

// 或使用async/await（更直观）
async function processUser() {
  try {
    const data = await fetchUserData();
    console.log(data);
    const result = await processData(data);
    // 处理结果
  } catch (error) {
    // 处理错误
  }
}
```

5. **过度使用Promise.all**

```javascript
// 问题：任一Promise失败就会导致整体失败
Promise.all([
  criticalOperation(), // 必要的操作
  nonCriticalOperation1(), // 非必要操作
  nonCriticalOperation2()  // 非必要操作
])
  .then(([critical, nonCritical1, nonCritical2]) => {
    // 处理所有结果
  })
  .catch(error => {
    // 即使只是非必要操作失败，也会进入这里
  });

// 更好：使用Promise.allSettled区分关键和非关键操作
Promise.allSettled([
  criticalOperation(),
  nonCriticalOperation1(),
  nonCriticalOperation2()
])
  .then(results => {
    // 检查关键操作是否成功
    if (results[0].status === 'rejected') {
      throw results[0].reason;
    }

    // 处理成功的关键操作
    const criticalResult = results[0].value;

    // 检查非关键操作，但不会因其失败而中断流程
    const nonCritical1 = results[1].status === 'fulfilled' ? results[1].value : null;
    const nonCritical2 = results[2].status === 'fulfilled' ? results[2].value : null;

    // 继续处理
  })
  .catch(error => {
    // 只处理关键操作失败
  });
```

6. **丢失Promise状态**

```javascript
// 错误：没有捕获Promise拒绝
function loadData() {
  const promise = fetch('/api/data').then(res => res.json());
  return {
    getPromise: () => promise
  };
}

// 使用时没有处理错误
const loader = loadData();
loader.getPromise(); // 如果这个Promise被拒绝，错误不会被捕获

// 正确：确保所有Promise都有错误处理
function loadData() {
  // 添加通用错误处理
  const promise = fetch('/api/data')
    .then(res => res.json())
    .catch(error => {
      console.error('加载数据失败:', error);
      throw error; // 重新抛出以便调用方可以处理
    });

  return {
    getPromise: () => promise
  };
}

// 使用时处理错误
const loader = loadData();
loader.getPromise()
  .then(data => {
    // 使用数据
  })
  .catch(error => {
    // 处理和显示错误
  });
```

**实战经验：**

> **经验分享**：在实际项目中，我发现处理Promise错误是最容易被忽视的部分。许多开发者只关注"happy path"，忽略了错误处理，导致应用在出错时行为不可预测。
>
> 我推荐的做法是创建Promise处理的工具函数或服务，统一处理常见错误模式。例如，在进行API调用时，我通常会创建一个包装函数处理通用错误：
>
> ```javascript
> // API请求工具函数
> function apiRequest(url, options = {}) {
>   return fetch(url, options)
>     .then(response => {
>       if (!response.ok) {
>         // 根据状态码创建适当的错误
>         if (response.status === 401) {
>           throw new AuthError('未授权访问');
>         } else if (response.status === 404) {
>           throw new NotFoundError(`资源未找到: ${url}`);
>         } else {
>           throw new ApiError(`API错误: ${response.status}`);
>         }
>       }
>       return response.json();
>     })
>     .catch(error => {
>       // 网络错误转换
>       if (error instanceof TypeError && error.message.includes('fetch')) {
>         throw new NetworkError('网络连接失败');
>       }
>       // 重新抛出其他错误
>       throw error;
>     });
> }
> ```
> 此外，在复杂应用中，实施全局的未处理Promise拒绝监听也很重要：
>
> ```javascript
> window.addEventListener('unhandledrejection', event => {
>   console.error('未处理的Promise拒绝:', event.reason);
>   // 可以发送到错误监控服务
>   errorMonitoringService.report(event.reason);
>   // 可选：阻止默认处理
>   event.preventDefault();
> });
> ```
> 最后，当涉及到复杂的Promise链和组合时，图表或注释可以帮助团队理解异步流程。我会在代码中添加流程注释或在文档中使用序列图来说明复杂的Promise交互。
