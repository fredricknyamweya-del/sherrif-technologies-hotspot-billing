import { AlertTriangle, RefreshCw } from 'lucide-react'
import Button from './Button'

export default function ErrorState({
  title = 'Something went wrong',
  message = 'We could not load this information. Please try again.',
  onRetry,
  className = '',
}) {
  return (
    <section className={`ui-state ui-error ${className}`.trim()} role="alert">
      <span className="ui-state-icon">
        <AlertTriangle size={24} aria-hidden="true" />
      </span>
      <h3>{title}</h3>
      <p>{message}</p>
      {onRetry && (
        <Button variant="outline" onClick={onRetry}>
          <RefreshCw size={16} aria-hidden="true" />
          Try again
        </Button>
      )}
    </section>
  )
}