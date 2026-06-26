# tauri-app01-template

<div align="center">
  <img src="./crates/icons/logo.png" alt="tauri-app01-template Logo" width="100">
  <h1>tauri-app01-template</h1>
  <p>[中文文档](https://github.com/minghe36/tauri-app01-template/blob/master/README-zh.md)</p>
  <p><a href="https://github.com/minghe36/tauri-app01-template/blob/master/README.md">英文文档</a></p>
</div>

基于 Tauri v2、React 19、Rust 构建的现代桌面应用模板，目标不是做一个只能演示启动页面的 starter，而是提供一套可以直接进入业务开发的工程底座。

推荐使用这个模板，原因很具体：

- **不是空壳工程**：桌面端、CLI、移动端 shell、i18n、主题、命令系统、测试和质量检查都已经接好，不需要你从零拼装。
- **适合长期维护**：目录边界、状态管理分层、前后端桥接方式、共享包结构都先约定好了，后面功能越做越多时不容易失控。
- **降低 Tauri 入门成本**：如果你熟悉前端但不熟悉 Rust / Tauri，这个模板已经把常见能力接法准备好了，能直接对照着改。
- **减少“工程杂活”**：类型检查、lint、Rust 检查、多语言、主题 token、共享组件这些基础设施都已就位，开发时不用反复补脚手架。
- **适合 AI 协作开发**：仓库结构、文档和规则比较明确，AI 生成代码时更容易遵守同一套约束，不容易越写越乱。

如果你只是要一个最小化 Hello World，这个模板会偏重；但如果你准备做一个要持续迭代、多人协作、跨端扩展的桌面应用，它会比空白 starter 更合适。

配套 UI 项目（开发中）：

- https://github.com/minghe36/tauri-app01-ui

## 技术栈说明

如果你是第一次接触这个仓库，先看这一节最有帮助。

### 前端

- **React 19**
  用来开发桌面应用界面。
- **TypeScript**
  给前端代码加类型约束。
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
  负责样式开发和共享主题 token。
- **Lucide React**
  图标库。

### 状态管理

- **useState**
  管理组件内部临时状态。
- **Zustand**
  管理共享的前端 UI / 应用状态。
- **TanStack Query**
  管理异步和持久化数据流。

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

你不需要从零去拼这些基础设施。

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

如果你现在只想“把应用先跑起来并改界面”，重点看这几个位置：

- `apps/desktop/src`：React 页面和组件
- `apps/desktop/src-tauri/src`：Rust 代码
- `packages/i18n/locales`：前端中英文文案
- `crates/locales`：Rust 端中英文文案
- `packages/css`：主题和全局样式

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

Tauri 不是纯前端项目，它依赖系统原生能力，所以不同系统要先装一些工具。

- macOS：先执行 `xcode-select --install`
- Windows：需要 Visual Studio C++ Build Tools
- Linux：需要安装 Tauri 官方文档中的系统依赖

官方说明：

- https://tauri.app/start/prerequisites/

如果你是新手，建议先把这一步装好，再继续下面的命令。

## 第一次启动项目

### 1. 克隆仓库

```bash
git clone <你的仓库地址>
cd app01-template
```

### 2. 安装依赖

这个仓库要求使用 `npm`，不要用 `pnpm`、`yarn` 或 `bun`。

```bash
npm install
```

### 3. 启动桌面开发环境

```bash
npm run tauri:dev
```

如果一切正常，你会看到桌面应用启动。

## 常用命令，新手先记这几个

### 启动桌面端

```bash
npm run tauri:dev
```

### 只启动前端开发服务器

```bash
npm run dev
```

说明：

- `npm run dev` 只跑 Vite 前端
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

### 做完整检查

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

如果你改了比较多代码，结束前最好跑一次。

## 这个仓库里“开发应用”通常是怎么做的？

可以按下面这个顺序理解：

### 1. 改界面

一般在：

- `apps/desktop/src/components`
- `apps/desktop/src/App.tsx`
- `apps/desktop/src/components/layout`

### 2. 改前端状态

这个仓库有明确规则：

- 组件内部临时状态：`useState`
- 多组件共享的 UI 状态：`Zustand`
- 持久化或异步数据：`TanStack Query`

如果你是新手，先不用把所有状态都放到全局。

### 3. 需要系统能力时写 Rust

比如：

- 文件读写
- 系统通知
- 桌面窗口控制
- 本地数据库

这些代码通常在：

- `apps/desktop/src-tauri/src/commands`

前端不要直接乱写底层系统调用，优先通过 Tauri 的 Rust 命令桥接。

### 4. 加文案时别直接写死

这个项目默认支持中英文。

所以新增用户可见文字时：

- 前端文案加到 `packages/i18n/locales/en.json` 和 `zh.json`
- Rust 文案加到 `crates/locales/en.json` 和 `zh.json`

## 新手第一次改代码，建议从哪里下手？

最简单的练习方式：

### 练习 1：改标题或页面文字

你可以先找：

- `apps/desktop/src/App.tsx`
- `packages/i18n/locales/zh.json`
- `packages/i18n/locales/en.json`

改一条前端文案，确认你能看到界面变化。

### 练习 2：改主题颜色

看这里：

- `packages/css/light.css`
- `packages/css/dark.css`

这里存放全局主题 token。

### 练习 3：改一个组件

看这里：

- `apps/desktop/src/components`
- `packages/components/ui`

如果只是当前桌面端使用，优先改 `apps/desktop/src/components`。
只有确定多个 app 都会复用时，再考虑放到 `packages/components/ui`。

## 这个仓库的几个重要约定

新手最容易踩坑的不是语法，而是“改错地方”。下面这些规则要先知道：

### 1. 用 `npm`

不要换成别的包管理器。

### 2. 这是多应用仓库，不是单应用仓库

不要默认所有东西都在根目录 `src/`。

现代路径通常是：

- `apps/desktop/src/...`
- `apps/desktop/src-tauri/...`
- `packages/...`

### 3. 前端文案和 Rust 文案是分开的

- React 文案：`packages/i18n`
- Rust 文案：`crates/locales`

### 4. 前端状态不要乱放

这个仓库对状态分层很严格。状态一旦影响多个组件或应用流程，就不要散落在很多临时 hook 里。

### 5. 前端访问业务数据不要直接写 SQL

前端应通过 Rust 命令访问业务数据，不要在前端自己拼 SQL。

### 6. 有共享组件就优先复用

UI 组件优先看：

- `packages/components/ui`

不要随手再造一套基础按钮、表单、弹窗。

## 我应该先读哪些文档？

如果你是新手，推荐按这个顺序读：

1. [docs/USING_THIS_TEMPLATE.md](/Users/xiewenhao/Documents/dev/app/app01-template/docs/USING_THIS_TEMPLATE.md)
2. [docs/developer/README.md](/Users/xiewenhao/Documents/dev/app/app01-template/docs/developer/README.md)
3. [docs/developer/architecture-guide.md](/Users/xiewenhao/Documents/dev/app/app01-template/docs/developer/architecture-guide.md)
4. [docs/developer/state-management.md](/Users/xiewenhao/Documents/dev/app/app01-template/docs/developer/state-management.md)
5. [docs/developer/tauri-commands.md](/Users/xiewenhao/Documents/dev/app/app01-template/docs/developer/tauri-commands.md)
6. [docs/developer/i18n-patterns.md](/Users/xiewenhao/Documents/dev/app/app01-template/docs/developer/i18n-patterns.md)

如果你不想一次看太多，至少先读：

- `architecture-guide.md`
- `README.md`

## 常见问题

### `npm install` 成功了，但 `npm run tauri:dev` 失败

大概率不是项目代码问题，而是系统依赖没装全。

优先检查：

- Rust 是否安装
- `xcode-select --install` / Windows Build Tools / Linux 依赖是否安装
- 是否能正常执行 `cargo -V`

### 我改了前端，但桌面端没看到效果

确认你运行的是：

```bash
npm run tauri:dev
```

而不是只跑了：

```bash
npm run dev
```

### 我不知道一个文件该放 `apps` 还是 `packages`

先问自己：

- 这个代码是不是只给桌面端用？

如果是，先放 `apps/desktop`。

只有当它真的要被多个 app 复用时，才放 `packages`。

### 为什么检查这么多？

因为这个模板不是为了“快速堆一个 demo”，而是为了后续继续维护。

这些检查的目的是尽量提前发现：

- 类型错误
- 样式格式问题
- 架构违规
- Rust 警告
- 测试失败

## 推荐的新手开发流程

如果你准备基于这个模板做自己的应用，建议这样开始：

1. 先把项目跑起来
2. 改应用名称、标题和图标
3. 改一两条界面文案
4. 改主题颜色
5. 新增一个简单组件
6. 跑 `npm run check:all`
7. 再开始做真正业务功能

不要一上来就同时改 Rust、数据库、窗口、多语言和发布流程。先把最小闭环跑通。

## 适合什么人？

这个模板适合：

- 想学 Tauri 的前端开发者
- 想做桌面应用的独立开发者
- 想从简单 starter 升级到更规范工程结构的人
- 想让 AI 辅助开发，但又不希望项目结构太乱的人

如果你只是想要一个极简的 Hello World，这个模板会显得偏完整。
如果你想做一个后续真的要维护的应用，这个模板会更合适。

## 相关文档

- 英文说明：[README.md](/Users/xiewenhao/Documents/dev/app/app01-template/README.md)
- 模板使用说明：[docs/USING_THIS_TEMPLATE.md](/Users/xiewenhao/Documents/dev/app/app01-template/docs/USING_THIS_TEMPLATE.md)
- 开发文档入口：[docs/developer/README.md](/Users/xiewenhao/Documents/dev/app/app01-template/docs/developer/README.md)
- 用户文档模板：[docs/userguide/userguide.md](/Users/xiewenhao/Documents/dev/app/app01-template/docs/userguide/userguide.md)

## 许可证

[MIT](LICENSE.md)
