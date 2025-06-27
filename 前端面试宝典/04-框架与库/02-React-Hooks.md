# React Hooks详解

> 本文档详细介绍React Hooks的概念、使用方法、最佳实践以及面试中常见问题。

## 基础概念

React Hooks是React 16.8引入的特性，允许在函数组件中使用状态和其他React特性，而无需编写class组件。

### Hooks优势

1. **更简洁的代码**：相比class组件更加简洁直观
2. **逻辑复用更容易**：自定义Hook可以轻松地实现逻辑复用
3. **关注点分离**：按照逻辑关注点组织代码，而非生命周期方法
4. **避免了this的困扰**：函数组件中不需要处理this绑定问题
5. **对TypeScript更友好**：函数组件更容易进行类型检查

### Hooks规则

1. **只在最顶层使用Hooks**：不要在循环、条件或嵌套函数中调用Hooks
2. **只在React函数组件中调用Hooks**：不要在普通JavaScript函数中调用
3. **自定义Hook必须以"use"开头**：命名约定，便于React识别

## 常用内置Hooks

### useState

用于在函数组件中添加状态管理。

```jsx
const [state, setState] = useState(initialState);

// 函数式更新（当新状态依赖于前一个状态时）
setState(prevState => prevState + 1);

// 惰性初始化（当初始状态需要复杂计算时）
const [state, setState] = useState(() => computeInitialState());
```

### useEffect

用于处理副作用，如数据获取、订阅或DOM操作。

```jsx
// 每次渲染后执行
useEffect(() => {
  document.title = `Count: ${count}`;
});

// 仅在挂载和卸载时执行
useEffect(() => {
  // 设置
  const subscription = someAPI.subscribe();
  // 清理
  return () => subscription.unsubscribe();
}, []);

// 依赖特定值变化时执行
useEffect(() => {
  fetchData(userId);
}, [userId]);
```

### useContext

用于在组件中消费React Context，简化跨组件数据共享。

```jsx
const ThemeContext = createContext('light');

function ThemedButton() {
  const theme = useContext(ThemeContext);
  return <button className={theme}>Themed Button</button>;
}
```

### useReducer

useState的替代方案，适用于复杂的状态逻辑。

```jsx
const [state, dispatch] = useReducer(reducer, initialState, init);

// 示例
function reducer(state, action) {
  switch (action.type) {
    case 'increment': return {count: state.count + 1};
    case 'decrement': return {count: state.count - 1};
    default: throw new Error();
  }
}
```

### useCallback

返回一个记忆化的回调函数，避免不必要的重新渲染。

```jsx
const memoizedCallback = useCallback(
  () => doSomething(a, b),
  [a, b] // 只有a或b变化时才会重新创建回调
);
```

### useMemo

返回一个记忆化的值，避免昂贵的计算在每次渲染时重复执行。

```jsx
const memoizedValue = useMemo(
  () => computeExpensiveValue(a, b),
  [a, b] // 只有a或b变化时才重新计算
);
```

### useRef

返回一个可变的ref对象，可以保存任何值或访问DOM元素。

```jsx
// 访问DOM元素
const inputRef = useRef(null);
<input ref={inputRef} />;

// 保存任意可变值
const intervalRef = useRef();
useEffect(() => {
  intervalRef.current = setInterval(() => {/* ... */}, 1000);
  return () => clearInterval(intervalRef.current);
}, []);
```

## 自定义Hooks

自定义Hooks是一种复用状态逻辑的方式，而不是复用状态本身。以下是几个常见的自定义Hook示例：

### useLocalStorage

用于与localStorage同步的状态管理：

```jsx
function useLocalStorage(key, initialValue) {
  // 状态初始化逻辑
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  // 更新状态并同步到localStorage
  const setValue = value => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(error);
    }
  };

  return [storedValue, setValue];
}

// 使用示例
function App() {
  const [name, setName] = useLocalStorage('name', 'Bob');

  return (
    <div>
      <input
        value={name}
        onChange={e => setName(e.target.value)}
        placeholder="输入名字"
      />
    </div>
  );
}
```

### useFetch

用于数据获取的Hook：

