import { Switch } from '@/components/retroui/Switch'

/** Props for the {@link FloatingButtonToggle} component */
interface FloatingButtonToggleProps {
  /** Whether the floating button is currently visible on pages */
  enabled: boolean
  /** Callback fired when the toggle state changes */
  onToggle: () => void
}

/**
 * Toggle switch controlling visibility of the floating autofill button on web pages.
 *
 * Uses a Radix UI Switch component with a label describing the feature.
 */
export default function FloatingButtonToggle({ enabled, onToggle }: FloatingButtonToggleProps) {
  return (
    <div className="flex items-center justify-between">
      <label className="text-sm text-foreground">Botón flotante</label>
      <Switch checked={enabled} onCheckedChange={onToggle} />
    </div>
  )
}
