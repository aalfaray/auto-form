import { Switch } from '@/components/retroui/Switch'

interface DetectionConfigProps {
  attributes: {
    name: boolean
    id: boolean
    placeholder: boolean
    label: boolean
    type: boolean
  }
  onChange: (attributes: DetectionConfigProps['attributes']) => void
}

const ATTRIBUTE_LABELS: Record<string, { label: string; description: string }> = {
  name: { label: 'Atributo name', description: 'Nombre del campo HTML' },
  id: { label: 'Atributo id', description: 'Identificador del elemento' },
  placeholder: { label: 'Placeholder', description: 'Texto de marcador de posición' },
  label: { label: 'Etiqueta label', description: 'Texto del label asociado' },
  type: { label: 'Atributo type', description: 'Tipo de input (email, tel, etc.)' },
}

export default function DetectionConfig({ attributes, onChange }: DetectionConfigProps) {
  const toggle = (key: string) => {
    onChange({
      ...attributes,
      [key]: !attributes[key as keyof typeof attributes],
    })
  }

  return (
    <div className="space-y-2">
      {Object.entries(ATTRIBUTE_LABELS).map(([key, { label, description }]) => (
        <div key={key} className="flex items-center justify-between py-1.5">
          <div>
            <p className="text-sm text-foreground">{label}</p>
            <p className="text-xs text-muted-foreground">{description}</p>
          </div>
          <Switch
            checked={attributes[key as keyof typeof attributes]}
            onCheckedChange={() => toggle(key)}
          />
        </div>
      ))}
    </div>
  )
}
