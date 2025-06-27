# TypeScript高级类型

## 联合类型与交叉类型

### 联合类型 (Union Types)

联合类型表示一个值可以是几种类型之一，使用竖线（`|`）分隔每个类型。

```typescript
// 联合类型
type StringOrNumber = string | number;

function printId(id: StringOrNumber) {
  if (typeof id === "string") {
    // 在这个分支中，id 的类型是 string
    console.log(`ID: ${id.toUpperCase()}`);
  } else {
    // 在这个分支中，id 的类型是 number
    console.log(`ID: ${id.toFixed(2)}`);
  }
}

// 以下都是合法的
printId(101);
printId("202");
```

### 交叉类型 (Intersection Types)

交叉类型将多个类型合并为一个类型，包含了所需的所有类型的特性，使用 & 操作符。

```typescript
interface BusinessPartner {
  name: string;
  credit: number;
}

interface Identity {
  id: number;
  email: string;
}

// 交叉类型
type Employee = BusinessPartner & Identity;

// 必须同时满足两个接口的要求
const roy: Employee = {
  name: "Roy",
  credit: 100,
  id: 1234,
  email: "roy@company.com"
};
```

## 类型守卫

类型守卫是一种表达式，在编译时检查可确保在其作用域内的类型。

### typeof 类型守卫

```typescript
function padLeft(value: string, padding: string | number) {
  // typeof 类型守卫
  if (typeof padding === "number") {
    return Array(padding + 1).join(" ") + value;
  }
  if (typeof padding === "string") {
    return padding + value;
  }
  throw new Error(`Expected string or number, got '${padding}'.`);
}
```

### instanceof 类型守卫

```typescript
class Bird {
  fly() {
    console.log("flying...");
  }
  layEggs() {
    console.log("laying eggs...");
  }
}

class Fish {
  swim() {
    console.log("swimming...");
  }
  layEggs() {
    console.log("laying eggs...");
  }
}

function getSmallPet(): Fish | Bird {
  return Math.random() > 0.5 ? new Bird() : new Fish();
}

let pet = getSmallPet();
pet.layEggs(); // 正确，两种类型都有这个方法

// instanceof 类型守卫
if (pet instanceof Bird) {
  pet.fly(); // 正确，在这个分支中 pet 是 Bird 类型
} else {
  pet.swim(); // 正确，在这个分支中 pet 是 Fish 类型
}
```

### 自定义类型守卫

使用类型谓词(type predicate)创建自定义类型守卫：

```typescript
// 使用类型谓词
function isFish(pet: Fish | Bird): pet is Fish {
  return (pet as Fish).swim !== undefined;
}

// 现在可以使用自定义类型守卫
if (isFish(pet)) {
  pet.swim();
} else {
  pet.fly();
}
```

## 字面量类型

字面量类型是更具体的字符串、数字或布尔值的子类型：

```typescript
// 字符串字面量类型
type Direction = "north" | "east" | "south" | "west";
function move(direction: Direction) {
  // ...
}
move("north"); // 正确
// move("northeast"); // 错误，不是预定义的方向

// 数字字面量类型
type DiceRoll = 1 | 2 | 3 | 4 | 5 | 6;
function rollDice(): DiceRoll {
  return (Math.floor(Math.random() * 6) + 1) as DiceRoll;
}

// 布尔字面量类型
type YesOrNo = true | false;
```

### 对象字面量的多余属性检查

TypeScript在对象字面量赋值给变量或传递给函数时，会进行额外的属性检查：

```typescript
interface SquareConfig {
  color?: string;
  width?: number;
}

// 错误：对象字面量"color"和额外的"colour"属性
function createSquare(config: SquareConfig): { color: string; area: number } {
  return {
    color: config.color || "red",
    area: config.width ? config.width * config.width : 20
  };
}

// 报错：Object literal may only specify known properties, but 'colour' does not exist in type 'SquareConfig'
// let mySquare = createSquare({ colour: "red", width: 100 });

// 解决方法1：使用类型断言
let mySquare = createSquare({ colour: "red", width: 100 } as SquareConfig);

// 解决方法2：添加索引签名
interface SquareConfig {
  color?: string;
  width?: number;
  [propName: string]: any;
}
```

