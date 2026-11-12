import { useId } from 'react'

export default function Field({
  label,
  htmlFor,
  hint,
  error,
  required = false,
  children,
  className = '',
}) {
  const generatedId = useId()
  const controlId = htmlFor || generatedId
  const hintId = hint ? `${controlId}-hint` : undefined
  const errorId = error ? `${controlId}-error` : undefined
  const describedBy = [hintId, errorId].filter(Boolean).join(' ') || undefined

  return (
    <div className={`ui-field ${className}`.trim()}>
      {label && (
        <label className="ui-field-label" htmlFor={controlId}>
          {label}
          {required && (
            <span className="ui-required" aria-label="required">
              {' '}
              *
            </span>
          )}
        </label>
      )}
      {typeof children === 'function'
        ? children({ id: controlId, describedBy, invalid: Boolean(error) })
        : children}
      {error && (
        <span className="ui-field-error" id={errorId} role="alert">
          {error}
        </span>
      )}
      {hint && !error && (
        <span className="ui-field-hint" id={hintId}>
          {hint}
        </span>
      )}
    </div>
  )
}