import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useI18n } from '../contexts/I18nContext'

const ROLE_TO_TOOLKIT = {
  student: 'student-productivity',
  teacher: 'teacher-digital-classroom',
  researcher: 'research-starter',
  developer: 'beginner-coding',
  designer: 'designer-toolkit',
  accountant: 'accountant-essentials',
}

const ROLES = [
  { id: 'student', icon: '🎓' },
  { id: 'teacher', icon: '📚' },
  { id: 'researcher', icon: '🔬' },
  { id: 'developer', icon: '💻' },
  { id: 'designer', icon: '🎨' },
  { id: 'accountant', icon: '📊' },
]

export default function OnboardingModal({ onClose }) {
  const { t } = useI18n()
  const navigate = useNavigate()
  const dialogRef = useRef(null)

  // Trap focus and handle Escape key
  useEffect(() => {
    const el = dialogRef.current
    if (!el) return
    el.focus()
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    el.addEventListener('keydown', handleKey)
    return () => el.removeEventListener('keydown', handleKey)
  }, [onClose])

  function handleRoleSelect(roleId) {
    try {
      localStorage.setItem('abakada_onboarding_role', roleId)
    } catch {}
    const toolkitId = ROLE_TO_TOOLKIT[roleId]
    onClose()
    navigate(`/learning-paths/${toolkitId}`)
  }

  return (
    <div
      className="modal-overlay"
      role="presentation"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div
        ref={dialogRef}
        className="modal onboarding-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="onboarding-title"
        tabIndex={-1}
      >
        <button
          type="button"
          className="modal__close btn btn--icon"
          aria-label={t('common.dismiss', 'Dismiss')}
          onClick={onClose}
        >
          ×
        </button>
        <h2 id="onboarding-title" className="onboarding-modal__title">
          {t('onboarding.title', 'What best describes you?')}
        </h2>
        <p className="onboarding-modal__subtitle">
          {t('onboarding.subtitle', "We'll recommend a learning path tailored to your role.")}
        </p>
        <div className="onboarding-modal__roles">
          {ROLES.map(role => (
            <button
              key={role.id}
              type="button"
              className="onboarding-modal__role-btn"
              onClick={() => handleRoleSelect(role.id)}
            >
              <span className="onboarding-modal__role-icon" aria-hidden="true">{role.icon}</span>
              <span className="onboarding-modal__role-label">
                {t(`learningPaths.role.${role.id}`, role.id.charAt(0).toUpperCase() + role.id.slice(1))}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
