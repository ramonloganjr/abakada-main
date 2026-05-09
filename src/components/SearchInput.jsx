import { useRef } from 'react'
import { useI18n } from '../contexts/I18nContext'

export default function SearchInput({ value, onChange }) {
  const { t } = useI18n()
  const inputRef = useRef(null)

  return (
    <div className="search">
      <svg className="search__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.35-4.35" />
      </svg>
      <input
        ref={inputRef}
        id="search-input"
        type="search"
        className="search__input"
        placeholder={t('search.placeholder', 'Search tools...')}
        aria-label={t('search.placeholder', 'Search tools')}
        autoComplete="off"
        spellCheck="false"
        maxLength={100}
        value={value}
        onChange={e => onChange(e.target.value)}
      />
      <button
        type="button"
        id="search-clear"
        className="search__clear"
        aria-label="Clear search"
        style={{ opacity: value ? 1 : 0, visibility: value ? 'visible' : 'hidden' }}
        onClick={() => { onChange(''); if (inputRef.current) inputRef.current.focus() }}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
    </div>
  )
}
