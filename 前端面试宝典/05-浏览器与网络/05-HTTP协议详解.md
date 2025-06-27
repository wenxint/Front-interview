# HTTP协议详解

> HTTP（超文本传输协议）是互联网的基础通信协议，用于在Web浏览器和服务器之间传输数据。掌握HTTP协议对前端开发者而言至关重要，它是理解网络通信、性能优化和安全问题的基础。

## HTTP协议的发展历程

### HTTP/0.9（1991年）

- 极其简单的协议，只支持GET方法
- 没有HTTP头部和状态码
- 只能传输HTML文档
- 每次请求后连接就会关闭

示例请求：
```
GET /index.html
```

### HTTP/1.0（1996年）

- 引入了HTTP头部信息
- 添加了状态码
- 支持多种文档类型（MIME类型）
- 支持POST和HEAD方法
- 仍然是非持久连接，每个请求都要建立新的TCP连接

示例请求：
```
GET /index.html HTTP/1.0
User-Agent: Mozilla/5.0
Accept: text/html
```

### HTTP/1.1（1997年）

- 持久连接，默认开启Keep-Alive
- 管道化请求（Pipelining）
- 添加了PUT、DELETE、OPTIONS、TRACE等方法
- 支持虚拟主机（Host头部）
- 支持断点续传
- 增强的缓存机制（更多的缓存控制头部）

示例请求：
```
GET /index.html HTTP/1.1
Host: www.example.com
User-Agent: Mozilla/5.0
Accept: text/html,application/xhtml+xml
```

### HTTP/2（2015年）

- 二进制分帧
- 多路复用（解决队头阻塞问题）
- 头部压缩（HPACK算法）
- 服务器推送
- 请求优先级

### HTTP/3（2022年）

- 基于QUIC协议而非TCP
- 改进的连接建立过程（0-RTT）
- 更好的丢包恢复
- 连接迁移支持

## HTTP消息结构

### 请求报文

HTTP请求由以下部分组成：

1. **请求行**：包含HTTP方法、请求URL和HTTP协议版本
2. **请求头部**：包含客户端信息和请求参数
3. **空行**：区分头部和主体
4. **请求主体**（可选）：包含请求的数据，如POST表单数据

示例：
```http
POST /api/users HTTP/1.1
Host: example.com
Content-Type: application/json
Content-Length: 32
Accept: application/json

{"username":"john","age":30}
```

### 响应报文

HTTP响应由以下部分组成：

1. **状态行**：包含HTTP协议版本、状态码和状态描述
2. **响应头部**：包含服务器信息和响应参数
3. **空行**：区分头部和主体
4. **响应主体**（可选）：包含响应的数据

示例：
```http
HTTP/1.1 200 OK
Date: Mon, 23 May 2023 22:38:34 GMT
Content-Type: application/json
Content-Length: 27
Server: nginx/1.18.0

{"id":123,"status":"success"}
```

## HTTP方法（动词）

### GET

- 从服务器获取指定资源
- 请求参数包含在URL中
- 不应该用于修改服务器上的数据
- 幂等方法（多次请求结果相同）

### POST

- 向服务器提交数据，通常用于创建资源
- 数据包含在请求主体中
- 非幂等方法（重复请求可能产生不同结果）
- 不会被缓存

### PUT

- 更新服务器上的资源
- 如果资源不存在则创建
- 具有幂等性
- 请求主体包含完整的资源表示

### DELETE

- 删除服务器上的指定资源
- 具有幂等性

### HEAD

- 类似于GET，但服务器只返回头部，不返回主体
- 常用于检查资源是否存在或已修改
- 减少带宽消耗

### OPTIONS

- 获取服务器支持的HTTP方法
- 用于CORS预检请求
- 检查服务器功能

### PATCH

- 对资源进行部分更新
- 与PUT不同，主体只包含需要更新的部分
- 通常非幂等

### TRACE

- 用于诊断，回显服务器收到的请求
- 用于测试或诊断目的
- 存在安全风险，生产环境通常禁用

### CONNECT

- 建立网络连接，如用于HTTPS的隧道
- 用于代理服务器

## HTTP状态码

### 1xx - 信息响应

- **100 Continue**：请求的初始部分已被服务器接收，客户端应继续发送剩余部分
- **101 Switching Protocols**：服务器同意切换协议，如升级到WebSocket

### 2xx - 成功响应

- **200 OK**：请求成功
- **201 Created**：请求成功并创建了新资源
- **204 No Content**：请求成功但没有返回内容
- **206 Partial Content**：返回部分内容，用于断点续传