## 可辨识联合

可辨识联合是设计模式中的一种，我们也称它为标签联合或代数数据类型：

```typescript
// 定义具有共同的辨识特征
interface Circle {
  kind: "circle";  // 辨识字段
  radius: number;
}

interface Square {
  kind: "square";  // 辨识字段
  sideLength: number;
}

type Shape = Circle | Square;

// 使用辨识联合进行类型守卫
function getArea(shape: Shape): number {
  switch (shape.kind) {
    case "circle":
      return Math.PI * shape.radius ** 2;
    case "square":
      return shape.sideLength ** 2;
  }
}
```

### 完整性检查

使用 `never` 类型和 TypeScript 的严格性检查确保所有可能的情况都被处理：

```typescript
interface Triangle {
  kind: "triangle";
  sideLength: number;
}

type Shape = Circle | Square | Triangle;

function getArea(shape: Shape): number {
  switch (shape.kind) {
    case "circle":
      return Math.PI * shape.radius ** 2;
    case "square":
      return shape.sideLength ** 2;
    case "triangle":
      return (Math.sqrt(3) / 4) * shape.sideLength ** 2;
    default:
      // 确保所有情况都已处理
      const _exhaustiveCheck: never = shape;
      return _exhaustiveCheck;
  }
}
```

## 索引类型

索引类型允许你使用动态属性名：

### 索引类型查询操作符 (keyof)

`keyof` 操作符获取对象类型的所有键的联合：

```typescript
interface Person {
  name: string;
  age: number;
  address: string;
}

// Key的类型为 "name" | "age" | "address"
type Key = keyof Person;

// 获取对象的属性值
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

const person: Person = {
  name: "John",
  age: 30,
  address: "New York"
};

// 类型检查会确保key是Person的一个属性
const name = getProperty(person, "name");
const age = getProperty(person, "age");
// getProperty(person, "job"); // 错误，"job"不是Person的属性
```

### 索引访问操作符 (T[K])

使用 `T[K]` 访问类型 `T` 的属性 `K` 的类型：

```typescript
interface Person {
  name: string;
  age: number;
  address: {
    city: string;
    country: string;
  };
}

// NameType 的类型为 string
type NameType = Person["name"];

// AddressType 的类型为 { city: string; country: string; }
type AddressType = Person["address"];

// CityType 的类型为 string
type CityType = Person["address"]["city"];

// 使用联合类型
type PersonProperties = Person["name" | "age"]; // string | number
```

## 映射类型

映射类型允许你基于旧类型创建新类型，通过遍历键来转换属性：

### 基本映射类型

```typescript
interface Person {
  name: string;
  age: number;
}

// 将Person的所有属性变为可选
type PartialPerson = {
  [P in keyof Person]?: Person[P];
};

// 将Person的所有属性变为只读
type ReadonlyPerson = {
  readonly [P in keyof Person]: Person[P];
};
```

### 内置映射类型

TypeScript 提供了几种有用的映射类型：

```typescript
// Partial<T> - 将所有属性设为可选
type PartialPerson = Partial<Person>;

// Required<T> - 将所有属性设为必需
type RequiredPartialPerson = Required<PartialPerson>;

// Readonly<T> - 将所有属性设为只读
type ReadonlyPerson = Readonly<Person>;

// Pick<T, K> - 从T中选择一组属性K
type NameOnlyPerson = Pick<Person, "name">;

// Omit<T, K> - 从T中排除一组属性K
type PersonWithoutAge = Omit<Person, "age">;

// Record<K, T> - 构造属性键为K、属性值为T的类型
type PersonRecord = Record<"admin" | "user", Person>;
```

### 映射类型修饰符

使用 `+` 或 `-` 添加或删除修饰符（如 `readonly` 或 `?`）：

