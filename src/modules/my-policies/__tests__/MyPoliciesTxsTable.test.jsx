import React from 'react'

import {
  getBlockLink,
  getTxLink
} from '@/lib/connect-wallet/utils/explorer'
import DateLib from '@/lib/date/DateLib'
import {
  MyPoliciesTxsTable, getColumns
} from '@/modules/my-policies/MyPoliciesTxsTable'
import { getCoverImgSrc } from '@/src/helpers/cover'
import { convertFromUnits } from '@/utils/bn'
import { formatCurrency } from '@/utils/formatter/currency'
import { fromNow } from '@/utils/formatter/relative-time'
import { mockHooksOrMethods } from '@/utils/unit-tests/mock-hooks-and-methods'
import { testData } from '@/utils/unit-tests/test-data'
import {
  cleanup,
  fireEvent,
  render,
  screen
} from '@/utils/unit-tests/test-utils'
import { i18n } from '@lingui/core'

describe('MyPoliciesTxsTable test', () => {
  mockHooksOrMethods.usePagination()
  mockHooksOrMethods.usePolicyTxs()
  mockHooksOrMethods.useNetwork()
  mockHooksOrMethods.useWeb3React()
  mockHooksOrMethods.useAppConstants()
  mockHooksOrMethods.useRegisterToken()
  mockHooksOrMethods.useCoversAndProducts2()

  beforeEach(() => {
    cleanup()
    i18n.activate('en')
    render(<MyPoliciesTxsTable />)
  })

  describe('Block number', () => {
    test('should render block number element if blockNumber is available', () => {
      const blockP = screen.getByTestId('block-number')
      expect(blockP).toBeInTheDocument()
    })

    test('should render correct block number text', () => {
      const blockA = screen.getByTestId('block-number').querySelector('a')
      expect(blockA).toHaveTextContent(
        '#' + testData.policies.data.blockNumber
      )
    })

    test('should render correct block href link', () => {
      const blockA = screen.getByTestId('block-number').querySelector('a')

      const href = getBlockLink(
        testData.network.networkId,
        testData.policies.data.blockNumber
      )
      expect(blockA).toHaveAttribute('href', href)
    })

    test('should not render block number element if blockNumber is not available', () => {
      cleanup()
      mockHooksOrMethods.usePolicyTxs(() => {
        return {
          ...testData.policies,
          data: {
            ...testData.policies.data,
            blockNumber: null
          }
        }
      })

      i18n.activate('en')
      render(<MyPoliciesTxsTable />)

      const blockP = screen.queryByTestId('block-number')
      expect(blockP).not.toBeInTheDocument()
    })
  })

  test('should render table wrapper', () => {
    const tableWrapper = screen.getByTestId('policy-txs-table-wrapper')
    expect(tableWrapper).toBeInTheDocument()
  })

  describe('Table Head', () => {
    const columns = getColumns()
    test('should render correct number of th elements', () => {
      const ths = screen
        .getByTestId('policy-txs-table-header')
        .querySelectorAll('tr:nth-child(2) > th')
      expect(ths.length).toBe(columns.length)
    })

    test('should render correct table header text', () => {
      const ths = screen
        .getByTestId('policy-txs-table-header')
        .querySelectorAll('tr:nth-child(2) > th')
      expect(ths[0].textContent).toBe(columns[0].name)
      expect(ths[1].textContent).toBe(columns[1].name)
      expect(ths[2].textContent).toBe(columns[2].name)
    })
  })

  test('should render the connect wallet td if account is not available', () => {
    cleanup()
    mockHooksOrMethods.useWeb3React({
      account: null
    })

    i18n.activate('en')
    render(<MyPoliciesTxsTable />)

    const tbody = screen.getByTestId('connect-wallet-tbody')
    expect(tbody).toBeInTheDocument()
    expect(tbody.querySelector('tr>td')).toHaveTextContent(
      'Please connect your wallet'
    )
  })

  describe('Table Row Data', () => {
    describe("Col 1: 'WHEN'", () => {
      test('should render correct transaction time in table row', () => {
        cleanup()
        i18n.activate('en')

        mockHooksOrMethods.useNetwork()
        mockHooksOrMethods.useWeb3React()
        mockHooksOrMethods.usePolicyTxs()

        render(<MyPoliciesTxsTable />)

        const td = screen.getAllByTestId('timestamp-col')[0]
        expect(td.textContent).toBe(
          fromNow(testData.policies.data.transactions[0].transaction.timestamp)
        )
      })

      test('should render correct transaction time in td title', () => {
        const td = screen.getAllByTestId('timestamp-col')[0]
        expect(td.title).toBe(
          DateLib.toLongDateFormat(
            testData.policies.data.transactions[0].transaction.timestamp,
            'en'
          )
        )
      })
    })

    describe("Col 2: 'DETAILS'", () => {
      const columns = getColumns()
      test('should not render details item if no coverInfo', () => {
        cleanup()
        i18n.activate('en')

        render(<MyPoliciesTxsTable />)

        const tbody = screen.queryByTestId('app-table-body')
        const tds = tbody.querySelectorAll('tr')[0].querySelectorAll('td')
        expect(tds.length).toBe(columns.length)
      })

      test('should render correct details in the row', () => {
        cleanup()
        i18n.activate('en')
        mockHooksOrMethods.useNetwork()
        mockHooksOrMethods.useWeb3React()
        mockHooksOrMethods.usePolicyTxs()
        mockHooksOrMethods.useAppConstants()
        mockHooksOrMethods.useCoversAndProducts2()

        render(<MyPoliciesTxsTable />)

        const td = screen.getAllByTestId('details-col')[0]
        expect(td).toBeInTheDocument()
      })

      test('should render correct image in details row', () => {
        const td = screen.getAllByTestId('details-col')[0]
        const img = td.querySelector('img')
        const src = getCoverImgSrc({
          key: testData.policies.data.transactions[0].cover.id
        })
        expect(img).toHaveAttribute('src', src)
      })

      test("should have `Purchased` in details if type if 'Purchased'", () => {
        const td = screen.getAllByTestId('details-col')[0]
        const span = td.querySelector('span')
        expect(span).toHaveTextContent('Purchased')
      })

      test("should have `Claimed` in details if type if not 'Purchased'", () => {
        const td = screen.getAllByTestId('details-col')[1]
        const span = td.querySelector('span')
        expect(span).toHaveTextContent('Claimed')
      })

      test('should have correct currency details', () => {
        const span = screen
          .getAllByTestId('details-col')[0]
          .querySelector('span')
        const text = formatCurrency(
          convertFromUnits(testData.policies.data.transactions[0].stablecoinAmount),
          'en'
        ).short
        expect(span).toHaveTextContent(text)
      })

      test('should have correct currency details in `title` attribute', () => {
        const span = screen
          .getAllByTestId('details-col')[0]
          .querySelector('span > span')
        const text = formatCurrency(
          convertFromUnits(
            testData.policies.data.transactions[0].stablecoinAmount,
            testData.appConstants.liquidityTokenDecimals
          ),
          'en'
        ).long

        expect(span).toHaveAttribute('title', text)
      })

      test('should show correct project name in details', () => {
        const span = screen
          .getAllByTestId('details-col')[0]
          .querySelector('span')

        expect(span).toHaveTextContent(testData.coversAndProducts2.data.coverInfoDetails.coverName)
      })
    })

    describe("Col 3: 'AMOUNT'", () => {
      test('span element should have class based on transaction type', () => {
        const spanPurchased = screen
          .getAllByTestId('col-amount')[0]
          .querySelector('span')
        expect(spanPurchased).toHaveClass('text-01052D')

        const spanClaimed = screen
          .getAllByTestId('col-amount')[1]
          .querySelector('span')
        expect(spanClaimed).toHaveClass('text-FA5C2F')
      })

      test('span element correct amount text content', () => {
        const span = screen
          .getAllByTestId('col-amount')[0]
          .querySelector('span')

        const text = formatCurrency(
          convertFromUnits(
            testData.policies.data.transactions[0].cxTokenAmount,
            testData.appConstants.liquidityTokenDecimals
          ),
          'en',
          testData.policies.data.transactions[0].cxToken.tokenSymbol,
          true
        ).short

        expect(span).toHaveTextContent(text)
      })

      test('span element correct amount title content', () => {
        const span = screen
          .getAllByTestId('col-amount')[0]
          .querySelector('span')

        const text = formatCurrency(
          convertFromUnits(
            testData.policies.data.transactions[0].cxTokenAmount,
            testData.appConstants.liquidityTokenDecimals
          ),
          'en',
          testData.policies.data.transactions[0].cxToken.tokenSymbol,
          true
        ).long
        expect(span.title).toBe(text)
      })

      test('should have add button', () => {
        const btn = screen
          .getAllByTestId('col-amount')[0]
          .querySelector('button')
        expect(btn).toBeInTheDocument()
      })

      test('simulate click on add button', () => {
        cleanup()
        i18n.activate('en')
        mockHooksOrMethods.useNetwork()
        mockHooksOrMethods.useWeb3React()
        mockHooksOrMethods.usePolicyTxs()
        mockHooksOrMethods.useAppConstants()
        mockHooksOrMethods.useCoversAndProducts2()
        const clickFn = jest.fn()
        mockHooksOrMethods.useRegisterToken(() => { return { register: clickFn } })

        render(<MyPoliciesTxsTable />)

        const btn = screen
          .getAllByTestId('col-amount')[0]
          .querySelector('button')
        fireEvent.click(btn)
        expect(clickFn).toHaveBeenCalled()
      })
    })

    describe("Col 4: 'Actions'", () => {
      test("should render the 'Open in explorer' link", () => {
        const link = screen.getAllByTestId('col-actions')[1].querySelector('a')
        expect(link).toBeInTheDocument()
        expect(link).toHaveTextContent('Open in explorer')
      })

      test('link should have correct href', () => {
        const link = screen.getAllByTestId('col-actions')[1].querySelector('a')
        const href = getTxLink(testData.network.networkId, {
          hash: testData.policies.data.transactions[1].transaction.id
        })
        expect(link).toHaveAttribute('href', href)
      })
    })
  })
})
