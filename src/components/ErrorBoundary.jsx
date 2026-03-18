import { Component } from 'react'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, info) {
    // In production, forward to an error tracking service (e.g. Sentry)
    if (import.meta.env.PROD) {
      console.error('[ErrorBoundary]', error, info.componentStack)
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className="site-main" id="main-content" role="alert" aria-live="assertive">
          <div className="container" style={{ padding: '4rem 0', textAlign: 'center' }}>
            <h1 style={{ marginBottom: '1rem' }}>Something went wrong</h1>
            <p style={{ marginBottom: '1.5rem', color: 'var(--text-secondary)' }}>
              An unexpected error occurred. Please refresh the page.
            </p>
            <button
              type="button"
              className="btn btn--primary"
              onClick={() => window.location.reload()}
            >
              Reload page
            </button>
          </div>
        </main>
      )
    }
    return this.props.children
  }
}
