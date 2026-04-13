import type { AutofillResult, UserConfig } from '../shared/types'
import { getFaker, generateData } from '../shared/faker-factory'
import { validateValue } from '../shared/validators'
import { detectFields } from './detector'

/**
 * Sets an input/textarea value using the native property setter to ensure
 * React and other frameworks detect the change.
 *
 * Dispatches `input`, `change`, and `blur` events after setting the value
 * to trigger all event listeners and framework reconciliation.
 *
 * @param element - The input or textarea element to set the value on
 * @param value - The new value to assign
 */
function setNativeValue(element: HTMLInputElement | HTMLTextAreaElement, value: string): void {
  const valueSetter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')?.set

  const textValueSetter = Object.getOwnPropertyDescriptor(
    HTMLTextAreaElement.prototype,
    'value'
  )?.set

  const setter = element instanceof HTMLTextAreaElement ? textValueSetter : valueSetter

  if (setter) {
    setter.call(element, value)
  } else {
    element.value = value
  }

  element.dispatchEvent(new Event('input', { bubbles: true }))
  element.dispatchEvent(new Event('change', { bubbles: true }))
  element.dispatchEvent(new Event('blur', { bubbles: true }))
}

/**
 * Fills a `<select>` element with a random non-placeholder option.
 *
 * Filters out disabled, empty, and placeholder options before selecting
 * a random one from the remaining choices.
 *
 * @param element - The select element to fill
 * @returns `true` if an option was selected, `false` if no valid options exist
 */
function fillSelect(element: HTMLSelectElement): boolean {
  const options = Array.from(element.options).filter(
    opt => !opt.disabled && opt.value.trim() !== '' && !isPlaceholderOption(opt)
  )
  if (options.length === 0) return false

  const randomOption = options[Math.floor(Math.random() * options.length)]
  element.value = randomOption.value
  element.dispatchEvent(new Event('change', { bubbles: true }))
  return true
}

/**
 * Determines if a select option is a placeholder rather than a real choice.
 *
 * Checks the option text against common placeholder patterns in multiple languages
 * (e.g. "Seleccione", "Choose", "--", "...", "None").
 *
 * @param opt - The option element to check
 * @returns `true` if the option appears to be a placeholder
 */
function isPlaceholderOption(opt: HTMLOptionElement): boolean {
  const text = opt.textContent?.trim().toLowerCase() || ''
  const placeholderTexts = [
    'seleccione',
    'select',
    'choose',
    'elige',
    'seleccionar',
    '--',
    '...',
    'ninguno',
    'none',
  ]
  return placeholderTexts.some(p => text.includes(p)) || text === ''
}

/**
 * Fills a checkbox input with a random checked state (50/50 probability).
 *
 * @param element - The checkbox input element
 * @returns Always `true` (checkbox is always successfully filled)
 */
function fillCheckbox(element: HTMLInputElement): boolean {
  element.checked = Math.random() > 0.5
  element.dispatchEvent(new Event('change', { bubbles: true }))
  return true
}

/**
 * Fills a radio button by randomly selecting one option from its named group.
 *
 * If the radio has no `name` attribute, it is simply checked.
 * If it has a `name`, all radios in the group are considered and one is
 * randomly selected.
 *
 * @param element - The radio input element
 * @returns Always `true`
 */
function fillRadio(element: HTMLInputElement): boolean {
  const name = element.name
  if (!name) {
    element.checked = true
    element.dispatchEvent(new Event('change', { bubbles: true }))
    return true
  }
  const group = document.querySelectorAll<HTMLInputElement>(
    `input[type="radio"][name="${CSS.escape(name)}"]`
  )
  const target = group[Math.floor(Math.random() * group.length)]
  if (target) {
    target.checked = true
    target.dispatchEvent(new Event('change', { bubbles: true }))
  }
  return true
}

/**
 * Fills a range input with a random value within its min/max/step constraints.
 *
 * @param element - The range input element
 * @returns Always `true`
 */
function fillRange(element: HTMLInputElement): boolean {
  const min = parseFloat(element.min) || 0
  const max = parseFloat(element.max) || 100
  const step = parseFloat(element.step) || 1
  const steps = Math.floor((max - min) / step)
  const randomSteps = Math.floor(Math.random() * steps)
  const value = min + randomSteps * step
  setNativeValue(element, String(value))
  return true
}

/**
 * Generates a numeric value for a number-type input, respecting min/max/step constraints.
 *
 * If the input has both `min` and `max` attributes defined, generates a value within
 * that range following the `step` interval. Otherwise, delegates to faker data generation.
 *
 * @param element - The number input element
 * @param fakerMethod - The faker method to use as fallback
 * @param locale - The locale for faker data generation
 * @returns The generated numeric value as a string
 */
