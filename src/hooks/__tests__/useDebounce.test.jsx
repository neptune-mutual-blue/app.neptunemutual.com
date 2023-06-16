import { useDebounce } from '@/src/hooks/useDebounce'
import { mockGlobals } from '@/utils/unit-tests/mock-globals'
import { renderHookWrapper } from '@/utils/unit-tests/helpers'

describe('useDebounce', () => {
  mockGlobals.setTimeout()
  test('should return correct value from hook', async () => {
    const args = ['mock value', 500]

    const { result, unmount } = await renderHookWrapper(useDebounce, args)
    expect(result).toEqual('mock value')
    unmount()
  })
})
