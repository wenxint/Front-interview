# React基础

> 本文详细介绍React的核心概念、组件开发、生命周期以及常用API，帮助读者构建起React的基础知识体系。

## 一、React简介

### 1.1 什么是React

React是一个由Facebook开发的声明式、高效且灵活的JavaScript库，用于构建用户界面。它让你可以将复杂的UI拆分为多个独立的、可复用的组件，并对每个组件进行独立思考。

React的核心特性包括：

- **声明式编程**：React使用JSX语法直观地声明UI的结构和行为
- **组件化**：构建封装的组件来管理各自的状态
- **虚拟DOM**：通过高效的虚拟DOM实现和差异算法优化渲染
- **单向数据流**：从父组件到子组件的数据流动，使应用状态更可预测
- **跨平台**：可通过React Native开发移动应用

### 1.2 为什么使用React

- **高效的DOM操作**：虚拟DOM使得React应用性能表现优异
- **组件复用性强**：组件化设计让代码更容易复用和维护
- **丰富的生态系统**：大量的三方库、工具和社区支持
- **大公司背书**：Facebook持续维护和改进
- **适用于大型应用**：良好的状态管理和组件化设计使其适合复杂应用
- **学习曲线合理**：入门相对容易，可逐步学习高级特性

## 二、JSX语法

JSX (JavaScript XML) 是React的核心语法，它是JavaScript的语法扩展，允许在JavaScript中编写HTML结构。

### 2.1 JSX基础语法

```jsx
const element = <h1>Hello, world!</h1>;
```

JSX与HTML的区别：

- **属性命名**：使用camelCase命名（如`className`而非`class`）
- **JavaScript表达式**：可在花括号`{}`中使用JavaScript表达式
- **自闭合标签**：像`<img />`这样的标签必须自闭合
- **表示对象**：JSX本质上是`React.createElement()`的语法糖

### 2.2 在JSX中嵌入表达式

```jsx
const name = 'Josh';
const element = <h1>Hello, {name}</h1>;

// 在JSX中使用JavaScript表达式
function formatName(user) {
  return user.firstName + ' ' + user.lastName;
}

const user = {
  firstName: 'Harper',
  lastName: 'Perez'
};

const element = (
  <h1>
    Hello, {formatName(user)}!
  </h1>
);
```

### 2.3 JSX属性

JSX中属性使用与HTML类似，但使用camelCase命名规则：

```jsx
// 静态属性
const element = <div className="container"></div>;

// 动态属性
const imgUrl = 'https://example.com/image.jpg';
const element = <img src={imgUrl} alt="Example" />;
```

### 2.4 条件渲染

```jsx
// 使用三元运算符
function Greeting({ isLoggedIn }) {
  return (
    <div>
      {isLoggedIn ? <UserGreeting /> : <GuestGreeting />}
    </div>
  );
}

// 使用逻辑与运算符
function Mailbox({ unreadMessages }) {
  return (
    <div>
      <h1>Hello!</h1>
      {unreadMessages.length > 0 &&
        <h2>
          You have {unreadMessages.length} unread messages.
        </h2>
      }
    </div>
  );
}
```

### 2.5 列表渲染

```jsx
function NumberList({ numbers }) {
  const listItems = numbers.map((number) =>
    <li key={number.toString()}>
      {number}
    </li>
  );

  return (
    <ul>{listItems}</ul>
  );
}
```

注意：渲染列表时，每个列表项都需要一个唯一的`key`属性，这有助于React识别哪些项已经更改、添加或删除。

## 三、React组件

组件是React应用的核心构建块，允许您将UI拆分为独立的、可重用的部分。

### 3.1 函数组件与类组件

**函数组件**：最简单的声明组件方式，是一个接收props并返回React元素的函数。

```jsx
function Welcome(props) {
  return <h1>Hello, {props.name}</h1>;
}
```

**类组件**：通过扩展`React.Component`类来定义组件。

```jsx
class Welcome extends React.Component {
  render() {
    return <h1>Hello, {this.props.name}</h1>;
  }
}
```

> 注意：随着React Hooks的引入，函数组件已经成为主流，类组件在新项目中使用越来越少。

### 3.2 Props

Props（属性）是组件之间传递数据的方式，是只读的，符合React单向数据流的原则。

```jsx
// 父组件传递props
function App() {
  return <Welcome name="Sara" />;
}

// 子组件接收props
function Welcome(props) {
  return <h1>Hello, {props.name}</h1>;
}
```

**Props验证**：使用PropTypes进行类型检查

```jsx
import PropTypes from 'prop-types';

function Welcome(props) {
  return <h1>Hello, {props.name}</h1>;
}

Welcome.propTypes = {
  name: PropTypes.string.isRequired,
};
```

### 3.3 State