function fillNumber(element: HTMLInputElement, fakerMethod: string, locale: string): string {
  const fakerInstance = getFaker(locale as never)
  const min = parseFloat(element.min)
  const max = parseFloat(element.max)
  const step = parseFloat(element.step) || 1

  if (!isNaN(min) && !isNaN(max)) {
    const steps = Math.floor((max - min) / step)
    const randomSteps = Math.floor(Math.random() * steps)
    return String(min + randomSteps * step)
  }

  return generateData(fakerInstance, fakerMethod === 'number.int' ? 'number.int' : fakerMethod)
}

/**
 * Fills all detectable form fields in the current document with synthetic data.
 *
 * Processes each detected field according to its type:
 * - **select**: Random valid option
 * - **checkbox**: Random checked state
 * - **radio**: Random group selection
 * - **range**: Random value within constraints
 * - **color**: Random hex color
 * - **number**: Respects min/max/step or uses faker
 * - **text/others**: Faker-generated data with optional validation
 *
 * Enforces `maxLength` constraints and retries up to 10 times when strict validation
 * fails with an HTML pattern attribute.
 *
 * @param config - The user configuration specifying locale, validation, and detection settings
 * @returns An {@link AutofillResult} with counts of filled/skipped fields and error details
 */
export function fillFields(config: UserConfig): AutofillResult {
  const fields = detectFields(config)
  const fakerInstance = getFaker(config.locale)
  const result: AutofillResult = {
    success: true,
    filled: 0,
    skipped: 0,
    errors: [],
  }

  for (const field of fields) {
    try {
      const { element, type, fakerMethod } = field

      if (element instanceof HTMLSelectElement) {
        if (fillSelect(element)) {
          result.filled++
        } else {
          result.skipped++
        }
        continue
      }

      if (type === 'checkbox') {
        fillCheckbox(element as HTMLInputElement)
        result.filled++
        continue
      }

      if (type === 'radio') {
        fillRadio(element as HTMLInputElement)
        result.filled++
        continue
      }

      if (type === 'range') {
        fillRange(element as HTMLInputElement)
        result.filled++
        continue
      }

      if (type === 'color') {
        setNativeValue(
          element as HTMLInputElement,
          '#' +
            Math.floor(Math.random() * 16777215)
              .toString(16)
              .padStart(6, '0')
        )
        result.filled++
        continue
      }

      let value: string

      if (type === 'number') {
        value = fillNumber(element as HTMLInputElement, fakerMethod, config.locale)
      } else {
        value = generateData(fakerInstance, fakerMethod)
      }

      const inputEl = element as HTMLInputElement
      if (config.strictValidation && inputEl.pattern) {
        let attempts = 0
        while (!validateValue(value, fakerMethod, true, inputEl.pattern) && attempts < 10) {
          value = generateData(fakerInstance, fakerMethod)
          attempts++
        }
      }

      const maxLength = inputEl.maxLength
      if (maxLength > 0 && value.length > maxLength) {
        value = value.substring(0, maxLength)
      }

      setNativeValue(element as HTMLInputElement | HTMLTextAreaElement, value)
      result.filled++
    } catch (error) {
      result.skipped++
      result.errors.push({
        selector: getSelector(field.element),
        reason: error instanceof Error ? error.message : 'Unknown error',
      })
    }
  }

  return result
}

/**
 * Generates a CSS-like selector string for an element for error reporting.
 *
 * Tries `#id` first, then `[name="..."]`, then falls back to the tag name.
 *
 * @param element - The HTML element to generate a selector for
 * @returns A descriptive selector string
 */
function getSelector(element: HTMLElement): string {
  if (element.id) return `#${element.id}`
  const el = element as HTMLInputElement
  if (el.name) return `[name="${el.name}"]`
  return element.tagName.toLowerCase()
}

/**
 * Clears all form fields in the current document, resetting them to their default state.
 *
 * Handles text inputs, textareas, selects, checkboxes, and radio buttons.
 * Disabled and read-only fields are skipped.
 *
 * @returns The total number of fields that were cleared
 */
export function clearAllFields(): number {
  const inputs = document.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>(
    'input:not([type="hidden"]):not([type="submit"]):not([type="button"]):not([type="reset"]):not([type="image"]):not([type="file"]):not([type="checkbox"]):not([type="radio"]), textarea'
  )
  const selects = document.querySelectorAll<HTMLSelectElement>('select')
  let count = 0

  inputs.forEach(el => {
    if (!el.disabled && !el.readOnly) {
      setNativeValue(el, '')
      count++
    }
  })

  selects.forEach(el => {
    if (!el.disabled) {
      el.selectedIndex = 0
      el.dispatchEvent(new Event('change', { bubbles: true }))
      count++
    }
  })

  const checkboxes = document.querySelectorAll<HTMLInputElement>(
    'input[type="checkbox"], input[type="radio"]'
  )
  checkboxes.forEach(el => {
    if (!el.disabled) {
      el.checked = false
      el.dispatchEvent(new Event('change', { bubbles: true }))
      count++
    }
  })

  return count
}
