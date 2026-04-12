import type { LocaleOption, SupportedLocale } from '../../shared/types'
import { Select } from '@/components/retroui/Select'

interface LocaleSelectorProps {
  value: SupportedLocale
  options: LocaleOption[]
  onChange: (locale: SupportedLocale) => void
}

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
