import type { AutofillResult, UserConfig } from '../shared/types'
import { getFaker, generateData } from '../shared/faker-factory'
import { validateValue } from '../shared/validators'
import { detectFields } from './detector'

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

function fillCheckbox(element: HTMLInputElement): boolean {
  element.checked = Math.random() > 0.5
  element.dispatchEvent(new Event('change', { bubbles: true }))
  return true
}

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

function getSelector(element: HTMLElement): string {
  if (element.id) return `#${element.id}`
  const el = element as HTMLInputElement
  if (el.name) return `[name="${el.name}"]`
  return element.tagName.toLowerCase()
}

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
