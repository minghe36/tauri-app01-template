//! SQLite storage bootstrap for device and application metadata.

use std::{
    fs,
    path::{Path, PathBuf},
    time::{SystemTime, UNIX_EPOCH},
};

use sqlx::sqlite::{SqliteConnectOptions, SqlitePoolOptions};
use tauri::AppHandle;

const DATABASE_NAME: &str = "db";
const RECORD_KEY: &str = "current";

#[derive(Debug, Clone)]
struct DeviceAppRecord {
    record_key: String,
    device_name: String,
    host_name: String,
    os_platform: String,
    os_type: String,
    os_family: String,
    os_version: String,
    architecture: String,
    app_name: String,
    app_version: String,
    app_identifier: String,
    created_at: i64,
    updated_at: i64,
}

/// Returns the repository storage directory used by the template.
pub fn workspace_storage_dir() -> PathBuf {
    Path::new(env!("CARGO_MANIFEST_DIR"))
        .join("../../../crates/storage")
        .components()
        .collect()
}

/// Returns the SQLite database path under `crates/storage/db`.
pub fn workspace_database_path() -> PathBuf {
    workspace_storage_dir().join(DATABASE_NAME)
}

/// Creates the SQLite database and ensures the device/app metadata table exists.
/// Also upserts the current device and application metadata into the table.
pub async fn initialize_storage(app: &AppHandle) -> Result<PathBuf, String> {
    let db_path = workspace_database_path();
    let record = build_runtime_record(app);

    initialize_storage_at_path(&db_path, &record).await?;

    Ok(db_path)
}

async fn initialize_storage_at_path(path: &Path, record: &DeviceAppRecord) -> Result<(), String> {
    let parent_dir = path.parent().ok_or_else(|| {
        format!(
            "Failed to resolve parent directory for database path: {}",
            path.display()
        )
    })?;

    fs::create_dir_all(parent_dir).map_err(|e| {
        format!(
            "Failed to create storage directory {}: {e}",
            parent_dir.display()
        )
    })?;

    let pool = SqlitePoolOptions::new()
        .max_connections(1)
        .connect_with(
            SqliteConnectOptions::new()
                .filename(path)
                .create_if_missing(true),
        )
        .await
        .map_err(|e| format!("Failed to open SQLite database {}: {e}", path.display()))?;

    ensure_schema(&pool).await?;
    upsert_device_app_record(&pool, record).await?;
    pool.close().await;

    Ok(())
}

async fn ensure_schema(pool: &sqlx::SqlitePool) -> Result<(), String> {
    sqlx::query(
        r#"
        CREATE TABLE IF NOT EXISTS device_app_info (
            record_key TEXT PRIMARY KEY,
            device_name TEXT NOT NULL,
            host_name TEXT NOT NULL,
            os_platform TEXT NOT NULL,
            os_type TEXT NOT NULL,
            os_family TEXT NOT NULL,
            os_version TEXT NOT NULL,
            architecture TEXT NOT NULL,
            app_name TEXT NOT NULL,
            app_version TEXT NOT NULL,
            app_identifier TEXT NOT NULL,
            created_at INTEGER NOT NULL,
            updated_at INTEGER NOT NULL
        )
        "#,
    )
    .execute(pool)
    .await
    .map_err(|e| format!("Failed to create device_app_info table: {e}"))?;

    Ok(())
}

