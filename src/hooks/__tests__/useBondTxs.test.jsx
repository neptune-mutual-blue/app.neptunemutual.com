import { mockGlobals } from '@/utils/unit-tests/mock-globals'
import { useBondTxs } from '../useBondTxs'
import { renderHookWrapper } from '@/utils/unit-tests/helpers'
import { mockHooksOrMethods } from '@/utils/unit-tests/mock-hooks-and-methods'

const mockProps = {
  page: 1,
  limit: 50
}

const mockResolvedData = {
  data: {
    _meta: {
      block: {
        number: 10
      }
    },
    bondTransactions: [{ id: '12312sa312' }]
  }
}

const mockReturnData = {
  data: {
    blockNumber: 10,
    transactions: [{ id: '12312sa312' }],
    totalCount: 1
  }
}

describe('useBondTxs', () => {
  const { mock, restore, mockFunction } = mockGlobals.console.error()

  test('while fetching data w/o account', async () => {
    mockHooksOrMethods.useWeb3React(() => { return { account: null } })
    mockHooksOrMethods.useNetwork()

    const { result } = await renderHookWrapper(useBondTxs, [mockProps])

    expect(result.data).toEqual({
      blockNumber: null,
      transactions: [],
      totalCount: 0
    })
    expect(result.loading).toBe(false)
    expect(result.hasMore).toBe(true)
  })

  test('while fetching data with account and successfully', async () => {
    mockHooksOrMethods.useWeb3React()
    mockHooksOrMethods.useNetwork()
    mockHooksOrMethods.getGraphURL()
    mockGlobals.fetch(true, undefined, mockResolvedData)

    const { result } = await renderHookWrapper(useBondTxs, [mockProps], true)

    expect(result.data).toEqual(mockReturnData.data)
  })

  test('while fetching data with account and error', async () => {
    mockGlobals.fetch(false)
    mock()

    const { result } = await renderHookWrapper(useBondTxs, [mockProps], true)

    expect(result.data).toEqual({
      blockNumber: null,
      transactions: [],
      totalCount: 0
    })
    expect(mockFunction).toHaveBeenCalled()

    mockGlobals.fetch().unmock()
    restore()
  })
})
