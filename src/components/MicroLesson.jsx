import { useState, useEffect, useRef, useMemo } from 'react'
import { useI18n } from '../contexts/I18nContext'
import { useNarration } from '../hooks/useNarration'
import { speechLangFor } from '../lib/speech'
import Icon from './Icon'

/**
 * Turns a learning-path stage (objectives + hands-on tasks) into a paced,
 * one-step-at-a-time micro-lesson with optional read-aloud. Built for low
 * bandwidth (text-first, no media) and first-time / oral-first learners.
 *
 * It does not invent content: "Learn" steps come from the stage's objectives and
 * "Do" steps from its tasks. Task steps stay wired to the existing completion
 * state so progress is shared with the checklist view.
 */
export default function MicroLesson({ stage, stageIndex, completedTasks, onToggleTask, onExit }) {
  const { t, lang } = useI18n()
  const [step, setStep] = useState(0)
  const { supported: ttsSupported, speaking, speak, stop: stopSpeaking } = useNarration(speechLangFor(lang))
  const liveRef = useRef(null)

  const steps = useMemo(() => {
    const learn = (stage.objectives || []).map((text) => ({ type: 'learn', text }))
    const dos = (stage.tasks || []).map((text, i) => ({ type: 'do', text, taskKey: `${stage.id}::${i}` }))
    const all = [...learn, ...dos]
    if (all.length === 0 && stage.description) all.push({ type: 'learn', text: stage.description })
    return all
  }, [stage])

  const total = steps.length
  const current = steps[Math.min(step, total - 1)]

  // Stop any narration when the step changes or the lesson unmounts.
  useEffect(() => stopSpeaking, [step, stopSpeaking])

  function toggleListen() {
    if (speaking) stopSpeaking()
    else if (current) speak(current.text)
  }

  function go(next) {
    stopSpeaking()
    setStep(Math.max(0, Math.min(total - 1, next)))
  }

  if (total === 0) return null

  const isDo = current.type === 'do'
  const done = isDo && completedTasks.has(current.taskKey)
  const isLast = step === total - 1

  return (
    <div className="micro-lesson" role="group" aria-label={t('learningPaths.guidedLesson', 'Guided lesson')}>
      <div className="micro-lesson__bar">
        <span className="micro-lesson__counter">
          {t('learningPaths.stepLabel', 'Step')} {step + 1} / {total}
        </span>
        <div className="micro-lesson__dots" role="tablist" aria-label={t('learningPaths.lessonSteps', 'Lesson steps')}>
          {steps.map((s, i) => (
            <button
              key={i}
              type="button"
              role="tab"
              aria-selected={i === step}
              aria-label={`${t('learningPaths.stepLabel', 'Step')} ${i + 1}`}
              className={`micro-lesson__dot${i === step ? ' is-active' : ''}${i < step ? ' is-past' : ''}${s.type === 'do' && completedTasks.has(s.taskKey) ? ' is-done' : ''}`}
              onClick={() => go(i)}
            />
          ))}
        </div>
        <button
          type="button"
          className="micro-lesson__exit btn btn--icon"
          aria-label={t('learningPaths.exitLesson', 'Exit guided lesson')}
          onClick={() => { stopSpeaking(); onExit?.() }}
        >
          <Icon name="close" collection="ui" size={16} />
        </button>
      </div>

      <div className="micro-lesson__stage" aria-hidden="true">
        {stageIndex != null ? `${t('learningPaths.stageWord', 'Stage')} ${stageIndex + 1} · ` : ''}{stage.title}
      </div>

      <div className="micro-lesson__card" aria-live="polite" ref={liveRef}>
        <span className={`micro-lesson__kind micro-lesson__kind--${current.type}`}>
          <Icon name={isDo ? 'list-checks' : 'compass'} collection="ui" size={14} />
          {isDo ? t('learningPaths.doStep', 'Try it') : t('learningPaths.learnStep', 'Learn')}
        </span>
        <p className="micro-lesson__text">{current.text}</p>

        <div className="micro-lesson__actions">
          {ttsSupported && (
            <button
              type="button"
              className={`micro-lesson__listen btn btn--secondary btn--sm${speaking ? ' is-speaking' : ''}`}
              onClick={toggleListen}
              aria-pressed={speaking}
            >
              <Icon name={speaking ? 'circle-empty' : 'play-circle'} collection="ui" size={14} />
              {speaking ? t('learningPaths.stopAudio', 'Stop') : t('learningPaths.listen', 'Listen')}
            </button>
          )}
          {isDo && (
            <label className={`micro-lesson__check${done ? ' is-done' : ''}`}>
              <input
                type="checkbox"
                checked={done}
                onChange={() => onToggleTask(current.taskKey)}
              />
              <span>{done ? t('learningPaths.didThis', 'Done') : t('learningPaths.markDone', 'I did this')}</span>
            </label>
          )}
        </div>
      </div>

      <div className="micro-lesson__nav">
        <button
          type="button"
          className="btn btn--secondary btn--sm"
          onClick={() => go(step - 1)}
          disabled={step === 0}
        >
          <Icon name="chevron-left" collection="ui" size={14} />
          {t('learningPaths.back', 'Back')}
        </button>
        {isLast ? (
          <button type="button" className="btn btn--primary btn--sm" onClick={() => { stopSpeaking(); onExit?.() }}>
            {t('learningPaths.finishLesson', 'Finish lesson')}
            <Icon name="check" collection="ui" size={14} />
          </button>
        ) : (
          <button type="button" className="btn btn--primary btn--sm" onClick={() => go(step + 1)}>
            {t('learningPaths.next', 'Next')}
            <Icon name="chevron-right" collection="ui" size={14} />
          </button>
        )}
      </div>
    </div>
  )
}