async fn upsert_device_app_record(
    pool: &sqlx::SqlitePool,
    record: &DeviceAppRecord,
) -> Result<(), String> {
    sqlx::query(
        r#"
        INSERT INTO device_app_info (
            record_key,
            device_name,
            host_name,
            os_platform,
            os_type,
            os_family,
            os_version,
            architecture,
            app_name,
            app_version,
            app_identifier,
            created_at,
            updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(record_key) DO UPDATE SET
            device_name = excluded.device_name,
            host_name = excluded.host_name,
            os_platform = excluded.os_platform,
            os_type = excluded.os_type,
            os_family = excluded.os_family,
            os_version = excluded.os_version,
            architecture = excluded.architecture,
            app_name = excluded.app_name,
            app_version = excluded.app_version,
            app_identifier = excluded.app_identifier,
            updated_at = excluded.updated_at
        "#,
    )
    .bind(&record.record_key)
    .bind(&record.device_name)
    .bind(&record.host_name)
    .bind(&record.os_platform)
    .bind(&record.os_type)
    .bind(&record.os_family)
    .bind(&record.os_version)
    .bind(&record.architecture)
    .bind(&record.app_name)
    .bind(&record.app_version)
    .bind(&record.app_identifier)
    .bind(record.created_at)
    .bind(record.updated_at)
    .execute(pool)
    .await
    .map_err(|e| format!("Failed to upsert device/app record: {e}"))?;

    Ok(())
}

fn build_runtime_record(app: &AppHandle) -> DeviceAppRecord {
    let timestamp = unix_timestamp_now();
    let host_name = tauri_plugin_os::hostname();

    DeviceAppRecord {
        record_key: RECORD_KEY.to_string(),
        device_name: host_name.clone(),
        host_name,
        os_platform: tauri_plugin_os::platform().to_string(),
        os_type: tauri_plugin_os::type_().to_string(),
        os_family: tauri_plugin_os::family().to_string(),
        os_version: tauri_plugin_os::version().to_string(),
        architecture: tauri_plugin_os::arch().to_string(),
        app_name: app.package_info().name.clone(),
        app_version: app.package_info().version.to_string(),
        app_identifier: app.config().identifier.clone(),
        created_at: timestamp,
        updated_at: timestamp,
    }
}

fn unix_timestamp_now() -> i64 {
    SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .map(|duration| duration.as_secs() as i64)
        .unwrap_or(0)
}

#[cfg(test)]
mod tests {
    use super::*;
    use sqlx::Row;

    fn sample_record() -> DeviceAppRecord {
        DeviceAppRecord {
            record_key: RECORD_KEY.to_string(),
            device_name: "test-device".into(),
            host_name: "test-host".into(),
            os_platform: "macos".into(),
            os_type: "macos".into(),
            os_family: "unix".into(),
            os_version: "14.0".into(),
            architecture: "aarch64".into(),
            app_name: "app01-tpl".into(),
            app_version: "0.1.0".into(),
            app_identifier: "com.app01.tpl".into(),
            created_at: 1,
            updated_at: 1,
        }
    }

    fn temp_database_path(name: &str) -> PathBuf {
        let timestamp = unix_timestamp_now();
        std::env::temp_dir().join(format!(
            "app01-tpl-{name}-{}-{timestamp}.sqlite",
            std::process::id()
        ))
    }

    #[test]
    fn workspace_database_path_points_to_crates_storage_db() {
        let path = workspace_database_path();
        assert!(path.ends_with("crates/storage/db"));
    }

    #[test]
    fn initialize_storage_creates_schema_and_upserts_record() {
        let db_path = temp_database_path("schema");
        let record = sample_record();

        tauri::async_runtime::block_on(async {
            initialize_storage_at_path(&db_path, &record)
                .await
                .expect("storage initialization should succeed");

            let pool = SqlitePoolOptions::new()
                .max_connections(1)
                .connect_with(
                    SqliteConnectOptions::new()
                        .filename(&db_path)
                        .create_if_missing(true),
                )
                .await
                .expect("database should open");

            let row = sqlx::query(
                "SELECT device_name, app_identifier FROM device_app_info WHERE record_key = ?",
            )
            .bind(RECORD_KEY)
            .fetch_one(&pool)
            .await
            .expect("record should exist");

            assert_eq!(row.get::<String, _>("device_name"), "test-device");
            assert_eq!(row.get::<String, _>("app_identifier"), "com.app01.tpl");

            pool.close().await;
        });

        let _ = fs::remove_file(db_path);
    }

    #[test]
    fn workspace_database_file_can_be_created() {
        let db_path = workspace_database_path();
        let record = sample_record();

        tauri::async_runtime::block_on(async {
            initialize_storage_at_path(&db_path, &record)
                .await
                .expect("workspace database initialization should succeed");
        });

        assert!(db_path.exists());
    }
}
