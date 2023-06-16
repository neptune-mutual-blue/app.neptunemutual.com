import { MyBondTxsTable } from '@/modules/pools/bond/MyBondTxsTable'
import { initiateTest } from '@/utils/unit-tests/helpers'
import { mockHooksOrMethods } from '@/utils/unit-tests/mock-hooks-and-methods'
import { testData } from '@/utils/unit-tests/test-data'
import {
  fireEvent,
  screen
} from '@/utils/unit-tests/test-utils'
import { i18n } from '@lingui/core'

describe('MyBondTxsTable test', () => {
  const { initialRender, rerenderFn } = initiateTest(MyBondTxsTable, {}, () => {
    mockHooksOrMethods.useWeb3React()
    mockHooksOrMethods.useBondTxs()
  })

  beforeEach(() => {
    i18n.activate('en')
    initialRender()
  })

  test('should render titles correctly in table', () => {
    const tableHeaders = screen.getAllByRole('columnheader')
    expect(tableHeaders.length).toBe(5)
  })

  test('should render rows according to txn length', () => {
    const rows = screen.getAllByRole('row')
    expect(rows.length).toBe(testData.bondTxs.data.transactions.length + 2)
  })

  test("should call register function on clicking 'Add toMetamask'", () => {
    const mockFun = jest.fn()

    rerenderFn({}, () => {
      mockHooksOrMethods.useRegisterToken({ register: mockFun })
    })

    const add = screen.getAllByTitle('Add to Metamask')
    fireEvent.click(add[0])
    expect(mockFun).toHaveBeenCalled()
  })

  test('should render Show More if the hook returned hasMore as true', () => {
    rerenderFn({}, () => {
      mockHooksOrMethods.useBondTxs({
        hasMore: true,
        data: testData.bondTxs.data,
        loading: false
      })
    })
    const hasMore = screen.getByTestId('table-show-more')
    expect(hasMore).toBeInTheDocument()
    fireEvent.click(hasMore)
  })
})
