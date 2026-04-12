import { useState, useEffect, useCallback } from 'react'
import type { AutofillResult, SupportedLocale, UserConfig } from '../shared/types'
import { getConfig, saveConfig } from '../shared/storage'
import { LOCALE_OPTIONS } from '../shared/constants'
import Header from './components/Header'
import FieldCounter from './components/FieldCounter'
import AutofillButton from './components/AutofillButton'
import LocaleSelector from './components/LocaleSelector'
import ValidationToggle from './components/ValidationToggle'
import FloatingButtonToggle from './components/FloatingButtonToggle'
import ClearButton from './components/ClearButton'
import FeedbackToast from './components/FeedbackToast'

export default function App() {
  const [config, setConfig] = useState<UserConfig | null>(null)
  const [fieldsCount, setFieldsCount] = useState<number>(0)
  const [loading, setLoading] = useState(false)
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(
    null
  )

  const requestFieldsCount = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
      const tabId = tabs[0]?.id
      if (!tabId) return
      chrome.tabs.sendMessage(tabId, { type: 'GET_FIELDS_COUNT' }, response => {
        if (chrome.runtime.lastError) {
          setFieldsCount(0)
          return
        }
        if (response?.count !== undefined) {
          setFieldsCount(response.count)
        }
      })
    })
  }

  useEffect(() => {
    const loadConfig = async () => {
      const cfg = await getConfig()
      setConfig(cfg)
      requestFieldsCount()
    }
    loadConfig()
  }, [])

  useEffect(() => {
    if (feedback) {
      const timer = setTimeout(() => setFeedback(null), 3000)
      return () => clearTimeout(timer)
    }
  }, [feedback])

  const handleAutofill = useCallback(() => {
    setLoading(true)
    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
      const tabId = tabs[0]?.id
      if (!tabId) {
        setLoading(false)
        setFeedback({ type: 'error', message: 'No se encontró la pestaña activa' })
        return
      }
      chrome.tabs.sendMessage(tabId, { type: 'AUTOFILL_REQUEST' }, (response: AutofillResult) => {
        setLoading(false)
        if (chrome.runtime.lastError || !response) {
          setFeedback({
            type: 'error',
            message: 'Error al comunicar con la página. Recarga e intenta de nuevo.',
          })
          return
        }
        if (response.success) {
          setFeedback({
            type: 'success',
            message: `${response.filled} campos completados${response.skipped > 0 ? `, ${response.skipped} omitidos` : ''}`,
          })
        } else {
          setFeedback({ type: 'error', message: `Errores en ${response.errors.length} campos` })
        }
      })
    })
  }, [])

  const handleClear = useCallback(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
      const tabId = tabs[0]?.id
      if (!tabId) return
      chrome.tabs.sendMessage(tabId, { type: 'CLEAR_FIELDS' }, response => {
        if (chrome.runtime.lastError) {
          setFeedback({ type: 'error', message: 'Error al limpiar los campos' })
          return
        }
        if (response?.cleared !== undefined) {
          setFeedback({ type: 'success', message: `${response.cleared} campos limpiados` })
        }
      })
    })
  }, [])

  const handleLocaleChange = useCallback(async (locale: SupportedLocale) => {
    const updated = await saveConfig({ locale })
    setConfig(updated)
    notifyConfigUpdate(updated)
  }, [])

  const handleValidationToggle = useCallback(async () => {
    if (!config) return
    const updated = await saveConfig({ strictValidation: !config.strictValidation })
    setConfig(updated)
    notifyConfigUpdate(updated)
  }, [config])

  const handleFloatingButtonToggle = useCallback(async () => {
    if (!config) return
    const updated = await saveConfig({ showFloatingButton: !config.showFloatingButton })
    setConfig(updated)
    notifyConfigUpdate(updated)
  }, [config])

  const notifyConfigUpdate = (updated: UserConfig) => {
    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
      const tabId = tabs[0]?.id
      if (!tabId) return
      chrome.tabs.sendMessage(tabId, { type: 'CONFIG_UPDATED', payload: updated })
    })
  }

  if (!config) return null

  return (
    <div className="w-[360px] bg-background flex flex-col">
      <Header />

      <div className="px-4 py-3 flex flex-col gap-2">
        <FieldCounter count={fieldsCount} />

        <AutofillButton onClick={handleAutofill} loading={loading} />

        <div className="flex flex-col gap-2 bg-white p-3 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <LocaleSelector
            value={config.locale}
            options={LOCALE_OPTIONS}
            onChange={handleLocaleChange}
          />
          <ValidationToggle enabled={config.strictValidation} onToggle={handleValidationToggle} />
          <FloatingButtonToggle
            enabled={config.showFloatingButton}
            onToggle={handleFloatingButtonToggle}
          />
        </div>

        <ClearButton onClick={handleClear} />

        <button
          onClick={() => chrome.runtime.openOptionsPage()}
          className="text-sm text-muted-foreground hover:text-primary transition-colors text-center py-1"
        >
          Configuración avanzada
        </button>
      </div>

      {feedback && <FeedbackToast type={feedback.type} message={feedback.message} />}
    </div>
  )
}
