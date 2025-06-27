# WebSocket

## 1. WebSocket基本概念

### 1.1 什么是WebSocket？

WebSocket是HTML5提供的一种在单个TCP连接上进行全双工通信的协议。WebSocket通信协议于2011年被IETF定为标准RFC 6455，并由RFC7936补充规范。WebSocket API也被W3C定为标准。

WebSocket使得客户端和服务器之间的数据交换变得更加简单，允许服务端主动向客户端推送数据。在WebSocket API中，浏览器和服务器只需要完成一次握手，两者之间就可以创建持久性的连接，并进行双向数据传输。

### 1.2 为什么需要WebSocket？

在WebSocket出现之前，实现实时通信主要依靠以下技术：

- **轮询（Polling）**：客户端定期向服务器发送HTTP请求，查询是否有新的信息。
- **长轮询（Long Polling）**：客户端向服务器发送请求，服务器保持连接打开直到有新消息，然后发送响应并关闭连接。
- **Server-Sent Events (SSE)**：允许服务器向客户端推送消息，但仍基于HTTP协议，且只支持服务器到客户端的单向通信。

这些方案都有明显的局限性：

1. **HTTP开销大**：HTTP协议设计用于非持久性的请求/响应模式，每次通信都带有完整的头信息。
2. **实时性差**：轮询方式下，要么频繁请求消耗资源，要么延迟较高影响体验。
3. **服务器推送困难**：HTTP主要基于客户端请求，服务器难以主动推送数据。
4. **连接数限制**：浏览器对同一域名的并发HTTP连接数有限制。

WebSocket协议解决了这些问题，提供了一种更优雅的解决方案。

### 1.3 WebSocket的特点

- **全双工通信**：支持客户端和服务器双向实时通信
- **单一TCP连接**：只需一个连接即可实现双向通信，减少连接开销
- **低延迟**：没有HTTP请求的头部开销，数据传输更高效
- **支持二进制数据**：可以发送文本或二进制数据
- **协议标识符**：WebSocket使用`ws://`和`wss://`(安全WebSocket)作为URI方案
- **跨域支持**：WebSocket设计为可以处理网页现有的跨域问题
- **兼容HTTP**：WebSocket连接以HTTP请求开始，便于通过现有的基础设施（代理、过滤、认证）

### 1.4 WebSocket与HTTP的区别

| 特性 | WebSocket | HTTP |
|------|-----------|------|
| 通信方式 | 全双工（双向通信） | 半双工（单向通信） |
| 连接特性 | 持久连接 | 非持久连接（HTTP/1.0）或可复用连接（HTTP/1.1、HTTP/2） |
| 协议开销 | 建立连接后数据包较小 | 每次请求都有完整的头信息 |
| 实时性 | 高（可立即推送） | 低（基于请求/响应） |
| 状态 | 有状态 | 无状态 |
| 数据格式 | 支持文本和二进制 | 主要支持文本，二进制需编码 |
| URL模式 | ws:// 或 wss:// | http:// 或 https:// |

## 2. WebSocket的使用方法

### 2.1 创建WebSocket连接

在客户端JavaScript中创建WebSocket连接非常简单：

```javascript
// 创建一个新的WebSocket连接
const socket = new WebSocket('ws://example.com/socket');

// 使用安全连接
// const socket = new WebSocket('wss://secure.example.com/socket');
```

WebSocket构造函数接受一个必须的URL参数和一个可选的协议参数：

```javascript
// 指定子协议
const socket = new WebSocket('ws://example.com/socket', ['protocol1', 'protocol2']);
```

### 2.2 WebSocket事件

WebSocket API提供了四个主要事件：

