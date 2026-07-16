import { describe, expect, it } from 'vitest'
import { InputController } from './InputController'

describe('InputController', () => {
  it('combines keyboard and touch input without cancelling either source', () => {
    const input = new InputController()
    input.set('keyboard', 'left', true)
    input.set('pointer-2', 'fire', true)
    expect(input.snapshot()).toEqual({
      left: true,
      right: false,
      up: false,
      down: false,
      fire: true,
    })
  })

  it('releases cancelled pointers and all input on lifecycle changes', () => {
    const input = new InputController()
    input.set('pointer-1', 'right', true)
    input.release('pointer-1')
    expect(input.snapshot().right).toBe(false)
    input.set('keyboard', 'left', true)
    input.releaseAll()
    expect(input.snapshot()).toEqual({
      left: false,
      right: false,
      up: false,
      down: false,
      fire: false,
    })
  })

  it('tracks ladder climbing input independently', () => {
    const input = new InputController()
    input.set('keyboard-up', 'up', true)
    expect(input.snapshot().up).toBe(true)
    expect(input.snapshot().down).toBe(false)
  })

  it('consumes a queued fire exactly once', () => {
    const input = new InputController()
    input.queueFire()
    expect(input.consumeFire()).toBe(true)
    expect(input.consumeFire()).toBe(false)
  })
})
