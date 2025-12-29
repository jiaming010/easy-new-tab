# iOS Style New Tab - iOS 风格浏览器新标签页

一个功能完善、可自定义的 iOS 风格浏览器新标签页扩展，类似 WeTab 的功能体验，使用 React 和 Tailwind CSS 打造。

## 📱 项目简介

这是一个 Chrome/Edge 浏览器扩展，将你的新标签页替换为 iOS 风格的界面，提供流畅的动画效果和完整的自定义管理功能。

## ✨ 主要特性

### 核心功能
- **🎨 iOS 风格设计**：完美复刻 iOS 主屏幕的视觉效果
- **⏰ 动态时钟**：实时显示当前时间和日期
- **🔍 智能搜索**：内置搜索栏，支持 Google、Bing、百度、DuckDuckGo
- **📂 文件夹管理**：支持创建文件夹，整理你的应用
- **🎯 快速访问**：自定义添加常用网站快捷方式
- **📍 Dock 栏**：底部固定 Dock 栏，快速访问常用应用

### 自定义功能
- **➕ 添加应用**：自由添加任意网站作为应用图标
- **✏️ 编辑应用**：修改应用名称、图标、颜色、网址
- **🗑️ 删除应用**：长按删除不需要的应用
- **🔄 拖拽排序**：长按拖动应用图标进行排序
- **🎨 图标库**：50+ 精美图标可选
- **🌐 网站 Logo**：自动获取网站真实 favicon（新功能！）
- **🌈 颜色主题**：12 种颜色预设
- **🖼️ 背景自定义**：设置自己喜欢的背景图片
- **📥 导入/导出**：支持配置备份和迁移
- **💾 数据持久化**：所有设置自动保存到浏览器

### 动画与交互
- **🌊 流畅动画**：使用 Framer Motion 提供丝滑的交互动画
- **👆 触摸反馈**：点击、悬停、拖拽都有视觉反馈
- **🎭 编辑模式**：一键进入编辑模式管理应用

## 🛠️ 技术栈

- **前端框架**：React 19.2.0
- **构建工具**：Vite 7.2.4
- **样式框架**：Tailwind CSS 3.4.19
- **动画库**：Framer Motion 12.23.26
- **拖拽库**：@dnd-kit/core 6.x
- **图标库**：Lucide React 0.562.0
- **代码规范**：ESLint 9.39.1

## 📦 项目结构

```
easy-new-tab/
├── public/
│   ├── manifest.json       # Chrome 扩展配置文件
│   └── vite.svg           # 扩展图标
├── src/
│   ├── utils/
│   │   ├── iconLibrary.js # 图标库和默认数据
│   │   └── storage.js     # 数据存储封装
│   ├── App.jsx            # 主应用组件
│   ├── App.css            # 应用样式
│   ├── main.jsx           # 应用入口
│   └── index.css          # 全局样式
├── index.html             # HTML 模板
├── vite.config.js         # Vite 配置
├── tailwind.config.js     # Tailwind CSS 配置
├── postcss.config.js      # PostCSS 配置
├── eslint.config.js       # ESLint 配置
└── package.json           # 项目依赖配置
```

## 🚀 快速开始

### 环境要求

- Node.js >= 16.0.0
- npm 或 yarn 包管理器

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

启动后在浏览器访问 `http://localhost:5173` 查看开发效果。

### 构建生产版本

```bash
npm run build
```

构建完成后，会在 `dist` 目录生成扩展文件。

### 代码检查

```bash
npm run lint
```

### 预览构建结果

```bash
npm run preview
```

## 🔧 安装扩展

### Chrome/Edge 浏览器安装步骤

1. 运行 `npm run build` 构建项目
2. 打开浏览器，进入扩展管理页面：
   - Chrome：`chrome://extensions/`
   - Edge：`edge://extensions/`
3. 开启右上角的「开发者模式」
4. 点击「加载已解压的扩展程序」
5. 选择项目的 `dist` 目录
6. 安装完成！打开新标签页即可看到效果

## 💡 使用说明

### 基本操作

1. **添加应用**
   - 点击右上角「编辑」按钮进入编辑模式
   - 点击「添加应用」按钮
   - 填写应用名称、网址
   - 可选：开启「使用网站真实 Logo」自动获取网站图标
   - 或手动选择图标和颜色
   - 点击「保存」

2. **编辑应用**
   - 进入编辑模式
   - 点击应用右上角的「编辑」按钮（蓝色）
   - 修改信息后保存

3. **删除应用**
   - 进入编辑模式
   - 点击应用右上角的「删除」按钮（红色）
   - 确认删除

4. **拖拽排序**
   - 进入编辑模式
   - 长按应用图标上的「拖拽」按钮（灰色）
   - 拖动到目标位置释放

5. **创建文件夹**
   - 进入编辑模式
   - 点击「添加文件夹」按钮
   - 填写文件夹名称
   - 点击「保存」

6. **使用搜索**
   - 在搜索栏输入关键词
   - 按回车键进行搜索

7. **更换背景**
   - 点击 Dock 栏的「设置」图标
   - 输入背景图片 URL
   - 点击「保存」

### 快捷功能

