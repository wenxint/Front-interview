# DevOps与监控

> DevOps与监控是现代前端工程不可或缺的一部分，它们帮助团队提高开发效率、保障系统稳定和快速响应问题。本文详细介绍前端DevOps实践和系统监控方案。

## 1. 前端DevOps概述

### 1.1 什么是前端DevOps

前端DevOps是将DevOps理念应用到前端开发流程中，通过自动化工具和流程整合开发(Development)和运维(Operations)，实现快速、可靠的产品交付。

**核心价值**：
- 缩短开发周期
- 提高发布频率
- 降低发布风险
- 提升产品质量
- 加速问题修复

### 1.2 前端DevOps工具链

| 阶段 | 工具 | 用途 |
|------|------|------|
| 计划 | Jira, Trello | 需求管理、任务跟踪 |
| 开发 | VS Code, Git | 代码编写、版本控制 |
| 构建 | Webpack, Vite | 代码编译、打包 |
| 测试 | Jest, Cypress | 单元测试、E2E测试 |
| 部署 | Docker, Kubernetes | 容器化、编排 |
| 监控 | Prometheus, Grafana | 性能监控、警报 |

## 2. 前端自动化部署

### 2.1 静态站点部署

**Netlify流水线**:
```yaml
# netlify.toml
[build]
  command = "npm run build"
  publish = "dist"
  
[context.production]
  environment = { NODE_VERSION = "16" }

[context.deploy-preview]
  command = "npm run build:preview"
```

**Vercel部署**:
```json
// vercel.json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": { "distDir": "dist" }
    }
  ],
  "routes": [
    { "handle": "filesystem" },
    { "src": "/.*", "dest": "/index.html" }
  ]
}
```

### 2.2 容器化部署

**Dockerfile**:
```dockerfile
# 构建阶段
FROM node:16-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# 生产阶段
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

**Docker Compose**:
```yaml
# docker-compose.yml
version: '3'
services:
  frontend:
    build: .
    ports:
      - "80:80"
    environment:
      - NODE_ENV=production
    restart: always
```

### 2.3 多环境配置

```javascript
// .env.development
VITE_API_URL=http://dev-api.example.com
VITE_FEATURE_FLAG=true

// .env.production
VITE_API_URL=https://api.example.com
VITE_FEATURE_FLAG=false
```

前端代码中使用：
```javascript
// config.js
export const API_URL = import.meta.env.VITE_API_URL
export const FEATURE_ENABLED = import.meta.env.VITE_FEATURE_FLAG === 'true'
```

## 3. 前端监控体系

### 3.1 性能监控

#### Web Vitals监控

```javascript
// performance-monitoring.js
import { getCLS, getFID, getLCP, getTTFB } from 'web-vitals';

function sendToAnalytics(metric) {
  const body = JSON.stringify({
    name: metric.name,
    value: metric.value,
    id: metric.id,
    page: window.location.pathname
  });
  
  navigator.sendBeacon('/analytics', body);
}

// 监控核心Web指标
getCLS(sendToAnalytics); // 累积布局偏移
getFID(sendToAnalytics); // 首次输入延迟
getLCP(sendToAnalytics); // 最大内容绘制
getTTFB(sendToAnalytics); // 首字节时间
```

#### 性能数据收集

```javascript
// 使用Performance API
function collectPerformanceMetrics() {
  const performanceEntries = performance.getEntriesByType('navigation')[0];
  
  return {
    dnsTime: performanceEntries.domainLookupEnd - performanceEntries.domainLookupStart,
    tcpTime: performanceEntries.connectEnd - performanceEntries.connectStart,
    ttfb: performanceEntries.responseStart - performanceEntries.requestStart,
    domContentLoaded: performanceEntries.domContentLoadedEventEnd - performanceEntries.domContentLoadedEventStart,
    domComplete: performanceEntries.domComplete - performanceEntries.domLoading,
    loadEvent: performanceEntries.loadEventEnd - performanceEntries.loadEventStart,
    totalTime: performanceEntries.loadEventEnd - performanceEntries.startTime
  };
}
```

### 3.2 错误监控

#### 前端错误捕获

```javascript
// error-monitoring.js
class ErrorMonitor {
  constructor() {
    this.init();
  }
  
  init() {
    // 捕获JS错误
    window.addEventListener('error', this.handleError.bind(this));
    
    // 捕获Promise错误
    window.addEventListener('unhandledrejection', this.handleRejection.bind(this));
    
    // 劫持console.error
    const originalConsoleError = console.error;
    console.error = (...args) => {
      this.handleConsoleError(args);
      originalConsoleError.apply(console, args);
    };
  }
  
