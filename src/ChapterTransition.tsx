import { useEffect, useRef, type CSSProperties } from 'react'
import { getChapterLabel } from './game/chapterTransition'
import { getPlayerTheme } from './game/playerTheme'

const TRANSITION_MS = 4200

type ChapterTransitionProps = {
  fromStageIndex: number
  fromStageName: string
  toStageIndex: number
  toStageName: string
  onComplete: () => void
}

export default function ChapterTransition({
  fromStageIndex,
  fromStageName,
  toStageIndex,
  toStageName,
  onComplete,
}: ChapterTransitionProps) {
  const completeRef = useRef(onComplete)
  completeRef.current = onComplete

  useEffect(() => {
    const timer = window.setTimeout(() => completeRef.current(), TRANSITION_MS)
    return () => window.clearTimeout(timer)
  }, [])

  const origin = getChapterLabel(fromStageIndex, fromStageName)
  const destination = getChapterLabel(toStageIndex, toStageName)
  const tone = getPlayerTheme(toStageIndex, toStageName)

  return (
    <div
      className={`screen chapter-transition-screen chapter-tone-${tone}`}
      role="status"
      aria-live="polite"
      aria-label={`World jump from ${origin} to ${destination}`}
    >
      <div className="chapter-starfield" aria-hidden="true">
        {Array.from({ length: 18 }, (_, index) => (
          <span
            key={index}
            style={{ '--star-index': index } as CSSProperties}
          />
        ))}
      </div>

      <div className="chapter-world chapter-world-origin" aria-hidden="true">
        <span />
      </div>
      <div className="chapter-gate" aria-hidden="true">
        <span className="chapter-gate-ring chapter-gate-ring-outer" />
        <span className="chapter-gate-ring chapter-gate-ring-middle" />
        <span className="chapter-gate-ring chapter-gate-ring-inner" />
        <span className="chapter-gate-core">ORBIT</span>
      </div>
      <div
        className="chapter-world chapter-world-destination"
        aria-hidden="true"
      >
        <span />
      </div>

      <div className="chapter-transition-copy">
        <p className="main-kicker">World Jump</p>
        <p className="chapter-origin-label">{origin}</p>
        <span className="chapter-route" aria-hidden="true">
          ◇ =====&gt;
        </span>
        <h1>{destination}</h1>
        <p className="chapter-arrival-stage">Next / Stage {toStageIndex + 1}</p>
        <p className="chapter-arrival-title">{toStageName}</p>
      </div>

      <button
        type="button"
        className="screen-button chapter-enter-button"
        onClick={onComplete}
      >
        Enter New World
      </button>
      <p className="space-hint">Press Space to Skip</p>
    </div>
  )
}