State是组件内部的可变数据，当state变化时，组件会重新渲染。

**类组件中的state**：

```jsx
class Counter extends React.Component {
  constructor(props) {
    super(props);
    this.state = { count: 0 }; // 初始化state
  }

  // 更新state的方法
  increment = () => {
    this.setState({ count: this.state.count + 1 });
  }

  render() {
    return (
      <div>
        <p>Count: {this.state.count}</p>
        <button onClick={this.increment}>+</button>
      </div>
    );
  }
}
```

**函数组件中的state (使用Hooks)**：

```jsx
import { useState } from 'react';

function Counter() {
  // 使用useState钩子声明状态变量
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>+</button>
    </div>
  );
}
```

### 3.4 组件生命周期（类组件）

React类组件的生命周期经历了三个主要阶段：挂载，更新和卸载。

**挂载阶段**：
- `constructor()` - 初始化state和绑定方法
- `static getDerivedStateFromProps()` - 在render前更新state
- `render()` - 渲染组件
- `componentDidMount()` - 组件挂载后执行，适合进行网络请求

**更新阶段**：
- `static getDerivedStateFromProps()`
- `shouldComponentUpdate()` - 决定是否重新渲染
- `render()`
- `getSnapshotBeforeUpdate()` - 在DOM更新前捕获一些信息
- `componentDidUpdate()` - 组件更新后执行

**卸载阶段**：
- `componentWillUnmount()` - 组件卸载前执行，适合清理订阅和计时器

```jsx
class LifecycleDemo extends React.Component {
  constructor(props) {
    super(props);
    this.state = { count: 0 };
    console.log('Constructor');
  }

  static getDerivedStateFromProps(props, state) {
    console.log('getDerivedStateFromProps');
    return null;
  }

  componentDidMount() {
    console.log('componentDidMount');
  }

  shouldComponentUpdate(nextProps, nextState) {
    console.log('shouldComponentUpdate');
    return true;
  }

  getSnapshotBeforeUpdate(prevProps, prevState) {
    console.log('getSnapshotBeforeUpdate');
    return null;
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    console.log('componentDidUpdate');
  }

  componentWillUnmount() {
    console.log('componentWillUnmount');
  }

  render() {
    console.log('render');
    return (
      <div>
        <p>Count: {this.state.count}</p>
        <button onClick={() => this.setState({ count: this.state.count + 1 })}>
          Increment
        </button>
      </div>
    );
  }
}
```

### 3.5 React Hooks（函数组件）

React 16.8引入了Hooks，使函数组件可以使用state和其他React特性。Hooks使代码更简洁，更易于测试和重用。

**常用的Hooks**：

- **useState**：管理状态
  ```jsx
  const [state, setState] = useState(initialState);
  ```

- **useEffect**：处理副作用，如数据获取、订阅或手动更改DOM
  ```jsx
  useEffect(() => {
    // 副作用代码，如API调用
    return () => {
      // 清理函数，如取消订阅
    };
  }, [dependencies]); // 依赖数组
  ```

- **useContext**：访问React Context
  ```jsx
  const value = useContext(MyContext);
  ```

- **useRef**：创建可变的ref对象
  ```jsx
  const inputRef = useRef(null);
  // 访问DOM: <input ref={inputRef} />
  ```

- **useMemo**：记忆计算结果
  ```jsx
  const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b]);
  ```

- **useCallback**：记忆回调函数
  ```jsx
  const memoizedCallback = useCallback(() => doSomething(a, b), [a, b]);
  ```

## 四、事件处理

React事件处理与DOM事件类似，但有一些语法差异：

1. React事件采用camelCase命名，而不是小写
2. 使用JSX传递函数作为事件处理器，而不是字符串

```jsx
// 在函数组件中处理事件
function ClickButton() {
  const handleClick = (e) => {
    e.preventDefault(); // 阻止默认行为
    console.log('按钮被点击');
  };

  return (
    <button onClick={handleClick}>
      Click me
    </button>
  );
}

// 在类组件中处理事件 - 需要绑定this
class ClickButton extends React.Component {
  constructor(props) {
    super(props);
    // 方式1: 在构造函数中绑定
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(e) {
    console.log('按钮被点击');
  }

  render() {
    return (
      <div>
        {/* 使用构造函数中绑定的方法 */}
        <button onClick={this.handleClick}>Click</button>

        {/* 方式2: 使用箭头函数 */}
        <button onClick={(e) => this.handleClick(e)}>Click</button>

        {/* 方式3: 使用类属性语法（需要babel支持） */}
        <button onClick={this.handleClickArrow}>Click</button>
      </div>
    );
  }

  // 类属性语法(方式3)
  handleClickArrow = (e) => {
    console.log('按钮被点击');
  }
}
```

## 五、表单处理

