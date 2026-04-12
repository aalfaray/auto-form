import { Badge } from '@/components/retroui/Badge'

export default function Header() {
  return (
    <div className="bg-primary px-4 py-3 flex items-center gap-2">
      <svg viewBox="0 0 24 24" className="w-6 h-6 fill-primary-foreground">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm-1 2l5 5h-5V4zM8 17h8v-2H8v2zm0-4h8v-2H8v2z" />
      </svg>
      <h1 className="text-primary-foreground text-sm font-semibold">Auto-Form</h1>
      <Badge variant="solid" size="sm" className="ml-auto">
        v1.0.0
      </Badge>
    </div>
  )
}
