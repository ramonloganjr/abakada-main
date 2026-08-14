import { Component } from 'react'
import { reportError } from '../lib/reportError'

// Deliberately self-contained rather than going through useI18n()/t().
//
// This is the last line of defense: it renders precisely when something below
// it threw, and the i18n provider (or its async translation fetch) is one of
// the things that can be broken. Depending on that context here would risk the
// error screen itself failing, leaving the user a blank page.
//
// I18nContext keeps document.documentElement.lang in sync (mapping `bis` to the
// ISO `ceb`), so reading it needs no React state. Headings reuse the wording
// already established for `accessibility.error` in each bundle so the copy stays
// consistent with the rest of the UI.
const COPY = {
  en: {
    title: 'Something went wrong',
    body: 'An unexpected error occurred. Please refresh the page.',
    reload: 'Reload page',
  },
  tl: {
    title: 'May naganap na error',
    body: 'May hindi inaasahang error na naganap. Paki-refresh ang pahina.',
    reload: 'I-reload ang pahina',
  },
  ilo: {
    title: 'Adda napasamak a biddut',
    body: 'Adda saan a nanamnama a biddut. Pangngaasim ta i-refresh ti panid.',
    reload: 'I-reload ti panid',
  },
  ceb: {
    title: 'Adunay nahitabo nga sayop',
    body: 'Adunay wala damha nga sayop nga nahitabo. Palihug i-refresh ang panid.',
    reload: 'I-reload ang panid',
  },
}

function copyForDocumentLang() {
  const lang = typeof document !== 'undefined' ? document.documentElement.lang : 'en'
  return COPY[lang] || COPY.en
}

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, info) {
    reportError(error, `ErrorBoundary${info.componentStack?.split('\n')[1]?.trim() ?? ''}`)
  }

  render() {
    if (this.state.hasError) {
      const copy = copyForDocumentLang()
      return (
        <main className="site-main" id="main-content" role="alert" aria-live="assertive">
          <div className="container" style={{ padding: '4rem 0', textAlign: 'center' }}>
            <h1 style={{ marginBottom: '1rem' }}>{copy.title}</h1>
            <p style={{ marginBottom: '1.5rem', color: 'var(--text-secondary)' }}>
              {copy.body}
            </p>
            <button
              type="button"
              className="btn btn--primary"
              onClick={() => window.location.reload()}
            >
              {copy.reload}
            </button>
          </div>
        </main>
      )
    }
    return this.props.children
  }
}
