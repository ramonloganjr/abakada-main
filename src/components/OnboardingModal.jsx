import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useI18n } from '../contexts/I18nContext'
import Icon from './Icon'

const ROLE_TO_TOOLKIT = {
  student: 'student-productivity',
  teacher: 'teacher-digital-classroom',
  researcher: 'research-starter',
  developer: 'beginner-coding',
  designer: 'designer-toolkit',
  accountant: 'accountant-essentials',
  professional: 'workplace-pro',
  'self-directed': 'self-directed-learner',
  'out-of-school-youth': 'digital-foundations',
}

const ROLES = [
  { id: 'student', icon: 'graduation-cap', label: 'Student' },
  { id: 'teacher', icon: 'presentation', label: 'Educator' },
  { id: 'professional', icon: 'briefcase', label: 'Professional' },
  { id: 'self-directed', icon: 'route', label: 'Self-Directed' },
  { id: 'out-of-school-youth', icon: 'sprout', label: 'New to Digital' },
  { id: 'researcher', icon: 'flask-round', label: 'Researcher' },
  { id: 'developer', icon: 'code', label: 'Developer' },
  { id: 'designer', icon: 'palette', label: 'Designer' },
  { id: 'accountant', icon: 'calculator', label: 'Accountant' },
]

export default function OnboardingModal({ onClose }) {
  const { t } = useI18n()
  const navigate = useNavigate()
  const dialogRef = useRef(null)

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
    if (toolkitId) navigate(`/learning-paths/${toolkitId}`)
    else navigate('/learning-paths')
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
          <Icon name="close" collection="ui" size={18} />
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
              <span className="onboarding-modal__role-icon" aria-hidden="true">
                <Icon name={role.icon} collection="ui" size={22} />
              </span>
              <span className="onboarding-modal__role-label">
                {t(`learningPaths.role.${role.id}`, role.label)}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
