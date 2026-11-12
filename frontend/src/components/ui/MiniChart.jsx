export default function MiniChart({
  values = [],
  label = 'Trend',
  color = 'var(--color-primary)',
  height = 48,
  className = '',
}) {
  const safeValues = values.map((value) => Number(value)).filter(Number.isFinite)
  const max = Math.max(...safeValues, 1)
  const min = Math.min(...safeValues, 0)
  const range = max - min || 1
  const points = safeValues
    .map((value, index) => {
      const x = safeValues.length <= 1 ? 50 : (index / (safeValues.length - 1)) * 100
      const y = 30 - ((value - min) / range) * 26
      return `${x},${y}`
    })
    .join(' ')

  if (!safeValues.length) return null

  return (
    <svg
      className={`ui-mini-chart ${className}`.trim()}
      viewBox="0 0 100 32"
      style={{ height, color }}
      role="img"
      aria-label={`${label} chart with ${safeValues.length} points`}
      preserveAspectRatio="none"
    >
      <polyline
        points={points}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  )
}