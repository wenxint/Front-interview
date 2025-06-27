# Async与Await

## Async/Await基础

### 问题：什么是Async/Await？与Promise相比有什么优势？

**Async/Await**是ES2017(ES8)引入的JavaScript异步编程语法糖，建立在Promise之上，使异步代码看起来更像同步代码，从而提高可读性和可维护性。

**Async/Await的基本语法：**

```javascript
// async关键字声明一个异步函数
async function fetchData() {
  try {
    // await关键字暂停执行，直到Promise解决
    const response = await fetch('/api/data');
    const data = await response.json();
    return data; // 返回值会被自动包装为Promise
  } catch (error) {
    console.error('获取数据出错:', error);
    throw error; // 抛出错误会导致返回的Promise被拒绝
  }
}

// 使用异步函数
fetchData()
  .then(data => console.log('获取的数据:', data))
  .catch(error => console.error('处理错误:', error));
```

**Async/Await与Promise的比较：**

```javascript
// 使用Promise的代码
function fetchUserDataPromise() {
  return fetch('/api/user')
    .then(response => {
      if (!response.ok) {
        throw new Error('网络错误');
      }
      return response.json();
    })
    .then(user => {
      return fetch(`/api/posts?userId=${user.id}`)
        .then(response => response.json())
        .then(posts => {
          user.posts = posts;
          return user;
        });
    });
}

// 使用Async/Await的代码
async function fetchUserDataAsync() {
  const userResponse = await fetch('/api/user');
  if (!userResponse.ok) {
    throw new Error('网络错误');
  }

  const user = await userResponse.json();
  const postsResponse = await fetch(`/api/posts?userId=${user.id}`);
  const posts = await postsResponse.json();

  user.posts = posts;
  return user;
}
```

**Async/Await的核心特性：**

1. **异步函数总是返回Promise**

```javascript
async function example() {
  return 'Hello';
}

// 等同于
function example() {
  return Promise.resolve('Hello');
}

console.log(example()); // Promise {<fulfilled>: 'Hello'}
```

2. **await只在async函数内部有效**

```javascript
// 错误：不能在异步函数外使用await
// const data = await fetchData(); // SyntaxError

// 正确：在异步函数内使用await
async function process() {
  const data = await fetchData();
  console.log(data);
}

// 在模块顶层使用await（ES2022支持）
// 注意：仅在ESM模块中有效，不在CommonJS中工作
// await fetchData(); // 在ESM模块的顶层可行
```

3. **自动处理Promise链**

```javascript
// Promise链
function processDataPromise() {
  return fetchData()
    .then(data => processData(data))
    .then(processed => saveData(processed))
    .then(result => {
      console.log('完成');
      return result;
    });
}

// 使用Async/Await
async function processDataAsync() {
  const data = await fetchData();
  const processed = await processData(data);
  const result = await saveData(processed);
  console.log('完成');
  return result;
}
```

**Async/Await相比Promise的优势：**

1. **更清晰的代码流程**：按照自上而下的顺序，减少了Promise链的缩进和嵌套

2. **更自然的错误处理**：使用try/catch捕获同步和异步错误，而不是.catch()

3. **调试更简单**：可以在每个await语句行设置断点，更容易跟踪执行流程

4. **更好的条件处理**：使复杂的条件逻辑更易于阅读和维护

```javascript
// 使用Promise的条件逻辑
function conditionalFetchPromise() {
  return getUser()
    .then(user => {
      if (user.isAdmin) {
        return getAdminData()
          .then(adminData => {
            user.adminData = adminData;
            return user;
          });
      } else if (user.isManager) {
        return getManagerData()
          .then(managerData => {
            user.managerData = managerData;
            return user;
          });
      } else {
        return user;
      }
    });
}

// 使用Async/Await的条件逻辑
async function conditionalFetchAsync() {
  const user = await getUser();

  if (user.isAdmin) {
    user.adminData = await getAdminData();
  } else if (user.isManager) {
    user.managerData = await getManagerData();
  }

  return user;
}
```

