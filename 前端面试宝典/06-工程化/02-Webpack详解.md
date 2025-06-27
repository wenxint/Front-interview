# Webpack详解

> Webpack是前端开发中最流行的模块打包工具之一，它可以将众多模块按照依赖关系打包成静态资源，在大型前端项目中扮演着至关重要的角色。深入理解Webpack的工作原理和配置技巧，是每位前端工程师必备的技能。

## 1. Webpack核心概念深度解析

### 1.1 什么是Webpack

Webpack是一个现代JavaScript应用程序的静态模块打包器(module bundler)。当Webpack处理应用程序时，会递归地构建一个依赖关系图(dependency graph)，其中包含应用程序需要的每个模块，然后将所有这些模块打包成一个或多个bundle。

**Webpack的核心价值**：
- **模块化支持**：支持ES6模块、CommonJS、AMD等多种模块规范
- **代码转换**：通过loader将各种资源转换为JavaScript模块
- **依赖管理**：自动分析和管理模块间的依赖关系
- **代码优化**：提供压缩、Tree Shaking、代码分割等优化策略
- **开发体验**：热模块替换(HMR)、source map等开发调试功能

**Webpack工作流程示意**：
```
源码文件 → Entry Point → 依赖分析 → Loader处理 → Plugin优化 → Bundle输出
   ↓           ↓          ↓         ↓         ↓         ↓
index.js → webpack → dependency → transform → optimize → dist/
style.css            graph        to JS       code      bundle.js
image.png                                                bundle.css
```

### 1.2 核心概念详解

#### 1.2.1 入口(Entry) - 构建的起点

入口是Webpack构建依赖图的起始点，告诉Webpack从哪里开始，并根据依赖关系确定需要打包的内容。

**单入口配置**：
```javascript
module.exports = {
  entry: './src/index.js'
};
```

**多入口配置（适用于多页应用）**：
```javascript
module.exports = {
  entry: {
    app: './src/app.js',
    admin: './src/admin.js',
    vendor: ['react', 'react-dom'] // 第三方库单独打包
  }
};
```

**动态入口配置**：
```javascript
module.exports = {
  entry: () => {
    return {
      app: './src/app.js',
      admin: './src/admin.js'
    };
  }
};
```

**入口依赖注入**：
```javascript
module.exports = {
  entry: {
    app: {
      import: './src/app.js',
      dependOn: 'shared' // 依赖shared chunk
    },
    admin: {
      import: './src/admin.js',
      dependOn: 'shared'
    },
    shared: ['react', 'react-dom']
  }
};
```

#### 1.2.2 输出(Output) - 控制bundle的生成

Output指定了如何输出编译后的文件，包括文件名、路径等配置。

**基础输出配置**：
```javascript
const path = require('path');

module.exports = {
  output: {
    path: path.resolve(__dirname, 'dist'), // 输出目录的绝对路径
    filename: 'bundle.js', // 输出文件名
    clean: true // 构建前清理输出目录
  }
};
```

**多入口输出配置**：
```javascript
module.exports = {
  entry: {
    app: './src/app.js',
    admin: './src/admin.js'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[contenthash].js', // [name]会被替换为chunk名称
    chunkFilename: '[name].[contenthash].chunk.js' // 非入口chunk的文件名
  }
};
```

**高级输出配置**：
```javascript
module.exports = {
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[contenthash:8].js',
    publicPath: '/assets/', // 资源的公共路径
    library: 'MyLibrary', // 暴露库的名称
    libraryTarget: 'umd', // 库的暴露方式
    globalObject: 'this', // 全局对象
    hashFunction: 'sha256', // 哈希函数
    hashDigestLength: 20 // 哈希摘要长度
  }
};
```

**输出文件名占位符详解**：
- `[name]`：chunk的名称
- `[id]`：chunk的id
- `[hash]`：每次构建生成的hash
- `[chunkhash]`：根据chunk内容生成的hash
- `[contenthash]`：根据文件内容生成的hash（推荐用于缓存）
- `[ext]`：文件扩展名
- `[query]`：查询字符串

#### 1.2.3 加载器(Loaders) - 转换文件的工具

Loader让Webpack能够处理非JavaScript文件，将它们转换为有效的模块。

**Loader的执行特点**：
- **从右到左**：loader链从右到左执行
- **链式调用**：前一个loader的输出作为下一个loader的输入
- **异步支持**：loader可以是同步的也可以是异步的

**常用Loader配置示例**：
```javascript
module.exports = {
  module: {
    rules: [
      // JavaScript/TypeScript处理
      {
        test: /\.(js|jsx|ts|tsx)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: [
                ['@babel/preset-env', {
                  targets: {
                    browsers: ['> 1%', 'last 2 versions']
                  },
                  useBuiltIns: 'usage',
                  corejs: 3
                }],
                '@babel/preset-react',
                '@babel/preset-typescript'
              ],
              plugins: [
                '@babel/plugin-proposal-class-properties',
                '@babel/plugin-syntax-dynamic-import'
              ],
              cacheDirectory: true // 启用缓存
            }
          }
        ]
      },

      // CSS处理链
      {
        test: /\.css$/,
        use: [
          process.env.NODE_ENV === 'production'
            ? MiniCssExtractPlugin.loader
            : 'style-loader', // 开发环境注入DOM，生产环境提取文件
          {
            loader: 'css-loader',
            options: {
              modules: {
                auto: true, // 自动启用CSS Modules
                localIdentName: '[name]__[local]--[hash:base64:5]'
              },
              importLoaders: 2 // 在css-loader前应用的loader数量
            }
          },
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [
                  ['autoprefixer', { grid: true }],
                  ['cssnano', { preset: 'default' }]
                ]
              }
            }
          },
          'sass-loader'
        ]
      },

      // 图片资源处理（Webpack 5 Asset Modules）
      {
        test: /\.(png|jpg|jpeg|gif|svg)$/i,
        type: 'asset',
        parser: {
          dataUrlCondition: {
            maxSize: 8 * 1024 // 8KB以下转base64
          }
        },
        generator: {
          filename: 'images/[name].[hash:8][ext]'
        }
      },

      // 字体处理
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'fonts/[name].[hash:8][ext]'
        }
      }
    ]
  }
};
```

**自定义Loader开发**：
```javascript
// my-loader.js
module.exports = function(source) {
  // this是webpack提供的loader上下文
  const options = this.getOptions(); // 获取配置选项

  // 处理源码
  const result = source.replace(/console\.log\(/g, 'console.debug(');

  // 返回处理后的代码
  return result;
};

// webpack.config.js中使用
module.exports = {
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: path.resolve('./my-loader.js'),
          options: {
            // 传递给loader的选项
          }
        }
      }
    ]
  }
};
```

#### 1.2.4 插件(Plugins) - 扩展Webpack功能

插件用于执行范围更广的任务，从打包优化到资源管理，再到环境变量注入。

**插件工作原理**：
插件通过监听Webpack构建过程中的钩子(hooks)来执行特定任务。

**常用插件配置**：
```javascript
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const TerserPlugin = require('terser-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');

module.exports = {
  plugins: [
    // 清理输出目录
    new CleanWebpackPlugin(),

    // 生成HTML并自动注入资源
    new HtmlWebpackPlugin({
      template: './src/index.html',
      filename: 'index.html',
      title: 'My Application',
      meta: {
        viewport: 'width=device-width, initial-scale=1',
        description: 'My awesome application'
      },
      minify: process.env.NODE_ENV === 'production' ? {
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true
      } : false
    }),

    // 提取CSS到单独文件
    new MiniCssExtractPlugin({
      filename: process.env.NODE_ENV === 'production'
        ? 'css/[name].[contenthash:8].css'
        : 'css/[name].css',
      chunkFilename: process.env.NODE_ENV === 'production'
        ? 'css/[name].[contenthash:8].chunk.css'
        : 'css/[name].chunk.css'
    }),

    // 复制静态资源
    new CopyWebpackPlugin({
      patterns: [
        {
          from: 'public',
          to: 'public',
          globOptions: {
            ignore: ['**/index.html']
          }
        }
      ]
    }),

    // 定义全局变量
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
      'process.env.API_URL': JSON.stringify(process.env.API_URL || 'http://localhost:3000'),
      __DEV__: process.env.NODE_ENV === 'development'
    }),

    // 提供全局模块
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      React: 'react'
    }),

    // Gzip压缩
    new CompressionPlugin({
      algorithm: 'gzip',
      test: /\.(js|css|html|svg)$/,
      threshold: 10240, // 只压缩大于10KB的资源
      minRatio: 0.8,
      deleteOriginalAssets: false
    }),

    // 包分析器（开发时使用）
    process.env.ANALYZE && new BundleAnalyzerPlugin({
      analyzerMode: 'server',
      openAnalyzer: true
    })
  ].filter(Boolean), // 过滤掉undefined的插件

  optimization: {
    minimizer: [
      // JavaScript压缩
      new TerserPlugin({
        parallel: true,
        terserOptions: {
          format: {
            comments: false
          },
          compress: {
            drop_console: process.env.NODE_ENV === 'production',
            drop_debugger: process.env.NODE_ENV === 'production',
            pure_funcs: process.env.NODE_ENV === 'production' ? ['console.log'] : []
          }
        },
        extractComments: false
      })
    ]
  }
};
```

**自定义插件开发**：
```javascript
// my-plugin.js
class MyPlugin {
  constructor(options = {}) {
    this.options = options;
  }

  apply(compiler) {
    // 监听compilation钩子
    compiler.hooks.compilation.tap('MyPlugin', (compilation) => {
      console.log('新的compilation创建！');

      // 监听assets优化钩子
      compilation.hooks.optimizeAssets.tapAsync('MyPlugin', (assets, callback) => {
        // 处理资源
        Object.keys(assets).forEach(assetName => {
          if (assetName.endsWith('.js')) {
            // 在JS文件顶部添加版权信息
            const originalSource = assets[assetName].source();
            const copyrightComment = `/*! Copyright ${new Date().getFullYear()} My Company */\n`;
            assets[assetName] = {
              source: () => copyrightComment + originalSource,
              size: () => copyrightComment.length + originalSource.length
            };
          }
        });
        callback();
      });
    });

    // 监听emit钩子（生成文件到output目录之前）
    compiler.hooks.emit.tapAsync('MyPlugin', (compilation, callback) => {
      // 生成一个manifest.json文件
      const manifest = {
        buildTime: new Date().toISOString(),
        files: Object.keys(compilation.assets)
      };

      compilation.assets['manifest.json'] = {
        source: () => JSON.stringify(manifest, null, 2),
        size: () => JSON.stringify(manifest, null, 2).length
      };

      callback();
    });
  }
}

module.exports = MyPlugin;

// 使用
module.exports = {
  plugins: [
    new MyPlugin({
      // 插件选项
    })
  ]
};
```

#### 1.2.5 模式(Mode) - 环境配置

模式告诉Webpack使用相应环境的内置优化。

**模式配置**：
```javascript
module.exports = {
  mode: 'production', // 'development' | 'production' | 'none'

  // 或者通过函数动态设置
  mode: (env, argv) => {
    return argv.mode === 'production' ? 'production' : 'development';
  }
};
```

**各模式的内置优化**：

**Development模式**：
```javascript
// 等价于
module.exports = {
  mode: 'development',
  devtool: 'eval',
  cache: { type: 'memory' },
  optimization: {
    moduleIds: 'named',
    chunkIds: 'named',
    mangleExports: false,
    nodeEnv: 'development',
    flagIncludedChunks: false,
    occurrenceOrder: false,
    concatenateModules: false,
    splitChunks: {
      hidePathInfo: false,
      minSize: 10000,
      maxAsyncRequests: Infinity,
      maxInitialRequests: Infinity,
    },
    emitOnErrors: true,
    checkWasmTypes: false,
    minimize: false,
  },
  plugins: [
    new webpack.DefinePlugin({ "process.env.NODE_ENV": JSON.stringify("development") }),
  ]
}
```

**Production模式**：
```javascript
// 等价于
module.exports = {
  mode: 'production',
  devtool: false,
  optimization: {
    moduleIds: 'deterministic',
    chunkIds: 'deterministic',
    mangleExports: 'deterministic',
    nodeEnv: 'production',
    flagIncludedChunks: true,
    occurrenceOrder: true,
    concatenateModules: true,
    splitChunks: {
      hidePathInfo: true,
      minSize: 20000,
      maxAsyncRequests: 30,
      maxInitialRequests: 30,
    },
    emitOnErrors: false,
    checkWasmTypes: true,
    minimize: true,
  },
  plugins: [
    new TerserPlugin(/* ... */),
    new webpack.DefinePlugin({ "process.env.NODE_ENV": JSON.stringify("production") }),
    new webpack.optimize.ModuleConcatenationPlugin(),
    new webpack.NoEmitOnErrorsPlugin()
  ]
}
```