### 3xx - 重定向

- **301 Moved Permanently**：资源永久移动到新位置
- **302 Found**：资源临时移动到新位置
- **304 Not Modified**：资源未修改，可使用缓存
- **307 Temporary Redirect**：临时重定向，不改变请求方法
- **308 Permanent Redirect**：永久重定向，不改变请求方法

### 4xx - 客户端错误

- **400 Bad Request**：服务器无法理解请求
- **401 Unauthorized**：需要身份验证
- **403 Forbidden**：服务器拒绝请求
- **404 Not Found**：资源不存在
- **405 Method Not Allowed**：不允许的请求方法
- **409 Conflict**：请求冲突
- **413 Payload Too Large**：请求实体过大
- **414 URI Too Long**：请求的URI过长
- **429 Too Many Requests**：请求过于频繁

### 5xx - 服务器错误

- **500 Internal Server Error**：服务器内部错误
- **501 Not Implemented**：服务器不支持请求的功能
- **502 Bad Gateway**：网关错误
- **503 Service Unavailable**：服务暂时不可用
- **504 Gateway Timeout**：网关超时

## 常用HTTP头部

### 通用头部

- **Date**：消息生成的日期和时间
- **Connection**：连接管理（Keep-Alive, close）
- **Cache-Control**：缓存指令
- **Transfer-Encoding**：指定主体编码方式

### 请求头部

- **Host**：请求的主机名（虚拟主机）
- **User-Agent**：客户端类型信息
- **Accept**：客户端能接受的响应内容类型
- **Accept-Language**：客户端语言偏好
- **Accept-Encoding**：客户端支持的压缩算法
- **Authorization**：身份验证凭证
- **Cookie**：客户端存储的Cookie
- **Referer**：请求来源页面
- **Origin**：跨域请求的来源
- **If-Modified-Since**：条件请求，检查资源是否修改

### 响应头部

- **Server**：服务器软件信息
- **Set-Cookie**：设置客户端Cookie
- **Location**：重定向目标URL
- **WWW-Authenticate**：身份验证方式
- **Access-Control-Allow-Origin**：CORS头部，指定允许跨域访问的域
- **Content-Disposition**：建议客户端以何种方式处理内容（内联或附件）

### 实体头部

- **Content-Type**：内容的MIME类型
- **Content-Length**：内容长度（字节）
- **Content-Encoding**：内容的编码方式（gzip等）
- **Content-Language**：内容的语言
- **Expires**：内容的过期时间
- **Last-Modified**：资源最后修改时间
- **ETag**：资源的唯一标识符

## HTTP的无状态性与Cookie

HTTP协议本身是无状态的，这意味着服务器不会在不同的请求之间保留任何信息。为了实现状态管理，引入了Cookie机制：

### Cookie工作原理

1. 服务器通过Set-Cookie响应头向客户端发送Cookie
2. 客户端保存Cookie
3. 客户端在后续请求中通过Cookie请求头发送Cookie
4. 服务器根据Cookie识别客户端

示例：
```http
// 服务器响应
HTTP/1.1 200 OK
Set-Cookie: sessionId=abc123; Path=/; HttpOnly; Secure; SameSite=Strict
Content-Type: text/html

// 后续客户端请求
GET /profile HTTP/1.1
Host: example.com
Cookie: sessionId=abc123
```

### Cookie属性

- **HttpOnly**：防止JavaScript通过document.cookie访问
- **Secure**：仅通过HTTPS发送
- **SameSite**：控制跨站发送（None, Lax, Strict）
- **Expires/Max-Age**：Cookie的过期时间
- **Domain**：Cookie所属的域
- **Path**：Cookie适用的路径

## HTTP请求与响应实例分析

### 完整请求实例

```http
POST /api/login HTTP/1.1
Host: example.com
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36
Accept: application/json
Content-Type: application/json
Content-Length: 51
Origin: https://example.com
Referer: https://example.com/login
Cookie: tracking_id=123456

{"username":"johndoe","password":"encrypted_password"}
```

### 完整响应实例

```http
HTTP/1.1 200 OK
Date: Wed, 24 May 2023 10:15:30 GMT
Server: nginx/1.18.0
Content-Type: application/json
Content-Length: 218
Set-Cookie: session=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9; Path=/; HttpOnly; Secure
Cache-Control: no-store
X-Content-Type-Options: nosniff
Strict-Transport-Security: max-age=31536000; includeSubDomains

{
  "status": "success",
  "user": {
    "id": 42,
    "username": "johndoe",
    "email": "john@example.com",
    "role": "user"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI0MiIsIm5hbWUiOiJqb2huZG9lIn0"
}
```