## Async/Await进阶使用

### 问题：Async/Await如何处理并发操作、错误处理和超时控制？

**并发操作**：

虽然Async/Await使代码看起来是同步的，但有时候我们需要并行执行多个异步操作以提高性能。

1. **使用Promise.all与await**

```javascript
// 串行执行 - 较慢，操作是依次执行的
async function fetchDataSequentially() {
  const start = Date.now();

  const user = await fetchUser();
  const posts = await fetchPosts();
  const comments = await fetchComments();

  console.log(`总耗时: ${Date.now() - start}ms`);
  return { user, posts, comments };
}

// 并行执行 - 更快，操作同时开始
async function fetchDataParallel() {
  const start = Date.now();

  // 所有请求并行启动
  const userPromise = fetchUser();
  const postsPromise = fetchPosts();
  const commentsPromise = fetchComments();

  // 然后等待所有结果
  const user = await userPromise;
  const posts = await postsPromise;
  const comments = await commentsPromise;

  console.log(`总耗时: ${Date.now() - start}ms`);
  return { user, posts, comments };
}

// 使用Promise.all简化并行操作
async function fetchDataParallelWithPromiseAll() {
  const start = Date.now();

  // 更简洁的并行请求处理
  const [user, posts, comments] = await Promise.all([
    fetchUser(),
    fetchPosts(),
    fetchComments()
  ]);

  console.log(`总耗时: ${Date.now() - start}ms`);
  return { user, posts, comments };
}
```

2. **有依赖关系的混合模式**

```javascript
async function fetchUserWithRelatedData(userId) {
  // 先获取用户信息
  const user = await fetchUser(userId);

  // 然后并行获取依赖用户ID的数据
  const [posts, followers, profile] = await Promise.all([
    fetchPosts(user.id),
    fetchFollowers(user.id),
    fetchProfile(user.id)
  ]);

  return {
    user,
    posts,
    followers,
    profile
  };
}
```

**错误处理策略**：

1. **基本的try/catch处理**

```javascript
async function fetchData() {
  try {
    const response = await fetch('/api/data');

    if (!response.ok) {
      throw new Error(`HTTP错误: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('获取数据失败:', error);
    // 可以根据错误类型进行不同处理
    if (error instanceof TypeError) {
      // 处理网络错误
      showOfflineMessage();
    } else {
      // 处理其他错误
      showErrorMessage(error.message);
    }
    // 可以返回默认数据或重新抛出
    return { error: true, message: error.message };
  }
}
```

2. **更细粒度的错误处理**

```javascript
async function processUserData(userId) {
  let user;

  // 分开处理各个步骤的错误
  try {
    user = await fetchUser(userId);
  } catch (error) {
    console.error('获取用户失败:', error);
    throw new Error(`无法获取用户(ID: ${userId}): ${error.message}`);
  }

  let posts;
  try {
    posts = await fetchPosts(user.id);
  } catch (error) {
    console.error('获取文章失败:', error);
    // 可以继续执行，使用空数组作为默认值
    posts = [];
  }

  // 返回部分数据，即使某些请求失败
  return { user, posts };
}
```

3. **创建可重用的错误处理包装器**

```javascript
// 创建一个包装器函数处理常见的异步错误模式
async function withErrorHandling(asyncFn, errorHandler, defaultValue) {
  try {
    return await asyncFn();
  } catch (error) {
    if (errorHandler) {
      errorHandler(error);
    } else {
      console.error('操作失败:', error);
    }
    return defaultValue;
  }
}

// 使用包装器
async function getUserData(userId) {
  const userData = await withErrorHandling(
    () => fetchUser(userId),
    (error) => {
      logError('用户数据获取失败', error);
      showUserFetchError();
    },
    { id: userId, name: '未知用户', isDefault: true }
  );

  return userData;
}
```

**超时控制**：

JavaScript没有内置的异步函数超时机制，但我们可以使用Promise.race实现：

1. **基本的超时控制**

```javascript
// 创建超时Promise
function timeout(ms) {
  return new Promise((_, reject) => {
    setTimeout(() => reject(new Error('操作超时')), ms);
  });
}

