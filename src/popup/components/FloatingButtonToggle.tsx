import { Switch } from '@/components/retroui/Switch'

interface FloatingButtonToggleProps {
  enabled: boolean
  onToggle: () => void
}

export default function FloatingButtonToggle({ enabled, onToggle }: FloatingButtonToggleProps) {
  return (
    <div className="flex items-center justify-between">
      <label className="text-sm text-foreground">Botón flotante</label>
      <Switch checked={enabled} onCheckedChange={onToggle} />
    </div>
  )
}
