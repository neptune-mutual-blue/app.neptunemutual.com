import { useFetchCoverProductActiveReportings } from '@/src/hooks/useFetchCoverProductActiveReportings'
import { mockGlobals } from '@/utils/unit-tests/mock-globals'
import { mockHooksOrMethods } from '@/utils/unit-tests/mock-hooks-and-methods'

import { renderHookWrapper } from '@/utils/unit-tests/helpers'

describe('useFetchCoverProductActiveReportings', () => {
  const { mock, mockFunction, restore } = mockGlobals.console.error()

  mockHooksOrMethods.useNetwork()
  mockHooksOrMethods.getGraphURL()
  mockHooksOrMethods.getNetworkId()

  const args = [
    {
      coverKey:
        '0x7072696d65000000000000000000000000000000000000000000000000000000',
      productKey:
        '0x6161766500000000000000000000000000000000000000000000000000000000'
    }
  ]

  test('should return default value', async () => {
    const mockData = { data: {} }
    mockGlobals.fetch(true, undefined, mockData)

    const { result } = await renderHookWrapper(
      useFetchCoverProductActiveReportings,
      args
    )

    expect(result.data).toEqual([])
    expect(result.loading).toBeFalsy()

    mockGlobals.fetch().unmock()
  })

  test('should return correct value as returned from api', async () => {
    const mockData = {
      data: { incidentReports: { id: '1', reportedOn: new Date().getTime() } }
    }
    mockGlobals.fetch(true, undefined, mockData)

    const { result } = await renderHookWrapper(
      useFetchCoverProductActiveReportings,
      args,
      true
    )

    expect(result.data).toEqual(mockData.data.incidentReports)

    mockGlobals.fetch().unmock()
  })

  test('should log error if api error occurs', async () => {
    mockGlobals.fetch(false)
    mock() // mocking console.error

    await renderHookWrapper(useFetchCoverProductActiveReportings, args, true)

    expect(mockFunction).toHaveBeenCalled()

    restore()
    mockGlobals.fetch().unmock()
  })

  test('should return if no product key & cover key available', async () => {
    const { result } = await renderHookWrapper(
      useFetchCoverProductActiveReportings,
      [{ coverKey: '', productKey: '' }]
    )

    expect(result.data).toEqual([])
  })
})
