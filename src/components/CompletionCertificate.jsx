import { useState } from 'react'
import { useI18n } from '../contexts/I18nContext'
import Icon from './Icon'

export default function CompletionCertificate({ toolkit }) {
  const { t } = useI18n()
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')

  const completedDate = new Date().toLocaleDateString('en-PH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <>
      <div className="cert-trigger">
        <span className="cert-trigger__icon" aria-hidden="true">
          <Icon name="award" collection="ui" size={20} />
        </span>
        <div className="cert-trigger__copy">
          <strong>{t('learningPaths.certPathwayMastered', 'Pathway mastered!')}</strong>
          <p>{t('learningPaths.certGetDesc', "You've completed every stage. Get your certificate.")}</p>
        </div>
        <button
          type="button"
          className="btn btn--primary btn--sm"
          onClick={() => setOpen(true)}
        >
          {t('learningPaths.certGetButton', 'Get Certificate')}
          <Icon name="external-link" collection="ui" size={12} aria-hidden="true" />
        </button>
      </div>

      {open && (
        <div
          className="cert-modal"
          role="dialog"
          aria-modal="true"
          aria-label={t('learningPaths.certAriaLabel', 'Certificate of Completion')}
          onClick={e => e.target === e.currentTarget && setOpen(false)}
        >
          <div className="cert-modal__inner">
            <div className="cert-modal__controls no-print">
              <div className="cert-modal__name-row">
                <label htmlFor="cert-name" className="cert-modal__label">
                  {t('learningPaths.certNameLabel', 'Your name')}{' '}
                  <span className="cert-modal__optional">{t('learningPaths.certNameOptional', '(optional)')}</span>
                </label>
                <input
                  id="cert-name"
                  type="text"
                  className="cert-modal__input"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder={t('learningPaths.certNamePlaceholder', 'Enter your name')}
                  maxLength={80}
                  autoFocus
                />
              </div>
              <div className="cert-modal__btns">
                <button
                  type="button"
                  className="btn btn--primary"
                  onClick={() => window.print()}
                >
                  <Icon name="printer" collection="ui" size={14} aria-hidden="true" />
                  {t('learningPaths.certPrintButton', 'Print / Save as PDF')}
                </button>
                <button
                  type="button"
                  className="btn btn--secondary"
                  onClick={() => setOpen(false)}
                >
                  {t('learningPaths.certClose', 'Close')}
                </button>
              </div>
            </div>

            <div className="certificate" aria-label={t('learningPaths.certAriaLabel', 'Certificate of Completion')}>
              <div className="certificate__outer">
                <div className="certificate__inner">
                  <div className="certificate__logo">Abakada</div>
                  <div className="certificate__heading">{t('learningPaths.certTitle', 'Certificate of Completion')}</div>
                  <p className="certificate__presented-to">{t('learningPaths.certThisCertifies', 'This certifies that')}</p>
                  <div className="certificate__name">
                    {name.trim() || ' '}
                    {!name.trim() && (
                      <span className="certificate__name-blank" aria-hidden="true">
                        ________________________________
                      </span>
                    )}
                  </div>
                  <p className="certificate__completed-text">{t('learningPaths.certHasCompleted', 'has successfully completed')}</p>
                  <div className="certificate__path-title">{toolkit.title}</div>
                  {toolkit.tagline && (
                    <div className="certificate__path-tagline">{toolkit.tagline}</div>
                  )}
                  <div className="certificate__meta">
                    <div className="certificate__date">{completedDate}</div>
                    {toolkit.duration && (
                      <div className="certificate__duration">{toolkit.duration}</div>
                    )}
                  </div>
                  <div className="certificate__seal" aria-hidden="true">
                    <Icon name="award" collection="ui" size={36} />
                  </div>
                  <div className="certificate__footer-line">
                    {t('learningPaths.certFooter', 'abakada.org · Free & Open-Source Tools for Filipinos')}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
