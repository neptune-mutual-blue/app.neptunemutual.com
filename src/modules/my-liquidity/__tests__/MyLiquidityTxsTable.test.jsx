import {
  getBlockLink,
  getTxLink
} from '@/lib/connect-wallet/utils/explorer'
import {
  getColumns,
  MyLiquidityTxsTable
} from '@/modules/my-liquidity/MyLiquidityTxsTable'
import { convertFromUnits } from '@/utils/bn'
import { formatCurrency } from '@/utils/formatter/currency'
import { fromNow } from '@/utils/formatter/relative-time'
import { initiateTest } from '@/utils/unit-tests/helpers'
import { mockGlobals } from '@/utils/unit-tests/mock-globals'
import { mockHooksOrMethods } from '@/utils/unit-tests/mock-hooks-and-methods'
import { testData } from '@/utils/unit-tests/test-data'
import {
  fireEvent,
  screen
} from '@/utils/unit-tests/test-utils'

const initialMocks = () => {
  mockHooksOrMethods.usePagination()
  mockHooksOrMethods.useLiquidityTxs()
  mockHooksOrMethods.useNetwork()
  mockHooksOrMethods.useWeb3React()
  mockHooksOrMethods.useAppConstants()
  mockHooksOrMethods.useCoversAndProducts2()
}

describe('MyLiquidityTxsTable test', () => {
  const { initialRender, rerenderFn } = initiateTest(
    MyLiquidityTxsTable,
    {},
    initialMocks
  )

  beforeEach(() => {
    initialRender()
  })

  describe('Blocknumber', () => {
    test('should render blocknumber element if blocknumber data present', () => {
      const card = screen.getByTestId('block-number')
      expect(card).toBeInTheDocument()
    })

    test('correct blocknumber data should be displayed', () => {
      const card = screen.getByTestId('block-number')
      const blockNumber = card.querySelector('a').textContent
      expect(blockNumber).toBe(`#${testData.liquidityTxs.data.blockNumber}`)
    })

    test('should render correct block url', () => {
      const card = screen.getByTestId('block-number')
      const blockNumber = card.querySelector('a').getAttribute('href')
      expect(blockNumber).toBe(
        getBlockLink(
          testData.network.networkId,
          testData.liquidityTxs.data.blockNumber
        )
      )
    })

    test('should not render blocknumber element if blocknumber data not present', () => {
      rerenderFn({}, () => {
        mockHooksOrMethods.useLiquidityTxs(() => {
          return {
            ...testData.liquidityTxs,
            data: {
              ...testData.liquidityTxs.data,
              blockNumber: null
            }
          }
        })
      })
      const card = screen.queryByTestId('block-number')
      expect(card).not.toBeInTheDocument()
    })
  })

  describe('Table', () => {
    test('should render table head', () => {
      const card = screen.getByTestId('table-head')
      expect(card).toBeInTheDocument()
    })

    test('should render correct number of columns', () => {
      const card = screen.getByTestId('table-head')
      const renderedColumns = card.querySelectorAll('th')
      expect(renderedColumns.length).toBe(getColumns().length + 1)
    })

    test('should render the TBody component if account connected', () => {
      const tableWrapper = screen.getByTestId('app-table-body')
      expect(tableWrapper).toBeInTheDocument()
    })

    test('should render correct number of table rows', () => {
      const tableWrapper = screen.getByTestId('app-table-body')
      const tableRows = tableWrapper.querySelectorAll('tr')
      expect(tableRows.length).toBe(
        testData.liquidityTxs.data.transactions.length
      )
    })

    test('should render show more if its true', () => {
      rerenderFn({}, () => {
        mockHooksOrMethods.useLiquidityTxs({ ...testData.liquidityTxs, hasMore: true })
      })
      const showMore = screen.getByTestId('table-show-more')
      expect(showMore).toBeInTheDocument()
      fireEvent.click(showMore)
    })

    test('fire register token', () => {
      mockGlobals.location()
      const register = screen.getAllByTitle('Add to Metamask')
      fireEvent.click(register[0])
    })

    describe('Tx table data row', () => {
      test('should render correct transaction time in row', () => {
        const tableWrapper = screen.getByTestId('app-table-body')
        const row = tableWrapper.querySelectorAll('tr')[0]
        const renderedTime = row.querySelectorAll('td')[0].textContent
        expect(renderedTime).toBe(
          fromNow(
            testData.liquidityTxs.data.transactions[0].transaction.timestamp
          )
        )
      })

      test('should render correct tx details in row', () => {
        const tableWrapper = screen.getByTestId('app-table-body')
        const row = tableWrapper.querySelectorAll('tr')[0]
        const renderedDetails = row.querySelectorAll('td')[1].textContent

        const dataRow = testData.liquidityTxs.data.transactions[0]
        const expectedDetails = `${
          dataRow.type === 'PodsIssued' ? 'Added' : 'Removed'
        } ${
          formatCurrency(
            convertFromUnits(
              dataRow.liquidityAmount,
              testData.appConstants.liquidityTokenDecimals
            ),
            'en'
          ).short
        } ${dataRow.type === 'PodsIssued' ? 'to' : 'from'} ${
          testData.coversAndProducts2.data.supportsProducts
            ? testData.coversAndProducts2.data.productInfoDetails.productName
            : testData.coversAndProducts2.data.coverInfoDetails.coverName
        } Cover`
        expect(renderedDetails).toBe(expectedDetails)
      })

      test('should render correct pod amount in row', () => {
        const tableWrapper = screen.getByTestId('app-table-body')
        const row = tableWrapper.querySelectorAll('tr')[0]
        const renderedAmount = row.querySelector(
          'td:nth-child(3)>div>span'
        ).textContent

        const dataRow = testData.liquidityTxs.data.transactions[0]
        const expectedAmount = formatCurrency(
          convertFromUnits(dataRow.podAmount, dataRow.vault.tokenDecimals),
          'en',
          dataRow.vault.tokenSymbol,
          true
        ).short
        expect(renderedAmount).toBe(expectedAmount)

        const metamaskButtonTitle = row
          .querySelector('td:nth-child(3)>div>button')
          .getAttribute('title')
        expect(metamaskButtonTitle).toBe('Add to Metamask')
      })

      test("should have correct 'Open in Explorer' link in row", () => {
        const tableWrapper = screen.getByTestId('app-table-body')
        const row = tableWrapper.querySelectorAll('tr')[0]
        const explorerLink = row
          .querySelector('td:nth-child(4)>div>a')
          .getAttribute('href')

        const dataRow = testData.liquidityTxs.data.transactions[0]
        expect(explorerLink).toBe(
          getTxLink(testData.network.networkId, {
            hash: dataRow.transaction.id
          })
        )
      })
    })

    test('should render no account message if no account connected', () => {
      rerenderFn({}, () => {
        mockHooksOrMethods.useWeb3React(() => {
          return {
            account: null
          }
        })
      })
      const card = screen.getByTestId('no-account-message')
      const tableWrapper = screen.queryByTestId('app-table-body')

      expect(card).toBeInTheDocument()
      expect(tableWrapper).not.toBeInTheDocument()
    })
  })
})
