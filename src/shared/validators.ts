/**
 * Validates whether a string matches a standard email format.
 *
 * Uses a simplified regex that checks for the basic `user@domain.tld` structure.
 * Does not perform DNS verification or RFC 5322 full compliance.
 *
 * @param value - The string to validate as an email address
 * @returns `true` if the value matches the email pattern
 *
 * @example
 * validateEmail('user@example.com')  // => true
 * validateEmail('invalid-email')     // => false
 */
export function validateEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

/**
 * Validates whether a string matches a common phone number format.
 *
 * Accepts digits, spaces, hyphens, plus signs, and parentheses, with a length
 * between 7 and 20 characters.
 *
 * @param value - The string to validate as a phone number
 * @returns `true` if the value matches the phone pattern
 *
 * @example
 * validatePhone('+1 (555) 123-4567') // => true
 * validatePhone('abc')               // => false
 */
export function validatePhone(value: string): boolean {
  return /^[\d\s\-\+\(\)]{7,20}$/.test(value)
}

/**
 * Validates whether a string matches a common postal/zip code format.
 *
 * Accepts digits, word characters, spaces, and hyphens, with a length
 * between 3 and 10 characters to accommodate various international formats.
 *
 * @param value - The string to validate as a zip/postal code
 * @returns `true` if the value matches the postal code pattern
 */
export function validateZipCode(value: string): boolean {
  return /^[\d\w\s\-]{3,10}$/.test(value)
}

/**
 * Validates whether a string is a valid URL using the URL constructor.
 *
 * @param value - The string to validate as a URL
 * @returns `true` if the value can be parsed as a valid URL
 *
 * @example
 * validateUrl('https://example.com') // => true
 * validateUrl('not-a-url')           // => false
 */
export function validateUrl(value: string): boolean {
  try {
    new URL(value)
    return true
  } catch {
    return false
  }
}

/**
 * Tests a value against a regex pattern string.
 *
 * Returns `true` if the pattern is invalid (fail-open strategy to avoid blocking
 * form fills due to malformed regex patterns).
 *
 * @param value - The string to test
 * @param pattern - A regex pattern string to compile and test against
 * @returns `true` if the value matches, or if the pattern is invalid
 */
export function validateByPattern(value: string, pattern: string): boolean {
  try {
    return new RegExp(pattern).test(value)
  } catch {
    return true
  }
}

/**
 * Dispatches value validation to the appropriate validator based on the faker method type.
 *
 * When strict mode is disabled, all values pass validation.
 * Priority order: HTML pattern attribute → faker method type detection.
 *
 * @param value - The generated value to validate
 * @param fakerMethod - The faker method path used to generate the value (e.g. `'internet.email'`)
 * @param strict - Whether strict validation is enabled
 * @param htmlPattern - Optional HTML `pattern` attribute regex from the input element
 * @returns `true` if the value is valid or validation is not strict
 */
export function validateValue(
  value: string,
  fakerMethod: string,
  strict: boolean,
  htmlPattern?: string
): boolean {
  if (!strict) return true

  if (htmlPattern) {
    return validateByPattern(value, htmlPattern)
  }

  if (fakerMethod.includes('email')) return validateEmail(value)
  if (fakerMethod.includes('phone')) return validatePhone(value)
  if (fakerMethod.includes('zipCode') || fakerMethod.includes('postal'))
    return validateZipCode(value)
  if (fakerMethod.includes('url')) return validateUrl(value)

  return true
}