## HTTP请求参数的传递方式

### URL参数

- 附加在URL中，跟在?后面
- 格式：`key1=value1&key2=value2`
- 适合简单、非敏感的数据
- 长度有限制（浏览器和服务器限制）
- 自动进行URL编码（encodeURIComponent）

```javascript
// 前端发送请求
fetch('https://api.example.com/search?query=javascript&page=1')
  .then(response => response.json())
  .then(data => console.log(data));
```

### 请求主体

#### 表单数据（application/x-www-form-urlencoded）

- 与URL参数格式相同，但在请求主体中
- 默认HTML表单提交格式

```javascript
// 前端发送请求
const formData = new URLSearchParams();
formData.append('username', 'john');
formData.append('password', 'secret');

fetch('https://api.example.com/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  },
  body: formData
});
```

#### JSON数据（application/json）

- 使用JSON格式传递复杂数据结构
- 现代API的常用格式

```javascript
// 前端发送请求
fetch('https://api.example.com/users', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    username: 'john',
    email: 'john@example.com',
    age: 30
  })
});
```

#### 多部分表单数据（multipart/form-data）

- 用于上传文件和混合数据
- 支持二进制数据传输

```javascript
// 前端发送请求
const formData = new FormData();
formData.append('username', 'john');
formData.append('avatar', fileInput.files[0]);

fetch('https://api.example.com/profile', {
  method: 'POST',
  body: formData
  // 注意：不需要手动设置Content-Type，浏览器会自动添加正确的边界
});
```

### HTTP头部

- 适合传递元数据和认证信息
- 不适合传递大量数据

```javascript
// 前端发送请求
fetch('https://api.example.com/protected-resource', {
  headers: {
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
    'X-API-Key': 'abcd1234',
    'Accept-Language': 'zh-CN'
  }
});
```

## HTTP连接管理

### 非持久连接（HTTP/1.0）

- 每个请求/响应对都需要单独的TCP连接
- 连接完成后立即关闭
- 服务器资源消耗小
- 网络效率低（频繁TCP握手）

### 持久连接（HTTP/1.1）

- 默认开启Keep-Alive
- 在一个TCP连接上发送多个请求/响应
- 减少TCP握手次数
- 可通过Connection: close关闭

```http
HTTP/1.1 200 OK
Connection: keep-alive
Keep-Alive: timeout=5, max=1000
```

### HTTP管道化（Pipelining）

- 允许在收到前一个响应之前发送下一个请求
- 仅部分实现，存在队头阻塞问题
- 现代浏览器默认禁用

### 多路复用（HTTP/2）

- 在单个TCP连接上并行处理多个请求
- 无需按顺序等待响应
- 解决了队头阻塞问题
- 显著提高性能

## 内容协商

内容协商允许客户端和服务器选择最合适的内容表示形式：

### 基于请求头部的协商

- **Accept**：媒体类型偏好
- **Accept-Language**：语言偏好
- **Accept-Encoding**：压缩算法偏好
- **Accept-Charset**：字符集偏好

### 服务器响应

- **Content-Type**：选择的媒体类型
- **Content-Language**：选择的语言
- **Content-Encoding**：选择的压缩方式
- **Vary**：列出用于内容协商的请求头部

示例：
```http
// 请求
GET /article/123 HTTP/1.1
Host: example.com
Accept-Language: zh-CN, zh;q=0.9, en;q=0.8
Accept: text/html, application/xhtml+xml

// 响应
HTTP/1.1 200 OK
Content-Type: text/html; charset=UTF-8
Content-Language: zh-CN
Vary: Accept-Language
```

## 缓存控制

HTTP提供了丰富的缓存控制机制，请参见"浏览器缓存机制"章节了解更多详情。

主要头部：
- **Cache-Control**
- **ETag**
- **Last-Modified**
- **If-None-Match**
- **If-Modified-Since**

## HTTP安全

### 常见HTTP安全头部

- **Strict-Transport-Security (HSTS)**：强制使用HTTPS
- **Content-Security-Policy (CSP)**：限制资源加载和脚本执行
- **X-Content-Type-Options: nosniff**：禁止MIME类型嗅探
- **X-Frame-Options**：控制页面是否可被嵌入iframe
- **X-XSS-Protection**：启用浏览器XSS过滤器
- **Referrer-Policy**：控制Referer头部的发送策略

