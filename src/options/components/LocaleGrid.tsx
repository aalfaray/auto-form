import type { LocaleOption, SupportedLocale } from '../../shared/types'
import { Button } from '@/components/retroui/Button'

/** Props for the {@link LocaleGrid} component */
interface LocaleGridProps {
  /** The currently selected locale */
  value: SupportedLocale
  /** Available locale options with flags and labels */
  options: LocaleOption[]
  /** Callback fired when a locale is selected */
  onChange: (locale: SupportedLocale) => void
}

/**
 * Grid of locale selection buttons for the options page.
 *
 * Displays all available locales as buttons in a 3-column grid with
 * flag emojis and locale names. The currently selected locale uses
 * the default (filled) variant, while others use the outline variant.
 */
export default function LocaleGrid({ value, options, onChange }: LocaleGridProps) {
  return (
    <div className="grid grid-cols-3 gap-2">
      {options.map(opt => (
        <Button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          variant={value === opt.value ? 'default' : 'outline'}
          className="flex items-center gap-2"
        >
          <span className="text-lg">{opt.flag}</span>
          <span>{opt.label}</span>
        </Button>
      ))}
    </div>
  )
}
