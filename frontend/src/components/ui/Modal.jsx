import { useEffect, useId, useRef } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'

export default function Modal({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  size = 'md',
}) {
  const dialogRef = useRef(null)
  const generatedId = useId()
  const titleId = `${generatedId}-title`
  const descriptionId = description ? `${generatedId}-description` : undefined

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) dialog.close()
  }, [open])

  if (typeof document === 'undefined') return null

  return createPortal(
    <dialog
      ref={dialogRef}
      className={`ui-modal size-${size}`}
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
      onCancel={(event) => {
        event.preventDefault()
        onClose?.()
      }}
      onClick={(event) => {
        if (event.target === dialogRef.current) onClose?.()
      }}
      onClose={() => {
        if (open) onClose?.()
      }}
    >
      <div className="ui-modal-card">
        <header className="ui-modal-header">
          <div>
            <h2 id={titleId}>{title}</h2>
            {description && <p id={descriptionId}>{description}</p>}
          </div>
          <button
            type="button"
            className="ui-icon-button"
            aria-label="Close dialog"
            onClick={onClose}
          >
            <X size={19} aria-hidden="true" />
          </button>
        </header>
        <div className="ui-modal-content">{children}</div>
        {footer && <footer className="ui-modal-footer">{footer}</footer>}
      </div>
    </dialog>,
    document.body,
  )
}