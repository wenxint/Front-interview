# CI/CD流程

> CI/CD（持续集成/持续交付）是现代前端工程化的重要实践，通过自动化流程提高开发效率和产品质量。本文将详细介绍CI/CD的核心概念、常见工具和实施方法。

## 1. 基本概念

### 1.1 什么是CI/CD

- **持续集成（Continuous Integration，CI）**：
  开发人员频繁地将代码集成到主分支，通过自动化测试验证新代码，尽早发现问题。

- **持续交付（Continuous Delivery，CD）**：
  确保代码随时可以部署到生产环境，但实际部署需要手动触发。

- **持续部署（Continuous Deployment，CD）**：
  自动将通过测试的代码部署到生产环境，无需人工干预。

### 1.2 CI/CD的好处

1. **提早发现问题**：集成测试尽早发现问题，降低修复成本
2. **减少手动操作**：自动化流程减少人为错误
3. **加快交付速度**：自动化部署缩短发布周期
4. **提高代码质量**：强制执行代码审查和测试标准
5. **促进团队协作**：提供统一的开发流程和环境

## 2. CI/CD工具对比

### 2.1 主流CI/CD工具

| 工具 | 特点 | 适用场景 |
|------|------|---------|
| **GitHub Actions** | 与GitHub深度集成，配置简单 | GitHub项目，各类前端应用 |
| **GitLab CI/CD** | 与GitLab集成，功能完善 | GitLab项目，需要完整DevOps流程 |
| **Jenkins** | 高度可定制，插件丰富 | 企业级应用，复杂部署场景 |
| **CircleCI** | 易用，配置简单，扩展性好 | 中小型项目，快速构建 |
| **Travis CI** | 配置简单，公开项目免费 | 开源项目，社区应用 |
| **Azure DevOps** | 与微软生态系统集成 | 企业级应用，微软技术栈 |

### 2.2 选择合适的工具

选择CI/CD工具时，考虑以下因素：

1. **代码托管平台**：与现有代码托管的集成度
2. **团队规模**：工具的学习曲线和协作特性
3. **项目复杂度**：所需的自定义能力和扩展性
4. **预算**：开源或商业解决方案的成本考量
5. **生态系统**：与现有工具链的兼容性

## 3. GitHub Actions详解

GitHub Actions是目前最流行的CI/CD工具之一，特别适合前端项目。

### 3.1 基本概念

- **工作流（Workflow）**：自动化过程，由一个或多个作业组成
- **事件（Event）**：触发工作流的行为（如push、PR）
- **作业（Job）**：在同一运行器上执行的一组步骤
- **步骤（Step）**：可执行命令或动作
- **动作（Action）**：可重用的命令单元
- **运行器（Runner）**：执行工作流的服务器

### 3.2 基本配置

**.github/workflows/ci.yml**:
```yaml
name: CI

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build-and-test:
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
    
    - name: Test
      run: npm test
    
    - name: Build
      run: npm run build
```

### 3.3 高级配置

**.github/workflows/cd.yml**:
```yaml
name: CD

on:
  push:
    branches: [ main ]

jobs:
  deploy:
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
    
    - name: Build
      run: npm run build
    
    - name: Deploy to Production
      uses: peaceiris/actions-gh-pages@v3
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./dist
    
    - name: Notify Slack
      uses: 8398a7/action-slack@v3
      with:
        status: ${{ job.status }}
        fields: repo,message,commit,author,action,eventName,ref,workflow
      env:
        SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK_URL }}
      if: always()
```

## 4. GitLab CI/CD详解

### 4.1 基本配置

**.gitlab-ci.yml**:
```yaml
stages:
  - build
  - test
  - deploy

cache:
  paths:
    - node_modules/

build:
  stage: build
  image: node:16
  script:
    - npm ci
    - npm run build
  artifacts:
    paths:
      - dist/

test:
  stage: test
  image: node:16
  script:
    - npm ci
    - npm run lint
    - npm test

deploy:
  stage: deploy
  image: node:16
  script:
    - npm install -g firebase-tools
    - firebase deploy --token $FIREBASE_TOKEN
  only:
    - main
```

### 4.2 环境变量与机密

在GitLab中管理敏感信息：

