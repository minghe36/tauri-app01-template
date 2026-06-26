# app01-template

这是一个用来开发桌面应用的模板仓库，技术组合是 **Tauri + React + Rust**。

它适合想做跨平台桌面应用的人，尤其适合刚开始接触 Tauri、Rust 或桌面应用开发的新手。这个模板的目标不是只给你一个空项目，而是让你更容易理解：

- 这个项目已经帮你搭好了什么
- 代码应该放在哪里
- 项目应该怎么启动
- 这套技术栈分别负责什么

你可以把它理解成：一个更适合真正开始做产品的桌面应用基础工程。

配套 UI 项目在这里：

- https://github.com/minghe36/tauri-app01-ui

## 这是什么？

这个仓库是一个 **Tauri v2 monorepo 模板**。

简单理解：

- **Tauri** 负责把前端界面打包成桌面应用
- **React** 负责界面开发
- **Rust** 负责桌面端能力、系统访问和性能敏感逻辑
- **npm workspaces** 负责把多个 app 和共享包放在同一个仓库里管理

这不是一个只有单独 `src/` 目录的简单前端项目，而是一个多应用工作区。

## 技术栈说明

如果你是第一次接触这个仓库，先看这一节最有帮助。

### 前端

- **React 19**
  用来开发桌面应用界面。
- **TypeScript**
  给前端代码加类型约束，减少低级错误。
- **Vite**
  负责前端开发服务器和构建流程。

### 桌面运行时

- **Tauri v2**
  负责把前端包装成桌面应用，并提供原生能力桥接。
- **Rust**
  负责 Tauri 命令、文件访问、系统集成和部分应用逻辑。

### UI 层

- **shadcn/ui**
  作为基础组件体系，提供按钮、对话框、表单等常见 UI 基础件。
- **Tailwind CSS v4**
  负责样式开发和主题 token 使用。
- **Lucide React**
  图标库。

### 状态管理

- **useState**
  管理组件内部的临时状态。
- **Zustand**
  管理共享的前端 UI / 应用状态。
- **TanStack Query**
  管理异步数据和持久化数据流。

### 国际化

- **react-i18next**
  前端多语言，文案在 `packages/i18n/locales`。
- **rust-i18n**
  Rust 端多语言，文案在 `crates/locales`。

模板默认支持中文和英文。

### 测试

- **Vitest**
  前端测试运行器。
- **Testing Library**
  React 组件测试工具。
- **cargo test**
  Rust 侧测试。

### 质量工具

- **ESLint**
  JavaScript / TypeScript lint 检查。
- **Prettier**
  代码格式化。
- **ast-grep**
  结构化规则检查，用来约束架构模式。
- **clippy**
  Rust lint 工具。
- **knip**
  检查未使用的代码和依赖。
- **jscpd**
  检查重复代码。

## 这个模板已经帮你准备了什么？

开箱就有这些能力：

- 桌面端应用壳
- CLI 子项目
- 移动端 Tauri shell
- React + TypeScript + Vite 开发环境
- Rust 命令桥接
- 中英文 i18n
- 共享 UI 组件和共享样式 token
- 测试、lint、格式化、Rust 检查
- `check:all` 一键质量检查

你不需要从零开始拼这些基础设施。

## 先理解目录

第一次看这个仓库，最容易迷路。先记住下面这些目录就够了：

```text
apps/
  desktop/     桌面端主应用（最常改）
  cli/         命令行工具
  mobile/      移动端 Tauri shell

packages/
  components/  共享 UI 组件
  css/         共享全局样式和主题 token
  config/      共享配置
  i18n/        前端中英文文案
  shared/      共享状态或公共逻辑

crates/
  locales/     Rust 端多语言文案
  icons/       应用图标资源

docs/
  developer/   开发文档
  userguide/   用户文档模板
```

如果你现在只想“先把应用跑起来并改界面”，重点看：

