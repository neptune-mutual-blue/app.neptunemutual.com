import { i18n } from '@lingui/core'
import { fireEvent, screen } from '@/utils/unit-tests/test-utils'
import { initiateTest, mockFn } from '@/utils/unit-tests/test-mockup-fn'
import { MyBondTxsTable } from '@/modules/pools/bond/MyBondTxsTable'
import { testData } from '@/utils/unit-tests/test-data'

describe('MyBondTxsTable test', () => {
  const { initialRender, rerenderFn } = initiateTest(MyBondTxsTable)

  beforeEach(() => {
    i18n.activate('en')
    initialRender()
    mockFn.useWeb3React()
    mockFn.useBondTxs()
  })

  test('should render titles correctly in table', () => {
    const tableHeaders = screen.getAllByRole('columnheader')
    expect(tableHeaders.length).toBe(4)
  })

  test('should render rows according to txn length', () => {
    const rows = screen.getAllByRole('row')
    expect(rows.length).toBe(testData.bondTxs.data.transactions.length + 1)
  })

  test("should call register function on clicking 'Add toMetamask'", () => {
    const add = screen.getAllByTitle('Add to Metamask')
    fireEvent.click(add[0])
  })

  test('should render Show More if the hook returned hasMore as true', () => {
    rerenderFn({}, () => {
      mockFn.useBondTxs({
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
