import { useDebounce } from '@/src/hooks/useDebounce'
import { mockFn, renderHookWrapper } from '@/utils/unit-tests/test-mockup-fn'

describe('useDebounce', () => {
  mockFn.setTimeout()
  test('should return correct value from hook', async () => {
    const args = ['mock value', 500]

    const { result, unmount } = await renderHookWrapper(useDebounce, args)
    expect(result).toEqual('mock value')
    unmount()
  })
})
