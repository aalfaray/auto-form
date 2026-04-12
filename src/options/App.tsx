import { useState, useEffect, useCallback } from 'react'
import type { SupportedLocale, UserConfig } from '../shared/types'
import { getConfig, saveConfig, resetConfig } from '../shared/storage'
import { LOCALE_OPTIONS } from '../shared/constants'
import LocaleGrid from './components/LocaleGrid'
import DetectionConfig from './components/DetectionConfig'
import IgnoredSelectors from './components/IgnoredSelectors'
import ResetButton from './components/ResetButton'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/retroui/Card'
import { Alert } from '@/components/retroui/Alert'
import { CheckCircle } from 'lucide-react'

export default function App() {
  const [config, setConfig] = useState<UserConfig | null>(null)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    loadConfig()
  }, [])

  useEffect(() => {
    if (saved) {
      const timer = setTimeout(() => setSaved(false), 2000)
      return () => clearTimeout(timer)
    }
  }, [saved])

  const loadConfig = async () => {
    const cfg = await getConfig()
    setConfig(cfg)
  }

  const updateConfig = useCallback(async (partial: Partial<UserConfig>) => {
    const updated = await saveConfig(partial)
    setConfig(updated)
    setSaved(true)
    notifyContentScript(updated)
  }, [])

  const handleReset = useCallback(async () => {
    const reset = await resetConfig()
    setConfig(reset)
    setSaved(true)
    notifyContentScript(reset)
  }, [])

  const notifyContentScript = (updated: UserConfig) => {
    chrome.tabs.query({}, tabs => {
      for (const tab of tabs) {
        if (tab.id) {
          chrome.tabs
            .sendMessage(tab.id, { type: 'CONFIG_UPDATED', payload: updated })
            .catch(() => {})
        }
      }
    })
  }

  if (!config) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Cargando configuración...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-primary border-2 border-black flex items-center justify-center">
            <svg viewBox="0 0 24 24" className="w-6 h-6 fill-primary-foreground">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm-1 2l5 5h-5V4zM8 17h8v-2H8v2zm0-4h8v-2H8v2z" />
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-semibold text-foreground">Configuración de Auto-Form</h1>
            <p className="text-sm text-muted-foreground">
              Personaliza el comportamiento de la extensión
            </p>
          </div>
        </div>

        {saved && (
          <Alert status="success" className="mb-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              <span className="text-sm font-medium">Configuración guardada</span>
            </div>
          </Alert>
        )}

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Locale de datos</CardTitle>
              <CardDescription>
                Selecciona el idioma/región para los datos generados
              </CardDescription>
            </CardHeader>
            <CardContent>
              <LocaleGrid
                value={config.locale}
                options={LOCALE_OPTIONS}
                onChange={(locale: SupportedLocale) => updateConfig({ locale })}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Atributos de detección</CardTitle>
              <CardDescription>
                Selecciona qué atributos se usan para identificar el tipo de campo
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DetectionConfig
                attributes={config.detectionAttributes}
                onChange={attributes => updateConfig({ detectionAttributes: attributes })}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Selectores ignorados</CardTitle>
              <CardDescription>
                Agrega selectores CSS de campos que no deben ser autocompletados
              </CardDescription>
            </CardHeader>
            <CardContent>
              <IgnoredSelectors
                selectors={config.ignoredSelectors}
                onChange={selectors => updateConfig({ ignoredSelectors: selectors })}
              />
            </CardContent>
          </Card>

          <div className="flex justify-center pt-2 pb-8">
            <ResetButton onReset={handleReset} />
          </div>
        </div>
      </div>
    </div>
  )
}
