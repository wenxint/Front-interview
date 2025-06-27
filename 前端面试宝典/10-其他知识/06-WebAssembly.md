# WebAssembly

## 概念介绍

WebAssembly（简称Wasm）是一种基于二进制格式的低级编程语言，设计目标是在Web浏览器中实现接近原生的执行性能。它作为JavaScript的补充技术存在，允许开发者使用C、C++、Rust等语言编写高性能模块，并通过WebAssembly虚拟机（Wasm VM）在浏览器中运行。

> WebAssembly的出现解决了JavaScript在计算密集型任务（如图形处理、物理模拟）中性能不足的问题，同时保持了与Web平台的深度集成能力<mcreference link="https://webassembly.org/" index="1">1</mcreference>。

## 核心特性

### 1. 高性能

WebAssembly采用紧凑的二进制格式（.wasm），通过消除解释执行开销，其执行速度可接近原生代码。与JavaScript的JIT编译相比，Wasm模块的加载和编译时间更可预测。

### 2. 跨平台兼容性

Wasm字节码遵循统一的规范，可在支持Wasm的浏览器（Chrome、Firefox、Safari、Edge）和Node.js环境中运行，实现"一次编译，到处运行"。

### 3. 与JavaScript深度集成

Wasm模块可通过JavaScript的`WebAssembly`接口（如`WebAssembly.instantiate()`）加载，并与JS共享内存空间（使用`WebAssembly.Memory`），实现双向调用。

### 4. 内存安全

Wasm运行时强制内存访问检查，避免了传统原生语言（如C）中常见的缓冲区溢出等安全问题。

## 实战案例：用Rust编写Wasm模块计算斐波那契数列

### 步骤1：创建Rust项目

```bash
cargo new wasm-fib --lib
cd wasm-fib
```

### 步骤2：修改Cargo.toml

添加Wasm绑定依赖：

```toml
[package]
name = "wasm-fib"
version = "0.1.0"
edition = "2021"

[lib]
type = ["cdylib"]

[dependencies]
wasm-bindgen = "0.2"  # 用于JS与Wasm交互
```

### 步骤3：编写Rust代码（src/lib.rs）

```rust
use wasm_bindgen::prelude::*;

/// 计算第n项斐波那契数列（迭代实现）
#[wasm_bindgen]
pub fn fib(n: u32) -> u32 {
    if n <= 1 { return n; }
    let mut a = 0;
    let mut b = 1;
    for _ in 2..=n {
        let c = a + b;
        a = b;
        b = c;
    }
    b
}
```

### 步骤4：编译为Wasm

```bash
cargo build --target wasm32-unknown-unknown
```

### 步骤5：在JavaScript中调用

```html
<script type="module">
import init, { fib } from './wasm-fib.wasm';

async function run() {
    await init();
    console.log(fib(10));  // 输出55
    console.log(fib(20));  // 输出6765
}
run();
</script>
```

## 兼容性说明

当前主流浏览器对WebAssembly的支持情况如下（截至2024年）：

| 浏览器       | 最低支持版本 | 特性支持情况               |
|--------------|--------------|----------------------------|
| Chrome       | 57+          | 完整支持（包括SIMD、GC）   |
| Firefox      | 52+          | 完整支持                   |
| Safari       | 11+          | 基础支持（部分高级特性待完善）|
| Edge         | 16+          | 完整支持                   |
| Node.js      | 8.0+         | 通过`--experimental-wasm`标志启用|

> 注：最新版浏览器已默认开启所有Wasm特性，包括SIMD（单指令多数据）和GC（垃圾回收）<mcreference link="https://caniuse.com/webassembly" index="2">2</mcreference>。

## 面试常见问题

### 问题1：WebAssembly与JavaScript的主要区别是什么？

**答案**：
- 执行性能：Wasm接近原生代码，JS依赖JIT编译
- 语言类型：Wasm是低级字节码格式，JS是高级动态语言
- 内存管理：Wasm需手动管理线性内存，JS自动垃圾回收
- 适用场景：Wasm适合计算密集型任务，JS适合DOM操作和业务逻辑

### 问题2：如何实现JavaScript与WebAssembly的相互调用？

**答案**：
- JS调用Wasm：通过`WebAssembly.instantiate()`加载模块后，直接调用导出的函数
- Wasm调用JS：在实例化时通过`importObject`注入JS函数供Wasm调用
- 数据传递：基本类型（数值）可直接传递，复杂数据需通过共享内存（`WebAssembly.Memory`）操作

### 问题3：WebAssembly能否完全替代JavaScript？

**答案**：
不能。两者是互补关系而非替代关系：
- Wasm擅长计算密集型任务，但无法直接操作DOM
- JS负责控制流程、事件处理和Web API调用
- 最佳实践是将核心计算逻辑用Wasm实现，通过JS协调业务流程

### 扩展思考

- 如何优化Wasm模块的体积？（提示：使用`wasm-opt`工具压缩、移除调试信息）
- Wasm的线性内存（Linear Memory）有哪些限制？（当前最大为4GB，可通过动态增长调整）
- 如何在Wasm中调用浏览器的WebGL API？（提示：通过`WebAssembly.Memory`共享纹理数据，配合JS桥接）