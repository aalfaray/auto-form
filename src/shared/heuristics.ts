import type { DetectedField, FieldMapping, UserConfig } from './types'
import { FIELD_MAPPINGS, INPUT_SELECTORS, PLACEHOLDER_PATTERNS } from './constants'

/**
 * Finds the label text associated with an HTML element by searching in multiple locations.
 *
 * Searches in order: `<label for="id">`, closest parent `<label>`, sibling `<label>` inside parent wrapper.
 *
 * @param element - The target HTML element to find the label for
 * @returns The trimmed label text, or an empty string if no label is found
 *
 * @example
 * // Given: <label for="email">Correo</label><input id="email" />
 * getLabel(document.getElementById('email')) // => 'Correo'
 */
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

/**
 * Matches a string value against all configured field mapping patterns.
 *
 * Iterates through {@link FIELD_MAPPINGS} and returns the first mapping whose
 * regex pattern matches the trimmed value.
 *
 * @param value - The attribute value to match (e.g. input name, id, or label text)
 * @returns The matching {@link FieldMapping}, or `null` if no pattern matches
 */
function matchFieldMapping(value: string): FieldMapping | null {
  if (!value) return null
  const trimmed = value.trim()
  for (const mapping of FIELD_MAPPINGS) {
    if (mapping.pattern.test(trimmed)) return mapping
  }
  return null
}

/**
 * Matches a placeholder text against known placeholder patterns.
 *
 * @param value - The placeholder attribute value to test
 * @returns The faker method string (e.g. `'person.firstName'`), or `null` if no match
 */
function matchPlaceholder(value: string): string | null {
  if (!value) return null
  for (const pp of PLACEHOLDER_PATTERNS) {
    if (pp.pattern.test(value)) return pp.fakerMethod
  }
  return null
}

/**
 * Returns the appropriate faker method for a given HTML input type attribute.
 *
 * @param type - The input type attribute value (e.g. `'email'`, `'tel'`, `'url'`)
 * @returns The faker method path (e.g. `'internet.email'`), or `null` if unmapped
 */
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

/**
 * Returns the appropriate faker method for a given HTML `autocomplete` attribute value.
 *
 * Maps standard autocomplete tokens defined in the HTML spec to their corresponding
 * faker.js data generation methods.
 *
 * @param ac - The autocomplete attribute value (e.g. `'given-name'`, `'email'`, `'postal-code'`)
 * @returns The faker method path, or `null` if the autocomplete value is unmapped
 */
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

/**
 * Scans the current document for form fields and identifies each field's type and
 * the appropriate faker method to generate data for it.
 *
 * Uses a priority-based detection cascade:
 * 1. Input `type` attribute (confidence 0.95)
 * 2. Input `name` attribute (confidence 0.9)
 * 3. Input `id` attribute (confidence 0.85)
 * 4. Input `placeholder` attribute (confidence 0.8)
 * 5. Associated `<label>` text (confidence 0.85/0.75)
 * 6. `autocomplete` attribute (confidence 0.9)
 * 7. Fallback to `lorem.word` (confidence 0.3)
 *
 * Fields that are disabled, read-only, or match ignored selectors are skipped.
 *
 * @param config - The user configuration specifying detection attributes and ignored selectors
 * @returns An array of {@link DetectedField} objects with element references, types, and confidence scores
 *
 * @example
 * const fields = detectFields({ locale: 'es', detectionAttributes: { name: true, id: true, ... }, ... })
 * // => [{ element: HTMLInputElement, type: 'text', fakerMethod: 'person.firstName', category: 'personal', confidence: 0.9 }]
 */
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

/**
 * Checks if an element matches any of the user-defined ignored CSS selectors.
 *
 * Invalid CSS selectors are silently skipped without throwing.
 *
 * @param element - The HTML element to test
 * @param selectors - Array of CSS selector strings to match against
 * @returns `true` if the element matches any selector, `false` otherwise
 */
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

/**
 * Identifies a single form field's purpose and maps it to a faker data generation method.
 *
 * Handles special input types first (select, checkbox, radio, range, color),
 * then falls through the detection priority chain based on enabled detection attributes.
 *
 * @param element - The form element to identify
 * @param config - The user configuration controlling which attributes are used for detection
 * @returns A {@link DetectedField} with identification metadata, or `null` if the field should be skipped
 */
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

/**
 * Counts the total number of detectable form fields in the current document.
 *
 * Uses the same {@link INPUT_SELECTORS} query as detection to ensure consistency.
 *
 * @returns The number of input, textarea, and select elements found
 */
export function countFields(): number {
  return document.querySelectorAll(INPUT_SELECTORS).length
}