```javascript
// 连接建立时触发
socket.onopen = function(event) {
  console.log('WebSocket连接已建立');

  // 连接建立后可以发送数据
  socket.send('Hello Server!');
};

// 接收到消息时触发
socket.onmessage = function(event) {
  console.log('收到消息:', event.data);

  // 处理不同类型的数据
  if (typeof event.data === 'string') {
    console.log('收到字符串消息');
  } else if (event.data instanceof Blob) {
    console.log('收到二进制Blob数据');
    // 处理Blob数据
    const reader = new FileReader();
    reader.onload = function() {
      console.log(reader.result);
    };
    reader.readAsArrayBuffer(event.data);
  } else if (event.data instanceof ArrayBuffer) {
    console.log('收到二进制ArrayBuffer数据');
  }
};

// 连接关闭时触发
socket.onclose = function(event) {
  // event.code表示关闭码
  // event.reason包含服务器提供的关闭原因
  // event.wasClean表示是否是干净地关闭
  console.log(`WebSocket已关闭：代码=${event.code}，原因=${event.reason}，干净关闭=${event.wasClean}`);
};

// 发生错误时触发
socket.onerror = function(error) {
  console.error('WebSocket错误:', error);
};
```

也可以使用EventListener来监听这些事件：

```javascript
socket.addEventListener('open', function(event) {
  console.log('连接已打开');
});

socket.addEventListener('message', function(event) {
  console.log('收到消息:', event.data);
});

socket.addEventListener('close', function(event) {
  console.log('连接已关闭');
});

socket.addEventListener('error', function(event) {
  console.log('发生错误');
});
```

### 2.3 发送数据

WebSocket支持发送文本和二进制数据：

```javascript
// 发送文本数据
socket.send('Hello Server!');

// 发送JSON数据
const data = { message: 'Hello', time: new Date() };
socket.send(JSON.stringify(data));

// 发送二进制数据
const buffer = new ArrayBuffer(8);
const dataView = new DataView(buffer);
dataView.setInt32(0, 123);
dataView.setInt32(4, 456);
socket.send(buffer);

// 发送Blob数据
const blob = new Blob(['Hello Binary World'], { type: 'application/octet-stream' });
socket.send(blob);
```

### 2.4 关闭连接

可以使用close()方法主动关闭WebSocket连接：

```javascript
// 正常关闭
socket.close();

// 使用关闭码和原因
socket.close(1000, '操作完成');

// 常见关闭码:
// 1000 - 正常关闭
// 1001 - 终端离开（如页面关闭）
// 1002 - 协议错误
// 1003 - 不接受收到的数据类型
// 1008 - 违反政策
// 1011 - 服务器遇到未知情况
```

### 2.5 检查连接状态

WebSocket对象的readyState属性表示当前的连接状态：

```javascript
switch (socket.readyState) {
  case WebSocket.CONNECTING: // 0 - 连接正在建立
    console.log('连接中...');
    break;
  case WebSocket.OPEN:       // 1 - 连接已建立，可以通信
    console.log('已连接');
    break;
  case WebSocket.CLOSING:    // 2 - 连接正在关闭
    console.log('关闭中...');
    break;
  case WebSocket.CLOSED:     // 3 - 连接已关闭
    console.log('已关闭');
    break;
}
```

## 3. WebSocket服务器实现

### 3.1 Node.js服务器实现

使用Node.js实现WebSocket服务器通常会使用`ws`库，这是一个流行的WebSocket实现：

```javascript
// 安装: npm install ws

const WebSocket = require('ws');

// 创建WebSocket服务器
const wss = new WebSocket.Server({ port: 8080 });

// 监听连接事件
wss.on('connection', function connection(ws) {
  console.log('客户端已连接');

  // 监听消息事件
  ws.on('message', function incoming(message) {
    console.log('收到消息: %s', message);

    // 向客户端发送回复
    ws.send(`服务器已收到: ${message}`);
  });

  // 发送欢迎消息
  ws.send('欢迎连接到WebSocket服务器！');

  // 监听关闭事件
  ws.on('close', function close() {
    console.log('客户端连接已关闭');
  });
});

console.log('WebSocket服务器运行在端口 8080');
```

### 3.2 与Express集成

WebSocket服务器可以与Express等HTTP服务器集成：

