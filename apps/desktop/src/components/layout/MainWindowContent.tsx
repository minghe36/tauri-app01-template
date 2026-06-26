import { useTranslation } from 'react-i18next'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { useUIStore } from '@/store/ui-store'

interface MainWindowContentProps {
  children?: React.ReactNode
  className?: string
  activeSection?: 'workspace' | 'appearance' | 'activity'
}

export function MainWindowContent({
  children,
  className,
  activeSection = 'workspace',
}: MainWindowContentProps) {
  const { t } = useTranslation()
  const lastQuickPaneEntry = useUIStore(state => state.lastQuickPaneEntry)

  return (
    <div className={cn('flex h-full flex-col bg-background', className)}>
      {children || (
        <div className="flex flex-1 flex-col gap-6 p-6">
          <div className="flex items-center justify-between gap-3">
            <div className="flex flex-col gap-1">
              <p className="text-sm font-medium text-muted-foreground">
                {t(`layout.section.${activeSection}.eyebrow`)}
              </p>
              <h1 className="text-3xl font-semibold tracking-tight text-foreground">
                {t(`layout.section.${activeSection}.title`)}
              </h1>
            </div>
            <Badge variant="secondary">
              {t(`layout.section.${activeSection}.badge`)}
            </Badge>
          </div>

          <div className="grid flex-1 gap-4 xl:grid-cols-[minmax(0,1.5fr)_minmax(18rem,1fr)]">
            <Card className="min-h-0">
              <CardHeader>
                <CardTitle>{t('layout.content.coreFocus')}</CardTitle>
              </CardHeader>
              <CardContent className="flex h-full flex-col gap-4">
                <p className="text-sm leading-6 text-muted-foreground">
                  {t(`layout.section.${activeSection}.content`)}
                </p>
                <div className="rounded-xl border border-dashed border-border bg-muted/40 p-4">
                  <p className="text-sm font-medium text-foreground">
                    {t('layout.content.lastEntry')}
                  </p>
                  <p className="mt-2 break-all text-sm text-muted-foreground">
                    {lastQuickPaneEntry || t('layout.content.noEntry')}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="min-h-0">
              <CardHeader>
                <CardTitle>
                  {t(`layout.section.${activeSection}.inspectorTitle`)}
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-3">
                <div className="rounded-xl bg-muted/60 p-4">
                  <p className="text-sm font-medium text-foreground">
                    {t(`layout.section.${activeSection}.insightTitle`)}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {t(`layout.section.${activeSection}.insight`)}
                  </p>
                </div>
                <div className="rounded-xl bg-muted/40 p-4">
                  <p className="text-sm font-medium text-foreground">
                    {t(`layout.section.${activeSection}.inspectorLabel`)}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {t(`layout.section.${activeSection}.inspectorBody`)}
                  </p>
                </div>
                <div className="rounded-xl border border-dashed border-border p-4">
                  <p className="text-sm font-medium text-foreground">
                    {t('layout.content.workflowTitle')}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {t('layout.content.designRule')}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  )
}
