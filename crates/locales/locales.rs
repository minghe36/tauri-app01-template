use rust_i18n::t;
use tauri::{AppHandle, Manager};

pub const DEFAULT_LOCALE: &str = "en";

pub fn initialize(app: &AppHandle) -> String {
    let saved_language = crate::commands::preferences::load_saved_language(app);
    apply_preference_locale(app, saved_language.as_deref())
}

pub fn apply_preference_locale(app: &AppHandle, preferred_language: Option<&str>) -> String {
    let locale = resolve_locale(preferred_language);
    rust_i18n::set_locale(&locale);
    update_runtime_labels(app);
    locale
}

pub fn resolve_locale(preferred_language: Option<&str>) -> String {
    preferred_language
        .and_then(normalize_locale)
        .map(ToOwned::to_owned)
        .or_else(detect_system_locale)
        .unwrap_or_else(|| DEFAULT_LOCALE.to_string())
}

pub fn detect_system_locale() -> Option<String> {
    sys_locale::get_locale()
        .as_deref()
        .and_then(normalize_locale)
        .map(ToOwned::to_owned)
}

pub fn normalize_locale(locale: &str) -> Option<&'static str> {
    let normalized = locale.trim().replace('_', "-").to_ascii_lowercase();

    if normalized.is_empty() {
        return None;
    }

    if normalized == "zh" || normalized.starts_with("zh-") {
        return Some("zh");
    }

    if normalized == "en" || normalized.starts_with("en-") {
        return Some("en");
    }

    None
}

fn update_runtime_labels(app: &AppHandle) {
    if let Some(window) = app.get_webview_window("quick-pane") {
        let _ = window.set_title(&t!("window.quick_pane_title"));
    }
}

#[cfg(test)]
mod tests {
    use super::{normalize_locale, resolve_locale, DEFAULT_LOCALE};

    #[test]
    fn normalizes_supported_locales() {
        assert_eq!(normalize_locale("en"), Some("en"));
        assert_eq!(normalize_locale("en-US"), Some("en"));
        assert_eq!(normalize_locale("zh"), Some("zh"));
        assert_eq!(normalize_locale("zh_CN"), Some("zh"));
        assert_eq!(normalize_locale("zh-Hans-CN"), Some("zh"));
    }

    #[test]
    fn rejects_unsupported_locales() {
        assert_eq!(normalize_locale("fr"), None);
        assert_eq!(normalize_locale(""), None);
    }

    #[test]
    fn resolves_preferred_locale_before_fallbacks() {
        assert_eq!(resolve_locale(Some("zh-CN")), "zh");
        assert_eq!(resolve_locale(Some("en-GB")), "en");
        assert!([DEFAULT_LOCALE, "zh", "en"].contains(&resolve_locale(Some("fr-FR")).as_str()));
    }
}
