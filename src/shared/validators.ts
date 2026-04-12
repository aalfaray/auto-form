export function validateEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

export function validatePhone(value: string): boolean {
  return /^[\d\s\-\+\(\)]{7,20}$/.test(value)
}

export function validateZipCode(value: string): boolean {
  return /^[\d\w\s\-]{3,10}$/.test(value)
}

export function validateUrl(value: string): boolean {
  try {
    new URL(value)
    return true
  } catch {
    return false
  }
}

export function validateByPattern(value: string, pattern: string): boolean {
  try {
    return new RegExp(pattern).test(value)
  } catch {
    return true
  }
}

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
