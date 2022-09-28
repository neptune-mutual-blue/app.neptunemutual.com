import { renderHook } from '@testing-library/react-hooks'
import { useCountdown } from '@/lib/countdown/useCountdown'
import { delay } from '@/utils/unit-tests/test-utils'

describe('useCountdown test', () => {
  test('test with proper time', async () => {
    const mockGetTime = jest.fn().mockReturnValue(1663110000)
    const { result, waitForNextUpdate } = renderHook(() =>
      useCountdown({ target: 1663190000, getTime: mockGetTime })
    )

    await waitForNextUpdate()

    expect(mockGetTime).toBeCalled()
    expect(result.current).toMatchObject({
      seconds: 20,
      minutes: 13,
      hours: 22
    })
  })

  test('test with invalid time', async () => {
    const mockGetTime = jest.fn().mockReturnValue(1663110000)

    const { result, rerender } = renderHook(() =>
      useCountdown({ target: 1663100000, getTime: mockGetTime })
    )

    await delay(1000)

    expect(mockGetTime).toBeCalled()
    expect(result.current).toMatchObject({
      seconds: 0,
      minutes: 0,
      hours: 0
    })

    rerender({ target: 1663100001, getTime: mockGetTime })
  })
})
