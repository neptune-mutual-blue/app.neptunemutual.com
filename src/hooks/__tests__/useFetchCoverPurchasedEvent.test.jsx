import DateLib from '@/lib/date/DateLib'
import {
  storePurchaseEvent,
  useFetchCoverPurchasedEvent
} from '@/src/hooks/useFetchCoverPurchasedEvent'
import { mockGlobals } from '@/utils/unit-tests/mock-globals'
import { mockHooksOrMethods } from '@/utils/unit-tests/mock-hooks-and-methods'
import { testData } from '@/utils/unit-tests/test-data'
import { renderHookWrapper } from '@/utils/unit-tests/helpers'

describe('useFetchCoverPurchasedEvent', () => {
  const { mock, mockFunction } = mockGlobals.console.error()
  mock()

  mockHooksOrMethods.useNetwork()
  mockHooksOrMethods.getGraphURL()
  jest.mock('@/lib/date/DateLib')

  const args = [
    {
      txHash: testData.coverPurchasedEvent.transactionHash
    }
  ]

  test('should return default value when no data returned from api', async () => {
    const mockData = { data: {} }
    mockGlobals.fetch(true, undefined, mockData)

    const { result } = await renderHookWrapper(
      useFetchCoverPurchasedEvent,
      args
    )

    expect(result.data).toBeFalsy()
    expect(result.loading).toBeFalsy()

    mockGlobals.fetch().unmock()
  })

  test('should return correct data as received', async () => {
    const mockData = {
      data: { coverPurchasedEvent: { id: 123, timestamp: 167934354 } }
    }
    mockGlobals.fetch(true, undefined, mockData)

    const { result } = await renderHookWrapper(
      useFetchCoverPurchasedEvent,
      args,
      true
    )

    expect(result.data).toBe(mockData.data.coverPurchasedEvent)
    expect(result.loading).toBeFalsy()

    mockGlobals.fetch().unmock()
  })

  test('should log error when error returned from api', async () => {
    mockGlobals.fetch(false)

    await renderHookWrapper(useFetchCoverPurchasedEvent, args, true)
    expect(mockFunction).toHaveBeenCalled()

    mockGlobals.fetch().unmock()
  })

  test('should get data from localstorage if available', async () => {
    // store an event in localstorage
    storePurchaseEvent(
      testData.coverPurchasedEvent,
      testData.coverPurchasedEvent.from
    )

    const { result } = await renderHookWrapper(
      useFetchCoverPurchasedEvent,
      args,
      true
    )

    expect(result.data.id).toBe(testData.coverPurchasedEvent.transactionHash)
  })

  test('testing storePurchaseEvent function', () => {
    storePurchaseEvent(
      { ...testData.coverPurchasedEvent, transactionHash: '123456789' },
      testData.coverPurchasedEvent.from
    )

    const storedEvent = JSON.parse(localStorage.getItem('123456789'))

    expect(storedEvent).toBeDefined()
    expect(storedEvent.event.id).toBe('123456789')
  })

  test('when localstorage data is expired', async () => {
    // store an event in localstorage
    storePurchaseEvent(
      testData.coverPurchasedEvent,
      testData.coverPurchasedEvent.from
    )

    // mock DateLib.unix method to give higher date timestamp
    const mockStaticF = jest
      .fn()
      .mockReturnValue(new Date().getTime() + 999999)
    DateLib.unix = mockStaticF

    await renderHookWrapper(useFetchCoverPurchasedEvent, args, true)

    const storedEvent = localStorage.getItem(args[0].txHash)
    expect(storedEvent).toBeFalsy()
  })
})
