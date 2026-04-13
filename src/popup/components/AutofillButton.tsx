import { Button } from '@/components/retroui/Button'
import { Loader2, Check } from 'lucide-react'

/** Props for the {@link AutofillButton} component */
interface AutofillButtonProps {
  /** Callback fired when the button is clicked */
  onClick: () => void
  /** Whether the autofill operation is in progress */
  loading: boolean
}

/**
 * Primary action button that triggers form autofill.
 *
 * Displays a loading spinner with "Completando..." text while the operation
 * is in progress, or a checkmark with "Autocompletar formulario" when idle.
 * Disabled during loading to prevent duplicate requests.
 */
export default function AutofillButton({ onClick, loading }: AutofillButtonProps) {
  return (
    <Button onClick={onClick} disabled={loading} size="lg" className="w-full">
      {loading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          Completando...
        </>
      ) : (
        <>
          <Check className="w-4 h-4" />
          Autocompletar formulario
        </>
      )}
    </Button>
  )
}