  handleError(event) {
    const { message, filename, lineno, colno, error } = event;
    this.report({
      type: 'js_error',
      message,
      source: filename,
      lineno,
      colno,
      stack: error?.stack,
      timestamp: new Date().toISOString()
    });
  }
  
  handleRejection(event) {
    this.report({
      type: 'unhandled_promise',
      message: event.reason?.message || String(event.reason),
      stack: event.reason?.stack,
      timestamp: new Date().toISOString()
    });
  }
  
  handleConsoleError(args) {
    this.report({
      type: 'console_error',
      message: args.map(arg => String(arg)).join(' '),
      timestamp: new Date().toISOString()
    });
  }
  
  report(data) {
    // 发送到错误收集服务
    navigator.sendBeacon('/error-collector', JSON.stringify(data));
  }
}

new ErrorMonitor();
```

#### 接入Sentry

```javascript
// sentry-setup.js
import * as Sentry from '@sentry/browser';
import { BrowserTracing } from '@sentry/tracing';

Sentry.init({
  dsn: 'https://your-dsn@sentry.io/project-id',
  integrations: [new BrowserTracing()],
  tracesSampleRate: 1.0,
  environment: process.env.NODE_ENV,
  release: 'my-app@1.0.0',
  beforeSend(event) {
    // 过滤或修改错误事件
    if (event.exception) {
      // 添加用户信息
      event.user = { id: getUserId() };
    }
    return event;
  }
});

// 捕获手动异常
try {
  someRiskyOperation();
} catch (error) {
  Sentry.captureException(error);
}

// 添加自定义上下文
Sentry.configureScope(scope => {
  scope.setTag('feature', 'checkout');
  scope.setUser({ id: '123', email: 'user@example.com' });
});
```

### 3.3 用户行为监控

```javascript
// behavior-tracking.js
class UserBehaviorTracker {
  constructor() {
    this.events = [];
    this.init();
  }
  
  init() {
    // 点击事件
    document.addEventListener('click', this.handleClick.bind(this));
    
    // 页面浏览
    window.addEventListener('popstate', this.handleNavigation.bind(this));
    
    // 表单提交
    document.addEventListener('submit', this.handleFormSubmit.bind(this));
    
    // 定期发送数据
    setInterval(this.sendEvents.bind(this), 10000);
    
    // 页面关闭前发送
    window.addEventListener('beforeunload', this.sendEvents.bind(this));
  }
  
  handleClick(event) {
    const element = event.target;
    const data = {
      type: 'click',
      element: element.tagName,
      id: element.id,
      class: element.className,
      text: element.innerText?.substring(0, 50),
      path: this.getElementPath(element),
      timestamp: new Date().toISOString()
    };
    this.events.push(data);
  }
  
  handleNavigation() {
    this.events.push({
      type: 'navigation',
      url: window.location.href,
      timestamp: new Date().toISOString()
    });
  }
  
  handleFormSubmit(event) {
    const form = event.target;
    this.events.push({
      type: 'form_submit',
      formId: form.id,
      formAction: form.action,
      timestamp: new Date().toISOString()
    });
  }
  
  getElementPath(element) {
    // 简化版元素路径
    const path = [];
    let currentElement = element;
    
    while (currentElement && currentElement !== document.body) {
      let selector = currentElement.tagName.toLowerCase();
      if (currentElement.id) {
        selector += `#${currentElement.id}`;
      } else if (currentElement.className) {
        selector += `.${currentElement.className.split(' ')[0]}`;
      }
      path.unshift(selector);
      currentElement = currentElement.parentElement;
    }
    
    return path.join(' > ');
  }
  
  sendEvents() {
    if (this.events.length === 0) return;
    
    navigator.sendBeacon('/behavior-collector', JSON.stringify({
      events: this.events,
      url: window.location.href,
      userAgent: navigator.userAgent
    }));
    
    this.events = [];
  }
}

new UserBehaviorTracker();
```

## 4. 监控数据可视化

### 4.1 Grafana仪表盘

Grafana是一个流行的开源监控数据可视化工具，可以连接多种数据源。

**Prometheus数据源配置**:
```yaml
# prometheus.yml
scrape_configs:
  - job_name: 'frontend-metrics'
    metrics_path: '/metrics'
    static_configs:
      - targets: ['frontend-service:3000']
