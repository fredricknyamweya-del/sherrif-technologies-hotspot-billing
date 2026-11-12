import { forwardRef } from 'react'

const Input = forwardRef(function Input(
  {
    id,
    invalid = false,
    className = '',
    leading,
    trailing,
    ...props
  },
  ref,
) {
  return (
    <div className={`ui-input-wrap ${className}`.trim()}>
      {leading && <span className="ui-input-leading">{leading}</span>}
      <input
        {...props}
        ref={ref}
        id={id}
        aria-invalid={invalid || undefined}
        className={`ui-input${leading ? ' has-leading' : ''}${trailing ? ' has-trailing' : ''}`}
      />
      {trailing && <span className="ui-input-trailing">{trailing}</span>}
    </div>
  )
})

export default Input