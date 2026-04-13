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

/** Pre-initialized faker instances keyed by supported locale */
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

/**
 * Retrieves the faker.js instance configured for the specified locale.
 *
 * Falls back to English (`en`) if the locale is not found in the instances map.
 *
 * @param locale - The target locale identifier (e.g. `'es'`, `'en'`, `'ja'`)
 * @returns The faker instance configured for the given locale
 *
 * @example
 * const fakerES = getFaker('es')
 * fakerES.person.firstName() // => 'María'
 */
export function getFaker(locale: SupportedLocale): typeof faker {
  return fakerInstances[locale] || fakerEN
}

type FakerMethod = string

/**
 * Generates synthetic data by invoking a faker.js method specified as a dot-notation string.
 *
 * Traverses the faker object tree using the method path and invokes the resulting function.
 * If the method returns a `Date` object, it is converted to ISO date format (`YYYY-MM-DD`).
 *
 * @param fakerInstance - The faker.js instance to use for data generation
 * @param method - Dot-notation path to the faker method (e.g. `'person.firstName'`, `'internet.email'`)
 * @returns The generated value as a string, or an empty string if the method path is invalid
 *
 * @example
 * generateData(faker, 'person.firstName') // => 'John'
 * generateData(faker, 'internet.email')   // => 'john@example.com'
 * generateData(faker, 'date.birthdate')   // => '1990-05-15'
 */
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
