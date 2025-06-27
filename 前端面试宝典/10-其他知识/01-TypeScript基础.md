# TypeScript基础

## TypeScript简介

TypeScript是JavaScript的超集，添加了类型系统和对ES6+特性的支持，由Microsoft开发和维护。它可以编译成纯JavaScript，运行在任何浏览器、Node.js环境中。

### TypeScript的优势

- **类型安全**：在编译时捕获错误，减少运行时错误
- **IDE支持**：提供更好的代码补全、导航和重构功能
- **更好的文档**：类型注解即文档
- **ES6+特性支持**：使用最新的JavaScript特性，编译为向后兼容的版本
- **强大的工具生态**：越来越多的库和框架提供TypeScript支持

## 基本类型

TypeScript包含以下基本类型：

```typescript
// 布尔值
let isDone: boolean = false;

// 数字
let decimal: number = 6;
let hex: number = 0xf00d;
let binary: number = 0b1010;

// 字符串
let color: string = "blue";
let sentence: string = `The color is ${color}`;

// 数组
let list: number[] = [1, 2, 3];
let list2: Array<number> = [1, 2, 3]; // 泛型写法

// 元组
let x: [string, number] = ["hello", 10];

// 枚举
enum Color {Red, Green, Blue}
let c: Color = Color.Green;

// Any - 不进行类型检查
let notSure: any = 4;
notSure = "maybe a string";
notSure = false;

// Void - 表示没有任何类型
function warnUser(): void {
  console.log("Warning message");
}

// Null 和 Undefined
let u: undefined = undefined;
let n: null = null;

// Never - 永不存在的值的类型
function error(message: string): never {
  throw new Error(message);
}

// Object
let obj: object = {};
```

## 类型断言

类型断言有两种形式：

```typescript
// 尖括号语法
let someValue: any = "this is a string";
let strLength: number = (<string>someValue).length;

// as语法 (在JSX中使用)
let someValue: any = "this is a string";
let strLength: number = (someValue as string).length;
```

## 接口

接口用于定义对象的结构和类型：

```typescript
// 基本接口
interface User {
  name: string;
  id: number;
}

// 使用接口
const user: User = {
  name: "Hayes",
  id: 0,
};

// 可选属性
interface SquareConfig {
  color?: string;
  width?: number;
}

// 只读属性
interface Point {
  readonly x: number;
  readonly y: number;
}

// 函数类型
interface SearchFunc {
  (source: string, subString: string): boolean;
}

// 可索引类型
interface StringArray {
  [index: number]: string;
}

// 类类型
interface ClockInterface {
  currentTime: Date;
  setTime(d: Date): void;
}

class Clock implements ClockInterface {
  currentTime: Date = new Date();
  setTime(d: Date) {
    this.currentTime = d;
  }
}

// 继承接口
interface Shape {
  color: string;
}

interface Square extends Shape {
  sideLength: number;
}
```

## 函数

TypeScript中的函数可以指定参数类型和返回值类型：

```typescript
// 函数声明
function add(x: number, y: number): number {
  return x + y;
}

// 函数表达式
let myAdd: (x: number, y: number) => number =
  function(x: number, y: number): number { return x + y; };

// 可选参数
function buildName(firstName: string, lastName?: string): string {
  if (lastName) {
    return `${firstName} ${lastName}`;
  }
  return firstName;
}

// 默认参数
function buildName(firstName: string, lastName = "Smith"): string {
  return `${firstName} ${lastName}`;
}

// 剩余参数
function buildName(firstName: string, ...restOfName: string[]): string {
  return firstName + " " + restOfName.join(" ");
}

// 函数重载
function padLeft(value: string, padding: string): string;
function padLeft(value: string, padding: number): string;
function padLeft(value: string, padding: string | number): string {
  if (typeof padding === "number") {
    return Array(padding + 1).join(" ") + value;
  }
  if (typeof padding === "string") {
    return padding + value;
  }
  throw new Error(`Expected string or number, got '${padding}'.`);
}
```