#### 1.2.6 模块(Modules) - 一切皆模块

在Webpack中，除了JavaScript，其他资源文件也被视为模块。

**模块类型示例**：
```javascript
// ES2015 import语句
import MyModule from './my-module.js';
import { namedExport } from './other-module.js';

// CommonJS require()语句
const MyModule = require('./my-module.js');

// AMD define和require语句
define(['./my-module.js'], function(MyModule) {
  // ...
});

// CSS @import语句
@import './styles.css';

// 样式表url(...)或者HTML文件<img src=...>中的图片链接
background-image: url('./image.png');

// Web Workers
const worker = new Worker('./worker.js');
```

**模块解析规则**：
```javascript
module.exports = {
  resolve: {
    // 自动解析确定的扩展
    extensions: ['.tsx', '.ts', '.jsx', '.js', '.json'],

    // 创建import或require的别名
    alias: {
      '@': path.resolve(__dirname, 'src'),
      'components': path.resolve(__dirname, 'src/components'),
      'utils': path.resolve(__dirname, 'src/utils'),
      'styles': path.resolve(__dirname, 'src/styles')
    },

    // 告诉webpack解析模块时应该搜索的目录
    modules: [
      'node_modules',
      path.resolve(__dirname, 'src')
    ],

    // 解析主文件
    mainFields: ['browser', 'module', 'main'],

    // 解析主文件名
    mainFiles: ['index'],

    // 解析包的描述文件
    descriptionFiles: ['package.json'],

    // 强制解析器为这些后缀执行完整的解析
    enforceExtension: false,

    // 如果为true，将不允许无扩展名文件
    enforceModuleExtension: false,

    // 是否缓存
    cache: true,

    // 不解析的请求
    unsafeCache: true,

    // 自定义解析插件
    plugins: [
      // new DirectoryNamedPlugin()
    ]
  }
};
```

#### 1.2.7 依赖图(Dependency Graph) - 构建核心

Webpack从入口文件开始，递归地构建整个应用的依赖图。

**依赖图构建过程**：
1. **解析入口**：从entry配置的文件开始
2. **分析依赖**：通过AST分析找出所有import/require语句
3. **递归处理**：对每个依赖模块重复上述过程
4. **生成图谱**：构建完整的模块依赖关系图

**依赖图可视化示例**：
```
app.js (entry)
├── utils.js
│   ├── lodash (node_modules)
│   └── helper.js
├── components/
│   ├── Header.js
│   │   ├── React (node_modules)
│   │   └── header.css
│   └── Footer.js
│       ├── React (node_modules)
│       └── footer.css
└── styles/
    ├── main.css
    ├── variables.scss
    └── mixins.scss
```

**依赖图分析工具**：
```javascript
// webpack-bundle-analyzer配置
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
  plugins: [
    new BundleAnalyzerPlugin({
      analyzerMode: 'static', // 'server' | 'static' | 'json'
      reportFilename: 'bundle-report.html',
      openAnalyzer: true,
      generateStatsFile: true,
      statsFilename: 'stats.json',
      logLevel: 'info'
    })
  ]
};
```

### 1.3 Webpack构建流程详解

**完整构建流程**：

1. **初始化参数**：从配置文件和Shell语句中读取与合并参数
2. **开始编译**：用上一步得到的参数初始化Compiler对象，加载所有配置的插件，执行对象的run方法开始执行编译
3. **确定入口**：根据配置中的entry找出所有的入口文件
4. **编译模块**：从入口文件出发，调用所有配置的Loader对模块进行翻译，再找出该模块依赖的模块，递归进行
5. **完成模块编译**：使用Loader翻译完所有模块后，得到了每个模块被翻译后的最终内容以及它们之间的依赖关系
6. **输出资源**：根据入口和模块之间的依赖关系，组装成一个个包含多个模块的Chunk，再把每个Chunk转换成一个单独的文件加入到输出列表
7. **输出完成**：确定好输出内容后，根据配置确定输出的路径和文件名，把文件内容写入到文件系统

**钩子系统**：
```javascript
// 插件中监听各种钩子
class MyPlugin {
  apply(compiler) {
    // 编译器钩子
    compiler.hooks.beforeRun.tap('MyPlugin', () => {
      console.log('开始编译前');
    });

    compiler.hooks.compile.tap('MyPlugin', () => {
      console.log('开始编译');
    });

    compiler.hooks.compilation.tap('MyPlugin', (compilation) => {
      console.log('新的compilation创建');

      // 编译过程钩子
      compilation.hooks.buildModule.tap('MyPlugin', (module) => {
        console.log('构建模块:', module.resource);
      });

      compilation.hooks.finishModules.tap('MyPlugin', (modules) => {
        console.log('完成模块构建');
      });

      compilation.hooks.optimizeChunks.tap('MyPlugin', (chunks) => {
        console.log('优化chunks');
      });
    });

    compiler.hooks.emit.tap('MyPlugin', (compilation) => {
      console.log('输出资源到目录前');
    });

    compiler.hooks.done.tap('MyPlugin', (stats) => {
      console.log('编译完成');
    });
  }
}
```

**编译性能监控**：
```javascript
// 性能分析配置
module.exports = {
  profile: true, // 启用性能分析

  plugins: [
    // 速度分析插件
    new (require('speed-measure-webpack-plugin'))({
      outputFormat: 'human', // 'json' | 'human' | 'humanVerbose'
      pluginNames: true,
      granularLoaderData: true
    }).wrap({
      // 原有配置
    })
  ]
};
```

## 2. 基本配置深度指南

### 2.1 安装Webpack

```bash
# 本地安装Webpack和CLI（推荐）
npm install webpack webpack-cli --save-dev

# 或使用yarn
yarn add webpack webpack-cli --dev

# 全局安装（不推荐，可能导致版本冲突）
npm install webpack webpack-cli -g

# 安装特定版本
npm install webpack@5.75.0 webpack-cli@4.10.0 --save-dev

# 验证安装
npx webpack --version
./node_modules/.bin/webpack --version
```

**版本选择建议**：
- **Webpack 5**：当前主流版本，支持Module Federation、Asset Modules等新特性
- **Webpack 4**：稳定版本，社区生态成熟，但缺少新特性
- **建议策略**：新项目使用Webpack 5，老项目评估迁移成本后决定

### 2.2 零配置使用

Webpack 4+支持零配置启动，适用于简单项目的快速开始：

```bash
# 项目结构
my-project/
├── src/
│   └── index.js
├── package.json
└── (无需webpack.config.js)

# 直接打包（默认入口：./src/index.js，输出：./dist/main.js）
npx webpack

# 指定模式
npx webpack --mode=development
npx webpack --mode=production
```

**零配置的默认行为**：
```javascript
// 等价于以下配置
module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'main.js'
  },
  mode: 'production'
};
```

### 2.3 配置文件类型与加载

**支持的配置文件名**（按优先级排序）：
1. `webpack.config.js`
2. `webpack.config.ts`（需要安装ts-node）
3. `webpack.config.mjs`（ES模块格式）
4. `webpack.config.cjs`（CommonJS格式）

**TypeScript配置文件**：
```typescript
// webpack.config.ts
import path from 'path';
import { Configuration } from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';

const config: Configuration = {
  entry: './src/index.ts',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[contenthash].js'
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html'
    })
  ]
};

export default config;
```

**ES模块配置文件**：
```javascript
// webpack.config.mjs
import path from 'path';
import { fileURLToPath } from 'url';
import HtmlWebpackPlugin from 'html-webpack-plugin';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[contenthash].js'
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html'
    })
  ]
};
```

**动态配置**：
```javascript
// webpack.config.js
module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';
  const isDevelopment = !isProduction;

  return {
    entry: './src/index.js',
    devtool: isProduction ? 'source-map' : 'eval-source-map',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: isProduction
        ? '[name].[contenthash:8].js'
        : '[name].js',
      clean: true
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: './src/index.html',
        minify: isProduction
      }),
      // 只在开发环境启用的插件
      isDevelopment && new webpack.HotModuleReplacementPlugin(),
      // 只在生产环境启用的插件
      isProduction && new MiniCssExtractPlugin({
        filename: '[name].[contenthash:8].css'
      })
    ].filter(Boolean)
  };
};
```

**Promise配置**：
```javascript
// webpack.config.js
module.exports = () => {
  return new Promise((resolve, reject) => {
    // 异步获取配置（如从API获取）
    fetchConfigFromAPI()
      .then(apiConfig => {
        resolve({
          entry: apiConfig.entry || './src/index.js',
          output: {
            path: path.resolve(__dirname, 'dist'),
            filename: '[name].js'
          },
          // ...其他配置
        });
      })
      .catch(reject);
  });
};
```

### 2.4 基础配置文件详解

**完整的基础配置示例**：
```javascript
// webpack.config.js
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  // 上下文目录（绝对路径）
  context: path.resolve(__dirname, 'src'),

  // 入口配置
  entry: {
    app: './index.js',
    // 可以是数组（多个文件合并为一个chunk）
    vendor: ['react', 'react-dom']
  },

  // 输出配置
  output: {
    // 输出目录（绝对路径）
    path: path.resolve(__dirname, 'dist'),

    // 输出文件名模板
    filename: '[name].[contenthash:8].js',

    // 异步chunk的文件名
    chunkFilename: '[name].[contenthash:8].chunk.js',

    // 静态资源的公共路径
    publicPath: '/',

    // 每次构建前清理输出目录
    clean: true,

    // 输出的库名称（如果构建库）
    library: {
      name: 'MyLibrary',
      type: 'umd'
    },

    // 全局对象名称
    globalObject: 'this',

    // 资源信息注释
    pathinfo: false
  },

  // 模式
  mode: process.env.NODE_ENV || 'development',

  // 开发工具（source map配置）
  devtool: process.env.NODE_ENV === 'production'
    ? 'source-map'
    : 'eval-cheap-module-source-map',

  // 解析配置
  resolve: {
    // 自动解析的文件扩展名
    extensions: ['.tsx', '.ts', '.jsx', '.js', '.json'],

    // 模块搜索目录
    modules: [
      path.resolve(__dirname, 'src'),
      'node_modules'
    ],

    // 路径别名
    alias: {
      '@': path.resolve(__dirname, 'src'),
      'components': path.resolve(__dirname, 'src/components'),
      'utils': path.resolve(__dirname, 'src/utils'),
      'assets': path.resolve(__dirname, 'src/assets')
    },

    // 主文件名
    mainFiles: ['index'],

    // 包描述文件中的字段名
    mainFields: ['browser', 'module', 'main'],

    // 符号链接解析
    symlinks: true,

    // 缓存解析结果
    cache: true,

    // 不安全的缓存
    unsafeCache: true
  },

  // 模块处理规则
  module: {
    // 不解析的文件
    noParse: /jquery|lodash/,

    rules: [
      // JavaScript/TypeScript
      {
        test: /\.(js|jsx|ts|tsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              ['@babel/preset-env', {
                targets: {
                  browsers: ['> 1%', 'last 2 versions']
                },
                useBuiltIns: 'usage',
                corejs: 3
              }],
              '@babel/preset-react',
              '@babel/preset-typescript'
            ],
            plugins: [
              '@babel/plugin-proposal-class-properties',
              '@babel/plugin-syntax-dynamic-import'
            ],
            cacheDirectory: true
          }
        }
      },

      // CSS
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },

      // SCSS
      {
        test: /\.scss$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: {
                auto: true,
                localIdentName: '[name]__[local]--[hash:base64:5]'
              }
            }
          },
          'sass-loader'
        ]
      },

      // 图片
      {
        test: /\.(png|jpg|jpeg|gif|svg)$/i,
        type: 'asset',
        parser: {
          dataUrlCondition: {
            maxSize: 8 * 1024 // 8KB
          }
        },
        generator: {
          filename: 'images/[name].[hash:8][ext]'
        }
      },

      // 字体
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'fonts/[name].[hash:8][ext]'
        }
      }
    ]
  },

  // 插件
  plugins: [
    // 清理输出目录
    new CleanWebpackPlugin(),

    // 生成HTML
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'public/index.html'),
      filename: 'index.html',
      title: 'My App',
      favicon: path.resolve(__dirname, 'public/favicon.ico'),
      meta: {
        viewport: 'width=device-width, initial-scale=1',
        description: 'My awesome application'
      }
    })
  ],

  // 优化配置
  optimization: {
    // 运行时chunk
    runtimeChunk: 'single',

    // 代码分割
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
          name: 'framework',
          chunks: 'all',
          priority: 40,
          enforce: true
        },
        // 第三方库
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendor',
          chunks: 'all',
          priority: 30,
          minChunks: 1,
          maxInitialRequests: 3,
          minSize: 30000
        },
        // 公共代码
        common: {
          name: 'common',
          chunks: 'all',
          priority: 20,
          minChunks: 2,
          reuseExistingChunk: true,
          enforce: true
        }
      }
    }
  },

  // 外部扩展（不打包的依赖）
  externals: {
    // 'react': 'React',
    // 'react-dom': 'ReactDOM'
  },

  // 性能提示
  performance: {
    hints: process.env.NODE_ENV === 'production' ? 'warning' : false,
    maxEntrypointSize: 512000, // 512KB
    maxAssetSize: 512000
  },

  // 统计信息
  stats: {
    colors: true,
    modules: false,
    children: false,
    chunks: false,
    chunkModules: false
  }
};
```

