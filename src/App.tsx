import { useState } from 'react'
import './App.css'

type Screen = 'main' | 'select' | 'play' | 'end'

function App() {
  const [screen, setScreen] = useState<Screen>('main')
  const [selectedMission, setSelectedMission] = useState<string | null>(null)

  if (screen === 'main') {
    return (
      <div>
        <h1>PANG</h1>
        <button type="button" onClick={() => setScreen('select')}>
          게임 선택하기
        </button>
      </div>
    )
  }

  if (screen === 'select') {
    return (
      <div>
        <h1>게임 선택</h1>
        <button
          type="button"
          onClick={() => setSelectedMission('미션 1')}
        >
          미션 1
        </button>
        {selectedMission && (
          <div>
            <p>선택됨: {selectedMission}</p>
            <button type="button" onClick={() => setScreen('play')}>
              시작
            </button>
          </div>
        )}
      </div>
    )
  }

  if (screen === 'play') {
    return (
      <div>
        <h1>{selectedMission} 플레이 중</h1>
        <p>실제 게임 플레이는 Phase 2에서 구현 예정입니다.</p>
        <button type="button" onClick={() => setScreen('end')}>
          게임 종료
        </button>
      </div>
    )
  }

  return (
    <div>
      <h1>게임 종료</h1>
      <button
        type="button"
        onClick={() => {
          setSelectedMission(null)
          setScreen('main')
        }}
      >
        메인으로
      </button>
    </div>
  )
}

export default App