## 面试常见问题

### 1. POST和GET有什么区别？

回答：
- **数据传输**：GET通过URL参数传输数据，POST通过请求主体传输
- **数据大小**：GET有URL长度限制，POST理论上无限制
- **安全性**：GET参数在URL中可见且可能被记录，POST数据在请求主体中相对安全
- **缓存**：GET请求可被缓存，POST通常不被缓存
- **幂等性**：GET是幂等的（多次请求结果相同），POST非幂等
- **书签**：GET请求可以被收藏为书签，POST不可以
- **浏览器历史**：GET请求参数保留在浏览器历史中，POST不会
- **编码类型**：GET只支持URL编码，POST支持多种编码类型
- **用途**：GET用于获取数据，POST用于提交数据

### 2. HTTP/1.1和HTTP/2有什么主要区别？

回答：
- HTTP/2采用二进制分帧层，而非HTTP/1.1的文本格式
- HTTP/2支持多路复用，可在单个TCP连接上并行处理多个请求/响应
- HTTP/2实现了头部压缩（HPACK算法），减少传输数据量
- HTTP/2支持服务器推送，服务器可主动向客户端推送相关资源
- HTTP/2支持请求优先级，优化资源加载顺序
- HTTP/2对连接数量的要求降低，单个连接的利用率更高

### 3. 什么是RESTful API？

回答：
REST（表述性状态转移）是一种API设计风格，RESTful API遵循以下原则：
- 使用HTTP方法表示操作（GET获取、POST创建、PUT更新、DELETE删除）
- 资源由URL唯一标识
- 无状态交互（服务器不保存客户端状态）
- 支持缓存（通过HTTP缓存机制）
- 统一接口（一致的资源操作方式）
- 分层系统（客户端无法区分直接连接服务器还是中间层）

例如：
- GET /users：获取用户列表
- GET /users/123：获取特定用户
- POST /users：创建新用户
- PUT /users/123：更新特定用户
- DELETE /users/123：删除特定用户

### 4. 如何处理CORS（跨域资源共享）问题？

回答：
CORS是一种机制，允许不同源的网页向API发起请求。浏览器通过预检请求和特定HTTP头部实现CORS。

服务器端实现CORS：
- 设置`Access-Control-Allow-Origin`头部指定允许访问的源
- 对于预检请求（OPTIONS方法），设置`Access-Control-Allow-Methods`和`Access-Control-Allow-Headers`
- 如需发送Cookie，设置`Access-Control-Allow-Credentials: true`
- 设置`Access-Control-Max-Age`缓存预检请求结果

前端处理：
- 使用`fetch`或`XMLHttpRequest`时设置`credentials`选项
- 确保请求符合CORS规范（如不能自定义某些头部）

### 5. HTTP状态码401和403有什么区别？

回答：
- **401 Unauthorized**：表示"未授权"，客户端需要进行身份验证。服务器不知道客户端是谁，需要提供有效凭证。通常伴随`WWW-Authenticate`头部，指示身份验证方式。
- **403 Forbidden**：表示"禁止访问"，服务器理解请求但拒绝执行。服务器知道客户端是谁，但该客户端没有访问资源的权限。

简而言之：401是"我不认识你，请先身份验证"，403是"我认识你，但你没有权限"。

### 6. `Cookie`和`Authorization`头在认证中的主要区别是什么？

回答：
- **存储位置**：Cookie存储在客户端浏览器（通过`Set-Cookie`响应头写入），而`Authorization`头通常存储在前端代码中（如`localStorage`或`sessionStorage`），通过手动添加到请求头。
- **自动携带**：Cookie会被浏览器自动附加到同源请求中（受`SameSite`属性限制）；`Authorization`头需要前端显式设置（如通过`axios`的`headers`配置）。
- **安全性**：Cookie易受CSRF攻击（需配合`SameSite=Strict`或CSRF令牌防护）；`Authorization`头（如JWT）通常通过`Bearer`方案传输，需配合HTTPS避免中间人攻击。
- **作用范围**：Cookie可用于跨多个请求的长期会话管理（如用户登录状态）；`Authorization`头更适合短期、敏感的API访问（如访问受保护资源）。
- **大小限制**：Cookie有严格的大小限制（通常4KB）；`Authorization`头的大小限制由服务器配置决定，适合传输较长的令牌（如JWT）。