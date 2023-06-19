import { useProtocolDayData } from '@/src/hooks/useProtocolDayData'
import { mockHooksOrMethods } from '@/utils/unit-tests/mock-hooks-and-methods'
import { renderHookWrapper } from '@/utils/unit-tests/helpers'
import { testData } from '@/utils/unit-tests/test-data'

const mockReturnData = testData.protocolDayData

describe('useProtocolDayData', () => {
  // const { mock, mockFunction, restore } = mockGlobals.console.error()
  mockHooksOrMethods.useWeb3React()
  mockHooksOrMethods.useNetwork()
  mockHooksOrMethods.getGraphURL()
  mockHooksOrMethods.getGroupedProtocolDayData()

  test('should return correct data', async () => {
    // mockGlobals.fetch(true, undefined, mockReturnData)
    const { result } = await renderHookWrapper(useProtocolDayData, [true], true)

    expect(result.loading).toBeFalsy()
    expect(result.data.totalCapacity.length).toEqual(
      mockReturnData.data.totalCapacity.length
    )
    expect(result.data.totalLiquidity.length).toEqual(
      mockReturnData.data.totalLiquidity.length
    )
    expect(result.data.totalCovered.length).toEqual(
      mockReturnData.data.totalCovered.length
    )
  })

  // test('should log error in case of api error', async () => {
  //   mock()
  //   // mockHooksOrMethods.getGroupedProtocolDayData(() => Promise.reject(new Error('sdsdsd')))

  //   // jest
  //   //   .spyOn(ProtocolDayDataFile, 'getGroupedProtocolDayData')
  //   //   .mockImplementation(async () => {
  //   //     await new Promise((resolve, reject) => {
  //   //       setTimeout(() => {
  //   //         resolve('Hello')
  //   //         // reject(new Error("dsdsd"))
  //   //       }, 500)
  //   //     })
  //   //     // setTimeout(() => {
  //   //     //   return Promise.reject(new Error('OH NOOOOOOO'))
  //   //     //   // reject(new Error("dsdsd"))
  //   //     // }, 500)

  //   //     throw new Error('ERROR')
  //   //   })

  //   await renderHookWrapper(useProtocolDayData, [true])

  //   expect(mockFunction).toHaveBeenCalled()

  //   restore()
  // })
})
