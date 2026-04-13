import { Button } from '@/components/retroui/Button'
import { RotateCcw } from 'lucide-react'

/** Props for the {@link ResetButton} component */
interface ResetButtonProps {
  /** Callback fired when the reset action is confirmed */
  onReset: () => void
}

/**
 * Button that restores all extension settings to their factory defaults.
 *
 * Uses an outline variant with a rotate-counterclockwise icon to indicate
 * the "restore to defaults" action.
 */
export default function ResetButton({ onReset }: ResetButtonProps) {
  return (
    <Button variant="outline" onClick={onReset}>
      <RotateCcw className="w-4 h-4" />
      Restaurar valores por defecto
    </Button>
  )
}
