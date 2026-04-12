import { Button } from '@/components/retroui/Button'
import { RotateCcw } from 'lucide-react'

interface ResetButtonProps {
  onReset: () => void
}

export default function ResetButton({ onReset }: ResetButtonProps) {
  return (
    <Button variant="outline" onClick={onReset}>
      <RotateCcw className="w-4 h-4" />
      Restaurar valores por defecto
    </Button>
  )
}
