# Codex Project Instructions

## Overview

This repository is a Tauri v2 monorepo template managed with **npm workspaces**.
It currently has:

- `apps/cli` - Node.js CLI app
- `apps/desktop` - main desktop Tauri + React app
- `apps/mobile` - mobile Tauri app shell and platform entry scripts
- `packages/i18n` - shared translations and i18n bootstrap
- `packages/config` - shared frontend config presets
- `packages/components/ui` - shared shadcn UI components
- `packages/css` - shared global CSS and theme token entrypoints
- `packages/shared/src/stores` - shared Zustand store logic

Codex should treat this repository as a **multi-app workspace**, not a single-root app.

## New Sessions

At the start of a new session, always:

1. Read `docs/tasks.md`
2. Read `docs/developer/architecture-guide.md`
3. Read `docs/developer/README.md`
4. Check `git status`
5. Inspect the relevant app/package before editing

## Core Rules

1. Use `npm` only. Do not use `pnpm`, `bun`, or `yarn`.
2. Read files before editing them.
3. Follow established patterns from `docs/developer/`.
4. Prefer workspace-aware commands over ad hoc directory-local assumptions.
5. Match existing style and naming.
6. Generated code must include corresponding test cases unless the user explicitly says not to add tests or the change is purely non-executable documentation/content.
7. After generating code, automatically run the relevant unit tests and verify they pass before finishing when the environment permits.
8. Run `npm run check:all` after significant changes.
9. Do not start a long-running dev server unless the user explicitly asks.
10. Do not create commits unless the user explicitly asks.
11. Update relevant docs when introducing new patterns or moving architecture boundaries.
12. When removing files, use `rm -f`.

## Repository Map

### Apps

- `apps/cli/src` - CLI entrypoint and command handling
- `apps/desktop/src` - desktop React app
- `apps/desktop/src-tauri` - desktop Rust/Tauri code and config
- `apps/mobile/src-tauri` - mobile Tauri shell

### Shared Packages

- `packages/i18n/locales` - translation JSON files
- `packages/i18n/src` - `@app/i18n` package exports
- `packages/config/eslint` - shared ESLint config
- `packages/config/tsconfig` - shared TS config presets
- `packages/components/ui` - shared shadcn component library
- `packages/css` - shared global styles and light/dark theme files
- `packages/shared/src/stores` - Zustand store implementations and store types

### Important Root Files

- `package.json` - workspace scripts and root quality gates
- `sgconfig.yml` - ast-grep config
- `.prettierignore` - formatting exclusions
- `.ast-grep/rules` - custom structural rules

## Script Conventions

### Default Scripts

These default to desktop:

- `npm run dev`
- `npm run build`
- `npm run preview`
- `npm run tauri:dev`
- `npm run tauri:build`

### Per-Target Tauri Scripts

Use these when the target matters:

- `npm run tauri:dev:desktop`
- `npm run tauri:build:desktop`
- `npm run tauri:dev:mobile`
- `npm run tauri:build:mobile`
- `npm run tauri:dev:android`
- `npm run tauri:build:android`
- `npm run tauri:dev:ios`
- `npm run tauri:build:ios`

Do not assume `tauri:dev` means all platforms. It is desktop-only by default.

CLI commands should run through the CLI workspace directly, for example:

- `npm --workspace @app/cli run test:run`

## Architecture Rules

### State Management Onion

Use the project state hierarchy:

`useState` -> `Zustand` -> `TanStack Query`

Decision rule:

- Component-local transient UI state -> `useState`
- Cross-component UI state -> `Zustand`
- Persistent or server/file-backed data -> `TanStack Query`

### Frontend Status State Rule

Frontend status state must use Zustand.

Rules:

1. UI/app status state must be defined in a platform store under `apps/<platform>/src/store`.
2. Desktop status state must live under `apps/desktop/src/store`.
3. Do not scatter frontend status state across ad hoc hooks or feature-local state once that state affects app flow, bootstrapping, or multi-component coordination.
4. Persisted data loading can still use TanStack Query, but the frontend status derived from those flows should be coordinated through the platform Zustand store when it drives the UI shell.

### Zustand Performance Rule

Use selectors:

```ts
const leftSidebarVisible = useUIStore(state => state.leftSidebarVisible)
```

Do not destructure the full store in components:

```ts
const { leftSidebarVisible } = useUIStore()
```

In callbacks and command handlers, prefer `store.getState()`.

### React Compiler Rule

React Compiler is enabled.

Do not add `useMemo`, `useCallback`, or `React.memo` by default unless there is a clear repo-specific reason and the surrounding code already uses that pattern.

### Command System Rule

User actions should flow through the command system where applicable.

- Desktop command definitions live under `apps/desktop/src/lib/commands`
- Native menus and shortcuts should remain aligned with command behavior

### Tauri Command Rule

Frontend must use typed bindings from:

- `apps/desktop/src/lib/tauri-bindings.ts`

Do not introduce raw `invoke('string-command')` calls when a typed command path is available.

When Rust commands change:

