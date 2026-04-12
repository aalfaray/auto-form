import { Alert } from '@/components/retroui/Alert'
import { CheckCircle, XCircle } from 'lucide-react'

interface FeedbackToastProps {
  type: 'success' | 'error'
  message: string
}

export default function FeedbackToast({ type, message }: FeedbackToastProps) {
  return (
    <div className="mx-4 mb-3">
      <Alert status={type === 'success' ? 'success' : 'error'} variant="default">
        <div className="flex items-center gap-2">
          {type === 'success' ? (
            <CheckCircle className="w-4 h-4" />
          ) : (
            <XCircle className="w-4 h-4" />
          )}
          <span className="text-sm font-medium">{message}</span>
        </div>
      </Alert>
    </div>
  )
}
