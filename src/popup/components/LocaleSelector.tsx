import type { LocaleOption, SupportedLocale } from '../../shared/types'
import { Select } from '@/components/retroui/Select'

/** Props for the {@link LocaleSelector} component */
interface LocaleSelectorProps {
  /** The currently selected locale value */
  value: SupportedLocale
  /** Available locale options to display */
  options: LocaleOption[]
  /** Callback fired when a new locale is selected */
  onChange: (locale: SupportedLocale) => void
}

/**
 * Dropdown selector for choosing the data generation locale.
 *
 * Renders a Radix UI Select with flag emojis and locale labels.
 * The selected locale determines the cultural context of generated
 * faker data (names, addresses, phone numbers, etc.).
 */
export default function LocaleSelector({ value, options, onChange }: LocaleSelectorProps) {
  return (
    <div className="flex items-center justify-between">
      <label className="text-sm text-foreground">Locale de datos</label>
      <Select value={value} onValueChange={val => onChange(val as SupportedLocale)}>
        <Select.Trigger className="w-40">
          <Select.Value />
        </Select.Trigger>
        <Select.Content>
          {options.map(opt => (
            <Select.Item key={opt.value} value={opt.value}>
              {opt.flag} {opt.label}
            </Select.Item>
          ))}
        </Select.Content>
      </Select>
    </div>
  )
}