```typescript
// 移除只读属性
type Mutable<T> = {
  -readonly [P in keyof T]: T[P];
};

const readonlyPerson: Readonly<Person> = {
  name: "John",
  age: 30
};

// 错误：无法修改只读属性
// readonlyPerson.name = "Jane";

// 使用Mutable移除只读特性
const mutablePerson: Mutable<Readonly<Person>> = readonlyPerson;
mutablePerson.name = "Jane"; // 现在可以修改

// 移除可选标志
type Concrete<T> = {
  [P in keyof T]-?: T[P];
};

// 使所有属性都是必需的
type RequiredPerson = Concrete<Partial<Person>>;
```

## 条件类型

条件类型根据条件表达式的结果选择两种可能类型之一：

```typescript
// 基本形式：T extends U ? X : Y
type IsString<T> = T extends string ? true : false;

// 示例
type A = IsString<string>;  // true
type B = IsString<number>;  // false

// 条件类型与联合类型分配
type ToArray<T> = T extends any ? T[] : never;

type StrArrOrNumArr = ToArray<string | number>; // string[] | number[]
```

### infer 关键字

`infer` 关键字用于从条件类型中提取类型：

```typescript
// 提取函数返回类型
type ReturnType<T> = T extends (...args: any[]) => infer R ? R : any;

function createUser() {
  return { name: "John", age: 30 };
}

// User的类型是函数返回值的类型：{ name: string; age: number }
type User = ReturnType<typeof createUser>;

// 提取数组元素类型
type ArrayElementType<T> = T extends (infer U)[] ? U : never;

// Item的类型是string
type Item = ArrayElementType<string[]>;
```

### 预定义的条件类型

TypeScript 提供了一些常用的条件类型：

```typescript
// Extract<T, U> - 提取T中可分配给U的类型
type StringOrNumber = string | number | boolean;
type ExtractedTypes = Extract<StringOrNumber, string | number>; // string | number

// Exclude<T, U> - 从T中排除可分配给U的类型
type OnlyBoolean = Exclude<StringOrNumber, string | number>; // boolean

// NonNullable<T> - 从T中排除null和undefined
type NullableString = string | null | undefined;
type DefinitelyString = NonNullable<NullableString>; // string

// Parameters<T> - 提取函数参数类型为元组
function greet(name: string, age: number): void {
  console.log(`Hello ${name}, you are ${age} years old!`);
}

// 类型为 [name: string, age: number]
type GreetParameters = Parameters<typeof greet>;
```

## 模板字面量类型

TypeScript 4.1 引入了模板字面量类型，允许你基于字符串字面量类型进行操作：

```typescript
// 基本用法
type World = "world";
type Greeting = `hello ${World}`; // "hello world"

// 使用联合类型
type EmailLocaleIDs = "welcome_email" | "email_heading";
type FooterLocaleIDs = "footer_title" | "footer_sendoff";

// 生成所有可能的组合
type AllLocaleIDs = `${EmailLocaleIDs | FooterLocaleIDs}_id`;
// "welcome_email_id" | "email_heading_id" | "footer_title_id" | "footer_sendoff_id"

// 使用内置类型
type Uppercase<S extends string> = intrinsic;
type Lowercase<S extends string> = intrinsic;
type Capitalize<S extends string> = intrinsic;
type Uncapitalize<S extends string> = intrinsic;

// 示例
type UppercaseGreeting = Uppercase<Greeting>; // "HELLO WORLD"
type LowercaseGreeting = Lowercase<Greeting>; // "hello world"
```

### 实际应用：转换对象属性

```typescript
// 将对象属性转换为 Getter/Setter
type Getters<T> = {
  [K in keyof T as `get${Capitalize<string & K>}`]: () => T[K]
};

// 示例
interface Person {
  name: string;
  age: number;
}

// 类型为 { getName: () => string; getAge: () => number; }
type PersonGetters = Getters<Person>;
```

## 实用类型技巧

### 深度只读类型

```typescript
// 递归地将类型设为只读
type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P];
};

interface NestedObject {
  name: string;
  settings: {
    theme: string;
    notification: boolean;
  };
}

// 类型包含嵌套的readonly属性
type DeepReadonlyNested = DeepReadonly<NestedObject>;
```