### 2.5 多入口配置详解

**多页面应用配置**：
```javascript
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const glob = require('glob');

// 自动扫描页面入口
function getEntries() {
  const entries = {};
  const htmlPlugins = [];

  // 扫描src/pages下的所有入口文件
  const entryFiles = glob.sync('./src/pages/*/index.js');

  entryFiles.forEach(entryFile => {
    const match = entryFile.match(/\.\/src\/pages\/(.*)\/index\.js$/);
    if (match) {
      const pageName = match[1];

      // 设置入口
      entries[pageName] = entryFile;

      // 创建对应的HTML插件
      htmlPlugins.push(
        new HtmlWebpackPlugin({
          template: `./src/pages/${pageName}/index.html`,
          filename: `${pageName}.html`,
          chunks: [pageName, 'vendor', 'common'], // 指定包含的chunk
          minify: process.env.NODE_ENV === 'production'
        })
      );
    }
  });

  return { entries, htmlPlugins };
}

const { entries, htmlPlugins } = getEntries();

module.exports = {
  entry: {
    ...entries,
    // 公共入口
    vendor: ['react', 'react-dom', 'lodash']
  },

  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name]/[name].[contenthash:8].js',
    chunkFilename: 'chunks/[name].[contenthash:8].chunk.js'
  },

  plugins: [
    ...htmlPlugins,
    // 其他插件
  ],

  optimization: {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        // 第三方库
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendor',
          chunks: 'all',
          priority: 10
        },
        // 公共模块
        common: {
          name: 'common',
          chunks: 'all',
          minChunks: 2,
          priority: 5,
          reuseExistingChunk: true
        }
      }
    }
  }
};
```

### 2.6 开发环境配置详解

**开发服务器配置**：
```javascript
module.exports = {
  mode: 'development',

  // 开发工具配置
  devtool: 'eval-cheap-module-source-map',

  // 开发服务器
  devServer: {
    // 服务器配置
    host: 'localhost', // 或 '0.0.0.0' 允许外部访问
    port: 8080,
    open: true, // 自动打开浏览器
    hot: true, // 热模块替换

    // 内容配置
    static: {
      directory: path.join(__dirname, 'public'),
      publicPath: '/'
    },

    // 压缩
    compress: true,

    // 历史API回退
    historyApiFallback: {
      // SPA路由配置
      rewrites: [
        { from: /^\/admin/, to: '/admin.html' },
        { from: /./, to: '/index.html' }
      ]
    },

    // 代理配置
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        pathRewrite: {
          '^/api': '' // 重写路径
        },
        logLevel: 'debug'
      },
      '/socket.io': {
        target: 'http://localhost:3000',
        ws: true // 启用WebSocket代理
      }
    },

    // HTTPS配置
    https: false, // 或者配置SSL证书
    // https: {
    //   key: fs.readFileSync('./ssl/server.key'),
    //   cert: fs.readFileSync('./ssl/server.crt')
    // },

    // 头部配置
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
      'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization'
    },

    // 错误覆盖
    client: {
      overlay: {
        errors: true,
        warnings: false
      },
      progress: true
    },

    // 监听文件变化
    watchFiles: {
      paths: ['src/**/*', 'public/**/*'],
      options: {
        usePolling: false,
        interval: 1000,
        aggregateTimeout: 300
      }
    }
  },

  // 缓存配置
  cache: {
    type: 'memory' // 开发环境使用内存缓存
  },

  // 优化配置
  optimization: {
    removeAvailableModules: false,
    removeEmptyChunks: false,
    splitChunks: false
  },

  // 输出配置
  output: {
    pathinfo: false // 减少路径信息
  }
};
```

**开发环境性能优化**：
```javascript
// webpack.dev.js
const webpack = require('webpack');

module.exports = {
  mode: 'development',

  // 快速source map
  devtool: 'eval-cheap-module-source-map',

  // 优化配置
  optimization: {
    moduleIds: 'named', // 使用可读的模块ID
    chunkIds: 'named'   // 使用可读的chunk ID
  },

  // 缓存配置
  cache: {
    type: 'filesystem',
    cacheDirectory: path.resolve(__dirname, '.temp_cache'),
    buildDependencies: {
      config: [__filename]
    }
  },

  // 模块解析优化
  resolve: {
    // 减少解析
    modules: [path.resolve(__dirname, 'src'), 'node_modules'],
    extensions: ['.js', '.jsx', '.ts', '.tsx'], // 只保留必要的扩展名
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },

  // 排除不必要的处理
  module: {
    rules: [
      {
        test: /\.(js|jsx|ts|tsx)$/,
        include: path.resolve(__dirname, 'src'), // 只处理src目录
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            cacheDirectory: true, // 启用babel缓存
            cacheCompression: false // 不压缩缓存
          }
        }
      }
    ]
  },

  plugins: [
    // 热模块替换
    new webpack.HotModuleReplacementPlugin(),

    // 友好错误插件
    new (require('friendly-errors-webpack-plugin'))({
      compilationSuccessInfo: {
        messages: ['Your application is running here: http://localhost:8080']
      }
    }),

    // 进度插件
    new webpack.ProgressPlugin()
  ]
};
```

### 2.7 生产环境配置详解

**生产环境优化配置**：
```javascript
// webpack.prod.js
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

module.exports = {
  mode: 'production',

  // 生产环境source map
  devtool: 'source-map',

  // 输出配置
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'js/[name].[contenthash:8].js',
    chunkFilename: 'js/[name].[contenthash:8].chunk.js',
    assetModuleFilename: 'assets/[name].[hash:8][ext]',
    clean: true
  },

  // CSS提取
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader'
        ]
      },
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader',
          'sass-loader'
        ]
      }
    ]
  },

  plugins: [
    // 清理构建目录
    new CleanWebpackPlugin(),

    // 提取CSS
    new MiniCssExtractPlugin({
      filename: 'css/[name].[contenthash:8].css',
      chunkFilename: 'css/[name].[contenthash:8].chunk.css',
      ignoreOrder: false
    }),

    // Gzip压缩
    new CompressionPlugin({
      algorithm: 'gzip',
      test: /\.(js|css|html|svg)$/,
      threshold: 10240,
      minRatio: 0.8,
      deleteOriginalAssets: false
    }),

    // Brotli压缩
    new CompressionPlugin({
      filename: '[path][base].br',
      algorithm: 'brotliCompress',
      test: /\.(js|css|html|svg)$/,
      compressionOptions: {
        params: {
          [require('zlib').constants.BROTLI_PARAM_QUALITY]: 11,
        },
      },
      threshold: 10240,
      minRatio: 0.8,
      deleteOriginalAssets: false
    }),

    // 包分析（可选）
    process.env.ANALYZE && new BundleAnalyzerPlugin({
      analyzerMode: 'static',
      openAnalyzer: false,
      reportFilename: 'bundle-report.html'
    })
  ].filter(Boolean),

  // 优化配置
  optimization: {
    minimize: true,
    minimizer: [
      // JS压缩
      new TerserPlugin({
        parallel: true,
        terserOptions: {
          parse: {
            ecma: 8
          },
          compress: {
            ecma: 5,
            warnings: false,
            comparisons: false,
            inline: 2,
            drop_console: true,
            drop_debugger: true,
            pure_funcs: ['console.log', 'console.info']
          },
          mangle: {
            safari10: true
          },
          output: {
            ecma: 5,
            comments: false,
            ascii_only: true
          }
        }
      }),

      // CSS压缩
      new CssMinimizerPlugin({
        parallel: true,
        minimizerOptions: {
          preset: [
            'default',
            {
              discardComments: { removeAll: true },
              normalizeUnicode: false
            }
          ]
        }
      })
    ],

    // 模块ID
    moduleIds: 'deterministic',
    chunkIds: 'deterministic',

    // 代码分割
    splitChunks: {
      chunks: 'all',
      minSize: 20000,
      maxSize: 244000,
      cacheGroups: {
        // 框架代码
        framework: {
          test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
          name: 'framework',
          chunks: 'all',
          priority: 40,
          enforce: true
        },
        // 第三方库
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendor',
          chunks: 'all',
          priority: 30,
          minChunks: 1,
          maxInitialRequests: 3,
          minSize: 30000
        },
        // 公共代码
        common: {
          name: 'common',
          chunks: 'all',
          priority: 20,
          minChunks: 2,
          reuseExistingChunk: true,
          enforce: true
        }
      }
    },

    // 运行时代码
    runtimeChunk: {
      name: 'runtime'
    }
  },

  // 性能配置
  performance: {
    hints: 'warning',
    maxEntrypointSize: 512000,
    maxAssetSize: 512000
  }
};
```

## 3. 加载器详解

### 3.1 JavaScript处理

```javascript
module: {
  rules: [
    {
      test: /\.js$/,
      exclude: /node_modules/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env'],
          plugins: ['@babel/plugin-proposal-class-properties']
        }
      }
    },
    // TypeScript处理
    {
      test: /\.tsx?$/,
      use: 'ts-loader',
      exclude: /node_modules/
    }
  ]
}
```

### 3.2 样式处理

```javascript
module: {
  rules: [
    // CSS处理
    {
      test: /\.css$/,
      use: ['style-loader', 'css-loader']
    },

    // SASS处理
    {
      test: /\.scss$/,
      use: [
        'style-loader',
        'css-loader',
        'sass-loader' // 将SASS转换为CSS
      ]
    },

    // Less处理
    {
      test: /\.less$/,
      use: [
        'style-loader',
        'css-loader',
        'less-loader' // 将Less转换为CSS
      ]
    },

    // PostCSS处理
    {
      test: /\.css$/,
      use: [
        'style-loader',
        'css-loader',
        {
          loader: 'postcss-loader',
          options: {
            plugins: [
              require('autoprefixer'),
              require('cssnano')
            ]
          }
        }
      ]
    }
  ]
}
```

### 3.3 资源处理

```javascript
module: {
  rules: [
    // 图片处理
    {
      test: /\.(png|svg|jpg|gif)$/,
      use: ['file-loader']
    },

    // 字体处理
    {
      test: /\.(woff|woff2|eot|ttf|otf)$/,
      use: [
        {
          loader: 'file-loader',
          options: {
            name: '[name].[hash].[ext]',
            outputPath: 'fonts/'
          }
        }
      ]
    },

    // 加载数据
    {
      test: /\.(csv|tsv)$/,
      use: ['csv-loader']
    },
    {
      test: /\.xml$/,
      use: ['xml-loader']
    },

    // JSON已内置支持，不需要额外loader
  ]
}
```

### 3.4 HTML和模板处理

```javascript
module: {
  rules: [
    // Handlebars模板
    {
      test: /\.handlebars$/,
      use: 'handlebars-loader'
    },

    // Pug模板
    {
      test: /\.pug$/,
      use: ['pug-loader']
    }
  ]
}
```

## 4. 插件系统深度解析

### 4.1 插件工作原理与架构

**插件本质**：
- 插件是一个具有apply方法的JavaScript对象
- 通过Webpack的事件系统（Tapable）进行工作
- 可以访问整个编译过程的生命周期
- 能够修改输出结果、添加额外功能

