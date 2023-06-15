import { useMyLiquidities } from '@/src/hooks/useMyLiquidities'
import { mockGlobals } from '@/utils/unit-tests/mock-globals'
import { mockHooksOrMethods } from '@/utils/unit-tests/mock-hooks-and-methods'
import { testData } from '@/utils/unit-tests/test-data'

import { renderHookWrapper } from '@/utils/unit-tests/helpers'

describe('useMyLiquidities', () => {
  const { mock, mockFunction, restore } = mockGlobals.console.error()

  mockHooksOrMethods.getGraphURL()
  mockHooksOrMethods.getNetworkId()

  const args = [testData.account.account]

  test('should return default data if empty data returned from api ', async () => {
    mockGlobals.fetch(true, undefined, { data: { userLiquidities: '' } })

    const { result } = await renderHookWrapper(useMyLiquidities, args, true)

    expect(result.data.myLiquidities).toEqual([])
    expect(result.data.liquidityList).toEqual([])
    expect(result.loading).toEqual(false)

    mockGlobals.fetch().unmock()
  })

  test('should return deafult value if no account provided', async () => {
    const { result } = await renderHookWrapper(useMyLiquidities, [])

    expect(result.data.myLiquidities).toEqual([])
    expect(result.data.liquidityList).toEqual([])
    expect(result.loading).toEqual(false)
  })

  test('should set correct data as returned from api', async () => {
    const mockData = {
      data: {
        userLiquidities: [
          { totalPodsRemaining: 10, cover: { vaults: [{ address: '123' }] } },
          { totalPodsRemaining: 11, cover: { vaults: [{ address: '124' }] } },
          { totalPodsRemaining: 12, cover: { vaults: [{ address: '126' }] } }
        ]
      }
    }
    mockGlobals.fetch(true, undefined, mockData)

    const { result } = await renderHookWrapper(useMyLiquidities, args, true)

    expect(result.data.myLiquidities).toEqual(mockData.data.userLiquidities)

    mockGlobals.fetch().unmock()
  })

  test('should log the error when occurred', async () => {
    mockGlobals.fetch(false)
    mock()

    await renderHookWrapper(useMyLiquidities, args)

    expect(mockFunction).toHaveBeenCalled()

    mockGlobals.fetch().unmock()
    restore()
  })

  describe('edge cases coverage', () => {
    test('should set podAmount to 0 when not available in api data', async () => {
      const mockData = {
        data: {
          userLiquidities: [
            { totalPodsRemaining: '', cover: { vaults: [{ address: '123' }] } },
            { totalPodsRemaining: 10, cover: { vaults: [{ address: '124' }] } },
            { totalPodsRemaining: 16, cover: { vaults: [{ address: '126' }] } }
          ]
        }
      }
      mockGlobals.fetch(true, undefined, mockData)

      const { result } = await renderHookWrapper(useMyLiquidities, args, true)

      expect(result.data.liquidityList[0].podAmount).toEqual('0')

      mockGlobals.fetch().unmock()
    })
  })
})
