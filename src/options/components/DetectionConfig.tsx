import { Switch } from '@/components/retroui/Switch'

/** Props for the {@link DetectionConfig} component */
interface DetectionConfigProps {
  /** Current state of each detection attribute toggle */
  attributes: {
    name: boolean
    id: boolean
    placeholder: boolean
    label: boolean
    type: boolean
  }
  /** Callback fired when any detection attribute is toggled */
  onChange: (attributes: DetectionConfigProps['attributes']) => void
}

/** Labels and descriptions for each detection attribute */
const ATTRIBUTE_LABELS: Record<string, { label: string; description: string }> = {
  name: { label: 'Atributo name', description: 'Nombre del campo HTML' },
  id: { label: 'Atributo id', description: 'Identificador del elemento' },
  placeholder: { label: 'Placeholder', description: 'Texto de marcador de posición' },
  label: { label: 'Etiqueta label', description: 'Texto del label asociado' },
  type: { label: 'Atributo type', description: 'Tipo de input (email, tel, etc.)' },
}

/**
 * Configuration panel for toggling which HTML attributes are used for field detection.
 *
 * Each attribute (name, id, placeholder, label, type) has its own toggle switch
 * with a descriptive label and subtitle explaining what the attribute represents.
 */
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