// 使用Promise.race实现超时控制
async function fetchWithTimeout(url, ms = 5000) {
  try {
    const result = await Promise.race([
      fetch(url),
      timeout(ms)
    ]);

    return result;
  } catch (error) {
    if (error.message === '操作超时') {
      console.error(`请求超时 (${ms}ms)`);
    }
    throw error;
  }
}

// 使用
async function loadData() {
  try {
    const response = await fetchWithTimeout('/api/data', 3000);
    const data = await response.json();
    updateUI(data);
  } catch (error) {
    handleError(error);
  }
}
```

2. **可中止的fetch请求(使用AbortController)**

```javascript
async function fetchWithAbort(url, timeoutMs = 5000) {
  // 创建AbortController
  const controller = new AbortController();
  const { signal } = controller;

  // 设置超时
  const timeoutId = setTimeout(() => {
    controller.abort(); // 中止请求
  }, timeoutMs);

  try {
    // 将signal传递给fetch
    const response = await fetch(url, { signal });
    clearTimeout(timeoutId); // 清除超时
    return response;
  } catch (error) {
    clearTimeout(timeoutId); // 确保清除超时

    // 区分中止错误和其他错误
    if (error.name === 'AbortError') {
      throw new Error(`请求超时 (${timeoutMs}ms)`);
    }
    throw error;
  }
}

// 使用方法
async function loadUserData(userId) {
  try {
    const response = await fetchWithAbort(`/api/users/${userId}`, 2000);
    return await response.json();
  } catch (error) {
    console.error('加载用户数据失败:', error.message);
    return null;
  }
}
```

3. **为多个并行请求设置超时**

```javascript
async function fetchAllWithTimeout(requests, timeoutMs = 5000) {
  // 创建AbortController
  const controller = new AbortController();
  const { signal } = controller;

  // 超时Promise
  const timeoutPromise = new Promise((_, reject) => {
    setTimeout(() => {
      controller.abort();
      reject(new Error(`操作超时 (${timeoutMs}ms)`));
    }, timeoutMs);
  });

  // 包装每个请求，传递signal
  const fetchPromises = requests.map(url =>
    fetch(url, { signal }).then(response => response.json())
  );

  // 任一Promise完成或超时
  try {
    return await Promise.race([
      Promise.all(fetchPromises),
      timeoutPromise
    ]);
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error(`请求已中止`);
    }
    throw error;
  }
}

// 使用方法
async function loadDashboardData() {
  try {
    const [users, posts, comments] = await fetchAllWithTimeout([
      '/api/users',
      '/api/posts',
      '/api/comments'
    ], 3000);

    updateDashboard({ users, posts, comments });
  } catch (error) {
    showError(`加载仪表盘数据失败: ${error.message}`);
  }
}
```

## Async/Await最佳实践与陷阱

### 问题：在使用Async/Await时，有哪些最佳实践和常见陷阱需要注意？

**最佳实践：**

1. **始终添加错误处理**

```javascript
// 不好的做法：没有错误处理
async function fetchData() {
  const data = await api.get('/data');
  return data;
}

// 好的做法：使用try/catch
async function fetchData() {
  try {
    const data = await api.get('/data');
    return data;
  } catch (error) {
    console.error('获取数据失败:', error);
    throw error; // 或者返回默认值
  }
}
```

2. **避免无谓的await**

```javascript
// 不必要的await
async function processData() {
  // 当不需要等待结果时，不要使用await
  await saveLog('Processing started'); // 除非需要确保日志已保存

  const data = await fetchData();
  return await processResult(data); // 最后一个await不需要
}

// 优化后
async function processData() {
  // 不需要等待这个Promise完成
  saveLog('Processing started'); // 没有await，不阻塞执行

  const data = await fetchData();
  return processResult(data); // 函数已经返回Promise，不需要await
}
```

3. **并行执行独立操作**

```javascript
// 低效：串行执行
async function getResourcesSequential() {
  const users = await fetchUsers();
  const products = await fetchProducts(); // 直到用户获取完才开始
  return { users, products };
}

