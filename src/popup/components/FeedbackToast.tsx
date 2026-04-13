import { Alert } from '@/components/retroui/Alert'
import { CheckCircle, XCircle } from 'lucide-react'

/** Props for the {@link FeedbackToast} component */
interface FeedbackToastProps {
  /** The feedback status type determining icon and color scheme */
  type: 'success' | 'error'
  /** The feedback message to display */
  message: string
}

/**
 * Transient feedback notification shown after autofill or clear operations.
 *
 * Displays a colored alert with a success (green) or error (red) icon
 * alongside the operation result message.
 */
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
