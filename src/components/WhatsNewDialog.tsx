import { RELEASE_NOTES } from '../game/releaseNotes'

type Props = {
  onBack: () => void
}

export default function WhatsNewDialog({ onBack }: Props) {
  return (
    <div
      className="screen whats-new-screen"
      role="dialog"
      aria-labelledby="whats-new-title"
    >
      <h1 id="whats-new-title">What's New</h1>
      <div className="whats-new-list">
        {RELEASE_NOTES.map((entry) => (
          <section className="whats-new-entry" key={entry.version}>
            <h2>
              v{entry.version}
              <span className="whats-new-date">{entry.date}</span>
            </h2>
            <ul>
              {entry.notes.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          </section>
        ))}
      </div>
      <div className="whats-new-actions">
        <button type="button" className="screen-button" onClick={onBack}>
          Back
        </button>
      </div>
    </div>
  )
}