// 高效：并行执行
async function getResourcesParallel() {
  const usersPromise = fetchUsers();
  const productsPromise = fetchProducts();

  const users = await usersPromise;
  const products = await productsPromise;

  return { users, products };
}

// 更简洁的方式
async function getResourcesParallel() {
  const [users, products] = await Promise.all([
    fetchUsers(),
    fetchProducts()
  ]);

  return { users, products };
}
```

4. **使用命名的异步函数进行堆栈跟踪**

```javascript
// 难以调试：匿名异步函数
router.get('/users', async (req, res) => {
  // 错误堆栈中不会有有用的函数名
});

// 易于调试：命名异步函数
router.get('/users', async function getUsersHandler(req, res) {
  // 错误堆栈将包含"getUsersHandler"
});

// 或者使用变量赋值
const getUsersHandler = async (req, res) => {
  // 错误堆栈将包含"getUsersHandler"
};
router.get('/users', getUsersHandler);
```

5. **考虑异步函数的生命周期**

```javascript
// 不好的做法：忽略异步操作完成
function initUser() {
  // 启动操作但不等待完成
  loadUserPreferences(); // 这是异步的，但没有await
  setupUI(); // 可能在用户偏好加载前执行
}

// 好的做法：确保按正确顺序完成
async function initUser() {
  try {
    // 等待用户偏好加载
    const preferences = await loadUserPreferences();
    // 现在安全地设置UI
    setupUI(preferences);
  } catch (error) {
    // 处理错误，也许使用默认偏好
    setupUI(defaultPreferences);
  }
}
```

6. **使用辅助函数简化常见模式**

```javascript
// 重试逻辑
async function withRetry(fn, retries = 3, delay = 300) {
  let lastError;

  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      console.warn(`尝试失败 (${attempt + 1}/${retries}):`, error.message);
      lastError = error;

      if (attempt < retries - 1) {
        // 在重试前等待，使用指数退避
        await new Promise(r => setTimeout(r, delay * Math.pow(2, attempt)));
      }
    }
  }

  throw lastError;
}

// 使用
async function fetchImportantData() {
  return withRetry(
    () => fetch('/api/critical-data').then(r => r.json()),
    5,  // 重试5次
    200 // 初始延迟200ms
  );
}
```

**常见陷阱：**

1. **忘记await导致未处理的Promise**

```javascript
// 错误：缺少await
async function saveData(data) {
  try {
    database.save(data); // 返回Promise但没有await
    return { success: true }; // 即使保存失败也会立即执行
  } catch (error) {
    // 这个catch永远不会执行!
    return { success: false, error: error.message };
  }
}

