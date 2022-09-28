import { renderHook } from '@testing-library/react-hooks'
import { useWindowSize } from '../useWindowSize'

describe('useWindowSize', () => {
  test('should receive values', () => {
    const { result } = renderHook(() => useWindowSize())

    expect(typeof result.current.width).toBe('number')
    expect(typeof result.current.height).toBe('number')
  })
})