**插件基本结构**：
```javascript
class MyPlugin {
  constructor(options = {}) {
    this.options = options;
  }

  apply(compiler) {
    // compiler是webpack实例
    // 监听webpack的生命周期钩子

    // 编译开始时
    compiler.hooks.compile.tap('MyPlugin', (params) => {
      console.log('Compilation started!');
    });

    // 每次编译时
    compiler.hooks.compilation.tap('MyPlugin', (compilation) => {
      // compilation是当前编译过程的实例

      // 处理资源
      compilation.hooks.processAssets.tap(
        {
          name: 'MyPlugin',
          stage: compilation.PROCESS_ASSETS_STAGE_OPTIMIZE
        },
        (assets) => {
          // 处理编译资源
          Object.keys(assets).forEach(filename => {
            // 修改资源内容
          });
        }
      );
    });

    // 编译完成时
    compiler.hooks.done.tap('MyPlugin', (stats) => {
      console.log('Compilation finished!');
    });
  }
}

module.exports = MyPlugin;
```

**Webpack生命周期钩子**：
```javascript
// Compiler钩子（编译器级别）
compiler.hooks.environment      // 环境准备完毕
compiler.hooks.afterEnvironment // 环境准备完毕之后
compiler.hooks.entryOption      // 入口选项处理完毕
compiler.hooks.afterPlugins     // 插件安装完毕
compiler.hooks.afterResolvers   // 解析器安装完毕
compiler.hooks.initialize       // 初始化
compiler.hooks.beforeRun        // 运行前
compiler.hooks.run              // 运行
compiler.hooks.watchRun         // 监听模式运行
compiler.hooks.normalModuleFactory  // 普通模块工厂创建
compiler.hooks.contextModuleFactory // 上下文模块工厂创建
compiler.hooks.beforeCompile    // 编译前
compiler.hooks.compile          // 编译
compiler.hooks.thisCompilation  // 当前编译
compiler.hooks.compilation      // 编译
compiler.hooks.make             // 构建
compiler.hooks.afterCompile     // 编译后
compiler.hooks.shouldEmit       // 是否输出
compiler.hooks.emit             // 输出
compiler.hooks.afterEmit        // 输出后
compiler.hooks.done             // 完成
compiler.hooks.failed           // 失败
compiler.hooks.invalid          // 无效
compiler.hooks.watchClose       // 监听关闭

// Compilation钩子（编译级别）
compilation.hooks.buildModule          // 构建模块
compilation.hooks.rebuildModule        // 重新构建模块
compilation.hooks.failedModule         // 模块构建失败
compilation.hooks.succeedModule        // 模块构建成功
compilation.hooks.finishModules        // 模块构建完成
compilation.hooks.finishRebuildingModule // 模块重建完成
compilation.hooks.seal                 // 密封
compilation.hooks.unseal               // 解除密封
compilation.hooks.optimizeDependencies // 优化依赖
compilation.hooks.afterOptimizeDependencies // 优化依赖后
compilation.hooks.optimize             // 优化
compilation.hooks.optimizeModules      // 优化模块
compilation.hooks.afterOptimizeModules // 优化模块后
compilation.hooks.optimizeChunks       // 优化代码块
compilation.hooks.afterOptimizeChunks  // 优化代码块后
compilation.hooks.optimizeTree         // 优化依赖树
compilation.hooks.afterOptimizeTree    // 优化依赖树后
compilation.hooks.optimizeChunkModules // 优化代码块模块
compilation.hooks.afterOptimizeChunkModules // 优化代码块模块后
compilation.hooks.shouldRecord         // 是否记录
compilation.hooks.reviveModules        // 恢复模块
compilation.hooks.beforeModuleIds      // 模块ID前
compilation.hooks.moduleIds            // 模块ID
compilation.hooks.optimizeModuleIds    // 优化模块ID
compilation.hooks.afterOptimizeModuleIds // 优化模块ID后
compilation.hooks.reviveChunks         // 恢复代码块
compilation.hooks.beforeChunkIds       // 代码块ID前
compilation.hooks.optimizeChunkIds     // 优化代码块ID
compilation.hooks.afterOptimizeChunkIds // 优化代码块ID后
compilation.hooks.recordModules        // 记录模块
compilation.hooks.recordChunks         // 记录代码块
compilation.hooks.beforeHash           // 哈希前
compilation.hooks.afterHash            // 哈希后
compilation.hooks.recordHash           // 记录哈希
compilation.hooks.record               // 记录
compilation.hooks.beforeModuleAssets   // 模块资源前
compilation.hooks.shouldGenerateChunkAssets // 是否生成代码块资源
compilation.hooks.beforeChunkAssets    // 代码块资源前
compilation.hooks.additionalChunkAssets // 额外代码块资源
compilation.hooks.records              // 记录
compilation.hooks.additionalAssets     // 额外资源
compilation.hooks.optimizeChunkAssets  // 优化代码块资源
compilation.hooks.afterOptimizeChunkAssets // 优化代码块资源后
compilation.hooks.optimizeAssets       // 优化资源
compilation.hooks.afterOptimizeAssets  // 优化资源后
compilation.hooks.processAssets        // 处理资源
compilation.hooks.afterProcessAssets   // 处理资源后
compilation.hooks.needAdditionalSeal   // 需要额外密封
compilation.hooks.afterSeal            // 密封后
```

### 4.2 常用内置插件详解

**HTML处理插件**：
```javascript
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  plugins: [
    new HtmlWebpackPlugin({
      // 模板文件
      template: './src/index.html',

      // 输出文件名
      filename: 'index.html',

      // 页面标题
      title: 'My Application',

      // 注入位置
      inject: 'body', // true | 'head' | 'body' | false

      // 包含的chunks
      chunks: ['app', 'vendor'],

      // 排除的chunks
      excludeChunks: ['admin'],

      // chunks排序
      chunksSortMode: 'auto', // 'none' | 'auto' | 'dependency' | {function}

      // 压缩配置
      minify: process.env.NODE_ENV === 'production' ? {
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true
      } : false,

      // 自定义元数据
      meta: {
        viewport: 'width=device-width, initial-scale=1, shrink-to-fit=no',
        description: 'My awesome application',
        keywords: 'webpack, react, javascript',
        author: 'Your Name'
      },

      // 基础URL
      base: '/',

      // favicon
      favicon: './src/favicon.ico',

      // 哈希
      hash: false,

      // 缓存
      cache: true,

      // 显示错误详情
      showErrors: true,

      // 自定义参数
      templateParameters: {
        version: process.env.npm_package_version,
        buildDate: new Date().toISOString()
      },

      // 脚本加载类型
      scriptLoading: 'blocking' // 'blocking' | 'defer'
    }),

    // 多页面配置
    ...['home', 'about', 'contact'].map(page =>
      new HtmlWebpackPlugin({
        template: `./src/pages/${page}.html`,
        filename: `${page}.html`,
        chunks: [page, 'vendor', 'common'],
        title: `${page.charAt(0).toUpperCase() + page.slice(1)} Page`
      })
    )
  ]
};
```

**CSS提取插件**：
```javascript
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  plugins: [
    new MiniCssExtractPlugin({
      // 输出文件名
      filename: process.env.NODE_ENV === 'production'
        ? 'css/[name].[contenthash:8].css'
        : 'css/[name].css',

      // 异步chunks的文件名
      chunkFilename: process.env.NODE_ENV === 'production'
        ? 'css/[name].[contenthash:8].chunk.css'
        : 'css/[name].chunk.css',

      // 插入顺序
      insert: '#some-element', // 或函数

      // 属性
      attributes: {
        id: 'target',
        'data-target': 'example'
      },

      // 链接类型
      linkType: 'text/css', // false | 'text/css'

      // 忽略顺序警告
      ignoreOrder: false,

      // 运行时
      runtime: true,

      // 实验性功能
      experimentalUseImportModule: false
    })
  ],

  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          // 生产环境提取CSS，开发环境内联
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              // 公共路径
              publicPath: '../',

              // 热模块替换
              hmr: process.env.NODE_ENV === 'development',

              // 重新加载所有CSS
              reloadAll: true,

              // ES模块
              esModule: true
            }
          },
          'css-loader'
        ]
      }
    ]
  }
};
```

**代码分割与优化插件**：
```javascript
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');

module.exports = {
  plugins: [
    // 清理输出目录
    new CleanWebpackPlugin({
      // 要清理的文件
      cleanOnceBeforeBuildPatterns: ['**/*'],

      // 监听模式下清理
      cleanOnceBeforeBuildPatterns: ['**/*', '!static-files*'],

      // 构建后清理
      cleanAfterEveryBuildPatterns: ['static*.*', '!static1.js'],

      // 允许清理webpack根目录外的文件
      dangerouslyAllowCleanPatternsOutsideProject: true,

      // 模拟删除
      dry: false,

      // 详细输出
      verbose: true,

      // 保护webpack assets不被删除
      protectWebpackAssets: false
    }),

    // 复制静态资源
    new CopyWebpackPlugin({
      patterns: [
        {
          from: 'src/assets',
          to: 'assets',

          // 过滤器
          filter: (resourcePath) => {
            // 排除某些文件
            return !resourcePath.includes('temp');
          },

          // 转换
          transform: (content, absoluteFrom) => {
            // 处理文件内容
            return content.toString().replace(/{{VERSION}}/g, process.env.npm_package_version);
          },

          // 转换缓存
          cacheTransform: true,

          // 转换路径
          transformPath: (targetPath, absolutePath) => {
            return targetPath.replace(/\.txt$/, '.md');
          },

          // 全局化模式
          globOptions: {
            ignore: ['**/temp/**']
          },

          // 信息
          info: {
            minimized: true
          },

          // 不存在时的处理
          noErrorOnMissing: true
        },

        // 简单复制
        'src/manifest.json',

        // 重命名
        {
          from: 'src/robots.txt',
          to: 'robots.txt'
        }
      ],

      options: {
        // 并发限制
        concurrency: 100
      }
    }),

    // Gzip压缩
    new CompressionPlugin({
      // 文件名
      filename: '[path][base].gz',

      // 压缩算法
      algorithm: 'gzip',

      // 测试匹配
      test: /\.(js|css|html|svg)$/,

      // 压缩阈值
      threshold: 10240,

      // 最小压缩比
      minRatio: 0.8,

      // 删除原文件
      deleteOriginalAssets: false,

      // 压缩选项
      compressionOptions: {
        level: 9
      }
    }),

    // Brotli压缩
    new CompressionPlugin({
      filename: '[path][base].br',
      algorithm: 'brotliCompress',
      test: /\.(js|css|html|svg)$/,
      compressionOptions: {
        params: {
          [require('zlib').constants.BROTLI_PARAM_QUALITY]: 11,
        },
      },
      threshold: 10240,
      minRatio: 0.8,
      deleteOriginalAssets: false
    })
  ]
};
```

**环境变量与定义插件**：
```javascript
const webpack = require('webpack');
const Dotenv = require('dotenv-webpack');

module.exports = {
  plugins: [
    // 定义全局常量
    new webpack.DefinePlugin({
      // 基础定义
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
      'process.env.API_URL': JSON.stringify(process.env.API_URL),

      // 版本信息
      VERSION: JSON.stringify(require('./package.json').version),

      // 构建时间
      BUILD_TIME: JSON.stringify(new Date().toISOString()),

      // 条件编译
      '__DEV__': process.env.NODE_ENV === 'development',
      '__PROD__': process.env.NODE_ENV === 'production',

      // 功能开关
      FEATURE_FLAGS: JSON.stringify({
        newFeature: true,
        experimentalFeature: false
      }),

      // 复杂对象
      CONFIG: JSON.stringify({
        api: {
          baseURL: process.env.API_URL || 'http://localhost:3000',
          timeout: 5000
        },
        app: {
          name: 'My App',
          version: require('./package.json').version
        }
      })
    }),

    // 环境变量插件
    new Dotenv({
      // .env文件路径
      path: './.env',

      // 是否安全模式（只加载.env.example中定义的变量）
      safe: true,

      // 允许空值
      allowEmptyValues: true,

      // 系统环境变量优先
      systemvars: true,

      // 静默模式
      silent: false,

      // 默认值
      defaults: './.env.defaults'
    }),

    // 提供全局变量
    new webpack.ProvidePlugin({
      // 自动加载模块
      $: 'jquery',
      jQuery: 'jquery',
      'window.jQuery': 'jquery',

      // React
      React: 'react',

      // 工具函数
      _: 'lodash',

      // Polyfills
      Promise: 'es6-promise-promise',

      // 自定义模块
      utils: path.resolve(path.join(__dirname, 'src/utils'))
    }),

    // 上下文替换
    new webpack.ContextReplacementPlugin(
      // 上下文目录
      /moment[/\\]locale$/,
      // 新上下文目录
      /zh-cn|en-gb/
    ),

    // 忽略插件
    new webpack.IgnorePlugin({
      // 忽略模块
      resourceRegExp: /^\.\/locale$/,
      contextRegExp: /moment$/
    }),

    // Banner插件
    new webpack.BannerPlugin({
      banner: `
        Build Date: ${new Date().toLocaleString()}
        Version: ${require('./package.json').version}
        Author: ${require('./package.json').author}
      `,
      raw: false,
      entryOnly: true
    })
  ]
};
```