## 类

TypeScript支持基于类的面向对象编程：

```typescript
class Greeter {
  // 属性
  greeting: string;

  // 构造函数
  constructor(message: string) {
    this.greeting = message;
  }

  // 方法
  greet() {
    return "Hello, " + this.greeting;
  }
}

let greeter = new Greeter("world");

// 继承
class Animal {
  name: string;
  constructor(theName: string) { this.name = theName; }
  move(distanceInMeters: number = 0) {
    console.log(`${this.name} moved ${distanceInMeters}m.`);
  }
}

class Snake extends Animal {
  constructor(name: string) { super(name); }
  move(distanceInMeters = 5) {
    console.log("Slithering...");
    super.move(distanceInMeters);
  }
}

// 修饰符
class Animal {
  private name: string;
  protected age: number;
  public color: string;
  readonly species: string;

  constructor(name: string, age: number, color: string, species: string) {
    this.name = name;
    this.age = age;
    this.color = color;
    this.species = species;
  }
}

// 存取器
class Employee {
  private _fullName: string = "";

  get fullName(): string {
    return this._fullName;
  }

  set fullName(newName: string) {
    this._fullName = newName;
  }
}

// 静态属性
class Grid {
  static origin = {x: 0, y: 0};

  calculateDistance(point: {x: number; y: number;}) {
    let xDist = (point.x - Grid.origin.x);
    let yDist = (point.y - Grid.origin.y);
    return Math.sqrt(xDist * xDist + yDist * yDist);
  }
}
```

## 泛型

泛型允许创建可重用的组件，支持多种类型：

```typescript
// 泛型函数
function identity<T>(arg: T): T {
  return arg;
}

// 使用泛型
let output = identity<string>("myString");
let output2 = identity("myString"); // 类型推断

// 泛型接口
interface GenericIdentityFn<T> {
  (arg: T): T;
}

// 泛型类
class GenericNumber<T> {
  zeroValue: T;
  add: (x: T, y: T) => T;
}

// 泛型约束
interface Lengthwise {
  length: number;
}

function loggingIdentity<T extends Lengthwise>(arg: T): T {
  console.log(arg.length);  // 现在可以确定有length属性
  return arg;
}

// 在泛型约束中使用类型参数
function getProperty<T, K extends keyof T>(obj: T, key: K) {
  return obj[key];
}
```

## 高级类型

TypeScript提供了多种高级类型机制：

```typescript
// 联合类型
function padLeft(value: string, padding: string | number) {
  // ...
}

// 类型守卫
function isString(test: any): test is string {
  return typeof test === "string";
}

// 交叉类型
interface ErrorHandling {
  success: boolean;
  error?: { message: string };
}

interface ArtworksData {
  artworks: { title: string }[];
}

type ArtworksResponse = ArtworksData & ErrorHandling;

// 字面量类型
type Easing = "ease-in" | "ease-out" | "ease-in-out";

// 可辨识联合
interface Square {
  kind: "square";
  size: number;
}
interface Rectangle {
  kind: "rectangle";
  width: number;
  height: number;
}
type Shape = Square | Rectangle;

// 索引类型
function pluck<T, K extends keyof T>(o: T, propertyNames: K[]): T[K][] {
  return propertyNames.map(n => o[n]);
}
```

## 命名空间和模块

TypeScript支持模块化组织代码：

```typescript
// 命名空间
namespace Validation {
  export interface StringValidator {
    isAcceptable(s: string): boolean;
  }
}

// 导出
export interface Person {
  name: string;
  age: number;
}

export class Employee implements Person {
  name: string;
  age: number;
  // ...
}

// 导入
import { Person, Employee } from './person';
import * as math from './math';
```

## 装饰器

装饰器是一种特殊的声明，可以附加到类、方法、属性或参数上：

