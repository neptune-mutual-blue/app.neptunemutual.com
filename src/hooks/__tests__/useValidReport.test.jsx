import { mockGlobals } from '@/utils/unit-tests/mock-globals'
import { useValidReport } from '../useValidReport'
import { renderHookWrapper } from '@/utils/unit-tests/helpers'
import { mockHooksOrMethods } from '@/utils/unit-tests/mock-hooks-and-methods'

const mockProps = {
  start: '1658819063',
  end: '1664582399',
  coverKey:
    '0x6262382d65786368616e67650000000000000000000000000000000000000000',
  productKey:
    '0x0000000000000000000000000000000000000000000000000000000000000000'
}

const mockReturnData = {
  data: {
    incidentReports: [
      {
        id: '1'
      }
    ]
  }
}

describe('useValidReport', () => {
  const { mock, restore, mockFunction } = mockGlobals.console.error()

  mockHooksOrMethods.useNetwork()
  mockHooksOrMethods.getGraphURL()

  test('while fetching is not valid timestamp', async () => {
    const { result } = await renderHookWrapper(useValidReport, [
      {
        ...mockProps,
        start: '',
        end: ''
      }
    ])

    expect(result.data.report).toEqual(undefined)
    expect(result.loading).toBe(false)
  })

  test('while fetching is valid timestamp', async () => {
    mockGlobals.fetch(true, undefined, mockReturnData)

    const { result } = await renderHookWrapper(
      useValidReport,
      [mockProps],
      true
    )

    expect(result.data.report).toEqual({
      id: '1'
    })
    expect(result.loading).toBe(false)
  })

  test('while fetching error', async () => {
    mockGlobals.fetch(false)
    mock()

    const { result } = await renderHookWrapper(
      useValidReport,
      [mockProps],
      true
    )

    expect(result.data.report).toEqual(undefined)
    expect(result.loading).toBe(false)
    expect(mockFunction).toHaveBeenCalled()

    mockGlobals.fetch().unmock()
    restore()
  })
})
