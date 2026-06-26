import * as Sentry from '@sentry/browser'
import type { BrowserOptions } from '@sentry/browser'
import { defaultOptions } from 'tauri-plugin-sentry-api'

interface SentryEnv {
  DEV: boolean
  MODE: string
  VITE_SENTRY_DSN?: string
  VITE_SENTRY_TRACES_SAMPLE_RATE?: string
}

type CaptureContext = Record<string, unknown>

let sentryInitialized = false

function getAppVersion(): string {
  return typeof __APP_VERSION__ === 'string' ? __APP_VERSION__ : '0.0.0-test'
}

export function resolveSentryOptions(
  env: SentryEnv = import.meta.env
): BrowserOptions | null {
  if (!env.VITE_SENTRY_DSN) {
    return null
  }

  const tracesSampleRate = Number.parseFloat(
    env.VITE_SENTRY_TRACES_SAMPLE_RATE ?? (env.DEV ? '1' : '0.1')
  )

  return {
    ...defaultOptions,
    dsn: env.VITE_SENTRY_DSN,
    release: getAppVersion(),
    environment: env.MODE,
    integrations: [Sentry.browserTracingIntegration()],
    tracesSampleRate: Number.isFinite(tracesSampleRate)
      ? tracesSampleRate
      : undefined,
  }
}

export function initSentry(env: SentryEnv = import.meta.env): boolean {
  if (sentryInitialized) {
    return true
  }

  const options = resolveSentryOptions(env)
  if (!options) {
    return false
  }

  Sentry.init(options)
  sentryInitialized = true
  return true
}

export function captureException(
  error: unknown,
  context?: CaptureContext
): string | undefined {
  if (!Sentry.isEnabled()) {
    return undefined
  }

  return Sentry.withScope(scope => {
    if (context) {
      scope.setContext('app', context)
    }

    return Sentry.captureException(error)
  })
}

export function captureMessage(
  message: string,
  context?: CaptureContext
): string | undefined {
  if (!Sentry.isEnabled()) {
    return undefined
  }

  return Sentry.withScope(scope => {
    if (context) {
      scope.setContext('app', context)
    }

    return Sentry.captureMessage(message)
  })
}

export function resetSentryForTests(): void {
  sentryInitialized = false
}