```typescript
// 类装饰器
function sealed(constructor: Function) {
  Object.seal(constructor);
  Object.seal(constructor.prototype);
}

@sealed
class Greeter {
  greeting: string;
  constructor(message: string) {
    this.greeting = message;
  }
  greet() {
    return "Hello, " + this.greeting;
  }
}

// 方法装饰器
function enumerable(value: boolean) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    descriptor.enumerable = value;
  };
}

class Greeter {
  greeting: string;
  constructor(message: string) {
    this.greeting = message;
  }

  @enumerable(false)
  greet() {
    return "Hello, " + this.greeting;
  }
}
```

## 实用工具类型

TypeScript内置了多种工具类型：

```typescript
// Partial - 将所有属性设为可选
interface User {
  name: string;
  age: number;
}
type PartialUser = Partial<User>; // { name?: string; age?: number; }

// Required - 将所有属性设为必选
type RequiredUser = Required<PartialUser>; // { name: string; age: number; }

// Readonly - 将所有属性设为只读
type ReadonlyUser = Readonly<User>; // { readonly name: string; readonly age: number; }

// Pick - 选取特定属性
type NameOnly = Pick<User, 'name'>; // { name: string; }

// Omit - 排除特定属性
type WithoutAge = Omit<User, 'age'>; // { name: string; }

// Record - 创建键值对类型
type UserRoles = Record<string, User>; // { [key: string]: User; }
```

## TypeScript配置

TypeScript项目通常使用`tsconfig.json`文件进行配置：

```json
{
  "compilerOptions": {
    "target": "es5",
    "module": "commonjs",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "**/*.spec.ts"]
}
```

## 常见面试问题

### 1. TypeScript相比JavaScript有哪些优势？

**答案**：TypeScript的主要优势包括：
- 静态类型检查，在编译时捕获类型错误
- 更好的IDE支持，提供智能提示、自动补全和重构功能
- 更清晰的代码结构和文档（类型即文档）
- 支持最新的ECMAScript特性
- 提高代码可维护性和可读性，特别是在大型项目中
- 更好的团队协作，明确的接口定义提高沟通效率

### 2. any、unknown和never类型有什么区别？

**答案**：
- **any**：表示任何类型，完全跳过类型检查，可以对any类型的变量进行任何操作
- **unknown**：比any更安全的类型，必须先通过类型检查（如类型断言或类型守卫）才能对unknown类型的值执行操作
- **never**：表示永不会出现的值的类型，常用于永远不会返回（如抛出异常或无限循环）的函数返回类型

### 3. interface和type的区别是什么？

**答案**：
- **扩展性**：interface可以声明合并（多次声明同名interface会合并），type不可以
- **组合方式**：interface使用extends继承，type使用&进行交叉
- **应用范围**：type可以声明基本类型、联合类型、元组等，interface主要用于对象形状的描述
- **计算属性**：type支持使用映射类型等高级功能，interface相对简单
- **最佳实践**：通常优先使用interface，需要使用联合类型或元组时使用type

### 4. 什么是泛型？为什么要使用泛型？

**答案**：泛型是一种创建可复用组件的工具，允许组件处理多种类型而不失去类型安全性。使用泛型的原因：
- 保持类型安全的同时增加代码复用性
- 避免使用any类型导致的类型检查丧失
- 允许函数、类或接口操作多种数据类型，同时保持严格的类型检查
- 例如，Array<T>可以是Array<number>或Array<string>，保持了类型的具体信息

### 5. TypeScript中的声明合并是什么？

**答案**：声明合并是指编译器将具有相同名称的多个声明合并为一个定义。最常见的是interface的合并：

```typescript
interface Box {
  height: number;
}

interface Box {
  width: number;
}

// 等同于
interface Box {
  height: number;
  width: number;
}
```

声明合并也适用于命名空间、模块等，是TypeScript增强现有定义的重要机制。