```javascript
const express = require('express');
const http = require('http');
const WebSocket = require('ws');

// 创建Express应用
const app = express();
app.use(express.static('public'));

// 创建HTTP服务器
const server = http.createServer(app);

// 将WebSocket服务器挂载到HTTP服务器
const wss = new WebSocket.Server({ server });

// WebSocket连接处理
wss.on('connection', function connection(ws) {
  console.log('客户端已连接');

  ws.on('message', function incoming(message) {
    console.log('收到: %s', message);

    // 广播消息给所有客户端
    wss.clients.forEach(function each(client) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(`广播: ${message}`);
      }
    });
  });
});

// 启动服务器
server.listen(8080, function() {
  console.log('服务器运行在 http://localhost:8080');
});
```

### 3.3 Python实现

使用Python的`websockets`库也可以简单实现WebSocket服务器：

```python
# 安装: pip install websockets

import asyncio
import websockets

async def echo(websocket, path):
    async for message in websocket:
        print(f"收到消息: {message}")
        await websocket.send(f"服务器已收到: {message}")

async def main():
    # 创建WebSocket服务器
    server = await websockets.serve(echo, "localhost", 8765)
    print("WebSocket服务器运行在 ws://localhost:8765")

    # 保持服务器运行
    await server.wait_closed()

if __name__ == "__main__":
    asyncio.run(main())
```

## 4. WebSocket的实际应用场景

### 4.1 实时通讯

WebSocket最常见的应用是聊天应用和即时消息系统：

```javascript
// 客户端聊天示例
const chatSocket = new WebSocket('ws://example.com/chat');

// 发送消息
document.querySelector('#sendButton').addEventListener('click', () => {
  const messageInput = document.querySelector('#messageInput');
  const message = {
    type: 'chat',
    content: messageInput.value,
    sender: currentUser.id,
    timestamp: new Date().toISOString()
  };

  chatSocket.send(JSON.stringify(message));
  messageInput.value = '';
});

// 接收消息
chatSocket.onmessage = (event) => {
  const message = JSON.parse(event.data);

  if (message.type === 'chat') {
    addMessageToChat(message);
  }
};

function addMessageToChat(message) {
  const chatContainer = document.querySelector('#chatContainer');
  const messageElement = document.createElement('div');
  messageElement.className = message.sender === currentUser.id ? 'my-message' : 'other-message';
  messageElement.textContent = message.content;
  chatContainer.appendChild(messageElement);
  chatContainer.scrollTop = chatContainer.scrollHeight;
}
```

### 4.2 实时数据更新

金融数据、体育比分、监控数据等需要实时更新的应用：

```javascript
// 股票行情示例
const stockSocket = new WebSocket('wss://example.com/stocks');

stockSocket.onopen = () => {
  // 订阅感兴趣的股票
  stockSocket.send(JSON.stringify({
    action: 'subscribe',
    symbols: ['AAPL', 'GOOGL', 'MSFT']
  }));
};

stockSocket.onmessage = (event) => {
  const data = JSON.parse(event.data);

  // 更新UI
  updateStockUI(data);
};

function updateStockUI(data) {
  const stockElement = document.querySelector(`#stock-${data.symbol}`);
  if (stockElement) {
    stockElement.querySelector('.price').textContent = data.price;

    const changeElement = stockElement.querySelector('.change');
    changeElement.textContent = data.change;

    // 根据涨跌设置颜色
    if (data.change > 0) {
      changeElement.className = 'change positive';
    } else if (data.change < 0) {
      changeElement.className = 'change negative';
    } else {
      changeElement.className = 'change neutral';
    }
  }
}
```

### 4.3 协同编辑

多人在线协同编辑文档的应用：

```javascript
// 协同编辑示例
const docSocket = new WebSocket('ws://example.com/document/123');

// 发送编辑操作
editor.on('change', (change) => {
  docSocket.send(JSON.stringify({
    type: 'edit',
    change: change,
    position: editor.getCursor(),
    userId: currentUser.id
  }));
});

// 接收其他用户的编辑
docSocket.onmessage = (event) => {
  const data = JSON.parse(event.data);

  if (data.type === 'edit' && data.userId !== currentUser.id) {
    // 应用其他用户的编辑
    editor.applyChange(data.change);

    // 显示其他用户的光标位置
    showUserCursor(data.userId, data.position);
  }
};
```