export type SupportedLocale = 'es' | 'en' | 'pt_BR' | 'fr' | 'de' | 'it' | 'ja' | 'ko' | 'zh_CN'

export interface UserConfig {
  locale: SupportedLocale
  strictValidation: boolean
  showFloatingButton: boolean
  detectionAttributes: {
    name: boolean
    id: boolean
    placeholder: boolean
    label: boolean
    type: boolean
  }
  ignoredSelectors: string[]
}

export interface FieldMapping {
  pattern: RegExp
  fakerMethod: string
  category: 'personal' | 'contact' | 'address' | 'payment' | 'misc'
}

export interface DetectedField {
  element: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
  type: string
  fakerMethod: string
  category: string
  confidence: number
}

export interface AutofillResult {
  success: boolean
  filled: number
  skipped: number
  errors: Array<{ selector: string; reason: string }>
}

export type MessageType =
  | 'FIELDS_DETECTED'
  | 'AUTOFILL_REQUEST'
  | 'AUTOFILL_RESULT'
  | 'CLEAR_FIELDS'
  | 'CONFIG_UPDATED'
  | 'GET_FIELDS_COUNT'

export interface ExtensionMessage {
  type: MessageType
  payload?: Record<string, unknown>
}

export interface LocaleOption {
  value: SupportedLocale
  label: string
  flag: string
}
