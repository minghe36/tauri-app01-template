import { beforeEach, describe, expect, it, vi } from 'vitest'
import {
  debug as pluginDebug,
  error as pluginError,
  info as pluginInfo,
  trace as pluginTrace,
  warn as pluginWarn,
} from '@tauri-apps/plugin-log'
import { logger } from './logger'

describe('logger', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('routes info logs through the tauri log plugin', async () => {
    logger.info('Preferences loaded', { theme: 'dark', retries: 2 })
    await Promise.resolve()

    expect(pluginInfo).toHaveBeenCalledWith('Preferences loaded', {
      keyValues: {
        theme: 'dark',
        retries: '2',
      },
    })
  })

  it('serializes Error objects for plugin logging', async () => {
    logger.error('Save failed', { error: new Error('disk full') })
    await Promise.resolve()

    expect(pluginError).toHaveBeenCalledWith('Save failed', {
      keyValues: {
        error: 'disk full',
      },
    })
  })

  it('falls back to console when plugin logging fails', async () => {
    const consoleWarnSpy = vi
      .spyOn(console, 'warn')
      .mockImplementation(() => undefined)
    const pluginWarnMock = vi.mocked(pluginWarn)
    pluginWarnMock.mockRejectedValueOnce(new Error('backend unavailable'))

    logger.warn('Fallback path', { feature: 'logging' })
    await Promise.resolve()
    await Promise.resolve()

    expect(consoleWarnSpy).toHaveBeenCalled()

    consoleWarnSpy.mockRestore()
  })

  it('supports all plugin log levels', async () => {
    logger.trace('trace message')
    logger.debug('debug message')
    logger.warn('warn message')
    await Promise.resolve()

    expect(pluginTrace).toHaveBeenCalledWith('trace message', undefined)
    expect(pluginDebug).toHaveBeenCalledWith('debug message', undefined)
    expect(pluginWarn).toHaveBeenCalledWith('warn message', undefined)
  })
})
