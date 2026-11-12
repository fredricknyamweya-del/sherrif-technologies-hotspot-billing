import { ArrowDownRight, ArrowUpRight, Minus } from 'lucide-react'

export default function StatCard({
  label,
  value,
  change,
  changeLabel = 'vs. previous period',
  icon: Icon,
  tone = 'primary',
  className = '',
}) {
  const numericChange = Number(change)
  const trend = Number.isFinite(numericChange)
    ? numericChange > 0
      ? 'up'
      : numericChange < 0
        ? 'down'
        : 'flat'
    : null
  const TrendIcon =
    trend === 'up' ? ArrowUpRight : trend === 'down' ? ArrowDownRight : Minus

  return (
    <article className={`ui-stat-card tone-${tone} ${className}`.trim()}>
      <div className="ui-stat-top">
        <span className="ui-stat-label">{label}</span>
        {Icon && (
          <span className="ui-stat-icon">
            <Icon size={19} aria-hidden="true" />
          </span>
        )}
      </div>
      <div className="ui-stat-value">{value}</div>
      {trend && (
        <div className={`ui-stat-change trend-${trend}`}>
          <TrendIcon size={15} aria-hidden="true" />
          <span>{Math.abs(numericChange)}%</span>
          <span className="ui-stat-change-label">{changeLabel}</span>
        </div>
      )}
    </article>
  )
}