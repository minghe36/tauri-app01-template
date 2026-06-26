# Internationalization (i18n)

## Overview

This app uses two i18n layers:

- Frontend: [react-i18next](https://react.i18next.com/) with resources in `packages/i18n/locales/`
- Rust/Tauri: [`rust-i18n`](https://crates.io/crates/rust-i18n) with resources in `crates/locales/`

All user-facing strings must go through one of those two systems. React text stays in the frontend locale package. Rust-returned messages, validation errors, and Rust-created window labels must use `rust-i18n`.

### Key Design Decisions

- **react-i18next**: Industry-standard React i18n library with excellent TypeScript support
- **JSON translation files**: Simple, portable format stored in `packages/i18n/locales/`
- **JavaScript-based native menus**: Menus are built from JavaScript (not Rust) to use the same translation system
- **RTL support**: CSS uses logical properties for automatic RTL layout

## Architecture

```text
packages/i18n/
├── locales/
│   ├── en.json          # English (default)
│   ├── zh.json          # Chinese
│   └── [lang].json      # Additional languages
└── src/
    ├── config.ts        # i18next configuration
    ├── i18n.d.ts        # TypeScript type definitions
    ├── language-init.ts # Reusable language bootstrap
    └── index.ts         # Exports

crates/locales/
├── en.json              # Rust English resources
├── zh.json              # Rust Chinese resources
└── locales.rs           # Rust locale bootstrap and normalization helpers
```

## Rust i18n Rules

### Locale bootstrap

Rust locale initialization runs during Tauri startup and resolves language in this order:

1. Saved `preferences.language`
2. System locale
3. `en`

The shared bootstrap lives in `crates/locales/locales.rs`.

### Adding Rust strings

1. Add keys to both `crates/locales/en.json` and `crates/locales/zh.json`
2. Import `use rust_i18n::t;`
3. Return translated strings with `t!("errors.some_key")`

Example:

```rust
use rust_i18n::t;

fn example(message: &str) -> String {
    t!("errors.preferences.read", message = message)
}
```

### When to use which layer

- React-rendered copy: `packages/i18n/locales/*.json`
- Native menu labels built in JavaScript: `packages/i18n/locales/*.json`
- Rust command errors and validation messages: `crates/locales/*.json`
- Rust-created window titles or other Rust-owned labels: `crates/locales/*.json`

## Adding New Translatable Strings

### Step 1: Add to Translation File

Add your string to `packages/i18n/locales/en.json`:

```json
{
  "myFeature.title": "My Feature",
  "myFeature.description": "This is my feature description",
  "myFeature.button.save": "Save Changes"
}
```

### Step 2: Use in React Components

```typescript
import { useTranslation } from 'react-i18next'

function MyComponent() {
  const { t } = useTranslation()

  return (
    <div>
      <h1>{t('myFeature.title')}</h1>
      <p>{t('myFeature.description')}</p>
      <button>{t('myFeature.button.save')}</button>
    </div>
  )
}
```

### Step 3: Add to Other Languages

Add the same keys to all other language files (e.g., `packages/i18n/locales/zh.json`).

## Key Naming Conventions

Use dot notation to organize keys by feature/component:

| Pattern                   | Example                                 | Use Case                |
| ------------------------- | --------------------------------------- | ----------------------- |
| `feature.element`         | `preferences.title`                     | Simple feature strings  |
| `feature.section.element` | `preferences.general.keyboardShortcuts` | Nested sections         |
| `feature.action.verb`     | `commands.openPreferences.label`        | Action labels           |
| `common.word`             | `common.enabled`                        | Shared/reusable strings |
| `toast.type.key`          | `toast.success.preferencesSaved`        | Toast notifications     |
| `menu.item`               | `menu.quit`                             | Native menu items       |

### Naming Rules

1. **Use camelCase** for multi-word segments: `keyboardShortcuts`, not `keyboard-shortcuts`
2. **Be specific**: `preferences.appearance.colorTheme`, not `theme`
3. **Group related strings**: All preference strings under `preferences.*`
4. **Use consistent suffixes**: `.label`, `.description`, `.placeholder` for form elements

## Interpolation

Pass dynamic values using double curly braces:

### Translation File

```json
{
  "menu.about": "About {{appName}}",
  "toast.error.windowCloseFailed": "Failed to close window: {{message}}"
}
```

### Usage

```typescript
t('menu.about', { appName: 'My App' })
// Output: "About My App"

t('toast.error.windowCloseFailed', { message: 'Permission denied' })
// Output: "Failed to close window: Permission denied"
```

## Pluralization

i18next supports pluralization with `_one`, `_other` suffixes:

### Translation File

```json
{
  "items.count_one": "{{count}} item",
  "items.count_other": "{{count}} items"
}
```

### Usage

```typescript
t('items.count', { count: 1 }) // "1 item"
t('items.count', { count: 5 }) // "5 items"
```

## Adding a New Language

### Step 1: Create Translation File

Copy `/locales/en.json` to `/locales/[lang].json` and translate all strings.

### Step 2: Register in Config

Update `/src/i18n/config.ts`:

```typescript
import en from '../../locales/en.json'
import zh from '../../locales/zh.json' // NEW

const resources = {
  en: { translation: en },
  zh: { translation: zh }, // NEW
}
```

### Step 3: Add RTL Support (if applicable)

If the language is RTL, add it to the `rtlLanguages` array:

```typescript
const rtlLanguages = ['ar', 'he', 'fa', 'ur'] // Add your RTL language
```

## RTL Language Support

### Automatic Direction Switching

The i18n config automatically updates `document.documentElement.dir` when the language changes:

```typescript
// In /src/i18n/config.ts
i18n.on('languageChanged', lng => {
  const dir = rtlLanguages.includes(lng) ? 'rtl' : 'ltr'
  document.documentElement.dir = dir
  document.documentElement.lang = lng
})
```

### CSS Logical Properties

Use CSS logical properties instead of physical properties for automatic RTL support:

| Physical (avoid) | Logical (use)                         |
| ---------------- | ------------------------------------- |
| `left`           | `start` or `inset-inline-start`       |
| `right`          | `end` or `inset-inline-end`           |
| `margin-left`    | `margin-inline-start` or `ms-*`       |
| `margin-right`   | `margin-inline-end` or `me-*`         |
| `padding-left`   | `padding-inline-start` or `ps-*`      |
| `padding-right`  | `padding-inline-end` or `pe-*`        |
| `text-left`      | `text-start`                          |
| `text-right`     | `text-end`                            |
| `border-left`    | `border-s-*` or `border-inline-start` |
| `border-right`   | `border-e-*` or `border-inline-end`   |

### Example

```tsx
// ❌ BAD: Physical properties break in RTL
<div className="text-left pl-4 mr-2">

// ✅ GOOD: Logical properties work in both LTR and RTL
<div className="text-start ps-4 me-2">
```

## Native Menus

Native menus are built from JavaScript to use the same i18n system as React components.

### Menu Builder Location

See `/src/lib/menu.ts` for the menu builder implementation.

### Adding Menu Items

```typescript
import i18n from '@/i18n/config'

export async function buildAppMenu(): Promise<Menu> {
  const t = i18n.t.bind(i18n)

  const myItem = await MenuItem.new({
    id: 'my-action',
    text: t('menu.myAction'),
    action: handleMyAction,
  })

  // ... add to submenu
}
```

### Automatic Menu Rebuild

Menus are automatically rebuilt when the language changes:

```typescript
// In /src/lib/menu.ts
export function setupMenuLanguageListener(): void {
  i18n.on('languageChanged', async () => {
    await buildAppMenu()
  })
}
```

## System Locale Detection

On app startup, the language is initialized based on:

1. **User's saved preference** (if set in preferences)
2. **System locale** (if we have translations for it)
3. **English** (fallback)

See `/src/i18n/language-init.ts` for the implementation.

## Language Selector

The language selector in Preferences > Appearance allows users to change the language:

```typescript
import { availableLanguages } from '@/i18n/config'
import { useTranslation } from 'react-i18next'

function LanguageSelector() {
  const { i18n } = useTranslation()

  const handleChange = async (lang: string) => {
    await i18n.changeLanguage(lang)
    // Save to preferences...
  }

  return (
    <Select value={i18n.language} onValueChange={handleChange}>
      {availableLanguages.map(lang => (
        <SelectItem key={lang} value={lang}>
          {lang.toUpperCase()}
        </SelectItem>
      ))}
    </Select>
  )
}
```

## TypeScript Support

The `i18n.d.ts` file provides type-safe translation keys:

```typescript
// Type errors if key doesn't exist in en.json
t('nonexistent.key') // TypeScript error

// Autocomplete works for valid keys
t('preferences.title') // ✅ Works
```

## Using Translations Outside React

For non-React contexts (like menu building), import i18n directly:

```typescript
import i18n from '@/i18n/config'

// Get the t function
const t = i18n.t.bind(i18n)
const text = t('menu.about', { appName: 'My App' })

// Or use i18n directly
const currentLanguage = i18n.language
await i18n.changeLanguage('ar')
```

## Testing with RTL

To test RTL layout:

1. Open Preferences > Appearance
2. Change language to Chinese (zh)
3. Verify layout displays correctly
4. Check all text alignment uses logical properties