### 类型递归

```typescript
// 递归地将联合类型转为交叉类型
type UnionToIntersection<U> =
  (U extends any ? (k: U) => void : never) extends ((k: infer I) => void) ? I : never;

type Union = { a: string } | { b: number } | { c: boolean };
// 结果为 { a: string } & { b: number } & { c: boolean }
type Intersection = UnionToIntersection<Union>;
```

### 解构类型

```typescript
// 从函数参数中提取类型
function processUser(user: { id: number; name: string; email: string }) {
  // ...
}

// 提取参数类型
type UserType = Parameters<typeof processUser>[0];
// 等价于 { id: number; name: string; email: string }
```

## 高级类型挑战

### 实现Deep Partial

```typescript
// 递归地将所有属性变为可选
type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

interface DeepObject {
  name: string;
  profile: {
    age: number;
    address: {
      city: string;
      country: string;
    };
  };
}

// 深度可选类型
type PartialDeepObject = DeepPartial<DeepObject>;

// 可以这样使用
const partial: PartialDeepObject = {
  name: "John",
  profile: {
    // age可以省略
    address: {
      // city可以省略
      country: "USA"
    }
  }
};
```

### 实现类型过滤

```typescript
// 从对象类型中过滤特定类型的属性
type FilterByValueType<T, ValueType> = {
  [K in keyof T as T[K] extends ValueType ? K : never]: T[K]
};

interface Mixed {
  name: string;
  age: number;
  isActive: boolean;
  roles: string[];
  meta: {
    created: Date;
  };
}

// 仅保留字符串类型的属性
type StringProps = FilterByValueType<Mixed, string>;
// 结果为 { name: string }

// 仅保留数组类型的属性
type ArrayProps = FilterByValueType<Mixed, any[]>;
// 结果为 { roles: string[] }
```

## 常见面试问题

### 1. 什么是TypeScript中的协变和逆变？

**答案**：协变和逆变是类型系统中描述类型转换关系的概念：

- **协变(Covariance)**：如果A是B的子类型，那么T\<A\>也是T\<B\>的子类型，这就是协变。在TypeScript中，数组和对象属性是协变的。

  ```typescript
  interface Animal { name: string }
  interface Dog extends Animal { breed: string }

  // 协变例子：Dog[]可以赋值给Animal[]
  let dogs: Dog[] = [{ name: "Rex", breed: "German Shepherd" }];
  let animals: Animal[] = dogs; // 合法，因为数组是协变的
  ```

- **逆变(Contravariance)**：如果A是B的子类型，那么T\<B\>是T\<A\>的子类型，这就是逆变。在TypeScript中，函数参数是逆变的。

  ```typescript
  // 函数类型
  type AnimalCallback = (animal: Animal) => void;
  type DogCallback = (dog: Dog) => void;

  // 逆变例子：AnimalCallback可以赋值给DogCallback
  let animalFunc: AnimalCallback = (animal) => console.log(animal.name);
  let dogFunc: DogCallback = animalFunc; // 合法，因为函数参数是逆变的
  ```

逆变性质确保了类型安全性，特别是在函数参数中。更具体类型的函数需要接受更通用的参数类型。

### 2. TypeScript中的类型兼容性是如何工作的？

**答案**：TypeScript使用结构性类型系统(Structural Typing)，也称为"鸭子类型"：如果两个对象具有相同的形状，则认为它们是相同的类型，不管它们的名称如何。

```typescript
interface Point {
  x: number;
  y: number;
}

class Point2D {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
}

// 虽然Point2D没有显式地实现Point接口，但它们结构兼容
let p1: Point = new Point2D(1, 2); // 有效

// 对象字面量检查更严格
let p2: Point = { x: 1, y: 2 }; // 有效
let p3: Point = { x: 1, y: 2, z: 3 }; // 错误：对象字面量只能指定已知属性
```

类型兼容性的关键规则：
- 目标类型中的每个属性必须在源类型中找到对应属性
- 源类型可以有更多的属性
- 函数参数是双向协变的(在严格模式下是逆变的)

