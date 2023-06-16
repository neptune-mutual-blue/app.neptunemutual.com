import { useRecentVotes } from '@/src/hooks/useRecentVotes'
import { mockGlobals } from '@/utils/unit-tests/mock-globals'
import { mockHooksOrMethods } from '@/utils/unit-tests/mock-hooks-and-methods'
import { testData } from '@/utils/unit-tests/test-data'
import { renderHookWrapper } from '@/utils/unit-tests/helpers'

const mockProps = {
  coverKey:
    '0x6465666900000000000000000000000000000000000000000000000000000000',
  productKey:
    '0x31696e6368000000000000000000000000000000000000000000000000000000',
  page: 1,
  incidentDate: '1660795546',
  limit: 50
}

const mockReturnData = {
  data: testData.recentVotes.data
}

describe('useRecentVotes', () => {
  const { mock, mockFunction, restore } = mockGlobals.console.error()
  mockHooksOrMethods.useWeb3React()
  mockHooksOrMethods.useNetwork()
  mockHooksOrMethods.getGraphURL()

  test('should return correct data', async () => {
    mockGlobals.fetch(true, undefined, mockReturnData)
    const { result } = await renderHookWrapper(
      useRecentVotes,
      [mockProps],
      true
    )
    expect(result.loading).toBeFalsy()
    expect(result.data.transactions.length).toBe(
      testData.recentVotes.data.votes.length
    )
  })

  test('should log error in case of api error', async () => {
    mockGlobals.fetch(false)
    mock()

    await renderHookWrapper(useRecentVotes, [mockProps], true)

    expect(mockFunction).toHaveBeenCalled()

    mockGlobals.fetch().unmock()
    restore()
  })

  test('should return null if coverkey and incident date not provided', async () => {
    const { result } = await renderHookWrapper(useRecentVotes, [
      { ...mockProps, incidentDate: '', coverKey: '' }
    ])
    expect(result.data.transactions.length).toBe(0)
  })
})
