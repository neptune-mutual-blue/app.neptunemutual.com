import { mockGlobals } from '@/utils/unit-tests/mock-globals'
import { useCoverActiveReportings } from '../useCoverActiveReportings'
import { renderHookWrapper } from '@/utils/unit-tests/helpers'
import { mockHooksOrMethods } from '@/utils/unit-tests/mock-hooks-and-methods'

const mockProps = {
  coverKey:
    '0x7072696d65000000000000000000000000000000000000000000000000000000'
}

const mockResolvedData = {
  data: {
    incidentReports: [
      {
        id: '0x6465666900000000000000000000000000000000000000000000000000000000-0x31696e6368000000000000000000000000000000000000000000000000000000-1661159947',
        incidentDate: '1661159947',
        productKey:
          '0x31696e6368000000000000000000000000000000000000000000000000000000',
        status: 'Reporting'
      }
    ]
  }
}

const mockReturnData = {
  data: [
    {
      id: '0x6465666900000000000000000000000000000000000000000000000000000000-0x31696e6368000000000000000000000000000000000000000000000000000000-1661159947',
      incidentDate: '1661159947',
      productKey:
        '0x31696e6368000000000000000000000000000000000000000000000000000000',
      status: 'Reporting'
    }
  ]
}

describe('useCoverActiveReportings', () => {
  const { mock, restore, mockFunction } = mockGlobals.console.error()

  mockHooksOrMethods.getNetworkId()
  mockHooksOrMethods.getGraphURL()

  test('while fetching successfully', async () => {
    mockGlobals.fetch(true, undefined, mockResolvedData)

    const { result } = await renderHookWrapper(
      useCoverActiveReportings,
      [mockProps],
      true
    )

    expect(result.data).toEqual(mockReturnData.data)
    expect(result.loading).toBe(false)
  })

  test('when fetched error', async () => {
    mockGlobals.fetch(false)
    mock()

    const { result } = await renderHookWrapper(
      useCoverActiveReportings,
      [mockProps],
      true
    )

    expect(result.data).toEqual([])
    expect(result.loading).toBe(false)
    expect(mockFunction).toHaveBeenCalled()

    mockGlobals.fetch().unmock()
    restore()
  })
})
