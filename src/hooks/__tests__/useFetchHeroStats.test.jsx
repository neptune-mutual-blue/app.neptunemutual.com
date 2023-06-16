import { useFetchHeroStats } from '@/src/hooks/useFetchHeroStats'
import { mockGlobals } from '@/utils/unit-tests/mock-globals'
import { mockHooksOrMethods } from '@/utils/unit-tests/mock-hooks-and-methods'

import { renderHookWrapper } from '@/utils/unit-tests/helpers'

describe('useFetchHeroStats', () => {
  const { mock, mockFunction, restore } = mockGlobals.console.error()

  mockHooksOrMethods.getGraphURL()
  mockHooksOrMethods.getNetworkId()

  const mockFetchData = {
    data: {
      covers: [{}, {}, {}, {}],
      cxTokens: [
        { totalCoveredAmount: 12323 },
        { totalCoveredAmount: 7 },
        { totalCoveredAmount: 1000 }
      ],
      protocols: [
        {
          totalCoverLiquidityAdded: 1234,
          totalCoverLiquidityRemoved: 5434,
          totalFlashLoanFees: 124,
          totalCoverFee: 1023
        }
      ],
      reporting: [{}]
    }
  }

  test('should return correct data ', async () => {
    mockGlobals.fetch(true, undefined, mockFetchData)

    const { result } = await renderHookWrapper(useFetchHeroStats, [], true)

    expect(result.data.availableCovers).toBeDefined()
    expect(result.data.reportingCovers).toBeDefined()
    expect(result.data.coverFee).toBeDefined()
    expect(result.data.covered).toBeDefined()
    expect(result.data.totalCoverage).toBeDefined()
    expect(result.data.tvlPool).toBeDefined()

    mockGlobals.fetch().unmock()
  })

  test('should log error if error returned from api', async () => {
    mockGlobals.fetch(false)
    mock()

    await renderHookWrapper(useFetchHeroStats, [], true)

    expect(mockFunction).toHaveBeenCalled()

    mockGlobals.fetch().unmock()
    restore()
  })
})
