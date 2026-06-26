//! Preferences management commands.
//!
//! Handles loading and saving user preferences to disk.

use rust_i18n::t;
use std::path::PathBuf;
use tauri::{AppHandle, Manager};

use crate::types::{validate_string_input, validate_theme, AppPreferences};

/// Gets the path to the preferences file.
fn get_preferences_path(app: &AppHandle) -> Result<PathBuf, String> {
    let app_data_dir = app
        .path()
        .app_data_dir()
        .map_err(|e| t!("errors.app_data_dir.resolve", message = e.to_string()).to_string())?;

    // Ensure the directory exists
    std::fs::create_dir_all(&app_data_dir)
        .map_err(|e| t!("errors.app_data_dir.create", message = e.to_string()).to_string())?;

    Ok(app_data_dir.join("preferences.json"))
}

fn load_preferences_from_disk(app: &AppHandle) -> Option<AppPreferences> {
    let path = get_preferences_path(app).ok()?;
    if !path.exists() {
        return None;
    }

    let contents = std::fs::read_to_string(&path)
        .inspect_err(|e| log::warn!("Failed to read preferences: {e}"))
        .ok()?;

    serde_json::from_str(&contents)
        .inspect_err(|e| log::warn!("Failed to parse preferences: {e}"))
        .ok()
}

/// Load the saved quick pane shortcut from preferences, returning None on any failure.
/// Used at startup before the full preferences system is available.
pub fn load_quick_pane_shortcut(app: &AppHandle) -> Option<String> {
    load_preferences_from_disk(app)?.quick_pane_shortcut
}

/// Load the saved language preference from preferences, returning None on any failure.
pub fn load_saved_language(app: &AppHandle) -> Option<String> {
    load_preferences_from_disk(app)?.language
}

/// Simple greeting command for demonstration purposes.
#[tauri::command]
#[specta::specta]
pub fn greet(name: &str) -> Result<String, String> {
    // Input validation
    validate_string_input(name, 100, "Name").map_err(|e| {
        log::warn!("Invalid greet input: {e}");
        e
    })?;

    log::info!("Greeting user: {name}");
    Ok(t!("messages.greet", name = name).to_string())
}

/// Loads user preferences from disk.
/// Returns default preferences if the file doesn't exist.
#[tauri::command]
#[specta::specta]
pub async fn load_preferences(app: AppHandle) -> Result<AppPreferences, String> {
    log::debug!("Loading preferences from disk");
    let prefs_path = get_preferences_path(&app)?;

    if !prefs_path.exists() {
        log::info!("Preferences file not found, using defaults");
        return Ok(AppPreferences::default());
    }

    let contents = std::fs::read_to_string(&prefs_path).map_err(|e| {
        log::error!("Failed to read preferences file: {e}");
        t!("errors.preferences.read", message = e.to_string()).to_string()
    })?;

    let preferences: AppPreferences = serde_json::from_str(&contents).map_err(|e| {
        log::error!("Failed to parse preferences JSON: {e}");
        t!("errors.preferences.parse", message = e.to_string()).to_string()
    })?;

    log::info!("Successfully loaded preferences");
    Ok(preferences)
}

/// Saves user preferences to disk.
/// Uses atomic write (temp file + rename) to prevent corruption.
#[tauri::command]
#[specta::specta]
pub async fn save_preferences(app: AppHandle, preferences: AppPreferences) -> Result<(), String> {
    // Validate theme value
    validate_theme(&preferences.theme)?;

    log::debug!("Saving preferences to disk: {preferences:?}");
    let prefs_path = get_preferences_path(&app)?;

    let json_content = serde_json::to_string_pretty(&preferences).map_err(|e| {
        log::error!("Failed to serialize preferences: {e}");
        t!("errors.preferences.serialize", message = e.to_string()).to_string()
    })?;

    // Write to a temporary file first, then rename (atomic operation)
    let temp_path = prefs_path.with_extension("tmp");

    std::fs::write(&temp_path, json_content).map_err(|e| {
        log::error!("Failed to write preferences file: {e}");
        t!("errors.preferences.write", message = e.to_string()).to_string()
    })?;

    if let Err(rename_err) = std::fs::rename(&temp_path, &prefs_path) {
        log::error!("Failed to finalize preferences file: {rename_err}");
        // Clean up the temp file to avoid leaving orphaned files on disk
        if let Err(remove_err) = std::fs::remove_file(&temp_path) {
            log::warn!("Failed to remove temp file after rename failure: {remove_err}");
        }
        return Err(t!(
            "errors.preferences.finalize",
            message = rename_err.to_string()
        )
        .to_string());
    }

    let locale = crate::locales::apply_preference_locale(&app, preferences.language.as_deref());
    log::info!("Rust locale updated from preferences: {locale}");

    log::info!("Successfully saved preferences to {prefs_path:?}");
    Ok(())
}