### 4.3 性能优化插件

**Bundle分析插件**：
```javascript
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const SpeedMeasurePlugin = require('speed-measure-webpack-plugin');
const DuplicatePackageCheckerPlugin = require('duplicate-package-checker-webpack-plugin');

const smp = new SpeedMeasurePlugin();

module.exports = smp.wrap({
  plugins: [
    // Bundle分析
    new BundleAnalyzerPlugin({
      // 分析模式
      analyzerMode: 'static', // 'server' | 'static' | 'json' | 'disabled'

      // 服务器配置
      analyzerHost: '127.0.0.1',
      analyzerPort: 8888,

      // 报告文件
      reportFilename: 'bundle-report.html',

      // 默认大小
      defaultSizes: 'parsed', // 'stat' | 'parsed' | 'gzip'

      // 自动打开
      openAnalyzer: false,

      // 生成统计文件
      generateStatsFile: true,
      statsFilename: 'stats.json',

      // 统计选项
      statsOptions: null,

      // 日志级别
      logLevel: 'info'
    }),

    // 重复包检查
    new DuplicatePackageCheckerPlugin({
      // 详细输出
      verbose: true,

      // 发出错误而不是警告
      emitError: false,

      // 显示帮助
      showHelp: true,

      // 严格模式
      strict: false,

      // 排除实例
      exclude: (instance) => {
        return instance.name === 'regenerator-runtime';
      }
    })
  ]
});
```

**缓存优化插件**：
```javascript
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');

module.exports = {
  plugins: [
    // 硬盘缓存（Webpack 4）
    new HardSourceWebpackPlugin({
      // 缓存目录
      cacheDirectory: 'node_modules/.cache/hard-source/[confighash]',

      // 配置哈希
      configHash: function(webpackConfig) {
        return require('node-object-hash')({sort: false}).hash(webpackConfig);
      },

      // 环境哈希
      environmentHash: {
        root: process.cwd(),
        directories: [],
        files: ['package-lock.json', 'yarn.lock']
      },

      // 信息级别
      info: {
        mode: 'none', // 'test' | 'none'
        level: 'debug'
      },

      // 缓存键
      cachePrune: {
        maxAge: 2 * 24 * 60 * 60 * 1000, // 2天
        sizeThreshold: 50 * 1024 * 1024   // 50MB
      }
    }),

    // 额外缓存插件
    new HardSourceWebpackPlugin.ExcludeModulePlugin([
      {
        test: /mini-css-extract-plugin[\\/]dist[\\/]loader/
      }
    ])
  ],

  // Webpack 5内置缓存
  cache: {
    type: 'filesystem',
    version: '1.0',
    cacheDirectory: path.resolve(__dirname, '.temp_cache'),
    store: 'pack',
    buildDependencies: {
      defaultWebpack: ['webpack/lib/'],
      config: [__filename],
      tsconfig: [path.resolve(__dirname, 'tsconfig.json')]
    },
    name: 'development-cache'
  }
};
```

### 4.4 开发体验插件

**热更新与错误处理**：
```javascript
const webpack = require('webpack');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
const ErrorOverlayPlugin = require('error-overlay-webpack-plugin');
const notifier = require('node-notifier');

module.exports = {
  plugins: [
    // 热模块替换
    new webpack.HotModuleReplacementPlugin(),

    // 友好的错误提示
    new FriendlyErrorsWebpackPlugin({
      // 编译成功时的消息
      compilationSuccessInfo: {
        messages: [
          'Your application is running here: http://localhost:8080',
          'Your application is running here: https://localhost:8443'
        ],
        notes: ['Some additional notes to be displayed upon successful compilation']
      },

      // 清除控制台
      clearConsole: true,

      // 额外的格式化器
      additionalFormatters: [],

      // 额外的转换器
      additionalTransformers: [],

      // 成功时的回调
      onErrors: function (severity, errors) {
        if (severity !== 'error') return;

        const error = errors[0];
        const filename = error.file && error.file.split('!').pop();

        notifier.notify({
          title: "Webpack error",
          message: severity + ': ' + error.name,
          subtitle: filename || '',
          icon: path.join(__dirname, 'logo.png')
        });
      }
    }),

    // 错误覆盖层
    new ErrorOverlayPlugin(),

    // 进度插件
    new webpack.ProgressPlugin({
      activeModules: false,
      entries: true,
      handler(percentage, message, ...args) {
        console.info(Math.floor(percentage * 100) + '%', message, ...args);
      },
      modules: true,
      modulesCount: 5000,
      profile: false,
      dependencies: true,
      dependenciesCount: 10000,
      percentBy: null
    })
  ]
};
```

### 4.5 自定义插件开发实例

**文件列表插件**：
```javascript
// plugins/file-list-plugin.js
/**
 * 生成文件列表的插件
 */
class FileListPlugin {
  constructor(options = {}) {
    this.options = {
      outputFile: 'file-list.json',
      format: 'json', // 'json' | 'html' | 'txt'
      ...options
    };
  }

  apply(compiler) {
    const pluginName = 'FileListPlugin';

    compiler.hooks.emit.tapAsync(pluginName, (compilation, callback) => {
      // 获取所有输出文件
      const fileList = Object.keys(compilation.assets).map(filename => ({
        name: filename,
        size: compilation.assets[filename].size(),
        chunks: this.getChunksForFile(filename, compilation)
      }));

      // 根据格式生成内容
      let output;
      switch (this.options.format) {
        case 'html':
          output = this.generateHTML(fileList);
          break;
        case 'txt':
          output = this.generateText(fileList);
          break;
        default:
          output = JSON.stringify(fileList, null, 2);
      }

      // 添加到输出资源
      compilation.assets[this.options.outputFile] = {
        source: () => output,
        size: () => output.length
      };

      callback();
    });
  }

  getChunksForFile(filename, compilation) {
    const chunks = [];
    for (const chunk of compilation.chunks) {
      if (chunk.files.has(filename)) {
        chunks.push(chunk.name || chunk.id);
      }
    }
    return chunks;
  }

  generateHTML(fileList) {
    const rows = fileList.map(file =>
      `<tr><td>${file.name}</td><td>${file.size}</td><td>${file.chunks.join(', ')}</td></tr>`
    ).join('');

    return `
      <!DOCTYPE html>
      <html>
      <head><title>File List</title></head>
      <body>
        <h1>Generated Files</h1>
        <table border="1">
          <tr><th>File</th><th>Size</th><th>Chunks</th></tr>
          ${rows}
        </table>
      </body>
      </html>
    `;
  }

  generateText(fileList) {
    return fileList.map(file =>
      `${file.name} (${file.size} bytes) - Chunks: ${file.chunks.join(', ')}`
    ).join('\n');
  }
}

module.exports = FileListPlugin;
```

**资源压缩插件**：
```javascript
// plugins/custom-compression-plugin.js
/**
 * 自定义压缩插件
 */
const zlib = require('zlib');
const { promisify } = require('util');

const gzip = promisify(zlib.gzip);
const brotliCompress = promisify(zlib.brotliCompress);

class CustomCompressionPlugin {
  constructor(options = {}) {
    this.options = {
      algorithm: 'gzip', // 'gzip' | 'brotli' | 'both'
      test: /\.(js|css|html|svg)$/,
      threshold: 0,
      minRatio: 0.8,
      deleteOriginalAssets: false,
      ...options
    };
  }

  apply(compiler) {
    const pluginName = 'CustomCompressionPlugin';

    compiler.hooks.compilation.tap(pluginName, (compilation) => {
      compilation.hooks.processAssets.tapAsync(
        {
          name: pluginName,
          stage: compilation.PROCESS_ASSETS_STAGE_OPTIMIZE_TRANSFER
        },
        async (assets, callback) => {
          const { RawSource } = compilation.constructor.getCompilationHooks(compilation).processAssets.constructor;

          for (const filename of Object.keys(assets)) {
            if (!this.options.test.test(filename)) continue;

            const asset = assets[filename];
            const source = asset.source();
            const size = asset.size();

            if (size < this.options.threshold) continue;

            try {
              if (this.options.algorithm === 'gzip' || this.options.algorithm === 'both') {
                const compressed = await gzip(source);
                const ratio = compressed.length / size;

                if (ratio < this.options.minRatio) {
                  assets[`${filename}.gz`] = new RawSource(compressed);
                }
              }

              if (this.options.algorithm === 'brotli' || this.options.algorithm === 'both') {
                const compressed = await brotliCompress(source);
                const ratio = compressed.length / size;

                if (ratio < this.options.minRatio) {
                  assets[`${filename}.br`] = new RawSource(compressed);
                }
              }

              if (this.options.deleteOriginalAssets) {
                delete assets[filename];
              }
            } catch (error) {
              compilation.errors.push(new Error(`${pluginName}: ${error.message}`));
            }
          }

          callback();
        }
      );
    });
  }
}

module.exports = CustomCompressionPlugin;
```

**模块依赖分析插件**：
```javascript
// plugins/dependency-analyzer-plugin.js
/**
 * 模块依赖分析插件
 */
class DependencyAnalyzerPlugin {
  constructor(options = {}) {
    this.options = {
      outputFile: 'dependency-graph.json',
      includeDynamicImports: true,
      includeNodeModules: false,
      ...options
    };
  }

  apply(compiler) {
    const pluginName = 'DependencyAnalyzerPlugin';

    compiler.hooks.emit.tapAsync(pluginName, (compilation, callback) => {
      const dependencyGraph = this.buildDependencyGraph(compilation);
      const output = JSON.stringify(dependencyGraph, null, 2);

      compilation.assets[this.options.outputFile] = {
        source: () => output,
        size: () => output.length
      };

      callback();
    });
  }

  buildDependencyGraph(compilation) {
    const graph = {
      modules: {},
      chunks: {},
      entries: {}
    };

    // 分析模块
    for (const module of compilation.modules) {
      if (!this.shouldIncludeModule(module)) continue;

      const moduleInfo = {
        id: module.id,
        name: module.nameForCondition ? module.nameForCondition() : null,
        size: module.size(),
        chunks: [],
        dependencies: [],
        dependents: []
      };

      // 获取模块所属的chunks
      for (const chunk of compilation.chunks) {
        if (chunk.hasModule(module)) {
          moduleInfo.chunks.push(chunk.name || chunk.id);
        }
      }

      // 获取依赖关系
      if (module.dependencies) {
        for (const dep of module.dependencies) {
          if (dep.module && this.shouldIncludeModule(dep.module)) {
            moduleInfo.dependencies.push({
              module: dep.module.id,
              type: dep.constructor.name,
              weak: dep.weak || false
            });
          }
        }
      }

      graph.modules[module.id] = moduleInfo;
    }

    // 分析chunks
    for (const chunk of compilation.chunks) {
      graph.chunks[chunk.name || chunk.id] = {
        id: chunk.id,
        name: chunk.name,
        size: chunk.size(),
        modules: Array.from(chunk.modulesIterable, m => m.id),
        parents: Array.from(chunk.parentsIterable, p => p.name || p.id),
        children: Array.from(chunk.childrenIterable, c => c.name || c.id),
        files: Array.from(chunk.files)
      };
    }

    // 分析入口
    for (const [name, entrypoint] of compilation.entrypoints) {
      graph.entries[name] = {
        chunks: entrypoint.chunks.map(c => c.name || c.id),
        assets: entrypoint.getFiles()
      };
    }

    return graph;
  }

  shouldIncludeModule(module) {
    if (!module || !module.nameForCondition) return false;

    const moduleName = module.nameForCondition();
    if (!moduleName) return false;

    // 排除node_modules（如果配置）
    if (!this.options.includeNodeModules && moduleName.includes('node_modules')) {
      return false;
    }

    return true;
  }
}

module.exports = DependencyAnalyzerPlugin;
```

