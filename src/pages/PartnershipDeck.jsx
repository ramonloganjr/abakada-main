import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useTheme } from '../contexts/ThemeContext'

// Slide scroll-snap deck — mirrors the legacy partnership-deck.html in React
export default function PartnershipDeck() {
  const { appliedTheme } = useTheme()
  const deckRef = useRef(null)

  const logoSrc = appliedTheme === 'dark'
    ? '/assets/logo/logo-dark-background.svg'
    : '/assets/logo/logo-light-background.svg'

  // Scroll-reveal via IntersectionObserver
  useEffect(() => {
    const container = deckRef.current
    if (!container) return
    const els = container.querySelectorAll('.deck-reveal')
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('deck-reveal--visible'); observer.unobserve(e.target) } }),
      { root: container, threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    )
    els.forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  return (
    <>
      <style>{`
        .deck-wrap {
          height: 100vh;
          overflow-y: auto;
          scroll-snap-type: y mandatory;
          scroll-behavior: smooth;
        }
        @media (max-width: 768px) {
          .deck-wrap { height: auto; overflow-y: visible; scroll-snap-type: none; }
        }
        .deck-slide {
          height: 100vh;
          min-height: 600px;
          scroll-snap-align: start;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 3rem 2rem;
          position: relative;
          overflow: hidden;
        }
        @media (max-width: 768px) {
          .deck-slide { height: auto; min-height: 100vh; padding: 5rem 1.5rem 3rem; }
        }
        .deck-slide__inner {
          width: 100%;
          max-width: 1200px;
          margin: 0 auto;
          position: relative;
          z-index: 2;
        }
        /* Backgrounds */
        .deck-slide--dots::before {
          content: '';
          position: absolute; inset: 0; z-index: 0;
          background-image: radial-gradient(var(--border-secondary) 1px, transparent 1px);
          background-size: 24px 24px;
          opacity: 0.5;
        }
        .deck-slide--dark {
          background: linear-gradient(135deg, #0f172a 0%, #000 100%);
          color: #fff;
        }
        .deck-slide--dark::after {
          content: '';
          position: absolute; inset: 0; z-index: 0;
          background-size: 50px 50px;
          background-image:
            linear-gradient(to right, rgba(255,255,255,0.04) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,255,255,0.04) 1px, transparent 1px);
          mask-image: radial-gradient(circle at center, black 30%, transparent 80%);
          -webkit-mask-image: radial-gradient(circle at center, black 30%, transparent 80%);
        }
        /* Reveal animation */
        .deck-reveal {
          opacity: 0;
          transform: translateY(28px);
          transition: opacity 0.7s cubic-bezier(0.16,1,0.3,1), transform 0.7s cubic-bezier(0.16,1,0.3,1);
        }
        .deck-reveal--visible { opacity: 1; transform: none; }
        .deck-reveal--d1 { transition-delay: 100ms; }
        .deck-reveal--d2 { transition-delay: 200ms; }
        .deck-reveal--d3 { transition-delay: 300ms; }
        .deck-reveal--d4 { transition-delay: 400ms; }
        @media (prefers-reduced-motion: reduce) {
          .deck-reveal { transition: none; opacity: 1; transform: none; }
        }
        /* Typography */
        .deck-eyebrow {
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          color: var(--accent-primary);
          margin-bottom: 0.75rem;
        }
        .deck-slide--dark .deck-eyebrow { color: var(--brand-secondary, #1bcace); }
        .deck-h1 {
          font-size: clamp(2.25rem, 5vw, 4rem);
          font-weight: 700;
          line-height: 1.1;
          letter-spacing: -0.02em;
          margin-bottom: 1.25rem;
          color: var(--text-primary);
        }
        .deck-slide--dark .deck-h1 { color: #fff; }
        .deck-h2 {
          font-size: clamp(1.75rem, 4vw, 3rem);
          font-weight: 700;
          line-height: 1.15;
          letter-spacing: -0.02em;
          margin-bottom: 1rem;
          color: var(--text-primary);
        }
        .deck-slide--dark .deck-h2 { color: #fff; }
        .deck-lead {
          font-size: clamp(1rem, 2vw, 1.25rem);
          color: var(--text-secondary);
          line-height: 1.7;
          max-width: 600px;
          margin-bottom: 2.5rem;
        }
        .deck-slide--dark .deck-lead { color: rgba(255,255,255,0.75); }
        /* Stats */
        .deck-stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2rem;
          margin-top: 2.5rem;
        }
        @media (max-width: 640px) { .deck-stats { grid-template-columns: 1fr; gap: 1rem; } }
        .deck-stat__value {
          font-size: clamp(2rem, 4vw, 3rem);
          font-weight: 700;
          color: var(--accent-primary);
          line-height: 1;
          margin-bottom: 0.25rem;
        }
        .deck-slide--dark .deck-stat__value { color: var(--brand-secondary, #1bcace); }
        .deck-stat__label {
          font-size: 0.875rem;
          color: var(--text-secondary);
          font-weight: 500;
        }
        .deck-slide--dark .deck-stat__label { color: rgba(255,255,255,0.6); }
        /* Cards grid */
        .deck-cards {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 1.25rem;
          margin-top: 2rem;
        }
        .deck-card {
          padding: 1.75rem;
          border-radius: 1rem;
          border: 1px solid var(--border-secondary);
          background: var(--bg-primary);
          transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
        }
        .deck-card:hover { transform: translateY(-4px); box-shadow: 0 12px 32px -8px rgba(0,0,0,0.12); border-color: var(--accent-primary); }
        .deck-slide--dark .deck-card {
          background: rgba(255,255,255,0.05);
          border-color: rgba(255,255,255,0.1);
        }
        .deck-card:hover { border-color: var(--accent-primary); }
        .deck-card__icon {
          width: 44px; height: 44px;
          color: var(--accent-primary);
          margin-bottom: 1rem;
        }
        .deck-slide--dark .deck-card__icon { color: var(--brand-secondary, #1bcace); }
        .deck-card__title {
          font-size: 1.0625rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
          color: var(--text-primary);
        }
        .deck-slide--dark .deck-card__title { color: #fff; }
        .deck-card__text {
          font-size: 0.9375rem;
          color: var(--text-secondary);
          line-height: 1.6;
        }
        .deck-slide--dark .deck-card__text { color: rgba(255,255,255,0.65); }
        /* Two-col layout */
        .deck-two-col {
          display: grid;
          grid-template-columns: 1.2fr 0.8fr;
          gap: 3rem;
          align-items: center;
        }
        @media (max-width: 768px) { .deck-two-col { grid-template-columns: 1fr; } }
        /* Buttons */
        .deck-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.875rem 1.75rem;
          font-size: 1rem;
          font-weight: 600;
          border-radius: 9999px;
          text-decoration: none;
          transition: all 0.2s ease;
          cursor: pointer;
          border: none;
        }
        .deck-btn--primary {
          background: var(--accent-primary);
          color: var(--color-on-accent);
          box-shadow: 0 4px 14px -2px rgba(3,170,191,0.35);
        }
        .deck-btn--primary:hover { background: var(--accent-hover); transform: translateY(-2px); color: var(--color-on-accent); }
        .deck-btn--outline {
          background: rgba(255,255,255,0.08);
          color: rgba(255,255,255,0.9);
          border: 1px solid rgba(255,255,255,0.2);
          backdrop-filter: blur(8px);
        }
        .deck-btn--outline:hover { background: rgba(255,255,255,0.15); border-color: rgba(255,255,255,0.5); color: #fff; }
        .deck-btn-row {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
          align-items: center;
        }
        /* Back nav */
        .deck-back {
          position: fixed;
          top: 1.25rem;
          left: 1.5rem;
          z-index: 200;
          display: inline-flex;
          align-items: center;
          gap: 0.375rem;
          font-size: 0.875rem;
          font-weight: 500;
          color: var(--text-secondary);
          background: var(--bg-elevated, var(--bg-primary));
          border: 1px solid var(--border-secondary);
          border-radius: 9999px;
          padding: 0.375rem 0.875rem 0.375rem 0.625rem;
          text-decoration: none;
          transition: all 0.2s ease;
          box-shadow: 0 1px 4px rgba(0,0,0,0.08);
        }
        .deck-back:hover { color: var(--text-primary); border-color: var(--border-focus); }
        /* Slide nav dots */
        .deck-dots {
          position: fixed;
          right: 1.5rem;
          top: 50%;
          transform: translateY(-50%);
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          z-index: 200;
        }
        @media (max-width: 768px) { .deck-dots { display: none; } }
        .deck-dot {
          width: 8px; height: 8px;
          border-radius: 50%;
          background: var(--border-secondary);
          border: none;
          cursor: pointer;
          padding: 0;
          transition: background 0.2s ease, transform 0.2s ease;
        }
        .deck-dot:hover { background: var(--accent-primary); transform: scale(1.3); }
        /* CTA slide center */
        .deck-cta-center { text-align: center; }
        .deck-cta-center .deck-h2 { margin-left: auto; margin-right: auto; }
        .deck-cta-center .deck-lead { margin-left: auto; margin-right: auto; }
        .deck-cta-center .deck-btn-row { justify-content: center; }
        /* Logo watermark */
        .deck-watermark {
          margin-top: 3rem;
          opacity: 0.4;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
        }
        .deck-watermark img { height: 28px; }
        .deck-watermark p { font-size: 0.8125rem; color: rgba(255,255,255,0.5); }
      `}</style>

      {/* Back to Partnerships */}
      <Link to="/partnerships" className="deck-back" aria-label="Back to Partnerships">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6"/>
        </svg>
        Partnerships
      </Link>

      {/* Slide nav dots */}
      <nav className="deck-dots" aria-label="Slide navigation">
        {['intro','mission','why','models','contact'].map((id, i) => (
          <button key={id} className="deck-dot" aria-label={`Go to slide ${i + 1}`}
            onClick={() => document.getElementById(`deck-${id}`)?.scrollIntoView({ behavior: 'smooth' })} />
        ))}
      </nav>

      <div className="deck-wrap" ref={deckRef}>

        {/* Slide 1 — Hero */}
        <section className="deck-slide deck-slide--dots" id="deck-intro">
          <div className="deck-slide__inner">
            <img src={logoSrc} alt="Abakada" style={{ height: 44, marginBottom: '2rem' }} className="deck-reveal" />
            <p className="deck-eyebrow deck-reveal deck-reveal--d1">Partnership Deck 2026</p>
            <h1 className="deck-h1 deck-reveal deck-reveal--d2">
              Empowering the Next Generation<br />of Filipino Builders
            </h1>
            <p className="deck-lead deck-reveal deck-reveal--d3">
              Join us in democratizing access to technology and education for thousands of students and professionals across the Philippines.
            </p>
            <div className="deck-btn-row deck-reveal deck-reveal--d4">
              <button className="deck-btn deck-btn--primary"
                onClick={() => document.getElementById('deck-mission')?.scrollIntoView({ behavior: 'smooth' })}>
                Explore Our Vision
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M7 13l5 5 5-5M7 6l5 5 5-5"/>
                </svg>
              </button>
            </div>
          </div>
        </section>

        {/* Slide 2 — Impact */}
        <section className="deck-slide deck-slide--dots" id="deck-mission">
          <div className="deck-slide__inner">
            <div className="deck-two-col">
              <div>
                <p className="deck-eyebrow deck-reveal">Our Impact</p>
                <h2 className="deck-h2 deck-reveal deck-reveal--d1">Bridging the Digital Divide</h2>
                <p className="deck-lead deck-reveal deck-reveal--d2">
                  Abakada provides free, verified, and accessible open-source tools to those who need them most. We are more than a directory — we are a platform for opportunity.
                </p>
                <div className="deck-stats deck-reveal deck-reveal--d3">
                  <div>
                    <div className="deck-stat__value">1.2k+</div>
                    <div className="deck-stat__label">Curated Tools</div>
                  </div>
                  <div>
                    <div className="deck-stat__value">45+</div>
                    <div className="deck-stat__label">Categories</div>
                  </div>
                  <div>
                    <div className="deck-stat__value">100%</div>
                    <div className="deck-stat__label">Free & Open Source</div>
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'center', position: 'relative' }}>
                <div style={{ position: 'absolute', width: 320, height: 320, borderRadius: '50%', background: 'var(--accent-subtle)', filter: 'blur(60px)', opacity: 0.7 }} />
                <img src="/assets/logo/favicon.svg" alt="" aria-hidden="true" style={{ width: '70%', opacity: 0.08, position: 'relative' }} />
              </div>
            </div>
          </div>
        </section>

        {/* Slide 3 — Why Partner */}
        <section className="deck-slide deck-slide--dark" id="deck-why">
          <div className="deck-slide__inner">
            <p className="deck-eyebrow deck-reveal">Why Partner?</p>
            <h2 className="deck-h2 deck-reveal deck-reveal--d1">Align Your Brand with Impact</h2>
            <div className="deck-cards">
              <div className="deck-card deck-reveal deck-reveal--d2">
                <div className="deck-card__icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                  </svg>
                </div>
                <h3 className="deck-card__title">Community Access</h3>
                <p className="deck-card__text">Directly reach students, educators, and developers who are actively seeking digital tools.</p>
              </div>
              <div className="deck-card deck-reveal deck-reveal--d3">
                <div className="deck-card__icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                </div>
                <h3 className="deck-card__title">Brand Equity</h3>
                <p className="deck-card__text">Demonstrate Corporate Social Responsibility by supporting open access to education.</p>
              </div>
              <div className="deck-card deck-reveal deck-reveal--d4">
                <div className="deck-card__icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>
                  </svg>
                </div>
                <h3 className="deck-card__title">Thought Leadership</h3>
                <p className="deck-card__text">Position your organization as a key enabler of the Philippine digital ecosystem.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Slide 4 — Models */}
        <section className="deck-slide deck-slide--dots" id="deck-models">
          <div className="deck-slide__inner">
            <p className="deck-eyebrow deck-reveal">Collaboration Models</p>
            <h2 className="deck-h2 deck-reveal deck-reveal--d1">Ways We Can Work Together</h2>
            <div className="deck-cards">
              {[
                {
                  icon: <><rect x="2" y="2" width="20" height="8" rx="2"/><rect x="2" y="14" width="20" height="8" rx="2"/><line x1="6" y1="6" x2="6.01" y2="6"/><line x1="6" y1="18" x2="6.01" y2="18"/></>,
                  title: 'Technology Partner',
                  text: 'Provide infrastructure, hosting, or software credits to support our platform operations.'
                },
                {
                  icon: <><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></>,
                  title: 'Educational Partner',
                  text: 'Schools and universities partnering to bring curated tools directly to students and faculty.'
                },
                {
                  icon: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></>,
                  title: 'Content Partner',
                  text: 'Co-create educational guides, tutorials, and resources for the community.'
                },
                {
                  icon: <><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></>,
                  title: 'Community Partner',
                  text: 'Support outreach programs, hackathons, and local events throughout the year.'
                },
              ].map((item, i) => (
                <div key={i} className={`deck-card deck-reveal deck-reveal--d${i + 1}`}>
                  <div className="deck-card__icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      {item.icon}
                    </svg>
                  </div>
                  <h3 className="deck-card__title">{item.title}</h3>
                  <p className="deck-card__text">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Slide 5 — CTA */}
        <section className="deck-slide deck-slide--dark" id="deck-contact">
          <div className="deck-slide__inner deck-cta-center">
            <h2 className="deck-h2 deck-reveal">Let's Build the Future Together</h2>
            <p className="deck-lead deck-reveal deck-reveal--d1">
              Ready to make an impact? Connect with our partnerships team to explore collaboration opportunities.
            </p>
            <div className="deck-btn-row deck-reveal deck-reveal--d2">
              <a href="mailto:partnerships@abakada.org" className="deck-btn deck-btn--primary">
                partnerships@abakada.org
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
              </a>
              <Link to="/" className="deck-btn deck-btn--outline">
                Browse Tools
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                  <polyline points="15 3 21 3 21 9"/>
                  <line x1="10" y1="14" x2="21" y2="3"/>
                </svg>
              </Link>
            </div>
            <div className="deck-watermark deck-reveal deck-reveal--d3">
              <img src="/assets/logo/logo-dark-background.svg" alt="Abakada" />
              <p>© 2026 Abakada Organization</p>
            </div>
          </div>
        </section>

      </div>
    </>
  )
}
