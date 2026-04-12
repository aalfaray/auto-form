import { Button } from '@/components/retroui/Button'
import { Loader2, Check } from 'lucide-react'

interface AutofillButtonProps {
  onClick: () => void
  loading: boolean
}

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