**插件使用示例**：
```javascript
// webpack.config.js
const FileListPlugin = require('./plugins/file-list-plugin');
const CustomCompressionPlugin = require('./plugins/custom-compression-plugin');
const DependencyAnalyzerPlugin = require('./plugins/dependency-analyzer-plugin');

module.exports = {
  plugins: [
    new FileListPlugin({
      outputFile: 'build-manifest.json',
      format: 'json'
    }),

    new CustomCompressionPlugin({
      algorithm: 'both',
      threshold: 1024,
      minRatio: 0.8
    }),

    new DependencyAnalyzerPlugin({
      outputFile: 'dependency-analysis.json',
      includeNodeModules: false
    })
  ]
};
```

// ... existing code ...

## 10. Webpack常见面试题

### 10.1 基础概念题

#### 问题1：什么是Webpack？它解决了什么问题？

**答**：
Webpack是一个现代JavaScript应用程序的静态模块打包器(module bundler)。它的主要作用是将项目中的各种资源（JavaScript、CSS、图片等）视为模块，分析它们的依赖关系，并将它们打包成一个或多个bundle。

**解决的主要问题**：

1. **模块化支持**：原生浏览器不支持ES6模块，Webpack可以将模块化代码转换为浏览器可执行的代码
2. **依赖管理**：自动分析和管理模块间的依赖关系
3. **资源处理**：统一处理各种类型的资源文件
4. **代码优化**：提供压缩、Tree Shaking、代码分割等优化功能
5. **开发体验**：热更新、source map等提升开发效率

```javascript
// 示例：模块化开发
// utils.js
export const add = (a, b) => a + b;
export const multiply = (a, b) => a * b;

// main.js
import { add, multiply } from './utils.js';
console.log(add(2, 3)); // 5
console.log(multiply(4, 5)); // 20

// Webpack将这些模块打包成浏览器可执行的代码
```

#### 问题2：Webpack的核心概念有哪些？请详细说明。

**答**：
Webpack有六个核心概念：

1. **Entry（入口）**：
```javascript
module.exports = {
  entry: './src/index.js', // 单入口
  // 或多入口
  entry: {
    app: './src/app.js',
    admin: './src/admin.js'
  }
};
```

2. **Output（输出）**：
```javascript
module.exports = {
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[contenthash].js'
  }
};
```

3. **Loaders（加载器）**：
```javascript
module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  }
};
```

4. **Plugins（插件）**：
```javascript
module.exports = {
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html'
    })
  ]
};
```

5. **Mode（模式）**：
```javascript
module.exports = {
  mode: 'production' // 'development' | 'production' | 'none'
};
```

6. **Module（模块）**：在Webpack中，一切皆模块，包括JS文件、CSS文件、图片等。

#### 问题3：Loader和Plugin的区别是什么？

**答**：
Loader和Plugin是Webpack中两个不同的概念，它们的作用机制和使用场景有明显区别：

**Loader（加载器）**：
- **作用**：转换文件，将非JavaScript文件转换为Webpack能够处理的模块
- **工作时机**：在模块加载时，对单个文件进行转换
- **执行方式**：链式调用，从右到左执行
- **配置位置**：在`module.rules`中配置

```javascript
// Loader配置示例
module.exports = {
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [
          'style-loader',    // 将CSS注入DOM
          'css-loader',      // 处理CSS文件
          'sass-loader'      // 编译Sass到CSS
        ]
      }
    ]
  }
};

// 自定义Loader
module.exports = function(source) {
  // 处理源代码
  return source.replace(/console\.log/g, '// console.log');
};
```

**Plugin（插件）**：
- **作用**：扩展Webpack功能，执行更广泛的任务
- **工作时机**：在整个编译生命周期中，在特定时机执行
- **执行方式**：监听Webpack的钩子事件
- **配置位置**：在`plugins`数组中配置

```javascript
// Plugin配置示例
module.exports = {
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html'
    }),
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash].css'
    })
  ]
};

// 自定义Plugin
class MyPlugin {
  apply(compiler) {
    compiler.hooks.emit.tap('MyPlugin', (compilation) => {
      // 在生成文件前执行
      console.log('正在生成bundle...');
    });
  }
}
```

**对比总结**：

| 特性 | Loader | Plugin |
|------|--------|--------|
| 作用范围 | 单个文件转换 | 整个构建过程 |
| 执行时机 | 模块加载时 | 编译生命周期各个阶段 |
| 配置方式 | module.rules | plugins数组 |
| 主要功能 | 文件转换 | 功能扩展、优化、资源管理 |

### 10.2 配置与使用题

#### 问题4：如何配置Webpack处理不同类型的文件？

**答**：
Webpack通过不同的Loader来处理各种类型的文件：

```javascript
module.exports = {
  module: {
    rules: [
      // JavaScript/TypeScript处理
      {
        test: /\.(js|jsx|ts|tsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/preset-env',
              '@babel/preset-react',
              '@babel/preset-typescript'
            ]
          }
        }
      },

      // CSS处理
      {
        test: /\.css$/,
        use: [
          process.env.NODE_ENV === 'production'
            ? MiniCssExtractPlugin.loader
            : 'style-loader',
          'css-loader',
          'postcss-loader'
        ]
      },

      // SCSS处理
      {
        test: /\.scss$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: true, // 启用CSS Modules
              localIdentName: '[name]__[local]--[hash:base64:5]'
            }
          },
          'sass-loader'
        ]
      },

      // 图片处理（Webpack 5）
      {
        test: /\.(png|jpg|jpeg|gif|svg)$/i,
        type: 'asset',
        parser: {
          dataUrlCondition: {
            maxSize: 8 * 1024 // 8KB以下转base64
          }
        },
        generator: {
          filename: 'images/[name].[hash:8][ext]'
        }
      },

      // 字体处理
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'fonts/[name].[hash:8][ext]'
        }
      },

      // JSON处理（内置支持）
      {
        test: /\.json$/,
        type: 'json'
      },

      // Vue文件处理
      {
        test: /\.vue$/,
        use: 'vue-loader'
      }
    ]
  }
};
```

#### 问题5：如何优化Webpack构建速度？

**答**：
Webpack构建速度优化可以从多个角度进行：

**1. 缓存优化**：
```javascript
module.exports = {
  // Webpack 5内置缓存
  cache: {
    type: 'filesystem',
    cacheDirectory: path.resolve(__dirname, '.temp_cache')
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader',
          options: {
            cacheDirectory: true // 启用Babel缓存
          }
        }
      }
    ]
  }
};
```

**2. 并行处理**：
```javascript
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  optimization: {
    minimizer: [
      new TerserPlugin({
        parallel: true // 并行压缩
      })
    ]
  },

  plugins: [
    // 多进程Loader
    new (require('thread-loader'))()
  ]
};
```

**3. 减少解析范围**：
```javascript
module.exports = {
  resolve: {
    modules: [
      path.resolve(__dirname, 'src'),
      'node_modules'
    ],
    extensions: ['.js', '.jsx'], // 减少扩展名
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        include: path.resolve(__dirname, 'src'), // 限制处理范围
        exclude: /node_modules/
      }
    ]
  }
};
```

**4. DLL预编译**：
```javascript
// webpack.dll.js
module.exports = {
  entry: {
    vendor: ['react', 'react-dom', 'lodash']
  },
  output: {
    library: '[name]_library',
    filename: '[name].dll.js'
  },
  plugins: [
    new webpack.DllPlugin({
      name: '[name]_library',
      path: path.resolve(__dirname, 'dist/[name].manifest.json')
    })
  ]
};

// webpack.config.js
module.exports = {
  plugins: [
    new webpack.DllReferencePlugin({
      manifest: require('./dist/vendor.manifest.json')
    })
  ]
};
```

**5. 开发环境优化**：
```javascript
module.exports = {
  mode: 'development',
  devtool: 'eval-cheap-module-source-map', // 快速source map
  optimization: {
    removeAvailableModules: false,
    removeEmptyChunks: false,
    splitChunks: false
  }
};
```

#### 问题6：Webpack如何实现代码分割？

**答**：
Webpack提供了三种代码分割方式：

**1. 入口分割**：
```javascript
module.exports = {
  entry: {
    main: './src/index.js',
    vendor: './src/vendor.js'
  }
};
```

**2. 动态导入**：
```javascript
// 异步加载模块
import('./math.js')
  .then(math => {
    console.log(math.add(2, 3));
  });

// 使用async/await
async function loadMath() {
  const math = await import('./math.js');
  return math.add(2, 3);
}

// React懒加载
const LazyComponent = React.lazy(() => import('./LazyComponent'));
```

**3. SplitChunks插件**：
```javascript
module.exports = {
  optimization: {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        // 第三方库
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
          priority: 10
        },
        // React相关
        react: {
          test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
          name: 'react',
          chunks: 'all',
          priority: 20
        },
        // 公共代码
        common: {
          name: 'common',
          chunks: 'all',
          minChunks: 2,
          priority: 5,
          reuseExistingChunk: true
        }
      }
    }
  }
};
```

**代码分割示例**：
```javascript
// 路由级别的代码分割
const routes = [
  {
    path: '/home',
    component: () => import('./pages/Home.vue')
  },
  {
    path: '/about',
    component: () => import('./pages/About.vue')
  }
];

// 组件级别的代码分割
function MyComponent() {
  const [showModal, setShowModal] = useState(false);
  const [Modal, setModal] = useState(null);

  const openModal = async () => {
    if (!Modal) {
      const { default: ModalComponent } = await import('./Modal');
      setModal(() => ModalComponent);
    }
    setShowModal(true);
  };

  return (
    <div>
      <button onClick={openModal}>打开弹窗</button>
      {showModal && Modal && <Modal />}
    </div>
  );
}
```

### 10.3 高级特性题

#### 问题7：什么是Tree Shaking？如何配置？

**答**：
Tree Shaking是一种通过静态分析消除未使用代码的优化技术，类似于"摇树"把枯叶摇掉。

**工作原理**：
1. ES6模块的静态结构特性
2. 标记未使用的代码
3. 在压缩阶段移除未使用的代码

**配置示例**：
```javascript
// package.json
{
  "sideEffects": false // 标记项目无副作用
}

// 或者指定有副作用的文件
{
  "sideEffects": [
    "*.css",
    "*.scss",
    "./src/polyfills.js"
  ]
}

// webpack.config.js
module.exports = {
  mode: 'production', // 生产模式自动启用
  optimization: {
    usedExports: true, // 标记未使用的导出
    minimize: true,    // 启用压缩
    sideEffects: false // 无副作用
  }
};
```

**Tree Shaking示例**：
```javascript
// utils.js
export function add(a, b) {
  return a + b;
}

export function multiply(a, b) {
  return a * b;
}

export function subtract(a, b) { // 未使用，会被摇掉
  return a - b;
}

// main.js
import { add } from './utils.js'; // 只导入需要的函数
console.log(add(1, 2));

// 最终打包结果只包含add函数，subtract会被移除
```

**优化建议**：
```javascript
// 1. 使用ES6模块
import { debounce } from 'lodash-es'; // ✅ 支持Tree Shaking
const _ = require('lodash'); // ❌ 不支持Tree Shaking

// 2. 避免副作用
// ❌ 有副作用
export function setupGlobalHandler() {
  window.addEventListener('click', handler);
}

// ✅ 无副作用
export function createHandler() {
  return function handler() {
    // ...
  };
}

// 3. 使用/*#__PURE__*/注释
const result = /*#__PURE__*/ complexCalculation();
```

#### 问题8：Webpack的热更新（HMR）原理是什么？

**答**：
热模块替换（Hot Module Replacement，HMR）允许在运行时更新模块，而无需完全刷新页面。

**工作原理**：

1. **监听文件变化**：webpack-dev-server监听文件系统变化
2. **重新编译**：文件变化时，只重新编译改变的模块
3. **推送更新**：通过WebSocket将更新推送到浏览器
4. **模块替换**：浏览器端的HMR runtime替换旧模块

**实现架构**：
```
文件系统 → Webpack Compiler → HMR Server → WebSocket → HMR Runtime → 浏览器
    ↓           ↓              ↓          ↓          ↓
  文件变化   重新编译        推送更新   接收更新    模块替换
```