1. **项目设置**：
   Settings > CI/CD > Variables

2. **常见变量类型**：
   - `API_KEY`：第三方服务访问令牌
   - `DEPLOY_KEY`：部署服务器密钥
   - `DATABASE_URL`：数据库连接信息

3. **变量属性**：
   - Protected：只在受保护分支上可用
   - Masked：在日志中隐藏值

## 5. 前端部署策略

### 5.1 静态站点部署

```yaml
# GitHub Pages部署
- name: Deploy to GitHub Pages
  uses: peaceiris/actions-gh-pages@v3
  with:
    github_token: ${{ secrets.GITHUB_TOKEN }}
    publish_dir: ./dist

# Netlify部署
- name: Deploy to Netlify
  uses: netlify/actions/cli@master
  with:
    args: deploy --prod
  env:
    NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
    NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}

# Vercel部署
- name: Deploy to Vercel
  uses: amondnet/vercel-action@v20
  with:
    vercel-token: ${{ secrets.VERCEL_TOKEN }}
    vercel-org-id: ${{ secrets.ORG_ID }}
    vercel-project-id: ${{ secrets.PROJECT_ID }}
    vercel-args: '--prod'
```

### 5.2 容器化部署

```yaml
# Docker构建与推送
- name: Set up Docker Buildx
  uses: docker/setup-buildx-action@v1

- name: Login to DockerHub
  uses: docker/login-action@v1
  with:
    username: ${{ secrets.DOCKERHUB_USERNAME }}
    password: ${{ secrets.DOCKERHUB_TOKEN }}

- name: Build and push Docker image
  uses: docker/build-push-action@v2
  with:
    context: .
    push: true
    tags: username/app-name:latest
```

### 5.3 云服务部署

```yaml
# AWS S3部署
- name: Deploy to AWS S3
  uses: jakejarvis/s3-sync-action@master
  with:
    args: --acl public-read --follow-symlinks --delete
  env:
    AWS_S3_BUCKET: ${{ secrets.AWS_S3_BUCKET }}
    AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
    AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
    SOURCE_DIR: './dist'

# 阿里云OSS部署
- name: Deploy to Aliyun OSS
  uses: manyuanrong/setup-ossutil@v2.0
  with:
    endpoint: oss-cn-hangzhou.aliyuncs.com
    access-key-id: ${{ secrets.ALIYUN_ACCESS_KEY_ID }}
    access-key-secret: ${{ secrets.ALIYUN_ACCESS_KEY_SECRET }}
- run: ossutil cp -rf ./dist oss://your-bucket-name/
```

## 6. 自动化测试集成

### 6.1 单元测试与代码覆盖率

```yaml
- name: Run tests with coverage
  run: npm test -- --coverage

- name: Upload coverage to Codecov
  uses: codecov/codecov-action@v2
  with:
    token: ${{ secrets.CODECOV_TOKEN }}
    directory: ./coverage
    fail_ci_if_error: true
```

### 6.2 端到端测试

```yaml
# Cypress测试
- name: Cypress tests
  uses: cypress-io/github-action@v2
  with:
    build: npm run build
    start: npm start
    wait-on: 'http://localhost:3000'
    browser: chrome
    headless: true

# Playwright测试
- name: Install Playwright
  run: npx playwright install --with-deps

- name: Run Playwright tests
  run: npx playwright test
```

### 6.3 性能测试

```yaml
- name: Lighthouse CI
  uses: treosh/lighthouse-ci-action@v8
  with:
    urls: |
      https://example.com/
      https://example.com/about
    uploadArtifacts: true
    temporaryPublicStorage: true
```

## 7. 高级CI/CD实践

### 7.1 分支策略与工作流

**Git Flow工作流**：
- `main`：稳定的生产代码
- `develop`：开发分支
- `feature/*`：功能分支
- `release/*`：发布准备分支
- `hotfix/*`：紧急修复分支

**GitHub Flow工作流**：
- `main`：始终可部署
- 功能分支：直接从main创建
- PR审查：合并前进行代码审查
- 合并后自动部署：通过CI/CD自动部署

### 7.2 灰度发布与A/B测试