- `apps/desktop/src`
- `apps/desktop/src-tauri/src`
- `packages/i18n/locales`
- `crates/locales`
- `packages/css`

## 运行前你要安装什么？

至少需要这几个环境：

### 1. Node.js

建议安装 **Node.js 20 或更高版本**。

检查方式：

```bash
node -v
npm -v
```

### 2. Rust

安装 stable 版本即可。

检查方式：

```bash
rustc -V
cargo -V
```

### 3. Tauri 的平台依赖

Tauri 不是纯前端项目，它依赖系统原生能力，所以不同系统需要先装一些系统工具。

- macOS：执行 `xcode-select --install`
- Windows：安装 Visual Studio C++ Build Tools
- Linux：按 Tauri 官方文档安装依赖

官方说明：

- https://tauri.app/start/prerequisites/

如果 `npm install` 成功，但 `npm run tauri:dev` 失败，优先先查这里。

## 第一次启动项目

### 1. 克隆仓库

```bash
git clone <你的仓库地址>
cd app01-template
```

### 2. 安装依赖

这个仓库要求使用 `npm`，不要换成 `pnpm`、`yarn` 或 `bun`。

```bash
npm install
```

### 3. 启动桌面开发环境

```bash
npm run tauri:dev
```

如果一切正常，你会看到桌面应用窗口启动。

## 常用命令

新手先记住这些就够了。

### 启动桌面端

```bash
npm run tauri:dev
```

### 只启动前端开发服务器

```bash
npm run dev
```

区别是：

- `npm run dev` 只跑 Vite
- `npm run tauri:dev` 才是完整桌面应用开发模式

### 打包桌面端

```bash
npm run tauri:build
```

### 跑前端测试

```bash
npm run test:run
```

### 跑 Rust 测试

```bash
npm run rust:test
```

### 跑完整检查

```bash
npm run check:all
```

这个命令会检查：

- TypeScript
- ESLint
- Prettier
- ast-grep
- Rust fmt
- clippy
- Vitest
- cargo test

如果你改了比较多内容，结束前最好跑一次。

## 这个仓库里通常怎么开发？

你可以按下面这个顺序理解。

### 1. 改桌面端界面

大部分 UI 工作在：

- `apps/desktop/src/components`
- `apps/desktop/src/App.tsx`
- `apps/desktop/src/components/layout`

### 2. 处理前端状态

这个仓库有明确约定：

- 组件内部临时状态：`useState`
- 多组件共享的 UI 状态：`Zustand`
- 异步或持久化数据：`TanStack Query`

### 3. 需要原生能力时写 Rust

比如：

- 文件读写
- 系统通知
- 桌面窗口控制
- 本地数据库

这些代码通常在：

- `apps/desktop/src-tauri/src/commands`

### 4. 不要把用户可见文案直接写死

这个模板默认支持中英文。

所以新增用户可见文字时：

- 前端文案放到 `packages/i18n/locales/en.json` 和 `zh.json`
- Rust 文案放到 `crates/locales/en.json` 和 `zh.json`

## 新手第一次改代码，建议从哪里下手？

### 练习 1：改一个标题或文案

先看：

- `apps/desktop/src/App.tsx`
- `packages/i18n/locales/zh.json`
- `packages/i18n/locales/en.json`

### 练习 2：改主题颜色

看这里：

- `packages/css/light.css`
- `packages/css/dark.css`

### 练习 3：改一个组件

看这里：

- `apps/desktop/src/components`
- `packages/components/ui`

如果只是桌面端用，优先放在 `apps/desktop/src/components`。
只有确定多个 app 都会复用时，再考虑放进 `packages/components/ui`。

## 这个仓库的几个重要约定

新手最容易踩坑的不是语法，而是改错地方。下面这些规则要先知道：

### 1. 用 `npm`

不要切换包管理器。

### 2. 这是多应用工作区

不要默认所有东西都在根目录 `src/`。

现代路径通常是：

- `apps/desktop/src/...`
- `apps/desktop/src-tauri/...`
- `packages/...`

