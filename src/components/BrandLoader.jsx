/**
 * BrandLoader — drop-in replacement for the legacy "Loading..." text.
 *
 * Uses an inline copy of /public/assets/logo/favicon.svg so it renders
 * with zero network round-trip and inherits the glow/pulse animation from
 * the global stylesheet (animations.css). Keeps DOM tiny and is safe to
 * mount inside a Suspense fallback.
 *
 * Variants:
 *   - "block" (default): centered in a card-sized region (route fallback)
 *   - "inline": tighter padding for inline UI (e.g. lazy components)
 *   - "page":  full-viewport centered (initial app boot)
 */
export default function BrandLoader({
  variant = 'block',
  label = 'Loading',
  ariaLabel,
}) {
  const role = 'status'
  const className = `brand-loader brand-loader--${variant}`
  return (
    <div className={className} role={role} aria-live="polite" aria-busy="true">
      <span className="brand-loader__mark" aria-hidden="true">
        <svg viewBox="0 0 196.23 196.23" width="44" height="44" focusable="false">
          <path
            d="M121.1,7.39l64.72,177.65h-42.38l-10.91-31.22-10.66,31.22H9.69L74.41,7.39h46.7ZM130.49,147.99l-32.74-93.9-32.99,93.9h65.73Z"
            fill="currentColor"
          />
        </svg>
      </span>
      <span className="brand-loader__sr">{ariaLabel || label}</span>
    </div>
  )
}