```jsx
function useFetch(url, options = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    async function fetchData() {
      try {
        const response = await fetch(url, options);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const result = await response.json();
        if (isMounted) {
          setData(result);
          setError(null);
        }
      } catch (error) {
        if (isMounted) {
          setError(error.message);
          setData(null);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [url, JSON.stringify(options)]);

  return { data, loading, error };
}

// 使用示例
function UserProfile({ userId }) {
  const { data, loading, error } = useFetch(
    `https://api.example.com/users/${userId}`
  );

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!data) return null;

  return (
    <div>
      <h1>{data.name}</h1>
      <p>Email: {data.email}</p>
    </div>
  );
}
```

### useForm

用于表单处理的Hook：

```jsx
function useForm(initialValues = {}) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // 处理输入变化
  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues(prevValues => ({
      ...prevValues,
      [name]: value
    }));
  };

  // 处理失去焦点
  const handleBlur = (event) => {
    const { name } = event.target;
    setTouched(prevTouched => ({
      ...prevTouched,
      [name]: true
    }));
  };

  // 重置表单
  const resetForm = () => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  };

  // 设置表单值
  const setFieldValue = (name, value) => {
    setValues(prevValues => ({
      ...prevValues,
      [name]: value
    }));
  };

  return {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    resetForm,
    setFieldValue,
    setErrors
  };
}

// 使用示例
function SignupForm() {
  const {
    values,
    handleChange,
    handleBlur,
    errors,
    touched,
    resetForm
  } = useForm({
    username: '',
    email: '',
    password: ''
  });

  const handleSubmit = (event) => {
    event.preventDefault();
    // 表单验证逻辑...
    console.log('Form values:', values);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Username:</label>
        <input
          type="text"
          name="username"
          value={values.username}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        {touched.username && errors.username && (
          <div>{errors.username}</div>
        )}
      </div>

      {/* 其他表单字段... */}

      <button type="submit">Sign Up</button>
      <button type="button" onClick={resetForm}>Reset</button>
    </form>
  );
}
```

### useMediaQuery

用于响应式设计的媒体查询Hook：

```jsx
function useMediaQuery(query) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);

    // 初始检查
    setMatches(mediaQuery.matches);

    // 添加监听器
    const handler = (event) => setMatches(event.matches);
    mediaQuery.addEventListener('change', handler);

    // 清理
    return () => mediaQuery.removeEventListener('change', handler);
  }, [query]);

  return matches;
}

// 使用示例
function ResponsiveComponent() {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const isTablet = useMediaQuery('(min-width: 769px) and (max-width: 1024px)');
  const isDesktop = useMediaQuery('(min-width: 1025px)');

  return (
    <div>
      {isMobile && <MobileView />}
      {isTablet && <TabletView />}
      {isDesktop && <DesktopView />}
    </div>
  );
}
```

### useClickOutside

用于检测元素外部点击的Hook：

```jsx
function useClickOutside(ref, handler) {
  useEffect(() => {
    const listener = (event) => {
      if (!ref.current || ref.current.contains(event.target)) {
        return;
      }
      handler(event);
    };

    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);

    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, handler]);
}

// 使用示例
function Dropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // 点击外部时关闭下拉菜单
  useClickOutside(dropdownRef, () => {
    if (isOpen) setIsOpen(false);
  });

  return (
    <div ref={dropdownRef}>
      <button onClick={() => setIsOpen(!isOpen)}>
        Toggle Dropdown
      </button>
      {isOpen && (
        <ul className="dropdown-menu">
          <li>Item 1</li>
          <li>Item 2</li>
          <li>Item 3</li>
        </ul>
      )}
    </div>
  );
}
```

## Hooks的高级用法

### 状态与副作用的结合

有时需要将状态管理和副作用结合使用，特别是在处理复杂异步操作时：

```jsx
function useAsync(asyncFunction, immediate = true) {
  const [status, setStatus] = useState('idle');
  const [value, setValue] = useState(null);
  const [error, setError] = useState(null);

  // 执行异步函数的函数
  const execute = useCallback(async () => {
    setStatus('pending');
    setValue(null);
    setError(null);

    try {
      const response = await asyncFunction();
      setValue(response);
      setStatus('success');
    } catch (error) {
      setError(error);
      setStatus('error');
    }
  }, [asyncFunction]);

  // 立即执行
  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [execute, immediate]);

  return { execute, status, value, error };
}

// 使用示例
function UserDashboard() {
  const {
    status,
    value: users,
    error,
    execute: fetchUsers
  } = useAsync(
    () => fetch('/api/users').then(res => res.json())
  );

  return (
    <div>
      {status === 'idle' && <div>请点击按钮加载用户</div>}
      {status === 'pending' && <div>加载中...</div>}
      {status === 'error' && <div>错误: {error.message}</div>}
      {status === 'success' && (
        <ul>
          {users.map(user => (
            <li key={user.id}>{user.name}</li>
          ))}
        </ul>
      )}
      <button onClick={fetchUsers} disabled={status === 'pending'}>
        {status === 'pending' ? '加载中...' : '刷新用户'}
      </button>
    </div>
  );
}
```

### Hook组合与抽象

复杂的状态逻辑可以通过组合多个自定义Hook来实现：

```jsx
// 组合多个Hook创建更复杂的功能
function useAuthenticatedFetch() {
  // 使用认证状态
  const { token } = useAuth();

  return useCallback(async (url, options = {}) => {
    // 在请求中添加认证令牌
    const headers = {
      'Authorization': `Bearer ${token}`,
      ...options.headers
    };

    return fetch(url, {
      ...options,
      headers
    });
  }, [token]);
}