1. update Rust command implementation
2. update `apps/desktop/src-tauri/src/bindings.rs` if needed
3. regenerate bindings with `npm run rust:bindings`
4. commit the generated TypeScript binding changes together with the Rust change

`apps/desktop/src/lib/bindings.ts` is generated. Do not hand-edit it.

### Database Access Rule

Frontend must not operate business data by calling database plugins or generic SQL bridges directly.

Rules:

1. Frontend database access must go through typed Rust commands exposed via `apps/desktop/src/lib/tauri-bindings.ts`.
2. Frontend code must not contain SQL strings or generic SQL execution helpers. Do not access SQLite directly from frontend code via `@tauri-apps/plugin-sql` or similar plugin APIs for app business data.
3. Rust-side business database operations and SQL strings must be implemented in `crates/models`.
4. Do not write SQL directly inside Rust feature, command, or core modules outside `crates/models`.
5. Add or extend model-layer functions in `crates/models` first, then call those model APIs from frontend-facing Rust code.

### Config and Env Rule

Program configuration must use:

- `crates/core/config_store.rs`

Environment variable access must use:

- `crates/env/env.rs`

Do not introduce parallel app config or environment lookup utilities when these shared modules already cover the need.

### Shortcut Rule

Shortcut registration and removal must use:

- `crates/core/shortcut.rs`

Platform-specific default shortcut definitions must use:

- `crates/platform/macos/shortcut_config.rs`
- `crates/platform/windows/shortcut_config.rs`

Do not register or unregister global shortcuts ad hoc inside feature modules when the shared shortcut manager already covers the need.

## Internationalization Rules

Use the shared package:

- import from `@app/i18n`
- translations live in `packages/i18n/locales/*.json`

Rules:

1. All user-facing strings must go through i18n.
2. Generated code must support **Chinese and English by default**.
3. Any new feature with visible text must add matching keys to both Chinese and English locale files.
4. Rust-side user-facing copy must use `rust-i18n` for localization. Do not hardcode Chinese, English, or other natural-language UI/error/progress strings directly in Rust feature code.
5. Rust locale files must live under `crates/locales/`, with shared helpers defined in `crates/locales/locales.rs` and language resources stored in files such as `crates/locales/en.json` and `crates/locales/zh.json`.
6. When adding or changing Rust output copy, introduce or update the corresponding Rust i18n resources in `crates/locales/` and resolve messages through that Rust i18n layer instead of returning raw hardcoded text.
7. Use CSS logical properties for RTL-safe layout.
8. Keep app code consuming `@app/i18n`, not local duplicate i18n setup.

Examples:

```ts
import { useTranslation } from 'react-i18next'
import i18n from '@app/i18n'
```

## Frontend Configuration Rules

Shared frontend config belongs in `packages/config`.

Use:

- `packages/config/eslint/react-app.js`
- `packages/config/tsconfig/react-app.json`
- `packages/config/tsconfig/vite-node.json`

If a new app is added, prefer extending shared config rather than cloning root config files.

## UI Component Rules

Use **shadcn** for frontend components.

Rules:

1. Shared UI components should live in `packages/components/ui`.
2. Prefer reusing or extending existing shadcn components before creating custom primitives.
3. Frontend form components must not use native form controls directly when a shadcn/ui equivalent exists.
4. Form UIs must use the shared shadcn form components under `packages/ui`.
5. New UI should support both **light** and **dark** themes by default.
6. When generating component code, assume theme compatibility is required unless the user explicitly says otherwise.
7. Element border radius must use `rounded-md` only. Do not introduce other Tailwind radius utilities such as `rounded-lg`, `rounded-xl`, `rounded-2xl`, or custom radius values unless the user explicitly asks.
8. All app feedback messages triggered by button actions must render through `apps/desktop/src/components/Toast.tsx`. Do not introduce direct `sonner` usage or alternate in-app message surfaces for button action results.
9. Scrollable UI regions in the desktop app must use `apps/desktop/src/components/ui/scroll-area.tsx`. Do not replace required scroll containers with native overflow wrappers unless the user explicitly approves that exception.
10. Do not use literal color values inside `className`, including Tailwind arbitrary values such as `bg-[#151216]/96`, `text-white/82`, `border-black`, inline hex, rgb, hsl, oklch, or similar. All colors must come from shared theme tokens defined in `packages/css/light.css`, `packages/css/dark.css`, or related shared theme files.
11. If a needed color token does not exist, add it to the shared theme first, then consume that token from component code. Do not work around missing tokens by hardcoding color values in JSX, TSX, CSS modules, or inline styles.
12. When adding a new frontend module, do not add module description copy by default. Only add descriptive helper text when the user explicitly requests it or the existing surrounding UI pattern already requires it.

For desktop app code, prefer importing shared UI from `packages/components/ui` rather than creating a second local UI component set.

## CSS and Theme Rules

Shared styling must flow through `packages/css`.

Rules:

