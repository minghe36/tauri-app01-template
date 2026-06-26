import {
  debug as pluginDebug,
  error as pluginError,
  info as pluginInfo,
  trace as pluginTrace,
  warn as pluginWarn,
} from '@tauri-apps/plugin-log'

type LogLevel = 'trace' | 'debug' | 'info' | 'warn' | 'error'

interface LogEntry {
  level: LogLevel
  message: string
  timestamp: Date
  context?: Record<string, unknown>
}

class Logger {
  trace(message: string, context?: Record<string, unknown>): void {
    this.log('trace', message, context)
  }

  debug(message: string, context?: Record<string, unknown>): void {
    this.log('debug', message, context)
  }

  info(message: string, context?: Record<string, unknown>): void {
    this.log('info', message, context)
  }

  warn(message: string, context?: Record<string, unknown>): void {
    this.log('warn', message, context)
  }

  error(message: string, context?: Record<string, unknown>): void {
    this.log('error', message, context)
  }

  private log(
    level: LogLevel,
    message: string,
    context?: Record<string, unknown>
  ): void {
    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date(),
      context,
    }

    void this.logToPlugin(entry).catch(error => {
      this.logToConsole(entry)
      console.warn('Failed to send log to backend:', error)
    })
  }

  private async logToPlugin(entry: LogEntry): Promise<void> {
    const keyValues = this.serializeContext(entry.context)
    const options = keyValues ? { keyValues } : undefined

    switch (entry.level) {
      case 'trace':
        await pluginTrace(entry.message, options)
        return
      case 'debug':
        await pluginDebug(entry.message, options)
        return
      case 'info':
        await pluginInfo(entry.message, options)
        return
      case 'warn':
        await pluginWarn(entry.message, options)
        return
      case 'error':
        await pluginError(entry.message, options)
        return
    }
  }

  private logToConsole(entry: LogEntry): void {
    const timestamp = entry.timestamp.toISOString()
    const prefix = `[${timestamp}] [${entry.level.toUpperCase()}]`

    const args = entry.context
      ? [prefix, entry.message, entry.context]
      : [prefix, entry.message]

    switch (entry.level) {
      case 'trace':
      case 'debug':
        console.debug(...args)
        break
      case 'info':
        console.info(...args)
        break
      case 'warn':
        console.warn(...args)
        break
      case 'error':
        console.error(...args)
        break
    }
  }

  private serializeContext(
    context?: Record<string, unknown>
  ): Record<string, string> | undefined {
    if (!context) {
      return undefined
    }

    return Object.fromEntries(
      Object.entries(context).map(([key, value]) => [key, this.stringifyValue(value)])
    )
  }

  private stringifyValue(value: unknown): string {
    if (value === null) {
      return 'null'
    }

    if (value === undefined) {
      return 'undefined'
    }

    if (typeof value === 'string') {
      return value
    }

    if (
      typeof value === 'number' ||
      typeof value === 'boolean' ||
      typeof value === 'bigint'
    ) {
      return String(value)
    }

    if (value instanceof Error) {
      return value.message
    }

    try {
      return JSON.stringify(value)
    } catch {
      return String(value)
    }
  }
}

export const logger = new Logger()
export const { trace, debug, info, warn, error } = logger