```

**Grafana仪表盘JSON**:
```json
{
  "dashboard": {
    "id": null,
    "title": "Frontend Performance Dashboard",
    "panels": [
      {
        "title": "Page Load Time",
        "type": "graph",
        "datasource": "Prometheus",
        "targets": [
          {
            "expr": "frontend_page_load_time_seconds{path='/'}",
            "legendFormat": "Home Page"
          }
        ]
      },
      {
        "title": "JS Errors Count",
        "type": "stat",
        "datasource": "Prometheus",
        "targets": [
          {
            "expr": "sum(increase(frontend_js_errors_total[24h]))",
            "legendFormat": "Errors (24h)"
          }
        ]
      }
    ]
  }
}
```

### 4.2 ELK日志分析

**Logstash配置**:
```
input {
  http {
    port => 8080
    codec => json
  }
}

filter {
  if [type] == "js_error" {
    grok {
      match => { "message" => "%{GREEDYDATA:error_message}" }
    }
    mutate {
      add_field => { "severity" => "error" }
    }
  }
}

output {
  elasticsearch {
    hosts => ["elasticsearch:9200"]
    index => "frontend-logs-%{+YYYY.MM.dd}"
  }
}
```

**Kibana可视化**:
- 错误趋势图：按时间显示错误数量
- 热门错误表格：显示最常见的错误消息
- 地理分布图：显示错误的地理分布
- 用户影响分析：按影响用户数排序错误

## 5. 告警与响应机制

### 5.1 告警配置

**Prometheus告警规则**:
```yaml
# alert.rules.yml
groups:
- name: frontend-alerts
  rules:
  - alert: HighErrorRate
    expr: sum(rate(frontend_js_errors_total[5m])) / sum(rate(frontend_page_views_total[5m])) > 0.05
    for: 1m
    labels:
      severity: critical
    annotations:
      summary: "高错误率告警"
      description: "前端错误率超过5%，当前值: {{ $value }}"

  - alert: SlowPageLoad
    expr: avg(frontend_page_load_time_seconds{quantile="0.95"}) > 3
    for: 5m
    labels:
      severity: warning
    annotations:
      summary: "页面加载缓慢"
      description: "95%的页面加载时间超过3秒，当前值: {{ $value }}秒"
```

**AlertManager配置**:
```yaml
# alertmanager.yml
route:
  group_by: ['alertname', 'severity']
  group_wait: 30s
  group_interval: 5m
  repeat_interval: 1h
  receiver: 'frontend-team'

receivers:
- name: 'frontend-team'
  slack_configs:
  - channel: '#frontend-alerts'
    send_resolved: true
    title: '{{ .GroupLabels.alertname }}'
    text: '{{ .CommonAnnotations.description }}'
  
  email_configs:
  - to: 'frontend-team@example.com'
    send_resolved: true
```

### 5.2 自动修复策略

- **自动重试**：对于网络请求错误，实现指数退避重试
- **资源降级**：当CDN失败时，切换到备用资源
- **特性开关**：自动关闭导致高错误率的功能
- **自动横向扩展**：负载高时增加服务实例

**自动切换CDN示例**:
```javascript
// cdn-failover.js
class CDNFailover {
  constructor(resources) {
    this.resources = resources; // 资源URLs数组：主CDN、备用CDN等
    this.currentIndex = 0;
    this.errorCounts = new Array(resources.length).fill(0);
    this.maxErrors = 3;
  }
  
  getResourceUrl(path) {
    return `${this.resources[this.currentIndex]}${path}`;
  }
  
  reportError() {
    this.errorCounts[this.currentIndex]++;
    
    if (this.errorCounts[this.currentIndex] >= this.maxErrors) {
      this.switchToNextCDN();
    }
  }
  
  switchToNextCDN() {
    this.currentIndex = (this.currentIndex + 1) % this.resources.length;
    console.warn(`切换到备用CDN: ${this.resources[this.currentIndex]}`);
    
    // 通知监控系统
    navigator.sendBeacon('/monitoring/cdn-switch', JSON.stringify({
      from: this.resources[this.currentIndex - 1],
      to: this.resources[this.currentIndex],
      timestamp: new Date().toISOString()
    }));
  }
}

const cdnManager = new CDNFailover([
  'https://main-cdn.example.com',
  'https://backup-cdn.example.com',
  'https://fallback.example.com'
]);

