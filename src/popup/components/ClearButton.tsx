import { Button } from '@/components/retroui/Button'
import { Trash2 } from 'lucide-react'

interface ClearButtonProps {
  onClick: () => void
}

export default function ClearButton({ onClick }: ClearButtonProps) {
  return (
    <Button variant="outline" onClick={onClick} className="w-full">
      <Trash2 className="w-4 h-4" />
      Limpiar campos
    </Button>
  )
}
