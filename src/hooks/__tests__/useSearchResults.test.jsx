import { useSearchResults } from '../useSearchResults'
import { renderHookWrapper } from '@/utils/unit-tests/test-mockup-fn'

const mockProps = {
  list: [],
  filter: jest.fn()
}

describe('useSearchResults', () => {
  test('should receive values', async () => {
    const { result } = await renderHookWrapper(useSearchResults, [mockProps])

    expect(result.searchValue).toEqual('')
    expect(result.setSearchValue).toEqual(expect.any(Function))
    expect(result.filtered).toEqual([])
  })
})
