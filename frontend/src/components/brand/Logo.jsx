import LogoMark from './LogoMark'

export default function Logo({ size = 'md', showTagline = false, className = '' }) {
  const markSize = size === 'sm' ? 36 : size === 'lg' ? 52 : 44

  return (
    <div className={`brand-lockup ${className}`.trim()}>
      <LogoMark size={markSize} />
      <span className="brand-copy">
        <span className="brand-name">Sherrif Technologies</span>
        {showTagline && <span className="brand-tagline">Wi-Fi, made simple.</span>}
      </span>
    </div>
  )
}