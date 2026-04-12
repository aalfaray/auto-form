import type { FieldMapping, LocaleOption, SupportedLocale, UserConfig } from './types'

export const DEFAULT_CONFIG: UserConfig = {
  locale: 'es',
  strictValidation: true,
  showFloatingButton: true,
  detectionAttributes: {
    name: true,
    id: true,
    placeholder: true,
    label: true,
    type: true,
  },
  ignoredSelectors: [],
}

export const LOCALE_OPTIONS: LocaleOption[] = [
  { value: 'es', label: 'Español', flag: '🇪🇸' },
  { value: 'en', label: 'English', flag: '🇺🇸' },
  { value: 'pt_BR', label: 'Português (BR)', flag: '🇧🇷' },
  { value: 'fr', label: 'Français', flag: '🇫🇷' },
  { value: 'de', label: 'Deutsch', flag: '🇩🇪' },
  { value: 'it', label: 'Italiano', flag: '🇮🇹' },
  { value: 'ja', label: '日本語', flag: '🇯🇵' },
  { value: 'ko', label: '한국어', flag: '🇰🇷' },
  { value: 'zh_CN', label: '中文', flag: '🇨🇳' },
]

export const FIELD_MAPPINGS: FieldMapping[] = [
  {
    pattern: /first[_\-]?name|nombre|fname|given[_\-]?name/i,
    fakerMethod: 'person.firstName',
    category: 'personal',
  },
  {
    pattern: /last[_\-]?name|apellido|lname|surname|family[_\-]?name/i,
    fakerMethod: 'person.lastName',
    category: 'personal',
  },
  {
    pattern: /full[_\-]?name|nombre[_\-]?completo/i,
    fakerMethod: 'person.fullName',
    category: 'personal',
  },
  {
    pattern: /email|e[_\-]?mail|correo|correo[_\-]?electronico/i,
    fakerMethod: 'internet.email',
    category: 'contact',
  },
  {
    pattern: /phone|tel(?!e)|telefono|teléfono|mobile|celular|cell|fax/i,
    fakerMethod: 'phone.number',
    category: 'contact',
  },
  {
    pattern: /address|direccion|dirección|street|calle/i,
    fakerMethod: 'location.streetAddress',
    category: 'address',
  },
  {
    pattern: /city|ciudad|town|pueblo/i,
    fakerMethod: 'location.city',
    category: 'address',
  },
  {
    pattern: /state|estado|provincia|region/i,
    fakerMethod: 'location.state',
    category: 'address',
  },
  {
    pattern: /zip|postal|cp|codigo[_\-]?postal|postcode/i,
    fakerMethod: 'location.zipCode',
    category: 'address',
  },
  {
    pattern: /country|pais|país/i,
    fakerMethod: 'location.country',
    category: 'address',
  },
  {
    pattern: /company|empresa|compania|organization|organización/i,
    fakerMethod: 'company.name',
    category: 'misc',
  },
  {
    pattern: /user(?!name)|usuario|username|user[_\-]?name|nickname|nick|login/i,
    fakerMethod: 'internet.username',
    category: 'contact',
  },
  {
    pattern: /password|contraseña|passwd|pwd/i,
    fakerMethod: 'internet.password',
    category: 'contact',
  },
  {
    pattern: /url|website|sitio|homepage|site/i,
    fakerMethod: 'internet.url',
    category: 'misc',
  },
  {
    pattern: /birthdate|birth[_\-]?date|dob|birthday|fecha[_\-]?nacimiento/i,
    fakerMethod: 'date.birthdate',
    category: 'personal',
  },
  { pattern: /age|edad/i, fakerMethod: 'number.int', category: 'personal' },
  {
    pattern: /job|trabajo|occupation|profesion|profesión|puesto/i,
    fakerMethod: 'person.jobTitle',
    category: 'personal',
  },
  {
    pattern: /card[_\-]?number|numero[_\-]?tarjeta|tarjeta|credit[_\-]?card|cc[_\-]?num/i,
    fakerMethod: 'finance.creditCardNumber',
    category: 'payment',
  },
  {
    pattern: /card[_\-]?expiry|exp[_\-]?date|vencimiento|caducidad|cc[_\-]?exp/i,
    fakerMethod: 'finance.creditCardExpirationDate',
    category: 'payment',
  },
  {
    pattern: /cvv|cvc|card[_\-]?cvv|security[_\-]?code|codigo[_\-]?seguridad/i,
    fakerMethod: 'finance.creditCardCVV',
    category: 'payment',
  },
  {
    pattern: /iban|cuenta|account/i,
    fakerMethod: 'finance.iban',
    category: 'payment',
  },
  {
    pattern:
      /description|descripcion|descripción|comment|comentario|message|mensaje|notes|notas|bio|about/i,
    fakerMethod: 'lorem.sentence',
    category: 'misc',
  },
  {
    pattern: /gender|genero|género|sexo/i,
    fakerMethod: 'person.sex',
    category: 'personal',
  },
]

export const INPUT_SELECTORS =
  'input:not([type="hidden"]):not([type="submit"]):not([type="button"]):not([type="reset"]):not([type="image"]):not([type="file"]), textarea, select'

export const PLACEHOLDER_PATTERNS: Array<{
  pattern: RegExp
  fakerMethod: string
}> = [
  { pattern: /nombre|name/i, fakerMethod: 'person.firstName' },
  { pattern: /apellido|surname/i, fakerMethod: 'person.lastName' },
  { pattern: /email|correo|e-mail/i, fakerMethod: 'internet.email' },
  { pattern: /tel[eé]fono|phone|mobile|celular/i, fakerMethod: 'phone.number' },
  {
    pattern: /direccion|address|calle|street/i,
    fakerMethod: 'location.streetAddress',
  },
  { pattern: /ciudad|city/i, fakerMethod: 'location.city' },
  { pattern: /pa[ií]s|country/i, fakerMethod: 'location.country' },
  {
    pattern: /c[oó]digo\s*postal|zip|postal/i,
    fakerMethod: 'location.zipCode',
  },
  { pattern: /empresa|company/i, fakerMethod: 'company.name' },
  { pattern: /usuario|username|user/i, fakerMethod: 'internet.username' },
  { pattern: /contrase[uñ]a|password/i, fakerMethod: 'internet.password' },
  { pattern: /fecha|date/i, fakerMethod: 'date.birthdate' },
  { pattern: /tarjeta|card/i, fakerMethod: 'finance.creditCardNumber' },
  {
    pattern: /comentario|comment|mensaje|message/i,
    fakerMethod: 'lorem.sentence',
  },
]

export const SUPPORTED_LOCALES: SupportedLocale[] = [
  'es',
  'en',
  'pt_BR',
  'fr',
  'de',
  'it',
  'ja',
  'ko',
  'zh_CN',
]
