import type { LocaleOption, SupportedLocale } from '../../shared/types'
import { Button } from '@/components/retroui/Button'

interface LocaleGridProps {
  value: SupportedLocale
  options: LocaleOption[]
  onChange: (locale: SupportedLocale) => void
}

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
