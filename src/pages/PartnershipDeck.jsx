import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useTheme } from '../contexts/ThemeContext'
import SEO from '../components/SEO'
import { pageMeta } from '../lib/pageMeta'
import { downloadFile } from '../lib/downloadFile'

const PITCH_DECK_URL = '/assets/doc/Abakada-Pitch-Deck-2026.pdf'
const PITCH_DECK_FILENAME = 'Abakada-Pitch-Deck-2026.pdf'

// Partnership deck — scroll-snap, reveal-on-scroll, theme-aware.
const SLIDES = [
  { id: 'intro',        label: 'Mission' },
  { id: 'opportunity',  label: 'The Gap' },
  { id: 'platform',     label: 'What We Built' },
  { id: 'how',          label: 'How It Works' },
  { id: 'traction',     label: 'Today' },
  { id: 'why',          label: 'Why Partner' },
  { id: 'models',       label: 'Ways to Partner' },
  { id: 'cobrand',      label: 'What You Get' },
  { id: 'roadmap',      label: 'What’s Next' },
  { id: 'contact',      label: 'Connect' },
]

export default function PartnershipDeck() {
  const { appliedTheme } = useTheme()
  const deckRef = useRef(null)

  const logoSrc = appliedTheme === 'dark'
    ? '/assets/logo/logo-dark-background.svg'
    : '/assets/logo/logo-light-background.svg'

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
      <SEO {...pageMeta.partnershipDeck} />
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
          min-height: 640px;
          scroll-snap-align: start;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 4rem 2rem;
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
        .deck-slide--gradient {
          background: linear-gradient(160deg, var(--accent-subtle, rgba(3,170,191,0.08)) 0%, var(--bg-primary) 60%);
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
        .deck-reveal--d5 { transition-delay: 500ms; }
        .deck-reveal--d6 { transition-delay: 600ms; }
        @media (prefers-reduced-motion: reduce) {
          .deck-reveal { transition: none; opacity: 1; transform: none; }
        }
        /* Typography */
        .deck-eyebrow {
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.14em;
          color: var(--accent-primary);
          margin-bottom: 0.875rem;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
        }
        .deck-eyebrow::before {
          content: '';
          width: 24px; height: 2px;
          background: currentColor;
          border-radius: 2px;
          opacity: 0.7;
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
          font-size: clamp(1.75rem, 4vw, 2.875rem);
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
          max-width: 640px;
          margin-bottom: 2.25rem;
        }
        .deck-slide--dark .deck-lead { color: rgba(255,255,255,0.78); }
        .deck-accent { color: var(--accent-primary); }
        .deck-slide--dark .deck-accent { color: var(--brand-secondary, #1bcace); }
        /* Pill / chip */
        .deck-chip {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          padding: 0.3rem 0.75rem;
          border-radius: 9999px;
          font-size: 0.75rem;
          font-weight: 600;
          letter-spacing: 0.04em;
          background: var(--accent-subtle, rgba(3,170,191,0.1));
          color: var(--accent-primary);
          border: 1px solid var(--accent-primary);
          margin-bottom: 1.25rem;
        }
        .deck-slide--dark .deck-chip {
          background: rgba(27,202,206,0.12);
          color: var(--brand-secondary, #1bcace);
          border-color: rgba(27,202,206,0.4);
        }
        /* Stats */
        .deck-stats {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 2rem;
          margin-top: 2.5rem;
        }
        @media (max-width: 768px) { .deck-stats { grid-template-columns: repeat(2, 1fr); gap: 1.5rem; } }
        @media (max-width: 480px) { .deck-stats { grid-template-columns: 1fr; gap: 1.25rem; } }
        .deck-stat__value {
          font-size: clamp(2rem, 4vw, 2.75rem);
          font-weight: 700;
          color: var(--accent-primary);
          line-height: 1;
          margin-bottom: 0.375rem;
          letter-spacing: -0.02em;
        }
        .deck-slide--dark .deck-stat__value { color: var(--brand-secondary, #1bcace); }
        .deck-stat__label {
          font-size: 0.875rem;
          color: var(--text-secondary);
          font-weight: 500;
          line-height: 1.4;
        }
        .deck-slide--dark .deck-stat__label { color: rgba(255,255,255,0.65); }
        /* Cards grid */
        .deck-cards {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 1.25rem;
          margin-top: 2rem;
        }
        .deck-cards--3 { grid-template-columns: repeat(3, 1fr); }
        .deck-cards--4 { grid-template-columns: repeat(4, 1fr); }
        @media (max-width: 900px) {
          .deck-cards--3, .deck-cards--4 { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 560px) {
          .deck-cards, .deck-cards--3, .deck-cards--4 { grid-template-columns: 1fr; }
        }
        .deck-card {
          padding: 1.75rem;
          border-radius: 1rem;
          border: 1px solid var(--border-secondary);
          background: var(--bg-primary);
          transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
          position: relative;
          overflow: hidden;
        }
        .deck-card:hover { transform: translateY(-4px); box-shadow: 0 12px 32px -8px rgba(0,0,0,0.12); border-color: var(--accent-primary); }
        .deck-slide--dark .deck-card {
          background: rgba(255,255,255,0.04);
          border-color: rgba(255,255,255,0.1);
          backdrop-filter: blur(10px);
        }
        .deck-slide--dark .deck-card:hover { border-color: var(--brand-secondary, #1bcace); background: rgba(255,255,255,0.06); }
        .deck-card__icon {
          width: 44px; height: 44px;
          color: var(--accent-primary);
          margin-bottom: 1rem;
          padding: 0.5rem;
          border-radius: 0.625rem;
          background: var(--accent-subtle, rgba(3,170,191,0.1));
        }
        .deck-slide--dark .deck-card__icon {
          color: var(--brand-secondary, #1bcace);
          background: rgba(27,202,206,0.12);
        }
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
        .deck-slide--dark .deck-card__text { color: rgba(255,255,255,0.68); }
        .deck-card__tag {
          position: absolute;
          top: 1rem;
          right: 1rem;
          font-size: 0.6875rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          padding: 0.25rem 0.5rem;
          border-radius: 0.375rem;
          background: var(--accent-subtle, rgba(3,170,191,0.12));
          color: var(--accent-primary);
        }
        .deck-slide--dark .deck-card__tag { background: rgba(27,202,206,0.15); color: var(--brand-secondary, #1bcace); }
        /* Two-col layout */
        .deck-two-col {
          display: grid;
          grid-template-columns: 1.1fr 0.9fr;
          gap: 3rem;
          align-items: center;
        }
        @media (max-width: 900px) { .deck-two-col { grid-template-columns: 1fr; gap: 2rem; } }
        /* Architecture stack diagram */
        .deck-stack {
          display: flex;
          flex-direction: column;
          gap: 0.625rem;
          padding: 1.5rem;
          border-radius: 1rem;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
        }
        .deck-stack__layer {
          display: flex;
          align-items: center;
          gap: 0.875rem;
          padding: 0.875rem 1rem;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 0.625rem;
          transition: all 0.25s ease;
        }
        .deck-stack__layer:hover {
          border-color: var(--brand-secondary, #1bcace);
          background: rgba(27,202,206,0.08);
          transform: translateX(4px);
        }
        .deck-stack__icon {
          width: 32px; height: 32px;
          color: var(--brand-secondary, #1bcace);
          flex-shrink: 0;
        }
        .deck-stack__name {
          font-size: 0.9375rem;
          font-weight: 600;
          color: #fff;
          margin-bottom: 0.125rem;
        }
        .deck-stack__detail {
          font-size: 0.8125rem;
          color: rgba(255,255,255,0.6);
        }
        /* Tier table for partnership models */
        .deck-tiers {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1rem;
          margin-top: 2rem;
        }
        @media (max-width: 900px) { .deck-tiers { grid-template-columns: 1fr; } }
        .deck-tier {
          padding: 1.75rem;
          border-radius: 1rem;
          background: var(--bg-primary);
          border: 1px solid var(--border-secondary);
          display: flex;
          flex-direction: column;
          position: relative;
        }
        .deck-tier__name {
          font-size: 0.875rem;
          font-weight: 600;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: var(--accent-primary);
          margin-bottom: 0.5rem;
        }
        .deck-tier__title {
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 0.625rem;
        }
        .deck-tier__desc {
          font-size: 0.9375rem;
          color: var(--text-secondary);
          line-height: 1.55;
          margin-bottom: 1.25rem;
        }
        .deck-tier__list {
          list-style: none;
          padding: 0;
          margin: 0 0 1.25rem;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .deck-tier__list li {
          font-size: 0.875rem;
          color: var(--text-secondary);
          display: flex;
          align-items: flex-start;
          gap: 0.5rem;
          line-height: 1.5;
        }
        .deck-tier__list li::before {
          content: '';
          width: 14px; height: 14px;
          flex-shrink: 0;
          margin-top: 0.2rem;
          background-color: var(--accent-primary);
          mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='20 6 9 17 4 12'/%3E%3C/svg%3E");
          -webkit-mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='20 6 9 17 4 12'/%3E%3C/svg%3E");
          mask-size: contain;
          -webkit-mask-size: contain;
          mask-repeat: no-repeat;
          -webkit-mask-repeat: no-repeat;
        }
        /* Roadmap timeline */
        .deck-timeline {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1rem;
          margin-top: 2.5rem;
          position: relative;
        }
        .deck-timeline::before {
          content: '';
          position: absolute;
          top: 18px;
          left: 0;
          right: 0;
          height: 2px;
          background: linear-gradient(to right, var(--accent-primary), transparent);
          opacity: 0.35;
          z-index: 0;
        }
        @media (max-width: 900px) {
          .deck-timeline { grid-template-columns: 1fr; }
          .deck-timeline::before { display: none; }
        }
        .deck-milestone { position: relative; z-index: 1; padding-top: 2.5rem; }
        .deck-milestone::before {
          content: '';
          position: absolute;
          top: 8px; left: 0;
          width: 20px; height: 20px;
          border-radius: 50%;
          background: var(--accent-primary);
          box-shadow: 0 0 0 4px var(--bg-primary), 0 0 0 6px var(--accent-primary);
        }
        .deck-slide--dark .deck-milestone::before {
          box-shadow: 0 0 0 4px #0f172a, 0 0 0 6px var(--brand-secondary, #1bcace);
          background: var(--brand-secondary, #1bcace);
        }
        .deck-milestone__date {
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--accent-primary);
          margin-bottom: 0.5rem;
        }
        .deck-slide--dark .deck-milestone__date { color: var(--brand-secondary, #1bcace); }
        .deck-milestone__title {
          font-size: 1rem;
          font-weight: 600;
          color: var(--text-primary);
          margin-bottom: 0.375rem;
        }
        .deck-slide--dark .deck-milestone__title { color: #fff; }
        .deck-milestone__text {
          font-size: 0.8125rem;
          color: var(--text-secondary);
          line-height: 1.5;
        }
        .deck-slide--dark .deck-milestone__text { color: rgba(255,255,255,0.6); }
        /* Trust strip */
        .deck-trust {
          display: flex;
          flex-wrap: wrap;
          gap: 0.625rem 1rem;
          margin-top: 2rem;
        }
        .deck-trust__item {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 0.875rem;
          border-radius: 0.625rem;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          font-size: 0.8125rem;
          color: rgba(255,255,255,0.85);
        }
        .deck-trust__item svg { width: 16px; height: 16px; color: var(--brand-secondary, #1bcace); }
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
        .deck-btn--ghost {
          background: transparent;
          color: var(--text-primary);
          border: 1px solid var(--border-secondary);
        }
        .deck-btn--ghost:hover { border-color: var(--accent-primary); color: var(--accent-primary); }
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
          position: relative;
        }
        .deck-dot:hover { background: var(--accent-primary); transform: scale(1.3); }
        .deck-dot::after {
          content: attr(data-label);
          position: absolute;
          right: calc(100% + 0.625rem);
          top: 50%;
          transform: translateY(-50%);
          font-size: 0.75rem;
          font-weight: 500;
          color: var(--text-secondary);
          background: var(--bg-elevated, var(--bg-primary));
          border: 1px solid var(--border-secondary);
          border-radius: 0.375rem;
          padding: 0.25rem 0.5rem;
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.15s ease;
          white-space: nowrap;
        }
        .deck-dot:hover::after { opacity: 1; }
        /* Slide counter */
        .deck-counter {
          position: absolute;
          bottom: 1.5rem;
          right: 2rem;
          font-size: 0.75rem;
          font-weight: 600;
          letter-spacing: 0.1em;
          color: var(--text-tertiary, var(--text-secondary));
          opacity: 0.7;
          z-index: 3;
        }
        .deck-slide--dark .deck-counter { color: rgba(255,255,255,0.5); }
        /* CTA slide center */
        .deck-cta-center { text-align: center; }
        .deck-cta-center .deck-h2 { margin-left: auto; margin-right: auto; }
        .deck-cta-center .deck-lead { margin-left: auto; margin-right: auto; }
        .deck-cta-center .deck-btn-row { justify-content: center; }
        /* Logo watermark */
        .deck-watermark {
          margin-top: 3rem;
          opacity: 0.5;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
        }
        .deck-watermark img { height: 28px; }
        .deck-watermark p { font-size: 0.8125rem; color: rgba(255,255,255,0.55); }
        /* Opportunity callout panel */
        .deck-callout {
          padding: 2rem;
          border-radius: 1.25rem;
          background: var(--bg-secondary);
          border: 1px solid var(--border-secondary);
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .deck-callout__metric {
          font-size: clamp(2.5rem, 6vw, 4rem);
          font-weight: 700;
          line-height: 1;
          color: var(--accent-primary);
          letter-spacing: -0.02em;
        }
        .deck-callout__title {
          font-size: 1.125rem;
          font-weight: 600;
          color: var(--text-primary);
        }
        .deck-callout__text {
          font-size: 0.9375rem;
          color: var(--text-secondary);
          line-height: 1.65;
        }
      `}</style>

      <Link to="/partnerships" className="deck-back" aria-label="Back to Partnerships">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6"/>
        </svg>
        Partnerships
      </Link>

      <nav className="deck-dots" aria-label="Slide navigation">
        {SLIDES.map((s, i) => (
          <button key={s.id} className="deck-dot" data-label={`${i + 1}. ${s.label}`} aria-label={`Go to ${s.label}`}
            onClick={() => document.getElementById(`deck-${s.id}`)?.scrollIntoView({ behavior: 'smooth' })} />
        ))}
      </nav>

      <div className="deck-wrap" ref={deckRef}>

        {/* 1 — Hero */}
        <section className="deck-slide deck-slide--dots" id="deck-intro">
          <div className="deck-slide__inner">
            <img src={logoSrc} alt="Abakada" width="180" height="44" style={{ height: 44, marginBottom: '2rem' }} className="deck-reveal" loading="lazy" decoding="async" />
            <p className="deck-eyebrow deck-reveal deck-reveal--d1">Partnership Deck · 2026</p>
            <h1 className="deck-h1 deck-reveal deck-reveal--d2">
              A Curated, Free Directory<br />of Open-Source Tools for<br /><span className="deck-accent">Every Filipino Learner</span>
            </h1>
            <p className="deck-lead deck-reveal deck-reveal--d3">
              Abakada.org is a hand-curated catalog of 1,000+ free and open-source productivity tools — built for Filipino students, educators, scholars, and professionals. No accounts, no paywalls, no tracking.
            </p>
            <div className="deck-btn-row deck-reveal deck-reveal--d4">
              <button className="deck-btn deck-btn--primary"
                onClick={() => document.getElementById('deck-opportunity')?.scrollIntoView({ behavior: 'smooth' })}>
                See Why It Matters
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M7 13l5 5 5-5M7 6l5 5 5-5"/>
                </svg>
              </button>
              <a href="mailto:partnerships@abakada.org" className="deck-btn deck-btn--ghost">
                Talk to the Founder
              </a>
            </div>
          </div>
          <div className="deck-counter">01 / 10</div>
        </section>

        {/* 2 — The Gap */}
        <section className="deck-slide deck-slide--gradient" id="deck-opportunity">
          <div className="deck-slide__inner">
            <div className="deck-two-col">
              <div>
                <p className="deck-eyebrow deck-reveal">The Gap We're Closing</p>
                <h2 className="deck-h2 deck-reveal deck-reveal--d1">Powerful Free Tools Exist.<br />Filipinos Just Can't Find Them.</h2>
                <p className="deck-lead deck-reveal deck-reveal--d2">
                  Filipino students and educators face two real frictions: most "premium" software requires paid subscriptions, and free open-source alternatives are scattered across hundreds of English-only sites with no local context or trust signals.
                </p>
                <p className="deck-lead deck-reveal deck-reveal--d3" style={{ marginBottom: 0 }}>
                  Abakada solves a discovery problem — not a software problem. We curate what already exists into one trusted, multilingual, free-forever directory built for Filipino learners.
                </p>
              </div>
              <div className="deck-callout deck-reveal deck-reveal--d2">
                <div className="deck-callout__metric">1,000+</div>
                <div className="deck-callout__title">Hand-vetted FOSS tools</div>
                <div className="deck-callout__text">Every tool in the directory is manually verified for licensing, safety, and educational value — across 45+ categories.</div>
                <div style={{ height: 1, background: 'var(--border-secondary)', margin: '0.5rem 0' }} />
                <div className="deck-callout__metric" style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)' }}>4 Languages</div>
                <div className="deck-callout__title">English · Tagalog · Bisaya · Ilokano</div>
                <div className="deck-callout__text">Built natively in four Philippine languages — not machine-translated. Reaches learners outside the English-only digital majority.</div>
              </div>
            </div>
          </div>
          <div className="deck-counter">02 / 10</div>
        </section>

        {/* 3 — What We Built */}
        <section className="deck-slide deck-slide--dots" id="deck-platform">
          <div className="deck-slide__inner">
            <p className="deck-eyebrow deck-reveal">What We Built</p>
            <h2 className="deck-h2 deck-reveal deck-reveal--d1">A Trustworthy Front Door<br />to the <span className="deck-accent">Open-Source World</span>.</h2>
            <p className="deck-lead deck-reveal deck-reveal--d2">
              Abakada.org is a Progressive Web App that runs anywhere — desktop, mobile, even offline. Four real, shipped features serve different parts of a learner's journey, from first discovery to everyday workflow.
            </p>
            <div className="deck-cards deck-cards--4">
              <div className="deck-card deck-reveal deck-reveal--d2">
                <div className="deck-card__icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="100%" height="100%">
                    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                  </svg>
                </div>
                <h3 className="deck-card__title">Tool Directory</h3>
                <p className="deck-card__text">1,000+ tools across 45+ categories. Full-text search, platform &amp; tag filters, license badges, project-health signals, direct links to the source.</p>
              </div>
              <div className="deck-card deck-reveal deck-reveal--d3">
                <div className="deck-card__icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="100%" height="100%">
                    <circle cx="6" cy="19" r="3"/><path d="M9 19h8.5a3.5 3.5 0 0 0 0-7h-11a3.5 3.5 0 0 1 0-7H15"/><circle cx="18" cy="5" r="3"/>
                  </svg>
                </div>
                <h3 className="deck-card__title">Learning Paths</h3>
                <p className="deck-card__text">10 curated, persona-based pathways — from Digital Foundations for first-time users to Workplace Productivity for professionals.</p>
              </div>
              <div className="deck-card deck-reveal deck-reveal--d4">
                <div className="deck-card__icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="100%" height="100%">
                    <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/>
                  </svg>
                </div>
                <h3 className="deck-card__title">Bookmarks &amp; Compare</h3>
                <p className="deck-card__text">Save tools to a personal list, compare up to 4 side-by-side. No account required — everything persists locally on the user's device.</p>
              </div>
              <div className="deck-card deck-reveal deck-reveal--d5">
                <div className="deck-card__icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="100%" height="100%">
                    <path d="M5 12.55a11 11 0 0 1 14.08 0"/><path d="M1.42 9a16 16 0 0 1 21.16 0"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><line x1="12" y1="20" x2="12.01" y2="20"/>
                  </svg>
                </div>
                <h3 className="deck-card__title">Offline-First PWA</h3>
                <p className="deck-card__text">Installable to any device, works offline after first visit, supports 4 Philippine languages. Built for learners on slow or intermittent connections.</p>
              </div>
            </div>
          </div>
          <div className="deck-counter">03 / 10</div>
        </section>

        {/* 4 — How It Works */}
        <section className="deck-slide deck-slide--dark" id="deck-how">
          <div className="deck-slide__inner">
            <div className="deck-two-col">
              <div>
                <p className="deck-eyebrow deck-reveal">How It Works</p>
                <h2 className="deck-h2 deck-reveal deck-reveal--d1">Boringly Reliable.<br />Deliberately Simple.</h2>
                <p className="deck-lead deck-reveal deck-reveal--d2">
                  Abakada is a static React Progressive Web App. No backend to maintain, no database to scale, no user accounts to breach. The whole product is a folder of files, a JSON catalog, and a Service Worker — which is exactly why it's fast, private, and free forever.
                </p>
                <div className="deck-trust deck-reveal deck-reveal--d3">
                  <div className="deck-trust__item">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                    100% Open Source
                  </div>
                  <div className="deck-trust__item">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                    No Tracking · No Accounts
                  </div>
                  <div className="deck-trust__item">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
                    Works Offline
                  </div>
                  <div className="deck-trust__item">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
                    Multilingual
                  </div>
                  <div className="deck-trust__item">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12l2 2 4-4"/><path d="M21 12c-1 0-3-1-3-3s2-3 3-3 3 1 3 3-2 3-3 3"/><path d="M3 12c1 0 3-1 3-3s-2-3-3-3-3 1-3 3 2 3 3 3"/><path d="M13 12h-2"/></svg>
                    MIT + CC BY 4.0
                  </div>
                </div>
              </div>
              <div className="deck-stack deck-reveal deck-reveal--d2">
                <div className="deck-stack__layer">
                  <svg className="deck-stack__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>
                  </svg>
                  <div>
                    <div className="deck-stack__name">Frontend</div>
                    <div className="deck-stack__detail">React 18 · Vite 5 · React Router · ES2020 · WCAG AA</div>
                  </div>
                </div>
                <div className="deck-stack__layer">
                  <svg className="deck-stack__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/>
                  </svg>
                  <div>
                    <div className="deck-stack__name">Data</div>
                    <div className="deck-stack__detail">Static JSON catalog · Versioned in Git · Manually curated</div>
                  </div>
                </div>
                <div className="deck-stack__layer">
                  <svg className="deck-stack__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12.55a11 11 0 0 1 14.08 0"/><path d="M1.42 9a16 16 0 0 1 21.16 0"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><line x1="12" y1="20" x2="12.01" y2="20"/>
                  </svg>
                  <div>
                    <div className="deck-stack__name">PWA &amp; Offline</div>
                    <div className="deck-stack__detail">Service Worker · IndexedDB queue · App-shell pre-cache · Installable</div>
                  </div>
                </div>
                <div className="deck-stack__layer">
                  <svg className="deck-stack__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/>
                  </svg>
                  <div>
                    <div className="deck-stack__name">Hosting</div>
                    <div className="deck-stack__detail">cPanel-friendly · Vercel · Netlify · Any static host</div>
                  </div>
                </div>
                <div className="deck-stack__layer">
                  <svg className="deck-stack__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                  <div>
                    <div className="deck-stack__name">Security &amp; Privacy</div>
                    <div className="deck-stack__detail">CSP headers · No telemetry · localStorage-only state · No data collection</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="deck-counter">04 / 10</div>
        </section>

        {/* 5 — Traction */}
        <section className="deck-slide deck-slide--dots" id="deck-traction">
          <div className="deck-slide__inner">
            <p className="deck-eyebrow deck-reveal">Where We Are Today</p>
            <h2 className="deck-h2 deck-reveal deck-reveal--d1">Live. Shipping.<br />Growing organically.</h2>
            <p className="deck-lead deck-reveal deck-reveal--d2">
              Abakada.org is in production today. It's not a pitch deck looking for funding to build a product — the product exists, runs, and is used by real people across the Philippines.
            </p>
            <div className="deck-stats deck-reveal deck-reveal--d3">
              <div>
                <div className="deck-stat__value">1,000+</div>
                <div className="deck-stat__label">Hand-curated Tools</div>
              </div>
              <div>
                <div className="deck-stat__value">45+</div>
                <div className="deck-stat__label">Categories</div>
              </div>
              <div>
                <div className="deck-stat__value">10</div>
                <div className="deck-stat__label">Learning Pathways</div>
              </div>
              <div>
                <div className="deck-stat__value">4</div>
                <div className="deck-stat__label">Philippine Languages</div>
              </div>
            </div>
            <div className="deck-cards deck-cards--3" style={{ marginTop: '3rem' }}>
              <div className="deck-card deck-reveal deck-reveal--d4">
                <div className="deck-card__tag">Product</div>
                <h3 className="deck-card__title">Live in Production</h3>
                <p className="deck-card__text">abakada.org runs today as an installable PWA. Daily visitor count is tracked transparently via a nightly GitHub Action and shown in the site footer.</p>
              </div>
              <div className="deck-card deck-reveal deck-reveal--d5">
                <div className="deck-card__tag">Reach</div>
                <h3 className="deck-card__title">Organic, Founder-Led</h3>
                <p className="deck-card__text">All growth so far has been word-of-mouth and organic search — no paid acquisition, no marketing budget. The audience is genuinely seeking these tools.</p>
              </div>
              <div className="deck-card deck-reveal deck-reveal--d6">
                <div className="deck-card__tag">Moat</div>
                <h3 className="deck-card__title">Editorial &amp; Linguistic</h3>
                <p className="deck-card__text">Every tool is manually vetted for license, safety, and relevance to Filipino learners. Content is authored in four Philippine languages — not auto-translated.</p>
              </div>
            </div>
          </div>
          <div className="deck-counter">05 / 10</div>
        </section>

        {/* 6 — Why Partner */}
        <section className="deck-slide deck-slide--dark" id="deck-why">
          <div className="deck-slide__inner">
            <p className="deck-eyebrow deck-reveal">Why Partner With Abakada</p>
            <h2 className="deck-h2 deck-reveal deck-reveal--d1">A Mission Worth Backing.</h2>
            <p className="deck-lead deck-reveal deck-reveal--d2">
              Abakada isn't a venture-funded SaaS chasing growth metrics. It's an independent civic-tech project — one that gives partners a credible, transparent way to support Filipino digital equity and reach learners directly.
            </p>
            <div className="deck-cards deck-cards--3">
              <div className="deck-card deck-reveal deck-reveal--d2">
                <div className="deck-card__icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="100%" height="100%">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
                  </svg>
                </div>
                <h3 className="deck-card__title">Authentic Audience Access</h3>
                <p className="deck-card__text">Filipino students, educators, and professionals who chose to be here — looking for tools, not ads. High-intent, high-trust by definition.</p>
              </div>
              <div className="deck-card deck-reveal deck-reveal--d3">
                <div className="deck-card__icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="100%" height="100%">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/>
                  </svg>
                </div>
                <h3 className="deck-card__title">Aligned Brand Story</h3>
                <p className="deck-card__text">Open-source, multilingual, free-forever, no tracking. Partner with values you'd be proud to defend in any boardroom or town hall.</p>
              </div>
              <div className="deck-card deck-reveal deck-reveal--d4">
                <div className="deck-card__icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="100%" height="100%">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
                  </svg>
                </div>
                <h3 className="deck-card__title">Editorial Co-Creation</h3>
                <p className="deck-card__text">Co-author tutorials, guides, and tool collections that genuinely help learners — published under Creative Commons, attributable to your team.</p>
              </div>
              <div className="deck-card deck-reveal deck-reveal--d4">
                <div className="deck-card__icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="100%" height="100%">
                    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
                  </svg>
                </div>
                <h3 className="deck-card__title">Reach Filipino Educators</h3>
                <p className="deck-card__text">A natural channel into Philippine schools, NGOs, and learning circles — places traditional ad spend struggles to penetrate.</p>
              </div>
              <div className="deck-card deck-reveal deck-reveal--d5">
                <div className="deck-card__icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="100%" height="100%">
                    <path d="M5 12.55a11 11 0 0 1 14.08 0"/><path d="M1.42 9a16 16 0 0 1 21.16 0"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><line x1="12" y1="20" x2="12.01" y2="20"/>
                  </svg>
                </div>
                <h3 className="deck-card__title">Direct, Founder-Led</h3>
                <p className="deck-card__text">No agency layers, no committee. Talk to the maintainer, agree on a deliverable, ship it. Most partnerships go from intro call to live in under two weeks.</p>
              </div>
              <div className="deck-card deck-reveal deck-reveal--d6">
                <div className="deck-card__icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="100%" height="100%">
                    <polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>
                  </svg>
                </div>
                <h3 className="deck-card__title">Open By Default</h3>
                <p className="deck-card__text">Source on GitHub. Content licensed CC BY 4.0. Visitor count published openly. Anything you contribute compounds in the public good.</p>
              </div>
            </div>
          </div>
          <div className="deck-counter">06 / 10</div>
        </section>

        {/* 7 — Partnership Models / Tiers */}
        <section className="deck-slide deck-slide--dots" id="deck-models">
          <div className="deck-slide__inner">
            <p className="deck-eyebrow deck-reveal">Ways to Partner</p>
            <h2 className="deck-h2 deck-reveal deck-reveal--d1">Three Honest Engagements.</h2>
            <p className="deck-lead deck-reveal deck-reveal--d2">
              Pick the model that fits how you want to contribute. None of these require Abakada to be something it isn't — every deliverable on this slide is something we already ship today.
            </p>
            <div className="deck-tiers">
              <div className="deck-tier deck-reveal deck-reveal--d2">
                <div className="deck-tier__name">Model 01</div>
                <div className="deck-tier__title">Community Supporter</div>
                <p className="deck-tier__desc">For NGOs, schools, student organizations, and grassroots groups aligned with our mission.</p>
                <ul className="deck-tier__list">
                  <li>Logo &amp; link on the Official Partners page</li>
                  <li>Cross-promotion on social channels</li>
                  <li>Joint outreach to Filipino learners</li>
                  <li>Annual impact recap</li>
                </ul>
              </div>
              <div className="deck-tier deck-reveal deck-reveal--d3">
                <div className="deck-tier__name">Model 02</div>
                <div className="deck-tier__title">Content &amp; Editorial Partner</div>
                <p className="deck-tier__desc">For educators, publishers, and open-source projects who want to co-create learning content.</p>
                <ul className="deck-tier__list">
                  <li>Co-authored learning paths or tool collections</li>
                  <li>Bylined guides published under CC BY 4.0</li>
                  <li>Featured tool spotlights</li>
                  <li>Translation contributions (Tagalog, Bisaya, Ilokano)</li>
                  <li>Quarterly check-in on what's resonating</li>
                </ul>
              </div>
              <div className="deck-tier deck-reveal deck-reveal--d4">
                <div className="deck-tier__name">Model 03</div>
                <div className="deck-tier__title">Infrastructure Sponsor</div>
                <p className="deck-tier__desc">For companies offering hosting credits, domain services, dev tools, or financial sponsorship that keeps Abakada free forever.</p>
                <ul className="deck-tier__list">
                  <li>Sponsor recognition on the site &amp; in this deck</li>
                  <li>Inclusion in the project's README on GitHub</li>
                  <li>Direct relationship with the maintainer</li>
                  <li>Public, transparent attribution</li>
                </ul>
              </div>
            </div>
          </div>
          <div className="deck-counter">07 / 10</div>
        </section>

        {/* 8 — Co-Branding & Ecosystem */}
        <section className="deck-slide deck-slide--gradient" id="deck-cobrand">
          <div className="deck-slide__inner">
            <p className="deck-eyebrow deck-reveal">What You Get</p>
            <h2 className="deck-h2 deck-reveal deck-reveal--d1">Concrete Deliverables.<br />Things We Already Ship.</h2>
            <p className="deck-lead deck-reveal deck-reveal--d2">
              No vaporware. Every item below is something we publish or run today — partnership just means co-creating it with your name on it.
            </p>
            <div className="deck-cards deck-cards--3">
              <div className="deck-card deck-reveal deck-reveal--d2">
                <div className="deck-card__icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="100%" height="100%">
                    <rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/>
                  </svg>
                </div>
                <h3 className="deck-card__title">Sponsored Learning Path</h3>
                <p className="deck-card__text">Co-author a curated learning path for your audience (e.g. "Open-Source for Civic Tech, by Partner X"). Lives at /learning-paths/your-id.</p>
              </div>
              <div className="deck-card deck-reveal deck-reveal--d3">
                <div className="deck-card__icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="100%" height="100%">
                    <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/>
                  </svg>
                </div>
                <h3 className="deck-card__title">Featured Tool Spotlight</h3>
                <p className="deck-card__text">If you maintain or sponsor an open-source tool that fits the directory, we can feature it on the home page Editor's Picks carousel.</p>
              </div>
              <div className="deck-card deck-reveal deck-reveal--d4">
                <div className="deck-card__icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="100%" height="100%">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
                  </svg>
                </div>
                <h3 className="deck-card__title">Co-Branded Tool Collection</h3>
                <p className="deck-card__text">A curated subset of the directory ("Tools for Filipino NGOs, by Partner X") with your branding, link, and short intro.</p>
              </div>
              <div className="deck-card deck-reveal deck-reveal--d4">
                <div className="deck-card__icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="100%" height="100%">
                    <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                  </svg>
                </div>
                <h3 className="deck-card__title">Translation Sponsorship</h3>
                <p className="deck-card__text">Fund the expansion of Tagalog, Bisaya, or Ilokano content. Acknowledged in the language footer and project README.</p>
              </div>
              <div className="deck-card deck-reveal deck-reveal--d5">
                <div className="deck-card__icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="100%" height="100%">
                    <rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/><line x1="9" y1="21" x2="9" y2="9"/>
                  </svg>
                </div>
                <h3 className="deck-card__title">Official Partners Page</h3>
                <p className="deck-card__text">A tiered listing on /official-partners with your logo, short blurb, and link — already live; ready for partner fill-in.</p>
              </div>
              <div className="deck-card deck-reveal deck-reveal--d6">
                <div className="deck-card__icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="100%" height="100%">
                    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
                  </svg>
                </div>
                <h3 className="deck-card__title">Joint Outreach Posts</h3>
                <p className="deck-card__text">Blog posts, social cards, and short-form content published from both your channels and ours — under shared Creative Commons terms.</p>
              </div>
            </div>
          </div>
          <div className="deck-counter">08 / 10</div>
        </section>

        {/* 9 — What's Next */}
        <section className="deck-slide deck-slide--dots" id="deck-roadmap">
          <div className="deck-slide__inner">
            <p className="deck-eyebrow deck-reveal">What's Next</p>
            <h2 className="deck-h2 deck-reveal deck-reveal--d1">Honest Goals.<br />No Hand-Waving.</h2>
            <p className="deck-lead deck-reveal deck-reveal--d2">
              These are realistic next steps for an independent, founder-led project. None of them require new infrastructure or enterprise stacks — just sustained editorial work and good partner collaborations.
            </p>
            <div className="deck-timeline">
              <div className="deck-milestone deck-reveal deck-reveal--d2">
                <div className="deck-milestone__date">Near-Term</div>
                <div className="deck-milestone__title">Catalog Growth &amp; Curation</div>
                <div className="deck-milestone__text">Continue vetting and adding open-source tools across the 45+ categories. Target: a steadily growing, hand-verified directory — quality over quantity.</div>
              </div>
              <div className="deck-milestone deck-reveal deck-reveal--d3">
                <div className="deck-milestone__date">Near-Term</div>
                <div className="deck-milestone__title">Translation Coverage</div>
                <div className="deck-milestone__text">Expand UI and key content translations across English, Tagalog, Bisaya, and Ilokano — with community help and partner sponsorship.</div>
              </div>
              <div className="deck-milestone deck-reveal deck-reveal--d4">
                <div className="deck-milestone__date">Mid-Term</div>
                <div className="deck-milestone__title">More Learning Paths</div>
                <div className="deck-milestone__text">Add pathways for under-served personas — out-of-school youth, civic-tech volunteers, OFWs returning home — co-authored with partners who know the audience.</div>
              </div>
              <div className="deck-milestone deck-reveal deck-reveal--d5">
                <div className="deck-milestone__date">Mid-Term</div>
                <div className="deck-milestone__title">Educator-Friendly Mode</div>
                <div className="deck-milestone__text">Printable tool collections, classroom-friendly handouts, and offline bundles teachers can hand to students with limited connectivity.</div>
              </div>
            </div>
          </div>
          <div className="deck-counter">09 / 10</div>
        </section>

        {/* 10 — CTA */}
        <section className="deck-slide deck-slide--dark" id="deck-contact">
          <div className="deck-slide__inner deck-cta-center">
            <span className="deck-chip deck-reveal">Let's talk</span>
            <h2 className="deck-h2 deck-reveal deck-reveal--d1">If This Resonates,<br />Reach Out Directly.</h2>
            <p className="deck-lead deck-reveal deck-reveal--d2">
              No discovery-call funnel, no qualification round. One short email to the maintainer. If there's a fit, we'll figure out the rest in a call.
            </p>
            <div className="deck-btn-row deck-reveal deck-reveal--d3">
              <a href="mailto:partnerships@abakada.org" className="deck-btn deck-btn--primary">
                partnerships@abakada.org
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
              </a>
              <a
                href={PITCH_DECK_URL}
                download={PITCH_DECK_FILENAME}
                className="deck-btn deck-btn--outline"
                aria-label="Download Abakada Partnership Pitch Deck PDF"
                onClick={(e) => {
                  e.preventDefault()
                  downloadFile(PITCH_DECK_URL, PITCH_DECK_FILENAME)
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="7 10 12 15 17 10"/>
                  <line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
                Download Pitch Deck
              </a>
              <Link to="/" className="deck-btn deck-btn--outline">
                Browse the Directory
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                  <polyline points="15 3 21 3 21 9"/>
                  <line x1="10" y1="14" x2="21" y2="3"/>
                </svg>
              </Link>
            </div>
            <div className="deck-watermark deck-reveal deck-reveal--d4">
              <img src="/assets/logo/logo-dark-background.svg" alt="Abakada" width="140" height="32" loading="lazy" decoding="async" />
              <p>© 2026 Abakada.org · Built independently in service of Filipino learners · MIT &amp; CC BY 4.0</p>
            </div>
          </div>
          <div className="deck-counter">10 / 10</div>
        </section>

      </div>
    </>
  )
}