1. Put global shared styles in `packages/css/globals.css`.
2. Put light theme color tokens in `packages/css/light.css`.
3. Put dark theme color tokens in `packages/css/dark.css`.
4. App-local style files should only contain app- or window-specific overrides, not duplicate shared theme tokens or global base rules.
5. When adding or changing theme tokens, update the shared `packages/css` files instead of reintroducing `App.css`/`theme-variables.css`-style duplication.

## Frontend Logging Rules

Frontend log output must use the log plugin uniformly.

Rules:

1. Use the shared logger utility, not ad hoc `console.log`, `console.warn`, or `console.error` calls in feature code.
2. Frontend logging should go through `@tauri-apps/plugin-log` via the project logger abstraction.
3. If logging behavior needs to change, update the shared logger implementation instead of introducing local logging patterns.

## Sentry Rules

Sentry is the unified channel for error reporting, crash collection, and performance tracing.

Rules:

1. Use Sentry uniformly for frontend error monitoring, crash reporting, and performance tracing.
2. New error-reporting code should report through the shared Sentry path instead of introducing alternative reporting services or ad hoc telemetry.
3. When adding recoverable error handling, decide whether the event should also be reported to Sentry in addition to local logging.
4. Do not introduce parallel error-monitoring SDKs unless the user explicitly requests it.
5. Use the shared Sentry initialization and reporting path instead of calling SDK APIs ad hoc throughout the app.

## Zustand Store Rules

State management uses **Zustand** for shared UI/application state.

Rules:

1. All store operation logic belongs in `packages/shared/src/stores`.
2. New stores, store actions, store types, and store-specific selectors should be organized under `packages/shared/src/stores/<domain>`.
3. Do not scatter Zustand business logic across page components, random hooks, or app-local utility files when it belongs in a store.
4. App code should consume stores from the shared store package instead of re-defining the same logic locally.

Component-local transient state can still use `useState`, but once logic becomes shared store behavior it should move into `packages/shared/src/stores`.

## Static Analysis and Quality Gates

Before finishing meaningful code changes, run:

```bash
npm run check:all
```

This includes:

- TypeScript
- ESLint
- ast-grep
- Prettier
- `cargo fmt --check`
- `cargo clippy`
- Vitest
- `cargo test`

Additional cleanup tools:

- `npm run knip`
- `npm run jscpd`

## Testing Rules

Rules:

1. Any generated executable code should include corresponding tests by default.
2. Prefer the smallest test scope that validates the changed behavior, but do not skip tests for business logic.
3. After code generation, automatically run the relevant unit tests.
4. If the change affects shared logic, run the affected package/app tests, not just a superficial smoke check.
5. If tests cannot be run because of environment or toolchain limits, report that explicitly instead of silently skipping validation.

Common commands:

- `npm run test:run`
- `npm run check:all`
- `npm run rust:test`

## Rust and Tauri Rules

1. Use Tauri v2 patterns only.
2. Keep permissions scoped to specific windows.
3. Prefer Rust-side validation for filesystem or security-sensitive operations.
4. Use modern Rust formatting like `format!("{value}")`.
5. Keep Tauri config changes app-scoped inside `apps/desktop/src-tauri` or `apps/mobile/src-tauri`.

## Editing Guidance

### When Working in Desktop

Most feature work belongs in:

- `apps/cli/src`
- `apps/desktop/src/components`
- `apps/desktop/src/hooks`
- `apps/desktop/src/lib`
- `apps/desktop/src/services`
- `apps/desktop/src/store`
- `apps/desktop/src-tauri/src`

When UI primitives or store logic are shared, prefer:

- `packages/components/ui`
- `packages/shared/src/stores`

### When Working in Shared Packages

Move code to `packages/*` only if it is genuinely reusable across apps.

Do not move desktop-only logic into shared packages just to “clean up” structure.

### When Updating Paths

Be careful with old single-app paths.

The correct modern locations are typically:

- `apps/desktop/src/...` instead of `src/...`
- `apps/desktop/src-tauri/...` instead of `src-tauri/...`
- `packages/i18n/...` instead of `locales/...` or local app i18n folders
- `packages/components/ui/...` for shared shadcn components
- `packages/shared/src/stores/...` for Zustand store logic

## Documentation Sync

When changing architecture or workflow, update the relevant docs in `docs/developer/`.

Most commonly affected docs:

- `architecture-guide.md`
- `i18n-patterns.md`
- `tauri-commands.md`
- `static-analysis.md`
- `testing.md`
- `cross-platform.md`

## Safety Notes

1. The worktree may already be dirty. Do not revert user changes.
2. Ignore unrelated changes unless they block the task.
3. If a generated file changed because of a real source change, keep it.
4. If a command fails due to environment, permissions, cache, or platform SDK issues, report that explicitly.

## Preferred Workflow

1. Read context
2. Identify whether the change is app-specific or shared
3. Edit the smallest correct surface
4. Update tests
5. Run `npm run check:all`
6. Update docs if patterns changed

This file is the project-specific baseline for Codex. When in doubt, prefer the documented architecture over improvising a new pattern.