**灰度发布配置**：
```yaml
- name: Deploy to Staging
  if: github.event_name == 'pull_request'
  run: |
    # 部署到临时环境
    npm run deploy:staging

- name: Deploy Canary Release
  if: github.ref == 'refs/heads/main'
  run: |
    # 部署到10%的用户
    DEPLOY_PERCENTAGE=10 npm run deploy:canary

- name: Promote to Production
  if: github.ref == 'refs/heads/main'
  run: |
    # 等待验证后全量部署
    npm run deploy:production
```

### 7.3 自动化版本管理

```yaml
- name: Semantic Release
  uses: semantic-release/semantic-release@v18
  env:
    GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
    NPM_TOKEN: ${{ secrets.NPM_TOKEN }}
```

## 8. CI/CD最佳实践

### 8.1 安全最佳实践

1. **依赖扫描**：
```yaml
- name: Security scan
  uses: snyk/actions/node@master
  with:
    args: --severity-threshold=high
  env:
    SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}
```

2. **密钥管理**：
   - 使用仓库密钥存储敏感信息
   - 定期轮换密钥
   - 限制密钥访问权限

3. **镜像扫描**：
```yaml
- name: Scan Docker image
  uses: aquasecurity/trivy-action@master
  with:
    image-ref: 'your-image:latest'
    format: 'table'
    exit-code: '1'
    severity: 'CRITICAL,HIGH'
```

### 8.2 优化构建速度

1. **缓存依赖**：
```yaml
- name: Cache dependencies
  uses: actions/cache@v3
  with:
    path: |
      **/node_modules
      ~/.npm
    key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}
    restore-keys: |
      ${{ runner.os }}-node-
```

2. **并行作业**：
```yaml
jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: npm run lint

  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: npm test

  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: npm run build
```

3. **矩阵构建**：
```yaml
jobs:
  test:
    runs-on: ${{ matrix.os }}
    strategy:
      matrix:
        os: [ubuntu-latest, windows-latest]
        node-version: [14, 16, 18]
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: ${{ matrix.node-version }}
      - run: npm test
```

### 8.3 监控与通知

1. **状态通知**：
```yaml
- name: Slack Notification
  uses: rtCamp/action-slack-notify@v2
  env:
    SLACK_WEBHOOK: ${{ secrets.SLACK_WEBHOOK }}
    SLACK_CHANNEL: ci-cd
    SLACK_TITLE: Deployment Status
    SLACK_MESSAGE: 'Application deployed successfully :rocket:'
    SLACK_COLOR: ${{ job.status }}
```

2. **部署跟踪**：
```yaml
- name: Create Deployment
  uses: chrnorm/deployment-action@v1
  with:
    token: ${{ secrets.GITHUB_TOKEN }}
    environment: production
    
- name: Update Deployment Status
  uses: chrnorm/deployment-status@v1
  with:
    token: ${{ secrets.GITHUB_TOKEN }}
    state: "success"
    deployment_id: ${{ steps.deployment.outputs.deployment_id }}
```

## 9. 面试常见问题

1. **CI/CD的主要优势是什么？**
   - 自动化减少手动错误
   - 加速开发和部署周期
   - 提高代码质量和团队协作
   - 实现快速反馈和迭代

2. **你如何处理CI/CD流程中的敏感信息？**
   - 使用仓库提供的密钥管理
   - 环境变量加密存储
   - 权限最小化原则
   - 避免在代码或日志中暴露密钥

3. **如何实现蓝绿部署？**
   ```yaml
   - name: Deploy Blue Environment
     run: |
       # 部署到蓝环境
       npm run deploy:blue
       
   - name: Test Blue Environment
     run: |
       # 测试蓝环境
       npm run test:e2e -- --url=https://blue.example.com
       
   - name: Switch Traffic
     run: |
       # 将流量从绿环境切换到蓝环境
       aws cloudfront update-distribution --id ${{ secrets.CF_DIST_ID }} --routing-config...
   ```

4. **如何确保CI/CD流程的可靠性？**
   - 自测试流程（测试你的CI/CD配置）
   - 环境一致性（开发、测试、生产保持一致）
   - 回滚策略（快速恢复机制）
   - 定期审查和优化CI/CD配置