### 3. unknown和any类型有什么区别？

**答案**：`unknown`和`any`都可以表示任意类型的值，但有以下关键区别：

- `any`：完全绕过类型检查，可以对`any`类型的值执行任何操作，不安全但灵活。
- `unknown`：更安全的顶层类型，必须先进行类型检查或类型断言后才能操作其值。

```typescript
// any示例
let valueAny: any = 10;
valueAny.foo.bar;  // 不会报错
valueAny();        // 不会报错
valueAny.trim();   // 不会报错

// unknown示例
let valueUnknown: unknown = 10;
// valueUnknown.foo.bar;  // 错误
// valueUnknown();        // 错误
// valueUnknown.trim();   // 错误

// 必须先进行类型检查
if (typeof valueUnknown === "string") {
  valueUnknown.trim();  // 现在可以了
}

// 或使用类型断言
const value: string = valueUnknown as string;
value.trim();  // 可以使用，但需要确保类型是正确的
```

`unknown`是类型安全的`any`，应优先使用`unknown`而不是`any`。

### 4. 什么是条件类型，如何使用infer关键字？

**答案**：条件类型允许基于类型关系表达类型，语法为`T extends U ? X : Y`。`infer`关键字用于在条件类型内推断和提取类型部分。

```typescript
// 条件类型示例：获取函数返回类型
type ReturnTypeOf<T> = T extends (...args: any[]) => infer R ? R : never;

function fetchUser() {
  return { id: 1, name: "John" };
}

// UserType是函数fetchUser的返回类型
type UserType = ReturnTypeOf<typeof fetchUser>;
// 等价于 { id: number; name: string; }
```

`infer`常用场景：
- 提取函数参数类型
- 提取构造函数实例类型
- 提取Promise的解析类型
- 提取数组元素类型

```typescript
// 提取Promise的解析类型
type UnwrapPromise<T> = T extends Promise<infer U> ? U : T;

// 类型为string
type ResolvedType = UnwrapPromise<Promise<string>>;

// 类型仍为number (因为不是Promise)
type NotPromiseType = UnwrapPromise<number>;
```

### 5. TypeScript中的映射类型有哪些实际应用？

**答案**：映射类型提供了从现有类型创建新类型的强大方式，常见应用包括：

1. **创建只读版本**：防止对象被修改
   ```typescript
   interface User { id: number; name: string; }
   const user: Readonly<User> = { id: 1, name: "John" };
   // user.name = "Jane"; // 错误：无法修改只读属性
   ```

2. **表单状态管理**：跟踪字段错误和触摸状态
   ```typescript
   interface FormValues { username: string; password: string; }

   type FormErrors<T> = {
     [K in keyof T]?: string;
   };

   type FormTouched<T> = {
     [K in keyof T]?: boolean;
   };

   // 使用
   const values: FormValues = { username: "", password: "" };
   const errors: FormErrors<FormValues> = { username: "Required" };
   const touched: FormTouched<FormValues> = { username: true };
   ```

3. **API响应转换**：将服务器响应映射为前端模型
   ```typescript
   interface ApiResponse {
     user_id: number;
     user_name: string;
     created_at: string;
   }

   // 转换为驼峰命名
   type ToCamelCase<S extends string> =
     S extends `${infer P}_${infer Q}`
       ? `${P}${Capitalize<ToCamelCase<Q>>}`
       : S;

   type CamelCaseProperties<T> = {
     [K in keyof T as ToCamelCase<string & K>]: T[K];
   };

   // 结果: { userId: number; userName: string; createdAt: string; }
   type UserModel = CamelCaseProperties<ApiResponse>;
   ```

4. **选择性深度递归类型**：根据需要递归处理嵌套属性
   ```typescript
   type DeepReadonlyConditional<T> = {
     readonly [P in keyof T]: T[P] extends object
       ? T[P] extends Function
         ? T[P]  // 不递归处理函数
         : DeepReadonlyConditional<T[P]>
       : T[P];
   };
