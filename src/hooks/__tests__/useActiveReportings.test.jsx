import { mockGlobals } from '@/utils/unit-tests/mock-globals'
import { useActiveReportings } from '../useActiveReportings'
import { renderHookWrapper } from '@/utils/unit-tests/helpers'
import { mockHooksOrMethods } from '@/utils/unit-tests/mock-hooks-and-methods'

const mockReturnData = {
  data: {
    incidentReports: [
      {
        id: 'x09319hdakn12313'
      }
    ]
  }
}

describe('useActiveReportings', () => {
  const { mock, restore, mockFunction } = mockGlobals.console.error()

  mockHooksOrMethods.useNetwork()
  mockHooksOrMethods.getGraphURL()

  test('while fetching successful', async () => {
    mockGlobals.fetch(true, undefined, mockReturnData)

    const { result } = await renderHookWrapper(useActiveReportings, [], true)

    expect(result.data.incidentReports).toEqual([
      ...mockReturnData.data.incidentReports
    ])
    expect(result.handleShowMore).toEqual(expect.any(Function))
    expect(result.loading).toBe(false)
    expect(result.hasMore).toBe(false)
  })

  test('while fetching error', async () => {
    mockGlobals.fetch(false)
    mock()

    const { result } = await renderHookWrapper(useActiveReportings, [], true)

    expect(result.data.incidentReports).toEqual([])
    expect(result.handleShowMore).toEqual(expect.any(Function))
    expect(result.loading).toBe(false)
    expect(result.hasMore).toBe(true)
    expect(mockFunction).toHaveBeenCalled()

    mockGlobals.fetch().unmock()
    restore()
  })

  test('calling handleShowMore function', async () => {
    mockGlobals.fetch(true, undefined, mockReturnData)

    const { result, act } = await renderHookWrapper(
      useActiveReportings,
      [],
      true
    )

    await act(async () => {
      await result.handleShowMore()
    })

    expect(result.data.incidentReports).toEqual([
      ...mockReturnData.data.incidentReports
    ])
  })
})
