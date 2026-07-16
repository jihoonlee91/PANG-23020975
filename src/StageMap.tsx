import { useEffect, useRef } from 'react'
import { CANVAS_WIDTH, CANVAS_HEIGHT, STAGE_COUNT } from './game/constants'
import { BACKGROUNDS, STAGE_NAMES } from './game/backgrounds'

type ThumbnailProps = {
  stageIndex: number
}

function StageThumbnail({ stageIndex }: ThumbnailProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    BACKGROUNDS[stageIndex % BACKGROUNDS.length](ctx)
  }, [stageIndex])

  return (
    <canvas
      ref={canvasRef}
      width={CANVAS_WIDTH}
      height={CANVAS_HEIGHT}
      className="stage-thumb"
    />
  )
}

type Props = {
  onBack?: () => void
  currentStage?: number
  nextStage?: number
  title?: string
  statusText?: string
  actionLabel?: string
  onAction?: () => void
  compact?: boolean
}

function StageMap({
  onBack,
  currentStage,
  nextStage,
  title = 'Stage Map',
  statusText,
  actionLabel,
  onAction,
  compact = false,
}: Props) {
  return (
    <div
      className={`screen stage-map-screen ${compact ? 'stage-map-transition' : ''}`}
    >
      <h1>{title}</h1>
      {statusText && <p className="stage-map-status">{statusText}</p>}
      <div className="stage-map-grid">
        {Array.from({ length: STAGE_COUNT }, (_, i) => {
          const isCurrent = i === currentStage
          const isNext = i === nextStage
          const isCleared = currentStage !== undefined && i < currentStage
          return (
            <div
              className={`stage-map-card ${isCleared ? 'stage-map-card-cleared' : ''} ${isCurrent ? 'stage-map-card-current' : ''} ${isNext ? 'stage-map-card-next' : ''}`}
              key={i}
              aria-current={isCurrent ? 'step' : undefined}
            >
              <div className="stage-thumb-wrap">
                <StageThumbnail stageIndex={i} />
                {isCleared && <span className="stage-map-badge">CLEAR</span>}
                {isCurrent && (
                  <span className="stage-map-badge stage-map-badge-current">
                    YOU ARE HERE
                  </span>
                )}
                {isNext && (
                  <span className="stage-map-badge stage-map-badge-next">
                    NEXT
                  </span>
                )}
              </div>
              <p>
                {i + 1}. {STAGE_NAMES[i % STAGE_NAMES.length]}
              </p>
            </div>
          )
        })}
      </div>
      <div className="stage-map-actions">
        {onAction && actionLabel && (
          <button type="button" className="screen-button" onClick={onAction}>
            {actionLabel}
          </button>
        )}
        {onBack && (
          <button
            type="button"
            className="screen-button screen-button-secondary"
            onClick={onBack}
          >
            Back
          </button>
        )}
      </div>
    </div>
  )
}

export default StageMap
