import { LoaderCircle } from 'lucide-react'
import { Link } from 'react-router'

const variants = {
  primary: 'ui-button-primary',
  secondary: 'ui-button-secondary',
  outline: 'ui-button-outline',
  ghost: 'ui-button-ghost',
  danger: 'ui-button-danger',
}

const sizes = {
  sm: 'ui-button-sm',
  md: '',
  lg: 'ui-button-lg',
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  className = '',
  type = 'button',
  as,
  to,
  ...props
}) {
  const Component = as || (to ? Link : 'button')
  return (
    <Component
      {...props}
      {...(Component === 'button'
        ? { type, disabled: disabled || loading }
        : { to, 'aria-disabled': disabled || loading || undefined })}
      className={`ui-button ${variants[variant] || variants.primary} ${sizes[size] ?? ''} ${className}`.trim()}
    >
      {loading && (
        <LoaderCircle className="ui-spin" size={17} aria-hidden="true" />
      )}
      {children}
    </Component>
  )
}