在React中，有两种主要的表单处理方式：受控组件和非受控组件。

### 5.1 受控组件

表单元素的值由React的state控制，是大多数情况下推荐的做法。

```jsx
import { useState } from 'react';

function Form() {
  const [name, setName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`提交的名字: ${name}`);
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        名字:
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </label>
      <button type="submit">提交</button>
    </form>
  );
}
```

### 5.2 非受控组件

表单数据由DOM本身处理，通常使用ref来获取表单值。

```jsx
import { useRef } from 'react';

function Form() {
  const inputRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`提交的名字: ${inputRef.current.value}`);
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        名字:
        <input type="text" ref={inputRef} />
      </label>
      <button type="submit">提交</button>
    </form>
  );
}
```

## 六、组件通信

### 6.1 父子组件通信

**父传子**：通过props向下传递数据

```jsx
function Parent() {
  const data = "Hello from parent";
  return <Child message={data} />;
}

function Child({ message }) {
  return <p>{message}</p>;
}
```

**子传父**：通过父组件传递的回调函数实现

```jsx
function Parent() {
  const handleMessage = (message) => {
    console.log("Message from child:", message);
  };

  return <Child onMessageSend={handleMessage} />;
}

function Child({ onMessageSend }) {
  return (
    <button onClick={() => onMessageSend("Hello from child")}>
      Send Message to Parent
    </button>
  );
}
```

### 6.2 跨层级组件通信

**使用Context API**：在不同嵌套层级的组件之间共享数据

```jsx
import { createContext, useContext } from 'react';

// 创建Context
const ThemeContext = createContext('light');

// 提供者组件
function App() {
  return (
    <ThemeContext.Provider value="dark">
      <Toolbar />
    </ThemeContext.Provider>
  );
}

// 中间组件
function Toolbar() {
  return <ThemedButton />;
}

// 消费者组件
function ThemedButton() {
  const theme = useContext(ThemeContext);
  return <button className={theme}>I'm a {theme} themed button</button>;
}
```

### 6.3 非关联组件通信

对于没有直接关系的组件通信，可以使用以下方法：

1. **状态提升**：将共享状态提升到最近的共同祖先组件
2. **Context API**：如前所述，适用于深层嵌套场景
3. **状态管理库**：如Redux、MobX等
4. **发布-订阅模式**：使用事件总线

## 七、React路由

React Router是React应用中处理路由的标准库。

### 7.1 基本路由

使用React Router v6的示例：

```jsx
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <nav>
        <Link to="/">首页</Link>
        <Link to="/about">关于</Link>
        <Link to="/contact">联系我们</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </BrowserRouter>
  );
}

function Home() {
  return <h2>首页</h2>;
}

function About() {
  return <h2>关于</h2>;
}

function Contact() {
  return <h2>联系我们</h2>;
}
```

### 7.2 路由参数

```jsx
import { BrowserRouter, Routes, Route, Link, useParams } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <nav>
        <Link to="/">首页</Link>
        <Link to="/user/1">用户1</Link>
        <Link to="/user/2">用户2</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/user/:id" element={<User />} />
      </Routes>
    </BrowserRouter>
  );
}

function User() {
  // 获取路由参数
  const { id } = useParams();
  return <h2>用户 {id} 的个人资料</h2>;
}
```

### 7.3 嵌套路由

```jsx
import { BrowserRouter, Routes, Route, Link, Outlet } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

function Layout() {
  return (
    <div>
      <nav>
        <Link to="/">首页</Link>
        <Link to="/about">关于</Link>
        <Link to="/contact">联系我们</Link>
      </nav>

      <hr />

      {/* 嵌套路由内容将在这里渲染 */}
      <Outlet />
    </div>
  );
}
```

## 八、React实践技巧

### 8.1 代码分割

使用React.lazy和Suspense可以实现代码分割，优化应用性能：

```jsx
import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// 使用lazy动态导入组件
const Home = lazy(() => import('./routes/Home'));
const About = lazy(() => import('./routes/About'));

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
```

### 8.2 错误边界

错误边界是React组件，用于捕获子组件树中的JavaScript错误，并显示回退UI：

```jsx
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // 更新状态以显示回退UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // 可以将错误日志发送到服务器
    console.error("Error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // 可以渲染自定义回退UI
      return <h1>Something went wrong.</h1>;
    }

    return this.props.children;
  }
}

// 使用错误边界
function App() {
  return (
    <div>
      <ErrorBoundary>
        <MyComponent />
      </ErrorBoundary>
    </div>
  );
}
```

### 8.3 Context优化

避免Context过度重渲染的技巧：