**配置示例**：
```javascript
// webpack.config.js
module.exports = {
  devServer: {
    hot: true, // 启用HMR
    hotOnly: true, // 构建失败时不刷新页面
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ]
};

// 应用代码中使用HMR API
if (module.hot) {
  // 接受自身更新
  module.hot.accept();

  // 接受依赖模块更新
  module.hot.accept('./math.js', function() {
    // 当math.js更新时执行的回调
    console.log('math.js模块已更新');
  });

  // 处理模块销毁
  module.hot.dispose(function(data) {
    // 清理工作
    clearInterval(timer);
  });
}
```

**React HMR实现**：
```javascript
// React组件的HMR
import React from 'react';
import { hot } from 'react-hot-loader/root';

function App() {
  return <div>Hello World</div>;
}

export default hot(App);

// 或使用React Fast Refresh（推荐）
// webpack.config.js
module.exports = {
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        use: {
          loader: 'babel-loader',
          options: {
            plugins: ['react-refresh/babel']
          }
        }
      }
    ]
  },
  plugins: [
    new ReactRefreshWebpackPlugin()
  ]
};
```

#### 问题9：Webpack 5有哪些新特性？

**答**：
Webpack 5引入了多项重要特性和改进：

**1. Module Federation（模块联邦）**：
```javascript
// 主应用配置
module.exports = {
  plugins: [
    new ModuleFederationPlugin({
      name: 'shell',
      remotes: {
        mfApp: 'mfApp@http://localhost:3001/remoteEntry.js'
      }
    })
  ]
};

// 远程应用配置
module.exports = {
  plugins: [
    new ModuleFederationPlugin({
      name: 'mfApp',
      filename: 'remoteEntry.js',
      exposes: {
        './Button': './src/Button'
      }
    })
  ]
};

// 使用远程模块
const RemoteButton = React.lazy(() => import('mfApp/Button'));
```

**2. Asset Modules（资源模块）**：
```javascript
module.exports = {
  module: {
    rules: [
      {
        test: /\.png$/,
        type: 'asset/resource' // 替代file-loader
      },
      {
        test: /\.svg$/,
        type: 'asset/inline' // 替代url-loader
      },
      {
        test: /\.txt$/,
        type: 'asset/source' // 替代raw-loader
      },
      {
        test: /\.jpg$/,
        type: 'asset', // 自动选择
        parser: {
          dataUrlCondition: {
            maxSize: 8 * 1024
          }
        }
      }
    ]
  }
};
```

**3. 改进的缓存机制**：
```javascript
module.exports = {
  cache: {
    type: 'filesystem',
    version: '1.0',
    cacheDirectory: path.resolve(__dirname, '.temp_cache'),
    store: 'pack',
    buildDependencies: {
      config: [__filename],
      tsconfig: [path.resolve(__dirname, 'tsconfig.json')]
    }
  }
};
```

**4. 更好的Tree Shaking**：
```javascript
// 支持嵌套的tree shaking
import { a } from './math';
// 如果math模块导出{a: {b: function}}, 现在可以更好地摇掉未使用的部分
```

**5. Node.js Polyfills移除**：
```javascript
module.exports = {
  resolve: {
    fallback: {
      "crypto": require.resolve("crypto-browserify"),
      "stream": require.resolve("stream-browserify"),
      "path": require.resolve("path-browserify")
    }
  }
};
```

**6. 新的优化选项**：
```javascript
module.exports = {
  optimization: {
    // 新的chunk算法
    chunkIds: 'deterministic',
    moduleIds: 'deterministic',

    // 实验性的realContentHash
    realContentHash: true,

    // SplitChunks改进
    splitChunks: {
      minSize: 20000,
      maxSize: 244000
    }
  }
};
```

### 10.4 实战问题题

#### 问题10：如何分析和优化Webpack包大小？

**答**：
包大小分析和优化是前端性能优化的重要环节：

**1. 包大小分析工具**：
```javascript
// webpack-bundle-analyzer
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
  plugins: [
    new BundleAnalyzerPlugin({
      analyzerMode: 'static',
      reportFilename: 'bundle-report.html',
      openAnalyzer: false
    })
  ]
};

// 运行分析
npm run build -- --analyze
```

**2. 使用webpack-bundle-analyzer查看结果**：
```bash
# 安装分析工具
npm install --save-dev webpack-bundle-analyzer

# 生成分析报告
npx webpack-bundle-analyzer dist/static/js/*.js

# 可视化分析结果显示：
# - 每个模块的大小
# - 重复的依赖
# - 哪些模块占用空间最大
```

**3. 优化策略**：
```javascript
// A. 代码分割优化
module.exports = {
  optimization: {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        // 分离第三方库
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
          priority: 10
        },
        // 分离常用库
        common: {
          name: 'common',
          chunks: 'all',
          minChunks: 2,
          priority: 5
        }
      }
    }
  }
};

// B. 使用更小的替代库
// ❌ 使用整个lodash (70KB)
import _ from 'lodash';

// ✅ 只导入需要的函数 (2KB)
import debounce from 'lodash/debounce';

// ✅ 使用更小的替代
import debounce from 'just-debounce-it'; // 1KB

// C. 动态导入大型库
async function loadCharts() {
  const { Chart } = await import('chart.js'); // 仅在需要时加载
  return Chart;
}

// D. 条件加载
if (process.env.NODE_ENV === 'development') {
  import('./devTools').then(devTools => devTools.init());
}
```

**4. 压缩优化**：
```javascript
const TerserPlugin = require('terser-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

module.exports = {
  optimization: {
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          compress: {
            drop_console: true, // 移除console
            drop_debugger: true, // 移除debugger
            pure_funcs: ['console.log'] // 移除特定函数调用
          }
        }
      }),
      new CssMinimizerPlugin()
    ]
  }
};
```

**5. 外部化大型依赖**：
```javascript
module.exports = {
  externals: {
    'react': 'React',
    'react-dom': 'ReactDOM',
    'lodash': '_'
  }
};

// HTML中引入CDN
<script src="https://unpkg.com/react@17/umd/react.production.min.js"></script>
<script src="https://unpkg.com/react-dom@17/umd/react-dom.production.min.js"></script>
```

#### 问题11：如何配置多环境的Webpack配置？

**答**：
多环境配置是实际项目中的常见需求，可以通过以下方式实现：

**1. 基础配置分离**：
```javascript
// webpack.common.js - 公共配置
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    clean: true
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: 'babel-loader'
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html'
    })
  ]
};

// webpack.dev.js - 开发环境
const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'eval-cheap-module-source-map',
  devServer: {
    hot: true,
    port: 3000,
    open: true
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  }
});

// webpack.prod.js - 生产环境
const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = merge(common, {
  mode: 'production',
  devtool: 'source-map',
  output: {
    filename: '[name].[contenthash].js'
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader']
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash].css'
    })
  ],
  optimization: {
    minimize: true
  }
});
```

**2. 环境变量配置**：
```javascript
// webpack.config.js
module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';
  const isDevelopment = !isProduction;

  return {
    mode: argv.mode,
    devtool: isProduction ? 'source-map' : 'eval-cheap-module-source-map',

    plugins: [
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(argv.mode),
        'process.env.API_URL': JSON.stringify(
          isProduction
            ? 'https://api.production.com'
            : 'http://localhost:3001'
        )
      }),

      // 条件插件
      isDevelopment && new webpack.HotModuleReplacementPlugin(),
      isProduction && new MiniCssExtractPlugin()
    ].filter(Boolean)
  };
};
```

**3. 多套环境配置**：
```javascript
// config/webpack.base.js
module.exports = {
  // 基础配置
};

// config/webpack.dev.js
module.exports = merge(baseConfig, {
  // 开发环境特定配置
});

// config/webpack.test.js
module.exports = merge(baseConfig, {
  // 测试环境特定配置
});

// config/webpack.staging.js
module.exports = merge(baseConfig, {
  // 预发布环境特定配置
});

// config/webpack.prod.js
module.exports = merge(baseConfig, {
  // 生产环境特定配置
});

// package.json
{
  "scripts": {
    "dev": "webpack serve --config config/webpack.dev.js",
    "build:test": "webpack --config config/webpack.test.js",
    "build:staging": "webpack --config config/webpack.staging.js",
    "build:prod": "webpack --config config/webpack.prod.js"
  }
}
```

**4. 环境变量文件**：
```javascript
// .env.development
NODE_ENV=development
API_URL=http://localhost:3001
DEBUG=true

// .env.production
NODE_ENV=production
API_URL=https://api.production.com
DEBUG=false

// webpack配置中使用dotenv
const dotenv = require('dotenv');
const env = dotenv.config({
  path: `.env.${process.env.NODE_ENV || 'development'}`
}).parsed;

module.exports = {
  plugins: [
    new webpack.DefinePlugin({
      'process.env': JSON.stringify(env)
    })
  ]
};
```

#### 问题12：如何处理Webpack构建中的常见错误？

**答**：
Webpack构建过程中会遇到各种错误，以下是常见错误及解决方案：

**1. 模块解析错误**：
```bash
# 错误信息
Module not found: Error: Can't resolve './component' in '/src'

# 解决方案
module.exports = {
  resolve: {
    // 添加文件扩展名
    extensions: ['.js', '.jsx', '.ts', '.tsx'],

    // 配置别名
    alias: {
      '@': path.resolve(__dirname, 'src'),
      'components': path.resolve(__dirname, 'src/components')
    },

    // 指定模块搜索目录
    modules: [
      path.resolve(__dirname, 'src'),
      'node_modules'
    ]
  }
};
```

**2. 内存溢出错误**：
```bash
# 错误信息
FATAL ERROR: Ineffective mark-compacts near heap limit Allocation failed - JavaScript heap out of memory

# 解决方案
# package.json
{
  "scripts": {
    "build": "node --max_old_space_size=4096 node_modules/.bin/webpack"
  }
}

# 或使用increase-memory-limit
npm install -g increase-memory-limit
increase-memory-limit
```

**3. Loader处理错误**：
```javascript
// 错误：无法处理某种文件类型
// 解决方案：添加相应的loader
module.exports = {
  module: {
    rules: [
      {
        test: /\.svg$/,
        use: {
          loader: '@svgr/webpack',
          options: {
            icon: true
          }
        }
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        type: 'asset/resource'
      }
    ]
  }
};
```

**4. 循环依赖警告**：
```javascript
// 安装循环依赖检测插件
const CircularDependencyPlugin = require('circular-dependency-plugin');

module.exports = {
  plugins: [
    new CircularDependencyPlugin({
      exclude: /node_modules/,
      failOnError: true,
      allowAsyncCycles: false,
      cwd: process.cwd()
    })
  ]
};

// 解决循环依赖
// ❌ 循环依赖
// a.js
import { b } from './b.js';
export const a = 'a';

// b.js
import { a } from './a.js';
export const b = 'b';

// ✅ 正确方式
// 将共同依赖提取到第三个文件
// shared.js
export const shared = 'shared';

// a.js
import { shared } from './shared.js';
export const a = 'a';

// b.js
import { shared } from './shared.js';
export const b = 'b';
```

**5. 版本兼容性问题**：
```javascript
// 检查和锁定版本
{
  "devDependencies": {
    "webpack": "^5.75.0",
    "webpack-cli": "^4.10.0",
    "babel-loader": "^8.2.5"
  },
  "resolutions": {
    "webpack": "5.75.0"
  }
}

// 使用browserslist配置目标浏览器
// .browserslistrc
> 1%
last 2 versions
not ie <= 8

// babel.config.js
module.exports = {
  presets: [
    ['@babel/preset-env', {
      useBuiltIns: 'usage',
      corejs: 3
    }]
  ]
};
```

**调试技巧**：
```javascript
// 1. 详细错误信息
module.exports = {
  stats: {
    errorDetails: true,
    colors: true,
    modules: true,
    reasons: true
  }
};

// 2. 分析构建过程
const SpeedMeasurePlugin = require('speed-measure-webpack-plugin');
const smp = new SpeedMeasurePlugin();

module.exports = smp.wrap({
  // webpack配置
});

// 3. 使用webpack-bundle-analyzer
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
  plugins: [
    process.env.ANALYZE && new BundleAnalyzerPlugin()
  ].filter(Boolean)
};
```

#### 问题13：Webpack中的文件hash有哪几种？各自的作用和使用场景是什么？

**答**：
Webpack提供了三种不同的hash值来控制文件名的生成，用于实现长期缓存策略：

**1. hash（构建hash）**：
- **特点**：整个项目构建的hash，只要项目中有文件修改，所有文件的hash都会改变
- **使用场景**：不推荐在生产环境使用，因为会导致所有文件缓存失效

