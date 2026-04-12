import { Switch } from '@/components/retroui/Switch'

interface ValidationToggleProps {
  enabled: boolean
  onToggle: () => void
}

export default function ValidationToggle({ enabled, onToggle }: ValidationToggleProps) {
  return (
    <div className="flex items-center justify-between">
      <label className="text-sm text-foreground">Validación estricta</label>
      <Switch checked={enabled} onCheckedChange={onToggle} />
    </div>
  )
}
