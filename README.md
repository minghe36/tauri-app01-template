# app01-template

This repository is a starter template for building desktop applications with **Tauri + React + Rust**.

It is aimed at developers who want a practical starting point instead of an empty demo. If you are new to Tauri, Rust, or desktop app development, this template is meant to help you understand:

- what is already set up for you
- where to put code
- how to run the project
- which tools are used and why

You can treat it as a "ready-to-build-from" foundation for a real app, not just a toy example.

There is also a companion UI project here:

- https://github.com/minghe36/tauri-app01-ui

## What Is This?

This repository is a **Tauri v2 monorepo template**.

In simple terms:

- **Tauri** packages your frontend as a desktop app
- **React** builds the user interface
- **Rust** handles native desktop features, system access, and performance-sensitive logic
- **npm workspaces** keep multiple apps and shared packages in one repository

This is not a single `src/` frontend app. It is a multi-app workspace.

## Tech Stack

If you are new to the project, this is the most important section to understand first.

### Frontend

- **React 19**
  Used to build the desktop UI.
- **TypeScript**
  Adds static types to frontend code.
- **Vite**
  Runs the frontend dev server and build pipeline.

### Desktop Runtime

- **Tauri v2**
  Wraps the frontend into a desktop application and exposes native APIs.
- **Rust**
  Powers Tauri commands, file access, system integration, and app-side logic.

### UI Layer

- **shadcn/ui**
  Base component system for dialogs, forms, buttons, and common UI primitives.
- **Tailwind CSS v4**
  Utility-first styling plus shared theme tokens.
- **Lucide React**
  Icon library used across the app.

### State Management

- **useState**
  For local component state.
- **Zustand**
  For shared frontend UI/app state.
- **TanStack Query**
  For async or persistent data flows.

### Internationalization

- **react-i18next**
  Frontend translations in `packages/i18n/locales`.
- **rust-i18n**
  Rust-side translations in `crates/locales`.

The template is set up for Chinese and English by default.

### Testing

- **Vitest**
  Frontend test runner.
- **Testing Library**
  UI testing utilities for React.
- **cargo test**
  Rust-side test runner.

### Quality Tools

- **ESLint**
  JavaScript/TypeScript linting.
- **Prettier**
  Code formatting.
- **ast-grep**
  Structural rules for architecture enforcement.
- **clippy**
  Rust linting.
- **knip**
  Detects unused code and dependencies.
- **jscpd**
  Detects duplication.

## What Is Already Included?

Out of the box, this template already gives you:

- a desktop app shell
- a CLI workspace app
- a mobile Tauri shell
- React + TypeScript + Vite setup
- Rust command bindings
- English and Chinese i18n
- shared UI components and shared CSS tokens
- tests, linting, formatting, and Rust checks
- one-command quality checks with `npm run check:all`

You do not need to assemble these basics from scratch.

## Understand the Repository Layout

The easiest way to get lost in this project is to treat it like a small single-app repo. Start with this map:

```text
apps/
  desktop/     Main desktop app
  cli/         CLI app
  mobile/      Mobile Tauri shell

packages/
  components/  Shared UI components
  css/         Shared global styles and theme tokens
  config/      Shared config
  i18n/        Frontend translations
  shared/      Shared state or common logic

crates/
  locales/     Rust-side translations
  icons/       Shared app icons

docs/
  developer/   Developer documentation
  userguide/   End-user documentation template
```

If your goal is just to get the app running and start changing UI, focus on:

- `apps/desktop/src`
- `apps/desktop/src-tauri/src`
- `packages/i18n/locales`
- `crates/locales`
- `packages/css`

## What Do You Need Installed?

At minimum, install these first.

### 1. Node.js

Use **Node.js 20 or newer**.

Check it with:

```bash
node -v
npm -v
```

### 2. Rust

Use the latest stable toolchain.

Check it with:

```bash
rustc -V
cargo -V
```

### 3. Platform Dependencies for Tauri

Tauri depends on native system tooling, so setup differs by platform.

- macOS: run `xcode-select --install`
- Windows: install Visual Studio C++ Build Tools
- Linux: install the packages listed in the Tauri prerequisites guide

Official guide:

- https://tauri.app/start/prerequisites/

If `npm install` succeeds but `npm run tauri:dev` fails, missing system dependencies are usually the first thing to check.