- **搜索栏**：主屏幕中央的搜索框，支持多种搜索引擎
- **Dock 栏**：底部固定栏，放置最常用的应用
- **设置面板**：点击 Dock 栏的设置图标，自定义背景和搜索引擎

## 🎨 自定义配置

### 默认数据

首次使用时会自动加载默认应用，包括：
- Google、GitHub、Gmail、YouTube
- Twitter、Instagram 等常用网站

你可以在 `src/utils/iconLibrary.js` 中修改默认应用列表。

### 图标库

#### 自定义图标
支持 50+ 精美图标，包括：
- 社交媒体：Twitter, Facebook, Instagram, LinkedIn
- 开发工具：GitHub, GitLab, VS Code, Terminal
- 办公软件：Mail, Calendar, Files, Notes
- 更多分类：音乐、视频、购物、工具等

#### 网站真实 Logo ✨
新增自动获取网站 favicon 功能：
- 自动从网站 URL 提取真实 logo
- 支持多个 favicon 服务（Google、Favicon.im、FaviconKit）
- 自动降级机制，确保显示正常
- 适用于所有知名网站和品牌
- 详细使用说明请参考 [FAVICON_GUIDE.md](./FAVICON_GUIDE.md)

### 颜色主题

提供 12 种预设颜色：
- 基础色：灰、黑、白
- 暖色系：红、橙、黄
- 冷色系：绿、青、蓝、靛、紫、粉

### 搜索引擎

支持的搜索引擎：
- Google（默认）
- Bing
- 百度
- DuckDuckGo

## 🔌 扩展权限说明

本扩展需要以下权限：
- `storage`：用于保存你的应用配置和设置
- `newtab`：用于替换浏览器默认新标签页

**隐私承诺**：所有数据仅保存在本地，不会上传到任何服务器。

## 📝 开发指南

### 添加新图标

在 `src/utils/iconLibrary.js` 中：

```javascript
import { YourIcon } from 'lucide-react';

export const iconLibrary = {
    // ... 现有图标
    YourIcon,
};
```

### 修改默认应用

在 `src/utils/iconLibrary.js` 中修改 `DEFAULT_APPS` 数组：

```javascript
export const DEFAULT_APPS = [
    { 
        id: '1', 
        type: 'app', 
        name: '应用名称', 
        url: 'https://example.com', 
        iconName: 'Globe', 
        color: 'bg-blue-500 text-white' 
    },
    // 添加更多...
];
```

### 自定义样式

- 全局样式：`src/index.css`
- 组件样式：`src/App.css`
- Tailwind 配置：`tailwind.config.js`

### 数据存储

使用封装的 storage API：

```javascript
import { storage, STORAGE_KEYS } from './utils/storage';

// 保存数据
await storage.set(STORAGE_KEYS.APPS, appsData);

// 读取数据
const apps = await storage.get(STORAGE_KEYS.APPS, defaultValue);
```

## 🐛 常见问题

### 1. 样式不生效

确保已正确引入 Tailwind CSS：
```css
/* src/index.css */
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### 2. 扩展无法加载

- 检查是否运行了 `npm run build`
- 确认 `manifest.json` 配置正确
- 查看浏览器控制台错误信息

### 3. 数据丢失

- 开发环境使用 localStorage，清除浏览器数据会导致丢失
- 生产环境使用 chrome.storage.local，数据会持久保存

### 4. 拖拽不生效

- 确保已进入编辑模式
- 拖拽手柄是应用右上角的灰色按钮

### 5. 图标显示问题

- 确认图标名称在 `iconLibrary` 中存在
- 默认会使用 `Globe` 图标作为后备

## 🎯 TODO 与计划

- [ ] 添加多页面支持
- [ ] 实现应用分组
- [ ] 支持自定义 CSS
- [ ] 添加天气组件
- [ ] 支持待办事项
- [ ] 添加书签同步
- [ ] 支持多语言

## 📄 许可证

ISC License

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

### 贡献指南

1. Fork 本仓库
2. 创建你的特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交你的修改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开一个 Pull Request

## 📮 联系方式

如有问题或建议，欢迎通过 GitHub Issues 反馈。

## 📚 相关文档

- [FAVICON_GUIDE.md](./FAVICON_GUIDE.md) - 网站 Logo 功能使用指南
- [IMPORT_EXPORT_GUIDE.md](./IMPORT_EXPORT_GUIDE.md) - 导入导出配置指南
- [USER_GUIDE.md](./USER_GUIDE.md) - 详细用户指南
- [DEVELOPMENT.md](./DEVELOPMENT.md) - 开发文档
- [UPDATE_LOG.md](./UPDATE_LOG.md) - 更新日志

## 🙏 致谢

- [React](https://react.dev/) - UI 框架
- [Vite](https://vitejs.dev/) - 构建工具
- [Tailwind CSS](https://tailwindcss.com/) - 样式框架
- [Framer Motion](https://www.framer.com/motion/) - 动画库
- [dnd-kit](https://dndkit.com/) - 拖拽库
- [Lucide](https://lucide.dev/) - 图标库
- [Unsplash](https://unsplash.com/) - 背景图片

---

Made with ❤️ using React + Vite + Tailwind CSS
