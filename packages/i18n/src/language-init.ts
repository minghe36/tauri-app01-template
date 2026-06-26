import i18n, { availableLanguages } from './config'

type LoggerFn = (message: string, meta?: Record<string, unknown>) => void

type LanguageLogger = {
  debug?: LoggerFn
  info?: LoggerFn
  warn?: LoggerFn
  error?: LoggerFn
}

type InitializeLanguageOptions = {
  savedLanguage: string | null
  detectLocale?: () => Promise<string | null | undefined>
  logger?: LanguageLogger
  fallbackLanguage?: string
}

const defaultFallbackLanguage = 'en'

export async function initializeLanguage({
  savedLanguage,
  detectLocale,
  logger,
  fallbackLanguage = defaultFallbackLanguage,
}: InitializeLanguageOptions): Promise<void> {
  try {
    if (savedLanguage !== null) {
      if (availableLanguages.includes(savedLanguage)) {
        await i18n.changeLanguage(savedLanguage)
        logger?.info?.('Language set from user preference', {
          language: savedLanguage,
        })
      } else {
        logger?.warn?.(
          'Saved language not available, using fallback language',
          {
            savedLanguage,
            fallbackLanguage,
            availableLanguages,
          }
        )
        await i18n.changeLanguage(fallbackLanguage)
      }
      return
    }

    const systemLocale = await detectLocale?.()
    logger?.debug?.('Detected system locale', { systemLocale })

    if (systemLocale) {
      const parts = systemLocale.split('-')
      const langCode = (parts[0] ?? fallbackLanguage).toLowerCase()

      if (availableLanguages.includes(langCode)) {
        await i18n.changeLanguage(langCode)
        logger?.info?.('Language set from system locale', {
          systemLocale,
          language: langCode,
        })
        return
      }

      logger?.debug?.('System locale not available in translations', {
        systemLocale,
        langCode,
        availableLanguages,
      })
    }

    await i18n.changeLanguage(fallbackLanguage)
    logger?.info?.('Language set to fallback language', {
      fallbackLanguage,
    })
  } catch (error) {
    logger?.error?.('Failed to initialize language', {
      error,
      fallbackLanguage,
    })
    await i18n.changeLanguage(fallbackLanguage)
  }
}
