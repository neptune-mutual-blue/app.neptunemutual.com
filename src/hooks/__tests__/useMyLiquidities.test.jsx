import { useMyLiquidities } from '@/src/hooks/useMyLiquidities'
import { testData } from '@/utils/unit-tests/test-data'

import { mockFn, renderHookWrapper } from '@/utils/unit-tests/test-mockup-fn'

describe('useMyLiquidities', () => {
  const { mock, mockFunction, restore } = mockFn.console.error()

  mockFn.getGraphURL()
  mockFn.getNetworkId()

  const args = [testData.account.account]

  test('should return default data if empty data returned from api ', async () => {
    mockFn.fetch(true, undefined, { data: { userLiquidities: '' } })

    const { result } = await renderHookWrapper(useMyLiquidities, args, true)

    expect(result.data.myLiquidities).toEqual([])
    expect(result.data.liquidityList).toEqual([])
    expect(result.loading).toEqual(false)

    mockFn.fetch().unmock()
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
    mockFn.fetch(true, undefined, mockData)

    const { result } = await renderHookWrapper(useMyLiquidities, args, true)

    expect(result.data.myLiquidities).toEqual(mockData.data.userLiquidities)

    mockFn.fetch().unmock()
  })

  test('should log the error when occurred', async () => {
    mockFn.fetch(false)
    mock()

    await renderHookWrapper(useMyLiquidities, args)

    expect(mockFunction).toHaveBeenCalled()

    mockFn.fetch().unmock()
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
      mockFn.fetch(true, undefined, mockData)

      const { result } = await renderHookWrapper(useMyLiquidities, args, true)

      expect(result.data.liquidityList[0].podAmount).toEqual('0')

      mockFn.fetch().unmock()
    })
  })
})
