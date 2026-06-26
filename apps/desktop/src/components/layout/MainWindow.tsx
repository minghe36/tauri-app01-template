import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { TitleBar } from '@/components/titlebar/TitleBar'
import { LeftSideBar } from './LeftSideBar'
import { MainWindowContent } from './MainWindowContent'
import { CommandPalette } from '@/components/command-palette/CommandPalette'
import { PreferencesDialog } from '@/components/preferences/PreferencesDialog'
import { Toaster } from 'sonner'
import { useTheme } from '@/hooks/use-theme'
import { useUIStore } from '@/store/ui-store'
import { useMainWindowEventListeners } from '@/hooks/useMainWindowEventListeners'
import { cn } from '@/lib/utils'

type MainSection = 'workspace' | 'appearance' | 'activity'

export function MainWindow() {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const leftSidebarVisible = useUIStore(state => state.leftSidebarVisible)
  const [activeSection, setActiveSection] = useState<MainSection>('workspace')

  // Set up global event listeners (keyboard shortcuts, etc.)
  useMainWindowEventListeners()

  const sections: MainSection[] = ['workspace', 'appearance', 'activity']

  return (
    <div className="flex h-screen w-full flex-col overflow-hidden rounded-[var(--app-corner-radius)] bg-background">
      <TitleBar />

      <Tabs
        value={activeSection}
        onValueChange={value => setActiveSection(value as MainSection)}
        className="flex-1 overflow-hidden"
      >
        <div className="flex h-full w-full min-w-0 overflow-hidden">
          {leftSidebarVisible && (
            <LeftSideBar className="w-80 shrink-0">
              <div className="border-b px-4 py-4">
                <TabsList
                  aria-label={t('layout.navigation.ariaLabel')}
                  className="grid h-auto w-full grid-cols-3 rounded-md bg-muted/60 p-1"
                >
                  {sections.map(section => (
                    <TabsTrigger
                      key={section}
                      value={section}
                      className="rounded-md px-3 py-2 text-sm"
                    >
                      {t(`layout.section.${section}.tab`)}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>

              {sections.map(section => (
                <TabsContent
                  key={section}
                  value={section}
                  className="m-0 flex h-full flex-col"
                >
                  <div className="flex items-center justify-between border-b px-5 py-4">
                    <div className="flex min-w-0 flex-col gap-1">
                      <p className="text-sm font-medium text-muted-foreground">
                        {t(`layout.section.${section}.tab`)}
                      </p>
                      <h2 className="truncate text-lg font-semibold text-foreground">
                        {t(`layout.section.${section}.panelTitle`)}
                      </h2>
                    </div>
                    <Badge variant="outline">
                      {t(`layout.section.${section}.badge`)}
                    </Badge>
                  </div>

                  <div className="flex flex-1 flex-col gap-4 overflow-auto p-5">
                    <Card>
                      <CardHeader>
                        <CardTitle>
                          {t(`layout.section.${section}.panelCardTitle`)}
                        </CardTitle>
                        <CardDescription>
                          {t(`layout.section.${section}.panelDescription`)}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="flex flex-col gap-3">
                        <div className="rounded-xl bg-muted/50 p-4">
                          <p className="text-sm font-medium text-foreground">
                            {t(`layout.section.${section}.panelBlockTitle`)}
                          </p>
                          <p className="mt-2 text-sm leading-6 text-muted-foreground">
                            {t(`layout.section.${section}.panelBlockBody`)}
                          </p>
                        </div>
                        <div className="rounded-xl border border-dashed border-border p-4">
                          <p className="text-sm font-medium text-foreground">
                            {t(`layout.section.${section}.panelHintTitle`)}
                          </p>
                          <p className="mt-2 text-sm leading-6 text-muted-foreground">
                            {t(`layout.section.${section}.panelHintBody`)}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
              ))}
            </LeftSideBar>
          )}

          <MainWindowContent
            activeSection={activeSection}
            className={cn('min-w-0 flex-1 overflow-hidden')}
          />
        </div>
      </Tabs>

      {/* Global UI Components (hidden until triggered) */}
      <CommandPalette />
      <PreferencesDialog />
      <Toaster
        position="bottom-right"
        theme={
          theme === 'dark' ? 'dark' : theme === 'light' ? 'light' : 'system'
        }
        className="toaster group"
        toastOptions={{
          classNames: {
            toast:
              'group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg',
            description: 'group-[.toast]:text-muted-foreground',
            actionButton:
              'group-[.toast]:bg-primary group-[.toast]:text-primary-foreground',
            cancelButton:
              'group-[.toast]:bg-muted group-[.toast]:text-muted-foreground',
          },
        }}
      />
    </div>
  )
}
