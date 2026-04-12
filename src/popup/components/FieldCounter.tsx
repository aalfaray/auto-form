import { Badge } from '@/components/retroui/Badge'

interface FieldCounterProps {
  count: number
}

export default function FieldCounter({ count }: FieldCounterProps) {
  return (
    <div className="flex items-center gap-2 bg-white px-3 py-2 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
      <Badge variant="solid" size="sm">
        {count}
      </Badge>
      <span className="text-sm text-foreground">
        {count > 0
          ? `${count} campo${count !== 1 ? 's' : ''} detectado${count !== 1 ? 's' : ''}`
          : 'No se detectaron campos'}
      </span>
    </div>
  )
}