```javascript
module.exports = {
  output: {
    filename: '[name].[hash].js',
    path: path.resolve(__dirname, 'dist')
  }
};

// 构建结果示例：
// main.a1b2c3d4.js
// vendor.a1b2c3d4.js
// 如果任何文件发生变化，所有文件的hash都变为：e5f6g7h8
```

**2. chunkhash（chunk hash）**：
- **特点**：根据chunk内容生成，同一个chunk中的文件共享同一个hash
- **使用场景**：适用于代码分割场景，可以实现更细粒度的缓存控制

```javascript
module.exports = {
  output: {
    filename: '[name].[chunkhash].js'
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].[chunkhash].css' // CSS和JS会有相同的hash
    })
  ]
};

// 构建结果示例：
// main.abc123.js (主入口chunk)
// vendor.def456.js (第三方库chunk)
// common.ghi789.js (公共代码chunk)
```

**3. contenthash（内容hash）**：
- **特点**：根据文件内容生成，文件内容不变则hash不变
- **使用场景**：最细粒度的缓存控制，推荐在生产环境使用

```javascript
module.exports = {
  output: {
    filename: '[name].[contenthash].js'
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash].css' // CSS有独立的contenthash
    })
  ],
  optimization: {
    moduleIds: 'deterministic', // 确保模块ID稳定
    chunkIds: 'deterministic'   // 确保chunk ID稳定
  }
};

// 构建结果示例：
// main.abc123.js
// main.def456.css
// 只有当对应文件内容发生变化时，hash才会改变
```

**对比总结**：

| Hash类型 | 影响范围 | 变化条件 | 推荐使用场景 |
|---------|---------|---------|------------|
| hash | 全局 | 任何文件变化 | 开发环境或简单项目 |
| chunkhash | chunk级别 | chunk内任何文件变化 | 代码分割场景 |
| contenthash | 文件级别 | 文件内容变化 | 生产环境（推荐） |

**实际配置示例**：
```javascript
// 生产环境最佳实践配置
module.exports = {
  mode: 'production',
  entry: {
    main: './src/index.js',
    vendor: ['react', 'react-dom']
  },
  output: {
    filename: '[name].[contenthash:8].js',
    chunkFilename: '[name].[contenthash:8].chunk.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader']
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash:8].css',
      chunkFilename: '[name].[contenthash:8].chunk.css'
    }),
    new HtmlWebpackPlugin({
      template: './public/index.html',
      filename: 'index.html'
    })
  ],
  optimization: {
    moduleIds: 'deterministic',
    chunkIds: 'deterministic',
    runtimeChunk: 'single', // 提取runtime到单独文件
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all'
        }
      }
    }
  }
};
```

#### 问题14：如何优化Webpack的长期缓存策略？

**答**：
长期缓存策略的目标是最大化浏览器缓存的利用率，减少重复下载：

**1. 使用contenthash**：
```javascript
module.exports = {
  output: {
    filename: '[name].[contenthash:8].js',
    chunkFilename: '[name].[contenthash:8].chunk.js'
  }
};
```

**2. 分离runtime chunk**：
```javascript
module.exports = {
  optimization: {
    runtimeChunk: 'single' // 或者 runtimeChunk: { name: 'runtime' }
  }
};

// 为什么要分离runtime？
// runtime包含webpack的模块加载逻辑，经常变化
// 分离后可以避免影响业务代码的缓存
```

**3. 稳定的模块ID**：
```javascript
module.exports = {
  optimization: {
    moduleIds: 'deterministic', // 确保模块ID稳定
    chunkIds: 'deterministic'   // 确保chunk ID稳定
  }
};

// Webpack 4中需要使用HashedModuleIdsPlugin
const webpack = require('webpack');
module.exports = {
  plugins: [
    new webpack.HashedModuleIdsPlugin()
  ]
};
```

**4. 合理的代码分割**：
```javascript
module.exports = {
  optimization: {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        // 第三方库（变化频率低）
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          priority: 10,
          chunks: 'all'
        },
        // 公共代码
        common: {
          name: 'common',
          minChunks: 2,
          priority: 5,
          chunks: 'all',
          reuseExistingChunk: true
        },
        // React相关（单独分离）
        react: {
          test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
          name: 'react',
          priority: 20,
          chunks: 'all'
        }
      }
    }
  }
};
```

**5. CSS分离和hash策略**：
```javascript
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: '../' // 处理CSS中的相对路径
            }
          },
          'css-loader'
        ]
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash:8].css',
      chunkFilename: '[name].[contenthash:8].chunk.css'
    })
  ]
};
```

**6. 图片资源的hash处理**：
```javascript
module.exports = {
  module: {
    rules: [
      {
        test: /\.(png|jpg|jpeg|gif|svg)$/i,
        type: 'asset',
        parser: {
          dataUrlCondition: {
            maxSize: 8 * 1024 // 8KB以下内联
          }
        },
        generator: {
          filename: 'images/[name].[contenthash:8][ext]'
        }
      }
    ]
  }
};
```

**7. 处理动态导入的缓存**：
```javascript
// 使用魔法注释指定chunk名称
const LazyComponent = React.lazy(() =>
  import(/* webpackChunkName: "lazy-component" */ './LazyComponent')
);

// webpack配置
module.exports = {
  output: {
    chunkFilename: '[name].[contenthash:8].chunk.js'
  }
};
```

**8. 完整的缓存优化配置示例**：
```javascript
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  mode: 'production',
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[contenthash:8].js',
    chunkFilename: '[name].[contenthash:8].chunk.js',
    assetModuleFilename: 'assets/[name].[contenthash:8][ext]',
    clean: true
  },

  optimization: {
    moduleIds: 'deterministic',
    chunkIds: 'deterministic',

    // 分离runtime
    runtimeChunk: 'single',

    // 代码分割
    splitChunks: {
      chunks: 'all',
      maxSize: 244000, // 244KB
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          priority: 10
        },
        common: {
          name: 'common',
          minChunks: 2,
          priority: 5,
          reuseExistingChunk: true
        }
      }
    }
  },

  module: {
    rules: [
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader']
      },
      {
        test: /\.(png|jpg|jpeg|gif|svg)$/i,
        type: 'asset',
        generator: {
          filename: 'images/[name].[contenthash:8][ext]'
        }
      }
    ]
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true
      }
    }),

    new MiniCssExtractPlugin({
      filename: '[name].[contenthash:8].css',
      chunkFilename: '[name].[contenthash:8].chunk.css'
    })
  ]
};
```

**缓存策略验证**：
```javascript
// 测试缓存策略是否有效的方法

// 1. 构建分析
npm run build
// 记录文件hash值

// 2. 修改单个文件
// 只修改一个组件文件

// 3. 重新构建
npm run build
// 检查hash变化情况

// 期望结果：
// ✅ 只有修改的文件和包含它的chunk的hash发生变化
// ✅ vendor、common等未修改的chunk的hash保持不变
// ✅ runtime chunk的hash可能会变化（正常现象）
```

**HTTP缓存配置建议**：
```nginx
# Nginx配置示例
location ~* \.(js|css)$ {
  if ($request_filename ~* ".*\.([a-f0-9]{8})\.(js|css)$") {
    # 有hash的文件可以长期缓存
    expires 1y;
    add_header Cache-Control "public, immutable";
  }
}

location ~* \.(html)$ {
  # HTML文件不缓存或短期缓存
  expires 0;
  add_header Cache-Control "no-cache, no-store, must-revalidate";
}
```

#### 问题15：Webpack中hash长度和性能的关系是什么？如何选择合适的hash长度？

**答**：
Hash长度直接影响缓存冲突概率和文件名长度，需要在安全性和实用性之间找到平衡：

**1. Hash长度选择**：
```javascript
module.exports = {
  output: {
    filename: '[name].[contenthash:8].js',    // 8位hash（推荐）
    // filename: '[name].[contenthash:6].js', // 6位hash（最小推荐）
    // filename: '[name].[contenthash].js',   // 完整hash（20位，通常不必要）
  }
};

// 不同长度的hash示例：
// 6位: main.a1b2c3.js
// 8位: main.a1b2c3d4.js
// 完整: main.a1b2c3d4e5f6g7h8i9j0.js
```

**2. 冲突概率计算**：
```javascript
/**
 * Hash冲突概率计算
 *
 * 对于16进制hash：
 * - 6位：16^6 = 16,777,216 种可能（约1677万）
 * - 8位：16^8 = 4,294,967,296 种可能（约43亿）
 * - 完整（20位）：16^20 种可能（天文数字）
 *
 * 实际项目中的文件数量通常在几十到几千个，
 * 8位hash已经能够提供足够的安全边际
 */

// 冲突概率估算函数
function hashCollisionProbability(numFiles, hashBits) {
  const totalCombinations = Math.pow(16, hashBits);
  // 生日悖论公式的近似计算
  const probability = 1 - Math.exp(-Math.pow(numFiles, 2) / (2 * totalCombinations));
  return probability;
}

// 示例计算
console.log('1000个文件使用6位hash的冲突概率:',
  hashCollisionProbability(1000, 6).toFixed(6)); // 约0.000030
console.log('1000个文件使用8位hash的冲突概率:',
  hashCollisionProbability(1000, 8).toFixed(10)); // 约0.0000000116
```

**3. 性能影响分析**：
```javascript
// 文件名长度对性能的影响

// 短hash的优势：
// ✅ 文件名更短，减少HTTP头部大小
// ✅ 减少内存占用
// ✅ 提高文件系统操作性能
// ✅ 更好的可读性和调试体验

// 长hash的优势：
// ✅ 更低的冲突概率
// ✅ 更高的安全性

// 实际测试对比
const shortHashFile = 'main.a1b2c3d4.js';        // 17字符
const longHashFile = 'main.a1b2c3d4e5f6g7h8i9j0.js'; // 29字符

// 在大型项目中，文件名长度差异的实际影响：
// - HTTP头部增加约12字节/文件
// - 对于100个文件：增加1.2KB的传输量
// - 影响可以忽略不计
```

**4. 不同场景的推荐配置**：
```javascript
// 小型项目（<100个文件）
module.exports = {
  output: {
    filename: '[name].[contenthash:6].js',
    chunkFilename: '[name].[contenthash:6].chunk.js'
  }
};

// 中型项目（100-1000个文件）- 推荐配置
module.exports = {
  output: {
    filename: '[name].[contenthash:8].js',
    chunkFilename: '[name].[contenthash:8].chunk.js'
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash:8].css'
    })
  ]
};

// 大型项目（>1000个文件）
module.exports = {
  output: {
    filename: '[name].[contenthash:10].js',
    chunkFilename: '[name].[contenthash:10].chunk.js'
  }
};

// 开发环境（不需要hash）
module.exports = {
  mode: 'development',
  output: {
    filename: '[name].js',
    chunkFilename: '[name].chunk.js'
  }
};
```

**5. 自定义hash函数**：
```javascript
// 如果需要自定义hash算法
const crypto = require('crypto');

class CustomHashPlugin {
  apply(compiler) {
    compiler.hooks.compilation.tap('CustomHashPlugin', (compilation) => {
      compilation.hooks.beforeHash.tap('CustomHashPlugin', () => {
        // 自定义hash逻辑
        const customHash = crypto
          .createHash('md5')
          .update(Date.now().toString())
          .digest('hex')
          .substr(0, 8);

        compilation.hash = customHash;
      });
    });
  }
}

module.exports = {
  plugins: [
    new CustomHashPlugin()
  ]
};
```

**6. Hash稳定性优化**：
```javascript
// 确保hash的稳定性和可预测性
module.exports = {
  optimization: {
    // 确保模块ID稳定
    moduleIds: 'deterministic',

    // 确保chunk ID稳定
    chunkIds: 'deterministic',

    // 避免runtime chunk影响其他chunk的hash
    runtimeChunk: 'single',

    // 优化chunk分割以提高缓存效率
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        // 将频繁变化的代码分离
        framework: {
          test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
          name: 'framework',
          chunks: 'all'
        },
        // 将稳定的第三方库分离
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
          priority: -10
        }
      }
    }
  }
};
```

**最佳实践总结**：
1. **8位contenthash**是大多数项目的最佳选择
2. **开发环境不使用hash**，提高构建速度
3. **生产环境使用contenthash**，实现精确缓存控制
4. **配合HTTP缓存策略**，最大化缓存效果
5. **定期监控hash变化**，确保缓存策略有效
