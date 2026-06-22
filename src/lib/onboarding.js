// Onboarding role <-> learning-path mapping and persistence, shared by the
// OnboardingModal, the App-level first-visit trigger, and the home-page
// quick-start prompt so the role contract lives in exactly one place.

export const ROLE_TO_TOOLKIT = {
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

const ROLE_KEY = 'abakada_onboarding_role'

export function getOnboardingRole() {
  try { return localStorage.getItem(ROLE_KEY) } catch { return null }
}

export function setOnboardingRole(roleId) {
  try { localStorage.setItem(ROLE_KEY, roleId) } catch { /* private mode: skip */ }
}

export function toolkitForRole(roleId) {
  return ROLE_TO_TOOLKIT[roleId] || null
}
