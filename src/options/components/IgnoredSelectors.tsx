import { useState } from 'react'
import { Input } from '@/components/retroui/Input'
import { Button } from '@/components/retroui/Button'
import { X } from 'lucide-react'

/** Props for the {@link IgnoredSelectors} component */
interface IgnoredSelectorsProps {
  /** Current list of CSS selectors to ignore */
  selectors: string[]
  /** Callback fired when the selector list is updated */
  onChange: (selectors: string[]) => void
}

/**
 * Manager for CSS selectors that should be excluded from autofill.
 *
 * Allows users to add CSS selectors (e.g. `input[type="hidden"]`, `.captcha`)
 * for form fields that should not be auto-filled. Validates each selector
 * before adding it and supports removal via individual delete buttons.
 * Pressing Enter in the input field triggers the add action.
 */
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
