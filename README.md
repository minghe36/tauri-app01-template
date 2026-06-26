# tauri-app01-template

<div align="center">
  <img src="./crates/icons/logo.png" alt="tauri-app01-template Logo" width="100">
  <h1>tauri-app01-template</h1>
  <p>[Chinese README](https://github.com/minghe36/tauri-app01-template/blob/master/README-zh.md)</p>
</div>

A modern desktop application template built with **Tauri v2, React 19, and Rust**. The goal is not to provide a starter that only shows a launch screen, but to provide an engineering foundation you can move straight into real product development with.

The reasons to recommend this template are concrete:

- **It is not an empty shell**: desktop app, CLI, mobile shell, i18n, themes, command system, tests, and quality checks are already wired up, so you do not need to assemble everything from scratch.
- **It is suitable for long-term maintenance**: directory boundaries, state management layers, frontend-backend bridge patterns, and shared package structure are already defined, so the codebase is less likely to collapse as features grow.
- **It lowers the Tauri learning curve**: if you already know frontend development but are new to Rust or Tauri, common integration patterns are already prepared and easy to follow.
- **It reduces engineering overhead**: type checking, linting, Rust checks, i18n, theme tokens, and shared UI infrastructure are already in place, so you do not need to keep rebuilding scaffolding while developing features.
- **It works well with AI-assisted development**: the repository structure, docs, and rules are explicit enough that generated code is more likely to follow the same conventions instead of drifting into chaos.

If you only want a minimal Hello World, this template will feel heavy. But if you want to build a desktop app that will keep evolving, involve collaboration, or expand across platforms, it is a better fit than a blank starter.

Companion UI project (in progress):

- https://github.com/minghe36/tauri-app01-ui

## Tech Stack

If you are new to this repository, this is the best section to understand first.

### Frontend

- **React 19**
  Used to build the desktop app UI.
- **TypeScript**
  Adds type safety to frontend code.
- **Vite**
  Handles the frontend dev server and build pipeline.

### Desktop Runtime

- **Tauri v2**
  Packages the frontend as a desktop app and provides native capability bridges.
- **Rust**
  Powers Tauri commands, file access, system integration, and part of the application logic.

### UI Layer

- **shadcn/ui**
  Base component system for common UI primitives such as buttons, dialogs, and forms.
- **Tailwind CSS v4**
  Used for styling and shared theme tokens.
- **Lucide React**
  Icon library.

### State Management

- **useState**
  For temporary component-local state.
- **Zustand**
  For shared frontend UI / app state.
- **TanStack Query**
  For async and persistent data flows.

### Internationalization

- **react-i18next**
  Frontend i18n, with locale files in `packages/i18n/locales`.
- **rust-i18n**
  Rust-side i18n, with locale files in `crates/locales`.

The template supports Chinese and English by default.

### Testing

- **Vitest**
  Frontend test runner.
- **Testing Library**
  React component testing utilities.
- **cargo test**
  Rust-side tests.

### Quality Tools

- **ESLint**
  JavaScript / TypeScript linting.
- **Prettier**
  Code formatting.
- **ast-grep**
  Structural rule checks used to enforce architecture constraints.
- **clippy**
  Rust linting.
- **knip**
  Detects unused code and dependencies.
- **jscpd**
  Detects duplicate code.

## What Is Already Included?

Out of the box, this template already includes:

- a desktop app shell
- a CLI subproject
- a mobile Tauri shell
- React + TypeScript + Vite setup
- Rust command bindings
- Chinese and English i18n
- shared UI components and shared style tokens
- tests, linting, formatting, and Rust checks
- one-command quality checks with `npm run check:all`

You do not need to assemble these basics from scratch.

## Understand the Repository Layout

The easiest way to get lost in this repository is to treat it like a small single-app repo. Start with this map:

```text
apps/
  desktop/     Main desktop app (most common place to edit)
  cli/         CLI tool
  mobile/      Mobile Tauri shell

packages/
  components/  Shared UI components
  css/         Shared global styles and theme tokens
  config/      Shared config
  i18n/        Frontend translations
  shared/      Shared state or common logic

crates/
  locales/     Rust-side translations
  icons/       App icon resources

docs/
  developer/   Developer documentation
  userguide/   User documentation template
```

If you only want to get the app running and start changing the UI, focus on:

- `apps/desktop/src`: React pages and components
- `apps/desktop/src-tauri/src`: Rust code
- `packages/i18n/locales`: frontend translations
- `crates/locales`: Rust translations
- `packages/css`: themes and global styles

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

Install the stable toolchain.

Check it with:

```bash
rustc -V
cargo -V
```

### 3. Platform Dependencies for Tauri

Tauri is not a frontend-only project. It depends on native system tooling, so different platforms need different setup.

- macOS: run `xcode-select --install`
- Windows: install Visual Studio C++ Build Tools
- Linux: install the packages listed in the Tauri prerequisites guide

Official guide:

- https://tauri.app/start/prerequisites/

If you are a beginner, it is best to install those first before continuing.

## First Project Run

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd app01-template
```

### 2. Install dependencies

This repository requires `npm`. Do not use `pnpm`, `yarn`, or `bun`.

```bash
npm install
```

### 3. Start the desktop development environment

```bash
npm run tauri:dev
```

If everything is set up correctly, the desktop app window should open.

## Common Commands Beginners Should Learn First

### Start the desktop app

```bash
npm run tauri:dev
```

### Start only the frontend dev server

```bash
npm run dev
```

Important difference:

- `npm run dev` starts only the Vite frontend
- `npm run tauri:dev` starts the full desktop app development workflow

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

### Run the full quality check

```bash
npm run check:all
```

That command checks:

- TypeScript
- ESLint
- Prettier
- ast-grep
- Rust fmt
- clippy
- Vitest
- cargo test

If you changed a meaningful amount of code, run it before finishing.

## How Development Usually Works In This Repository

You can think about work in this template in the following order.

### 1. Change UI

Most UI work usually lives in:

- `apps/desktop/src/components`
- `apps/desktop/src/App.tsx`
- `apps/desktop/src/components/layout`

### 2. Change frontend state

This repository has clear rules:

- component-local temporary state: `useState`
- shared UI state across components: `Zustand`
- persistent or async data: `TanStack Query`

If you are new, you do not need to move everything into global state immediately.

### 3. Use Rust when native capability is needed

Examples:

- file reading and writing
- system notifications
- desktop window control
- local database operations

Those usually live in:

- `apps/desktop/src-tauri/src/commands`

Avoid calling low-level system features directly from the frontend. Prefer typed Tauri command bindings.

### 4. Do not hardcode user-facing text

This project supports Chinese and English by default.

So when you add visible text:

- frontend strings go into `packages/i18n/locales/en.json` and `zh.json`
- Rust strings go into `crates/locales/en.json` and `zh.json`

## Good First Changes For Beginners

The easiest way to learn this repo is to start with a small change.

### Exercise 1: Change a title or page label

Start here:

- `apps/desktop/src/App.tsx`
- `packages/i18n/locales/zh.json`
- `packages/i18n/locales/en.json`

Change one frontend string and confirm you can see the UI update.

### Exercise 2: Change theme colors

Look here:

- `packages/css/light.css`
- `packages/css/dark.css`

These files store the shared theme tokens.

### Exercise 3: Edit a component

Look here:

- `apps/desktop/src/components`
- `packages/components/ui`

If it is only used by the current desktop app, prefer `apps/desktop/src/components`.
Only move it into `packages/components/ui` when it is actually shared across apps.

## Important Project Rules

The most common beginner mistake is not syntax. It is editing the wrong place. These rules matter:

### 1. Use `npm`

Do not switch package managers.

### 2. This is a multi-app repository, not a single-app repository

Do not assume everything belongs in a root `src/` folder.

Modern paths are usually:

- `apps/desktop/src/...`
- `apps/desktop/src-tauri/...`
- `packages/...`

### 3. Frontend and Rust translations are separate

- React translations: `packages/i18n`
- Rust translations: `crates/locales`

### 4. Do not scatter frontend state randomly

This repository is strict about state layering. Once state affects multiple components or app flow, it should not stay spread across ad hoc hooks.

### 5. Do not write business SQL directly in the frontend

Frontend business data access should go through Rust commands.

### 6. Reuse shared UI first

For UI primitives, check:

- `packages/components/ui`

Do not create another parallel set of basic buttons, forms, and dialogs unless needed.

## What Should You Read First?

If you are new, read in this order:

1. [docs/USING_THIS_TEMPLATE.md](/Users/xiewenhao/Documents/dev/app/app01-template/docs/USING_THIS_TEMPLATE.md)
2. [docs/developer/README.md](/Users/xiewenhao/Documents/dev/app/app01-template/docs/developer/README.md)
3. [docs/developer/architecture-guide.md](/Users/xiewenhao/Documents/dev/app/app01-template/docs/developer/architecture-guide.md)
4. [docs/developer/state-management.md](/Users/xiewenhao/Documents/dev/app/app01-template/docs/developer/state-management.md)
5. [docs/developer/tauri-commands.md](/Users/xiewenhao/Documents/dev/app/app01-template/docs/developer/tauri-commands.md)
6. [docs/developer/i18n-patterns.md](/Users/xiewenhao/Documents/dev/app/app01-template/docs/developer/i18n-patterns.md)

If you do not want to read too much at once, at least start with:

- `architecture-guide.md`
- `README.md`

## FAQ

### `npm install` worked, but `npm run tauri:dev` failed

Most likely this is not a project code problem. Missing system dependencies are more common.

Check first:

- whether Rust is installed
- whether `xcode-select --install` / Windows Build Tools / Linux dependencies are installed
- whether `cargo -V` runs successfully

### I changed the frontend, but the desktop app did not update

Make sure you are running:

```bash
npm run tauri:dev
```

and not only:

```bash
npm run dev
```

### I do not know whether a file should go in `apps` or `packages`

Ask yourself first:

- is this code only used by the desktop app?

If yes, keep it in `apps/desktop`.

Only move it into `packages` when it is actually shared across multiple apps.

### Why are there so many checks?

Because this template is not meant for quickly stacking a demo. It is meant for projects that will keep evolving.

These checks are there to catch problems early:

- type errors
- styling / formatting issues
- architecture violations
- Rust warnings
- test failures

## Recommended Beginner Workflow

If you want to build your own app from this template, a good starting order is:

1. get the project running
2. change app name, title, and icon
3. change a few UI strings
4. tweak theme colors
5. add one small component
6. run `npm run check:all`
7. then start building real product features

Do not try to change Rust, database code, windows, i18n, and release workflows all at once. Get the smallest working loop first.

## Who Is This For?

This template is a good fit for:

- frontend developers learning Tauri
- indie developers building desktop apps
- developers who want to move from a simple starter to a more structured engineering base
- developers who want AI-assisted coding but do not want the project structure to become messy

If you only want a minimal Hello World, this template may feel heavy.
If you want to build an app that will actually be maintained over time, it is a better fit.

## Related Docs

- Chinese README: [README-zh.md](/Users/xiewenhao/Documents/dev/app/app01-template/README-zh.md)
- Template usage guide: [docs/USING_THIS_TEMPLATE.md](/Users/xiewenhao/Documents/dev/app/app01-template/docs/USING_THIS_TEMPLATE.md)
- Developer docs index: [docs/developer/README.md](/Users/xiewenhao/Documents/dev/app/app01-template/docs/developer/README.md)
- User guide template: [docs/userguide/userguide.md](/Users/xiewenhao/Documents/dev/app/app01-template/docs/userguide/userguide.md)

## License

[MIT](LICENSE.md)