## First Project Run

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd app01-template
```

### 2. Install dependencies

This repository uses `npm`. Do not switch to `pnpm`, `yarn`, or `bun`.

```bash
npm install
```

### 3. Start the desktop app in development mode

```bash
npm run tauri:dev
```

If everything is configured correctly, the desktop app window should open.

## Common Commands

These are the commands a beginner usually needs first.

### Start the desktop app

```bash
npm run tauri:dev
```

### Start only the frontend dev server

```bash
npm run dev
```

Important difference:

- `npm run dev` starts only Vite
- `npm run tauri:dev` starts the real desktop app workflow

### Build the desktop app

```bash
npm run tauri:build
```

### Run frontend tests

```bash
npm run test:run
```

### Run Rust tests

```bash
npm run rust:test
```

### Run the full quality gate

```bash
npm run check:all
```

That command runs checks for:

- TypeScript
- ESLint
- Prettier
- ast-grep
- Rust formatting
- clippy
- Vitest
- cargo test

If you made non-trivial changes, run it before finishing.

## How Development Usually Works Here

A simple way to think about work in this template:

### 1. Change UI in the desktop app

Most UI work goes into:

- `apps/desktop/src/components`
- `apps/desktop/src/App.tsx`
- `apps/desktop/src/components/layout`

### 2. Add or update frontend state

The repository follows a clear rule:

- local temporary state: `useState`
- shared frontend status/UI state: `Zustand`
- async or persistent data: `TanStack Query`

### 3. Use Rust when native capability is needed

Examples:

- file access
- system notifications
- desktop window control
- local database operations

Those usually live in:

- `apps/desktop/src-tauri/src/commands`

### 4. Do not hardcode user-facing copy

This template supports English and Chinese by default.

So when you add visible text:

- frontend strings go into `packages/i18n/locales/en.json` and `zh.json`
- Rust strings go into `crates/locales/en.json` and `zh.json`

## Good First Changes for Beginners

If you want to learn the repo by editing something small, start here.

### Exercise 1: Change a page label or title

Look at:

- `apps/desktop/src/App.tsx`
- `packages/i18n/locales/en.json`
- `packages/i18n/locales/zh.json`

### Exercise 2: Change theme colors

Look at:

- `packages/css/light.css`
- `packages/css/dark.css`

These files hold shared theme tokens.

### Exercise 3: Edit a component

Look at:

- `apps/desktop/src/components`
- `packages/components/ui`

If a component is desktop-only, prefer `apps/desktop/src/components`.
Only move things into `packages/components/ui` when they are truly shared.

## Important Project Rules

These are the rules beginners usually need to know early.

### 1. Use `npm`

Do not switch package managers.

### 2. This is a multi-app workspace

Do not assume everything belongs in a root `src/` folder.

Modern paths are usually:

- `apps/desktop/src/...`
- `apps/desktop/src-tauri/...`
- `packages/...`

### 3. Frontend and Rust translations are separate

- React translations: `packages/i18n`
- Rust translations: `crates/locales`

### 4. Do not scatter shared state randomly

Once state affects multiple components or application flow, it should follow the project state rules instead of living in ad hoc local hooks.

### 5. Do not put business SQL in the frontend

Business data access should go through typed Rust commands.

### 6. Reuse shared UI first

Before creating new primitives, check:

- `packages/components/ui`

## What Should You Read First?

Recommended reading order for new developers:

1. [docs/USING_THIS_TEMPLATE.md](/Users/xiewenhao/Documents/dev/app/app01-template/docs/USING_THIS_TEMPLATE.md)
2. [docs/developer/README.md](/Users/xiewenhao/Documents/dev/app/app01-template/docs/developer/README.md)
3. [docs/developer/architecture-guide.md](/Users/xiewenhao/Documents/dev/app/app01-template/docs/developer/architecture-guide.md)
4. [docs/developer/state-management.md](/Users/xiewenhao/Documents/dev/app/app01-template/docs/developer/state-management.md)
5. [docs/developer/tauri-commands.md](/Users/xiewenhao/Documents/dev/app/app01-template/docs/developer/tauri-commands.md)
6. [docs/developer/i18n-patterns.md](/Users/xiewenhao/Documents/dev/app/app01-template/docs/developer/i18n-patterns.md)

If you want the shortest path, start with:

- `architecture-guide.md`
- `docs/developer/README.md`

## FAQ

### `npm install` worked, but `npm run tauri:dev` failed

Usually this is not an app-code problem. It is more often a missing platform dependency.

Check:

- whether Rust is installed
- whether platform tooling is installed
- whether `cargo -V` works

### I changed frontend code, but the desktop app did not update

Make sure you ran:

```bash
npm run tauri:dev
```

and not only:

```bash
npm run dev
```

### I do not know whether code belongs in `apps` or `packages`

Ask this first:

- is it only used by the desktop app?

If yes, keep it in `apps/desktop`.
Only move it into `packages` when it is actually shared.

### Why are there so many checks?

Because this template is intended for maintainable app development, not only for quick demos.

The checks are there to catch:

- type errors
- formatting problems
- architecture violations
- Rust warnings
- test failures

## Recommended Beginner Workflow

If you are starting a real app from this template, a good order is:

1. get the project running
2. change app name, title, and icon
3. update a few UI strings
4. tweak theme colors
5. build one small component
6. run `npm run check:all`
7. then start building real product features

Do not try to change Rust, database code, multi-window behavior, i18n, and release setup all at once.

## Who Is This For?

This template is a good fit for:

- frontend developers learning Tauri
- indie developers building desktop apps
- teams that want a more structured base than a minimal starter
- developers who want AI-assisted coding without letting project structure turn messy

If you only want a tiny Hello World app, this template may feel heavy.
If you want a maintainable starting point for a real product, it is a better fit.

## Related Docs

- Chinese README: [README-zh.md](/Users/xiewenhao/Documents/dev/app/app01-template/README-zh.md)
- Template usage guide: [docs/USING_THIS_TEMPLATE.md](/Users/xiewenhao/Documents/dev/app/app01-template/docs/USING_THIS_TEMPLATE.md)
- Developer docs index: [docs/developer/README.md](/Users/xiewenhao/Documents/dev/app/app01-template/docs/developer/README.md)
- User guide template: [docs/userguide/userguide.md](/Users/xiewenhao/Documents/dev/app/app01-template/docs/userguide/userguide.md)

## License

[MIT](LICENSE.md)
