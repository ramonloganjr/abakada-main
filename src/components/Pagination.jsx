import { useI18n } from '../contexts/I18nContext'
import Icon from './Icon'

export default function Pagination({ page, totalPages, total, onPage }) {
  const { t } = useI18n()
  if (totalPages <= 1) return null

  const pages = []
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= page - 1 && i <= page + 1)) {
      pages.push(i)
    } else if (pages[pages.length - 1] !== '...') {
      pages.push('...')
    }
  }

  return (
    <nav className="pagination" aria-label="Pagination">
      <button
        type="button"
        className="pagination__btn"
        disabled={page <= 1}
        onClick={() => onPage(page - 1)}
        aria-label="Previous page"
      >
        <Icon name="chevron-left" collection="ui" size={16} />
      </button>

      {pages.map((p, i) =>
        p === '...'
          ? <span key={`ellipsis-${i}`} className="pagination__ellipsis">…</span>
          : <button
              key={p}
              type="button"
              className={`pagination__btn${p === page ? ' active' : ''}`}
              aria-current={p === page ? 'page' : undefined}
              onClick={() => onPage(p)}
            >
              {p}
            </button>
      )}

      <button
        type="button"
        className="pagination__btn"
        disabled={page >= totalPages}
        onClick={() => onPage(page + 1)}
        aria-label="Next page"
      >
        <Icon name="chevron-right" collection="ui" size={16} />
      </button>
    </nav>
  )
}
