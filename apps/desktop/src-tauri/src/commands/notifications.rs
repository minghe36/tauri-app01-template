//! Native notification commands.
//!
//! Provides cross-platform native notification support using the Tauri notification plugin.

use rust_i18n::t;
use tauri::AppHandle;

/// Sends a native system notification.
/// On mobile platforms, returns an error as notifications are not yet supported.
#[tauri::command]
#[specta::specta]
pub async fn send_native_notification(
    app: AppHandle,
    title: String,
    body: Option<String>,
) -> Result<(), String> {
    log::info!("Sending native notification: {title}");

    #[cfg(not(mobile))]
    {
        use tauri_plugin_notification::NotificationExt;

        let mut notification = app.notification().builder().title(title);

        if let Some(body_text) = body {
            notification = notification.body(body_text);
        }

        match notification.show() {
            Ok(_) => {
                log::info!("Native notification sent successfully");
                Ok(())
            }
            Err(e) => {
                log::error!("Failed to send native notification: {e}");
                Err(t!("errors.notifications.send", message = e.to_string()).to_string())
            }
        }
    }

    #[cfg(mobile)]
    {
        let _ = (app, body);
        log::warn!("Native notifications not supported on mobile");
        Err(t!("errors.notifications.unsupported_mobile").to_string())
    }
}
