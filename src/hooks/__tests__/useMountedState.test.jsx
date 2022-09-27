import { useMountedState } from '@/src/hooks/useMountedState'
import { renderHookWrapper } from '@/utils/unit-tests/test-mockup-fn'

describe('useMountedState', () => {
  test('should return default data', async () => {
    const { result } = await renderHookWrapper(useMountedState)

    expect(typeof result).toBe('function')
  })

  test('should execute the isMounted callback', async () => {
    const { result, act } = await renderHookWrapper(useMountedState)

    await act(async () => {
      await result()
    })
  })
})