```jsx
import React, { createContext, useState, useContext, useMemo } from 'react';

const UserContext = createContext();

function UserProvider({ children }) {
  const [user, setUser] = useState(null);

  // 使用useMemo记忆化Context值，避免不必要的重渲染
  const value = useMemo(() => ({
    user,
    login: (userData) => setUser(userData),
    logout: () => setUser(null)
  }), [user]);

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}

// 自定义Hook简化Context使用
function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}

// 导出
export { UserProvider, useUser };
```

### 8.4 性能优化技巧

1. **列表优化**：
   ```jsx
   // 使用key优化列表渲染
   function List({ items }) {
     return (
       <ul>
         {items.map(item => <ListItem key={item.id} item={item} />)}
       </ul>
     );
   }
   ```

2. **避免不必要的渲染**：
   ```jsx
   import React, { memo } from 'react';

   // 使用memo避免不必要的重渲染
   const ExpensiveComponent = memo(function ExpensiveComponent({ value }) {
     // 只有当value变化时才会重新渲染
     return <div>{value}</div>;
   });
   ```

3. **使用useMemo和useCallback**：
   ```jsx
   import { useMemo, useCallback } from 'react';

   function SearchResults({ query, data }) {
     // 记忆化昂贵的计算
     const filteredData = useMemo(() => {
       return data.filter(item => item.name.includes(query));
     }, [data, query]);

     // 记忆化回调函数
     const handleClick = useCallback((id) => {
       console.log('Item clicked:', id);
     }, []);

     return (
       <ul>
         {filteredData.map(item => (
           <li key={item.id} onClick={() => handleClick(item.id)}>
             {item.name}
           </li>
         ))}
       </ul>
     );
   }
   ```

## 九、常见面试问题

1. **React的虚拟DOM是什么，有什么优势？**

   虚拟DOM是React中的概念，它是真实DOM的一种轻量级表示。React使用虚拟DOM来提高性能，通过以下过程：
   - 首先渲染虚拟DOM树
   - 当状态变化时，创建新的虚拟DOM树
   - 使用差异算法比较新旧虚拟DOM树
   - 计算最小变化集
   - 只更新真实DOM中需要变化的部分

   优势：减少真实DOM操作，提高渲染性能；支持跨平台（不仅限于浏览器DOM）。

2. **函数组件和类组件有什么区别？**

   **函数组件**：
   - 更简洁，更易测试
   - 使用Hooks管理状态和副作用
   - 没有this绑定问题
   - 通常性能更好（没有实例化开销）

   **类组件**：
   - 使用ES6类语法
   - 有生命周期方法
   - 使用this访问props和state
   - 在引入Hooks前是处理状态和副作用的唯一方式

3. **React Hooks解决了什么问题？**

   - 在函数组件中使用状态和其他React特性
   - 复用状态逻辑而不改变组件层次结构
   - 将相关逻辑放在一起（如设置订阅和清理），而不是拆分到不同生命周期方法
   - 避免类组件中的this绑定问题
   - 减少包装地狱（HOC和render props）

4. **useEffect和componentDidMount有什么区别？**

   - componentDidMount只在组件首次渲染后执行一次
   - useEffect默认在每次渲染后执行，但可以通过第二个参数（依赖数组）控制
   - 指定空依赖数组 `useEffect(() => {}, [])` 类似于componentDidMount
   - useEffect可以返回清理函数，在下次effect执行前或组件卸载时调用

5. **列表渲染为什么需要key？**

   key帮助React识别哪些元素改变了，如添加、删除或重新排序。为列表项提供稳定的唯一ID作为key可以：
   - 提高DOM更新的效率
   - 避免组件状态混乱
   - 防止不必要的重渲染

   不推荐使用数组索引作为key，因为如果列表项顺序发生变化，可能导致状态混乱和性能问题。

## 十、React最佳实践

1. **组件设计原则**
   - 单一职责：每个组件只做一件事
   - 组件粒度适中：不要过大或过小
   - 无状态优先：尽可能使用无状态组件
   - 提取复用逻辑：使用自定义Hooks提取可复用逻辑

2. **项目结构建议**
   ```
   src/
   ├── components/        # 共享/可复用组件
   │   ├── Button/
   │   └── Card/
   ├── pages/             # 页面组件
   │   ├── Home/
   │   └── About/
   ├── hooks/             # 自定义hooks
   ├── context/           # React Context
   ├── utils/             # 工具函数
   ├── services/          # API服务
   ├── assets/            # 静态资源
   └── App.js             # 应用入口
   ```

3. **性能优化清单**
   - 适当使用React.memo、useMemo和useCallback
   - 移除不必要的状态和渲染
   - 使用虚拟化库处理长列表（如react-window）
   - 实现代码分割，按需加载
   - 避免不必要的重渲染

4. **常见反模式**
   - 不一致的组件结构
   - 过度使用状态管理
   - 过早优化
   - 在渲染函数中创建函数或对象
   - 组件过度抽象