import { Button } from '@/components/retroui/Button'
import { Trash2 } from 'lucide-react'

/** Props for the {@link ClearButton} component */
interface ClearButtonProps {
  /** Callback fired when the button is clicked */
  onClick: () => void
}

/**
 * Secondary action button that clears all filled form fields.
 *
 * Rendered with an outline variant and trash icon to visually distinguish
 * it from the primary autofill action.
 */
export default function ClearButton({ onClick }: ClearButtonProps) {
  return (
    <Button variant="outline" onClick={onClick} className="w-full">
      <Trash2 className="w-4 h-4" />
      Limpiar campos
    </Button>
  )
}
