import { LoaderCircle } from 'lucide-react'

export default function LoadingState({
  label = 'Loading',
  className = '',
  compact = false,
}) {
  return (
    <div
      className={`ui-loading${compact ? ' is-compact' : ''} ${className}`.trim()}
      role="status"
      aria-live="polite"
    >
      <LoaderCircle className="ui-spin" size={compact ? 18 : 24} aria-hidden="true" />
      <span>{label}</span>
    </div>
  )
}