// 使用组合的Hook
function ProtectedResource() {
  const authFetch = useAuthenticatedFetch();
  const { data, loading } = useFetch(() => authFetch('/api/protected-data'));

  if (loading) return <div>Loading...</div>;
  return <div>{data}</div>;
}
```

### 使用useReducer进行复杂状态管理

对于复杂的状态逻辑，`useReducer`通常比多个`useState`更适合：

```jsx
// 定义行为类型
const ACTIONS = {
  FETCH_START: 'FETCH_START',
  FETCH_SUCCESS: 'FETCH_SUCCESS',
  FETCH_ERROR: 'FETCH_ERROR',
  RESET: 'RESET'
};

// 初始状态
const initialState = {
  data: null,
  loading: false,
  error: null
};

// Reducer函数
function dataReducer(state, action) {
  switch (action.type) {
    case ACTIONS.FETCH_START:
      return { ...state, loading: true, error: null };
    case ACTIONS.FETCH_SUCCESS:
      return { ...state, loading: false, data: action.payload };
    case ACTIONS.FETCH_ERROR:
      return { ...state, loading: false, error: action.payload };
    case ACTIONS.RESET:
      return initialState;
    default:
      return state;
  }
}

// 数据获取Hook
function useDataFetching(fetchFunction) {
  const [state, dispatch] = useReducer(dataReducer, initialState);

  const fetchData = useCallback(async () => {
    dispatch({ type: ACTIONS.FETCH_START });

    try {
      const data = await fetchFunction();
      dispatch({ type: ACTIONS.FETCH_SUCCESS, payload: data });
    } catch (error) {
      dispatch({ type: ACTIONS.FETCH_ERROR, payload: error.message });
    }
  }, [fetchFunction]);

  // 重置状态
  const reset = useCallback(() => {
    dispatch({ type: ACTIONS.RESET });
  }, []);

  return {
    ...state,
    fetchData,
    reset
  };
}

// 使用示例
function ProductList({ categoryId }) {
  const { data, loading, error, fetchData } = useDataFetching(
    () => fetch(`/api/products?category=${categoryId}`).then(res => res.json())
  );

  useEffect(() => {
    fetchData();
  }, [categoryId, fetchData]);

  if (loading) return <div>加载中...</div>;
  if (error) return <div>错误: {error}</div>;
  if (!data) return <div>无数据</div>;

  return (
    <div>
      <h2>产品列表</h2>
      <ul>
        {data.map(product => (
          <li key={product.id}>{product.name}</li>
        ))}
      </ul>
    </div>
  );
}
```

### React性能优化与Hooks

使用Hooks进行性能优化的关键技术：

1. **合理使用依赖数组**

```jsx
// 不良实践
useEffect(() => {
  fetchData(props.id);
}); // 没有依赖数组，每次渲染都会执行

// 最佳实践
useEffect(() => {
  fetchData(props.id);
}, [props.id]); // 只有当id变化时才执行
```

2. **使用useCallback防止不必要的重新渲染**

```jsx
// 子组件使用React.memo防止不必要的重新渲染
const ChildComponent = React.memo(function ChildComponent({ onClick }) {
  console.log('Child renders');
  return <button onClick={onClick}>Click me</button>;
});

function ParentComponent() {
  const [count, setCount] = useState(0);

  // 不良实践
  // const handleClick = () => console.log('Clicked');

  // 最佳实践
  const handleClick = useCallback(() => {
    console.log('Clicked');
  }, []); // 依赖为空，函数引用永远不变

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
      <ChildComponent onClick={handleClick} />
    </div>
  );
}
```

3. **使用useMemo避免昂贵的计算**

```jsx
function SearchResults({ items, query }) {
  // 不良实践
  // const filteredItems = items.filter(item =>
  //   item.name.toLowerCase().includes(query.toLowerCase())
  // );

  // 最佳实践
  const filteredItems = useMemo(() => {
    console.log('Filtering items...');
    return items.filter(item =>
      item.name.toLowerCase().includes(query.toLowerCase())
    );
  }, [items, query]); // 只有当items或query变化时才重新计算

  return (
    <ul>
      {filteredItems.map(item => (
        <li key={item.id}>{item.name}</li>
      ))}
    </ul>
  );
}
```