### 3. 前端文案和 Rust 文案是分开的

- React 文案：`packages/i18n`
- Rust 文案：`crates/locales`

### 4. 共享状态不要乱放

一旦状态影响多个组件或应用流程，就应该按仓库规则放到合适的状态层里，而不是散落在很多临时 hook 中。

### 5. 前端不要直接写业务 SQL

业务数据访问应通过类型安全的 Rust 命令。

### 6. 先复用共享 UI

在自己新建基础组件前，先检查：

- `packages/components/ui`

## 我应该先读哪些文档？

推荐顺序：

1. [docs/USING_THIS_TEMPLATE.md](/Users/xiewenhao/Documents/dev/app/app01-template/docs/USING_THIS_TEMPLATE.md)
2. [docs/developer/README.md](/Users/xiewenhao/Documents/dev/app/app01-template/docs/developer/README.md)
3. [docs/developer/architecture-guide.md](/Users/xiewenhao/Documents/dev/app/app01-template/docs/developer/architecture-guide.md)
4. [docs/developer/state-management.md](/Users/xiewenhao/Documents/dev/app/app01-template/docs/developer/state-management.md)
5. [docs/developer/tauri-commands.md](/Users/xiewenhao/Documents/dev/app/app01-template/docs/developer/tauri-commands.md)
6. [docs/developer/i18n-patterns.md](/Users/xiewenhao/Documents/dev/app/app01-template/docs/developer/i18n-patterns.md)

如果你只想先抓住重点，先读：

- `architecture-guide.md`
- `docs/developer/README.md`

## 常见问题

### `npm install` 成功了，但 `npm run tauri:dev` 失败

通常不是项目代码问题，更常见的是系统依赖没装齐。

优先检查：

- Rust 是否安装
- 平台工具是否安装
- `cargo -V` 是否能正常执行

### 我改了前端代码，但桌面端没更新

确认你运行的是：

```bash
npm run tauri:dev
```

而不是只跑了：

```bash
npm run dev
```

### 我不知道代码该放 `apps` 还是 `packages`

先问自己：

- 它是不是只给桌面端用？

如果是，先放 `apps/desktop`。
只有真的共享时，才放进 `packages`。

### 为什么检查这么多？

因为这个模板是给可维护项目准备的，不是只为了快速堆一个 demo。

这些检查是为了更早发现：

- 类型错误
- 格式问题
- 架构违规
- Rust 警告
- 测试失败

## 推荐的新手开发流程

如果你准备基于这个模板做自己的应用，建议按这个顺序开始：

1. 先把项目跑起来
2. 改应用名称、标题和图标
3. 改几条界面文案
4. 调整主题颜色
5. 写一个小组件
6. 跑 `npm run check:all`
7. 再开始做真正业务功能

不要一开始就同时改 Rust、数据库、多窗口、多语言和发布流程。先把最小闭环跑通。

## 适合什么人？

这个模板适合：

- 想学 Tauri 的前端开发者
- 想做桌面应用的独立开发者
- 想从极简 starter 升级到更规范结构的人
- 想让 AI 辅助开发，但又不想让项目越写越乱的人

如果你只想要一个很小的 Hello World，这个模板会显得偏重。
如果你想从一开始就站在更可维护的基础上，它会更合适。

## 相关文档

- 英文说明：[README.md](/Users/xiewenhao/Documents/dev/app/app01-template/README.md)
- 模板使用说明：[docs/USING_THIS_TEMPLATE.md](/Users/xiewenhao/Documents/dev/app/app01-template/docs/USING_THIS_TEMPLATE.md)
- 开发文档入口：[docs/developer/README.md](/Users/xiewenhao/Documents/dev/app/app01-template/docs/developer/README.md)
- 用户文档模板：[docs/userguide/userguide.md](/Users/xiewenhao/Documents/dev/app/app01-template/docs/userguide/userguide.md)

## 许可证

[MIT](LICENSE.md)