// 修复：添加await
async function saveData(data) {
  try {
    await database.save(data);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
```

2. **连续使用await导致性能问题**

```javascript
// 性能问题：每个请求必须等待前一个完成
async function loadItems(itemIds) {
  const items = [];

  for (const id of itemIds) {
    // 每次迭代都要等待前一个请求完成
    const item = await fetchItem(id);
    items.push(item);
  }

  return items;
}

// 改进：并行加载所有项目
async function loadItems(itemIds) {
  // 创建所有请求的Promise数组
  const promises = itemIds.map(id => fetchItem(id));

  // 并行等待所有请求
  return Promise.all(promises);
}

// 限制并发数量的折中方案
async function loadItemsWithConcurrencyLimit(itemIds, limit = 5) {
  const results = [];

  // 分批处理请求
  for (let i = 0; i < itemIds.length; i += limit) {
    const batch = itemIds.slice(i, i + limit);
    const batchPromises = batch.map(id => fetchItem(id));

    // 等待当前批次完成，然后处理下一批
    const batchResults = await Promise.all(batchPromises);
    results.push(...batchResults);
  }

  return results;
}
```

3. **循环中的async函数陷阱**

```javascript
// 错误：map中的async函数不会如期望的那样工作
function processItems(items) {
  // 这将返回Promise数组，而不是等待它们完成
  return items.map(async (item) => {
    const result = await processItem(item);
    return result;
  });
  // 结果是Promise数组，不是处理后的值数组!
}

// 修复：使用Promise.all等待所有Promise
async function processItems(items) {
  const promises = items.map(async (item) => {
    const result = await processItem(item);
    return result;
  });

  // 等待所有Promise解决
  return Promise.all(promises);
}
```

4. **在async函数外使用await**

```javascript
// 错误：在非async函数中使用await
function fetchAndProcess() {
  // 这将导致语法错误
  const data = await fetchData(); // SyntaxError
  return processData(data);
}

// 修复：将函数标记为async
async function fetchAndProcess() {
  const data = await fetchData();
  return processData(data);
}

// 或者使用Promise链，如果不能将函数标记为async
function fetchAndProcess() {
  return fetchData()
    .then(data => processData(data));
}
```

5. **忽略并发执行带来的竞态条件**

```javascript
// 错误：可能导致竞态条件
async function updateUserProfile(userId, updates) {
  const profile = await fetchUserProfile(userId);

  // 如果同时有多个更新，这可能会导致冲突
  Object.assign(profile, updates);

  // 保存更新后的配置文件
  return saveUserProfile(userId, profile);
}

// 修复：使用锁机制或版本控制
async function updateUserProfile(userId, updates) {
  // 添加一个版本标记或乐观锁
  const { profile, version } = await fetchUserProfileWithVersion(userId);

  // 应用更新
  const updatedProfile = { ...profile, ...updates };

  // 尝试保存，如果版本已更改则会被拒绝
  return saveUserProfileWithVersion(userId, updatedProfile, version);
}
```

6. **错误处理的盲点**

```javascript
// 错误：捕获过多，掩盖真正的问题
async function processUserData(userId) {
  try {
    const user = await fetchUser(userId);
    const processed = await processData(user);
    await saveResult(processed);
    return { success: true };
  } catch (error) {
    // 所有错误都统一处理，难以区分来源
    console.error('处理失败:', error);
    return { success: false };
  }
}

// 改进：更细粒度的错误处理
async function processUserData(userId) {
  try {
    const user = await fetchUser(userId);

    try {
      const processed = await processData(user);

      try {
        await saveResult(processed);
        return { success: true };
      } catch (saveError) {
        console.error('保存结果失败:', saveError);
        // 可能实现重试逻辑或回滚
        return { success: false, phase: 'save', error: saveError.message };
      }
    } catch (processError) {
      console.error('处理数据失败:', processError);
      return { success: false, phase: 'process', error: processError.message };
    }
  } catch (fetchError) {
    console.error('获取用户失败:', fetchError);
    return { success: false, phase: 'fetch', error: fetchError.message };
  }
}
```

**实际应用中的经验分享：**

> **经验分享**：在我负责的一个大型React应用中，我们从Promise链迁移到Async/Await后，代码可读性显著提高，特别是在处理复杂的用户交互流程时。
>
> 然而，我们也遇到了一些挑战。最初，团队成员倾向于在所有地方使用`await`，导致很多本可以并行执行的操作变成了串行。这导致某些页面加载时间显著增加。我们后来制定了代码审查指南，要求开发者特别关注异步操作的并行机会。
>
> 另一个教训是关于错误处理。我们发现过于宽泛的`try/catch`块会掩盖真正的问题，让调试变得困难。我们后来采用了更细粒度的错误处理策略，并创建了自定义的错误类以便更好地区分不同类型的异常。
>
> 我们还开发了一组异步工具函数，用于处理常见模式如重试、超时、并发限制等，这些工具大大提高了团队生产力，也使代码更加一致和可靠。
>
> 最后，我们在Node.js服务端使用Async/Await时发现，必须特别注意处理未捕获的拒绝，因为它们可能导致整个服务崩溃。我们实现了全局的未处理Promise拒绝监听，并将其连接到我们的监控系统，这极大地提高了我们的故障检测能力。