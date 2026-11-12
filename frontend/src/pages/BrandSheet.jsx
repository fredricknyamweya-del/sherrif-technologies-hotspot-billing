import { ArrowRight, CheckCircle2, Wifi } from 'lucide-react'
import Logo from '@/components/brand/Logo'
import ThemeToggle from '@/components/brand/ThemeToggle'
import { PRIMARY_COLOR_SWATCHES } from '@/config/themes'
import { useTheme } from '@/hooks/useTheme'

export default function BrandSheet() {
  const { primaryColor, setPrimaryColor, appearanceError } = useTheme()

  return (
    <main className="brand-sheet">
      <header className="brand-sheet-header">
        <Logo showTagline />
        <ThemeToggle />
      </header>

      <section className="brand-hero" aria-labelledby="brand-title">
        <span className="eyebrow">Sikazwe Technologies · Connected</span>
        <h1 id="brand-title">A better connection starts here.</h1>
        <p>Fast, reliable Wi-Fi for the moments that matter.</p>
        <button className="brand-cta" type="button">
          Get connected <ArrowRight size={17} aria-hidden="true" />
        </button>
        <div className="brand-signal" aria-hidden="true">
          <Wifi size={164} strokeWidth={1} />
        </div>
      </section>

      <section className="brand-palette" aria-labelledby="palette-title">
        <div>
          <span className="eyebrow">A familiar signal</span>
          <h2 id="palette-title">Colour with purpose</h2>
          <p>Choose an accent to preview how the brand adapts.</p>
          {appearanceError && (
            <p className="appearance-error" role="alert">
              Colour updated for this session, but could not be saved: {appearanceError}
            </p>
          )}
        </div>
        <div className="swatch-list">
          {PRIMARY_COLOR_SWATCHES.map((swatch) => (
            <button
              key={swatch.value}
              type="button"
              className="swatch"
              style={{ '--swatch-color': swatch.value }}
              aria-label={`Use ${swatch.name}`}
              aria-pressed={primaryColor.toLowerCase() === swatch.value.toLowerCase()}
              onClick={() => setPrimaryColor(swatch.value)}
            >
              <span className="swatch-dot">
                {primaryColor.toLowerCase() === swatch.value.toLowerCase() && (
                  <CheckCircle2 size={20} aria-hidden="true" />
                )}
              </span>
              <span>{swatch.name}</span>
            </button>
          ))}
        </div>
      </section>
    </main>
  )
}