// 使用示例
function loadScript(path) {
  const script = document.createElement('script');
  script.src = cdnManager.getResourceUrl(path);
  script.onerror = () => {
    cdnManager.reportError();
    // 重试加载
    loadScript(path);
  };
  document.head.appendChild(script);
}
```

## 6. DevOps工作流自动化

### 6.1 自动化测试工作流

**GitHub Actions工作流**:
```yaml
# .github/workflows/test.yml
name: Frontend Tests

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main, develop ]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '16'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Lint
      run: npm run lint
    
    - name: Unit tests
      run: npm test -- --coverage
    
    - name: Upload coverage
      uses: codecov/codecov-action@v3
    
    - name: E2E tests
      uses: cypress-io/github-action@v5
      with:
        start: npm start
        wait-on: 'http://localhost:3000'
```

### 6.2 金丝雀发布

**金丝雀部署脚本**:
```javascript
// canary-deploy.js
const k8s = require('@kubernetes/client-node');

async function deployCanary(version, percentage) {
  const kc = new k8s.KubeConfig();
  kc.loadFromDefault();
  
  const appsV1Api = kc.makeApiClient(k8s.AppsV1Api);
  
  // 更新部署配置
  const deployment = {
    spec: {
      strategy: {
        rollingUpdate: {
          maxSurge: percentage + '%',
          maxUnavailable: '0%'
        }
      },
      template: {
        spec: {
          containers: [
            {
              name: 'frontend',
              image: `frontend:${version}`
            }
          ]
        }
      }
    }
  };
  
  await appsV1Api.patchNamespacedDeployment(
    'frontend',
    'default',
    deployment,
    undefined,
    undefined,
    undefined,
    undefined,
    { headers: { 'Content-Type': 'application/strategic-merge-patch+json' } }
  );
  
  console.log(`已部署金丝雀版本 ${version} 至 ${percentage}% 的流量`);
}

// 监控金丝雀健康状况
async function monitorCanary(version, timeoutMinutes = 30) {
  const startTime = Date.now();
  const timeoutMs = timeoutMinutes * 60 * 1000;
  
  while (Date.now() - startTime < timeoutMs) {
    // 检查错误率
    const errorRate = await getErrorRate(version);
    if (errorRate > 0.01) {
      console.error(`金丝雀版本 ${version} 错误率过高: ${errorRate}`);
      return false;
    }
    
    // 检查性能指标
    const p95LoadTime = await getP95LoadTime(version);
    if (p95LoadTime > 3000) {
      console.error(`金丝雀版本 ${version} 加载时间过长: ${p95LoadTime}ms`);
      return false;
    }
    
    await new Promise(resolve => setTimeout(resolve, 60000)); // 每分钟检查一次
  }
  
  console.log(`金丝雀版本 ${version} 监控通过`);
  return true;
}

// 部署流程
async function canaryDeploymentProcess(version) {
  try {
    // 部署到10%流量
    await deployCanary(version, 10);
    
    // 监控30分钟
    const isHealthy = await monitorCanary(version, 30);
    
    if (isHealthy) {
      // 扩展到100%
      await deployCanary(version, 100);
      console.log(`版本 ${version} 已全量发布`);
    } else {
      // 回滚
      await deployCanary('stable', 100);
      console.log(`版本 ${version} 被回滚`);
    }
  } catch (error) {
    console.error('部署过程失败:', error);
    await deployCanary('stable', 100);
  }
}

// 使用示例
canaryDeploymentProcess('v1.2.3');
```

## 7. 面试常见问题

1. **前端DevOps和传统DevOps有什么区别？**
   - 前端DevOps更关注静态资源部署、CDN缓存、浏览器兼容性等
   - 构建过程包括代码压缩、资源优化、预渲染等前端特定步骤
   - 测试包括跨浏览器测试、视觉回归测试等前端特有测试类型
   - 部署可能涉及CDN配置、边缘计算等

2. **如何监控前端性能并提高用户体验？**
   - 使用Web Vitals等核心指标监控真实用户体验
   - 建立性能预算并在CI中强制执行
   - 实现性能降级方案，例如在低端设备上使用简化版UI
   - 针对性能异常设置告警，快速响应问题

3. **前端错误监控的最佳实践是什么？**
   - 全面捕获JavaScript错误、Promise拒绝、资源加载失败
   - 收集上下文信息：用户信息、设备、浏览器、操作步骤
   - 对错误进行分类和去重，避免报告重复问题
   - 建立错误优先级体系，优先修复高影响错误

4. **如何实现前端的灰度发布和A/B测试？**
   - 使用特性标记系统控制功能可见性
   - 基于用户ID或特征进行流量分配
   - 监控关键指标评估新功能表现
   - 建立快速回滚机制应对异常 