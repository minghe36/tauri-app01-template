import { beforeEach, describe, expect, it, vi } from 'vitest'
import * as Sentry from '@sentry/browser'
import {
  captureException,
  initSentry,
  resetSentryForTests,
  resolveSentryOptions,
} from './sentry'

describe('sentry', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    resetSentryForTests()
  })

  it('does not initialize when dsn is missing', () => {
    const initialized = initSentry({
      DEV: true,
      MODE: 'test',
    })

    expect(initialized).toBe(false)
    expect(Sentry.init).not.toHaveBeenCalled()
  })

  it('builds browser options with tracing integration', () => {
    const options = resolveSentryOptions({
      DEV: false,
      MODE: 'production',
      VITE_SENTRY_DSN: 'https://example@sentry.io/1',
      VITE_SENTRY_TRACES_SAMPLE_RATE: '0.25',
    })

    expect(options).toMatchObject({
      dsn: 'https://example@sentry.io/1',
      environment: 'production',
      tracesSampleRate: 0.25,
    })
    expect(Sentry.browserTracingIntegration).toHaveBeenCalled()
  })

  it('captures exceptions through sentry scope', () => {
    const eventId = captureException(new Error('boom'), { feature: 'settings' })

    expect(eventId).toBe('event-id')
    expect(Sentry.captureException).toHaveBeenCalled()
    expect(Sentry.withScope).toHaveBeenCalled()
  })
})
