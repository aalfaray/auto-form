import { Switch } from '@/components/retroui/Switch'

/** Props for the {@link ValidationToggle} component */
interface ValidationToggleProps {
  /** Whether strict validation is currently enabled */
  enabled: boolean
  /** Callback fired when the toggle state changes */
  onToggle: () => void
}

/**
 * Toggle switch for enabling/disabling strict field validation.
 *
 * When enabled, generated values are validated against HTML pattern attributes
 * and expected formats (email, phone, zip code, URL) before being filled.
 */
export default function ValidationToggle({ enabled, onToggle }: ValidationToggleProps) {
  return (
    <div className="flex items-center justify-between">
      <label className="text-sm text-foreground">Validación estricta</label>
      <Switch checked={enabled} onCheckedChange={onToggle} />
    </div>
  )
}
