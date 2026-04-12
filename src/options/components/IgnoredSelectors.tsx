import { useState } from 'react'
import { Input } from '@/components/retroui/Input'
import { Button } from '@/components/retroui/Button'
import { X } from 'lucide-react'

interface IgnoredSelectorsProps {
  selectors: string[]
  onChange: (selectors: string[]) => void
}

export default function IgnoredSelectors({ selectors, onChange }: IgnoredSelectorsProps) {
  const [input, setInput] = useState('')

  const add = () => {
    const trimmed = input.trim()
    if (!trimmed || selectors.includes(trimmed)) return
    try {
      document.createElement('div').matches(trimmed)
    } catch {
      return
    }
    onChange([...selectors, trimmed])
    setInput('')
  }

  const remove = (index: number) => {
    onChange(selectors.filter((_, i) => i !== index))
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      add()
    }
  }

  return (
    <div>
      <div className="flex gap-2 mb-3">
        <Input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="input[type='hidden'], .captcha..."
          className="flex-1"
        />
        <Button onClick={add} variant="default">
          Agregar
        </Button>
      </div>
      {selectors.length > 0 ? (
        <ul className="space-y-1">
          {selectors.map((sel, i) => (
            <li
              key={i}
              className="flex items-center justify-between bg-muted px-3 py-1.5 text-sm border-2 border-black"
            >
              <code className="text-foreground text-xs">{sel}</code>
              <Button onClick={() => remove(i)} variant="ghost" size="icon" className="h-6 w-6">
                <X className="w-3 h-3" />
              </Button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-xs text-muted-foreground italic">No hay selectores ignorados</p>
      )}
    </div>
  )
}
