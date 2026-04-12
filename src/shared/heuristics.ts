import type { DetectedField, FieldMapping, UserConfig } from './types'
import { FIELD_MAPPINGS, INPUT_SELECTORS, PLACEHOLDER_PATTERNS } from './constants'

function getLabel(element: HTMLElement): string {
  const id = element.id
  if (id) {
    const label = document.querySelector(`label[for="${CSS.escape(id)}"]`)
    if (label) return label.textContent?.trim() || ''
  }
  const parentLabel = element.closest('label')
  if (parentLabel) return parentLabel.textContent?.trim() || ''
  const wrapper = element.parentElement
  if (wrapper) {
    const labelEl = wrapper.querySelector('label')
    if (labelEl) return labelEl.textContent?.trim() || ''
  }
  return ''
}

function matchFieldMapping(value: string): FieldMapping | null {
  if (!value) return null
  const trimmed = value.trim()
  for (const mapping of FIELD_MAPPINGS) {
    if (mapping.pattern.test(trimmed)) return mapping
  }
  return null
}

function matchPlaceholder(value: string): string | null {
  if (!value) return null
  for (const pp of PLACEHOLDER_PATTERNS) {
    if (pp.pattern.test(value)) return pp.fakerMethod
  }
  return null
}

function getInputTypeMethod(type: string): string | null {
  const typeMap: Record<string, string> = {
    email: 'internet.email',
    tel: 'phone.number',
    url: 'internet.url',
    number: 'number.int',
    date: 'date.birthdate',
    search: 'lorem.word',
  }
  return typeMap[type] || null
}

function getAutocompleteMethod(ac: string): string | null {
  const acMap: Record<string, string> = {
    'given-name': 'person.firstName',
    'family-name': 'person.lastName',
    name: 'person.fullName',
    email: 'internet.email',
    tel: 'phone.number',
    'street-address': 'location.streetAddress',
    'address-line1': 'location.streetAddress',
    'address-line2': 'location.secondaryAddress',
    'address-level2': 'location.city',
    'address-level1': 'location.state',
    'postal-code': 'location.zipCode',
    country: 'location.country',
    'country-name': 'location.country',
    organization: 'company.name',
    username: 'internet.username',
    'new-password': 'internet.password',
    'current-password': 'internet.password',
    'cc-number': 'finance.creditCardNumber',
    'cc-exp': 'finance.creditCardExpirationDate',
    'cc-csc': 'finance.creditCardCVV',
  }
  return acMap[ac] || null
}

export function detectFields(config: UserConfig): DetectedField[] {
  const elements = document.querySelectorAll<
    HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
  >(INPUT_SELECTORS)
  const fields: DetectedField[] = []

  for (const element of elements) {
    if (shouldIgnore(element, config.ignoredSelectors)) continue
    if (element.disabled) continue
    if ('readOnly' in element && (element as HTMLInputElement).readOnly) continue

    const detection = identifyField(element, config)
    if (detection) {
      fields.push(detection)
    }
  }

  return fields
}

function shouldIgnore(element: HTMLElement, selectors: string[]): boolean {
  for (const selector of selectors) {
    try {
      if (element.matches(selector)) return true
    } catch {
      // invalid selector, skip
    }
  }
  return false
}

function identifyField(
  element: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement,
  config: UserConfig
): DetectedField | null {
  if (element instanceof HTMLSelectElement) {
    return {
      element,
      type: 'select',
      fakerMethod: 'select',
      category: 'misc',
      confidence: 1,
    }
  }

  const inputEl = element as HTMLInputElement

  if (inputEl.type === 'checkbox' || inputEl.type === 'radio') {
    return {
      element: inputEl,
      type: inputEl.type,
      fakerMethod: 'checkbox',
      category: 'misc',
      confidence: 1,
    }
  }

  if (inputEl.type === 'range' || inputEl.type === 'color') {
    return {
      element: inputEl,
      type: inputEl.type,
      fakerMethod: inputEl.type,
      category: 'misc',
      confidence: 1,
    }
  }

  const attrs = config.detectionAttributes

  if (attrs.type && inputEl.type) {
    const method = getInputTypeMethod(inputEl.type)
    if (method) {
      return {
        element: inputEl,
        type: inputEl.type,
        fakerMethod: method,
        category: 'contact',
        confidence: 0.95,
      }
    }
  }

  if (attrs.name && inputEl.name) {
    const mapping = matchFieldMapping(inputEl.name)
    if (mapping) {
      return {
        element: inputEl,
        type: inputEl.type,
        fakerMethod: mapping.fakerMethod,
        category: mapping.category,
        confidence: 0.9,
      }
    }
  }

  if (attrs.id && inputEl.id) {
    const mapping = matchFieldMapping(inputEl.id)
    if (mapping) {
      return {
        element: inputEl,
        type: inputEl.type,
        fakerMethod: mapping.fakerMethod,
        category: mapping.category,
        confidence: 0.85,
      }
    }
  }

  if (attrs.placeholder && inputEl.placeholder) {
    const method = matchPlaceholder(inputEl.placeholder)
    if (method) {
      return {
        element: inputEl,
        type: inputEl.type,
        fakerMethod: method,
        category: 'misc',
        confidence: 0.8,
      }
    }
  }

  if (attrs.label) {
    const labelText = getLabel(inputEl)
    if (labelText) {
      const mapping = matchFieldMapping(labelText)
      if (mapping) {
        return {
          element: inputEl,
          type: inputEl.type,
          fakerMethod: mapping.fakerMethod,
          category: mapping.category,
          confidence: 0.85,
        }
      }
      const method = matchPlaceholder(labelText)
      if (method) {
        return {
          element: inputEl,
          type: inputEl.type,
          fakerMethod: method,
          category: 'misc',
          confidence: 0.75,
        }
      }
    }
  }

  if (inputEl.autocomplete) {
    const method = getAutocompleteMethod(inputEl.autocomplete)
    if (method) {
      return {
        element: inputEl,
        type: inputEl.type,
        fakerMethod: method,
        category: 'misc',
        confidence: 0.9,
      }
    }
  }

  return {
    element: inputEl,
    type: inputEl.type || 'text',
    fakerMethod: 'lorem.word',
    category: 'misc',
    confidence: 0.3,
  }
}

export function countFields(): number {
  return document.querySelectorAll(INPUT_SELECTORS).length
}
