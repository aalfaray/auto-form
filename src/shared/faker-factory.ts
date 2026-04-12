import { faker } from '@faker-js/faker'
import { faker as fakerES } from '@faker-js/faker/locale/es'
import { faker as fakerEN } from '@faker-js/faker/locale/en'
import { faker as fakerPT_BR } from '@faker-js/faker/locale/pt_BR'
import { faker as fakerFR } from '@faker-js/faker/locale/fr'
import { faker as fakerDE } from '@faker-js/faker/locale/de'
import { faker as fakerIT } from '@faker-js/faker/locale/it'
import { faker as fakerJA } from '@faker-js/faker/locale/ja'
import { faker as fakerKO } from '@faker-js/faker/locale/ko'
import { faker as fakerZH_CN } from '@faker-js/faker/locale/zh_CN'
import type { SupportedLocale } from './types'

const fakerInstances: Record<SupportedLocale, typeof faker> = {
  es: fakerES,
  en: fakerEN,
  pt_BR: fakerPT_BR,
  fr: fakerFR,
  de: fakerDE,
  it: fakerIT,
  ja: fakerJA,
  ko: fakerKO,
  zh_CN: fakerZH_CN,
}

export function getFaker(locale: SupportedLocale): typeof faker {
  return fakerInstances[locale] || fakerEN
}

type FakerMethod = string

export function generateData(fakerInstance: typeof faker, method: FakerMethod): string {
  const parts = method.split('.')
  let obj: unknown = fakerInstance
  for (const part of parts) {
    if (obj && typeof obj === 'object' && part in obj) {
      obj = (obj as Record<string, unknown>)[part]
    } else {
      return ''
    }
  }

  if (typeof obj === 'function') {
    const result = obj()
    if (result instanceof Date) {
      return result.toISOString().split('T')[0]
    }
    return String(result)
  }

  return String(obj)
}
