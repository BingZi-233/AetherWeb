# AetherWeb - 以太网络

以太网络 是一个基于 Nuxt 3 构建的现代化 Web 应用，为常规网站快速接入Appwrite服务提供模板示例。

## ✨ 特性

- 🔐 **安全授权** - 提供可靠的插件授权机制，保护开发者权益
- 📊 **数据分析** - 完整的使用统计和分析功能
- 🌙 **现代界面** - 支持深色模式的响应式设计
- ⚡ **高性能** - 基于 Nuxt 3 的 SPA 架构
- 🔧 **插件管理** - 完整的插件商店和管理系统

## 🛠️ 技术栈

- **框架**: [Nuxt 3](https://nuxt.com/) - Vue.js 全栈框架
- **UI 库**: [Nuxt UI](https://ui.nuxt.com/) - 基于 Tailwind CSS 的组件库
- **样式**: [Tailwind CSS](https://tailwindcss.com/) - 实用优先的 CSS 框架
- **图标**: [Nuxt Icon](https://github.com/nuxt-modules/icon) - 图标解决方案
- **图片**: [Nuxt Image](https://image.nuxt.com/) - 图片优化
- **字体**: [Nuxt Fonts](https://fonts.nuxt.com/) - 字体优化
- **脚本**: [Nuxt Scripts](https://scripts.nuxt.com/) - 第三方脚本管理
- **后端服务**: [Appwrite](https://appwrite.io/) - 开源后端即服务
- **类型检查**: [TypeScript](https://www.typescriptlang.org/) - 静态类型检查
- **数据验证**: [Zod](https://zod.dev/) - TypeScript 优先的模式验证

## 📁 项目结构

```
AetherWeb/
├── assets/          # 静态资源
├── components/      # Vue 组件
├── composables/     # 组合式函数
├── layouts/         # 布局组件
├── middleware/      # 中间件
├── pages/           # 页面组件
│   ├── auth/        # 认证相关页面
│   └── dashboard/   # 仪表板页面
├── plugins/         # Nuxt 插件
├── public/          # 公共静态文件
├── server/          # 服务端 API
├── stores/          # 状态管理
├── types/           # TypeScript 类型定义
└── utils/           # 工具函数
```

## 🚀 快速开始

### 环境要求

- Node.js 18+ 
- pnpm 9.15.3+

### 安装依赖

```bash
pnpm install
```

### 环境配置

创建 `.env` 文件并配置以下环境变量：

```env
# Appwrite 配置
APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
APPWRITE_PROJECT_ID=your_project_id
APPWRITE_API_KEY=your_api_key
```

### 开发模式

```bash
pnpm dev
```

应用将在 `http://localhost:3000` 启动

### 构建生产版本

```bash
# 构建应用
pnpm build

# 预览构建结果
pnpm preview
```

### 生成静态站点

```bash
pnpm generate
```

## 📱 主要功能

### 用户认证
- 用户注册和登录
- 邮箱验证
- Magic Link 登录
- OAuth 回调处理

## 🔧 配置说明

### Nuxt 配置

项目使用 SPA 模式 (`ssr: false`)，主要配置包括：

- **模块**: 集成了 Fonts、Icon、Image、Scripts 和 UI 模块
- **运行时配置**: 支持 Appwrite 服务配置
- **CSS**: 自定义样式文件

### Appwrite 集成

项目集成了 Appwrite 作为后端服务，提供：
- 用户认证和管理
- 数据库服务
- 文件存储
- 实时功能

## 🤝 贡献

欢迎提交 Issue 和 Pull Request 来帮助改进项目。

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

---

<div align="center">
  <p>由 ❤️BingZi-233 和 ☕Cursor 驱动开发</p>
  <p>© 2024 AetherWeb. All rights reserved.</p>
</div> 