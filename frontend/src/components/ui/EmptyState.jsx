import { Inbox } from 'lucide-react'

export default function EmptyState({
  title = 'Nothing here yet',
  description = 'There is no information to display right now.',
  icon: Icon = Inbox,
  action,
  className = '',
}) {
  return (
    <section className={`ui-state ui-empty ${className}`.trim()} aria-label={title}>
      <span className="ui-state-icon">
        <Icon size={24} aria-hidden="true" />
      </span>
      <h3>{title}</h3>
      <p>{description}</p>
      {action}
    </section>
  )
}