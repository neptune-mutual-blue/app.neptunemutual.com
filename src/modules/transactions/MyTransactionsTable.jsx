import {
  useEffect,
  useState
} from 'react'

import { renderHeader } from '@/common/Table/renderHeader'
import {
  Table,
  TableShowMore,
  TableWrapper,
  TBody,
  THead
} from '@/common/Table/Table'
import { convertToIconVariant } from '@/common/TransactionList'
import OpenInNewIcon from '@/icons/OpenInNewIcon'
import { getTxLink } from '@/lib/connect-wallet/utils/explorer'
import DateLib from '@/lib/date/DateLib'
import { useNetwork } from '@/src/context/Network'
import { useActionMessage } from '@/src/helpers/notification'
import { useSortData } from '@/src/hooks/useSortData'
import { useLanguageContext } from '@/src/i18n/i18n'
import { LSHistory } from '@/src/services/transactions/history'
import {
  TransactionHistory
} from '@/src/services/transactions/transaction-history'
import { fromNow } from '@/utils/formatter/relative-time'
import {
  t,
  Trans
} from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { useWeb3React } from '@web3-react/core'

const renderWhen = (row) => { return <WhenRenderer row={row} /> }
const renderDetails = (row) => { return <DetailsRenderer row={row} /> }
const renderAmount = (row) => { return <AmountRenderer row={row} /> }
const renderActions = (row) => { return <ActionsRenderer row={row} /> }

/**
 * Returns an array of column objects for the table.
 * Each object represents a column and contains properties such as id, name, alignment, and render functions.
 *
 * @param {import('@lingui/core').I18n} i18n - The I18n instance from Lingui library.
 * @param {Object} sorts - An object representing the current sort settings.
 * @param {Function} handleSort - A function to handle sorting events.
 * @returns {Array<{id: string, name: string, align: string, renderHeader: Function, renderData: (row: any, extraData: any, index: number) => React.JSX.Element}>} An array of column objects.
 */
export const getColumns = (i18n, sorts = {}, handleSort = () => {}) => {
  return [
    {
      id: 'when',
      name: t(i18n)`when`,
      align: 'left',
      renderHeader: (col) => { return renderHeader(col, 'timestamp', sorts, handleSort) },
      renderData: renderWhen
    },
    {
      id: 'details',
      name: t(i18n)`details`,
      align: 'left',
      renderHeader,
      renderData: renderDetails
    },
    {
      id: 'amount',
      name: t(i18n)`amount`,
      align: 'right',
      renderHeader,
      renderData: renderAmount
    },
    {
      id: 'actions',
      name: '',
      align: 'right',
      renderHeader,
      renderData: renderActions
    }
  ]
}

export const MyTransactionsTable = () => {
  const [
    /**
     * @type {import('@/src/services/transactions/history').IHistoryEntry[]}
     */
    listOfTransactions,
    /**
     * @type {(state: import('@/src/services/transactions/history').IHistoryEntry[]) => void}
     */
    setListOfTransactions
  ] = useState([])
  const [page, setPage] = useState(1)
  const [maxPage, setMaxPage] = useState(1)

  const { account } = useWeb3React()
  const { networkId } = useNetwork()

  const { sorts, handleSort, sortedData } = useSortData({ data: listOfTransactions })

  const { i18n } = useLingui()

  const columns = getColumns(i18n, sorts, handleSort)

  useEffect(() => {
    if (!networkId || !account) {
      return
    }

    LSHistory.setId(account, networkId)

    const updateListener = TransactionHistory.on((item) => {
      setListOfTransactions((items) => {
        return items.map((_item) => {
          if (_item.hash === item.hash) {
            Object.assign(_item, item)
          }

          return _item
        })
      }
      )
    })

    getNextPage(1)

    return () => {
      updateListener.off()
    }
  }, [account, networkId])

  const getNextPage = (page) => {
    const history = LSHistory.get(page)

    setListOfTransactions((current) => {
      const hashes = current.map(({ hash }) => { return hash })

      return [
        ...current,
        ...history.data.filter((item) => { return !hashes.includes(item.hash) })
      ]
    })

    setPage(page)
    setMaxPage(history.maxPage)
  }

  return (
    <>
      <TableWrapper data-testid='policy-txs-table-wrapper'>
        <Table>
          <THead
            columns={columns}
            data-testid='policy-txs-table-header'
          />
          {account
            ? (
              <TBody
                columns={columns}
                data={sortedData}
              />
              )
            : (
              <tbody data-testid='connect-wallet-tbody'>
                <tr className='w-full text-center'>
                  <td className='p-6' colSpan={columns.length}>
                    <Trans>Please connect your wallet...</Trans>
                  </td>
                </tr>
              </tbody>
              )}
        </Table>
      </TableWrapper>

      <TableShowMore
        show={page < maxPage}
        onShowMore={() => {
          if (page < maxPage) {
            getNextPage(page + 1)
          }
        }}
      />
    </>
  )
}

const WhenRenderer = ({ row }) => {
  const { locale } = useLanguageContext()

  return (
    <td
      className='px-6 py-6 text-sm leading-5 w-52 whitespace-nowrap text-01052D'
      title={DateLib.toLongDateFormat(row.timestamp / 1000, locale)}
      data-testid='timestamp-col'
    >
      {fromNow(row.timestamp / 1000)}
    </td>
  )
}

const DetailsRenderer = ({ row }) => {
  const { locale } = useLanguageContext()

  const { getActionMessage } = useActionMessage()

  const { title } = getActionMessage(
    row.methodName,
    row.status,
    row.data,
    locale
  )

  return (
    <td className='w-auto px-6 py-6 text-sm leading-5 text-01052D' data-testid='details-col'>
      <div className='flex items-center gap-5'>
        <div>{convertToIconVariant(row.status)}</div>
        <p>{title}</p>
      </div>
    </td>
  )
}

const AmountRenderer = ({ row }) => {
  const { locale } = useLanguageContext()
  const { getActionMessage } = useActionMessage()

  const { description } = getActionMessage(
    row.methodName,
    row.status,
    row.data,
    locale
  )

  return (
    <td className='max-w-sm px-6 py-6 text-sm leading-6 text-right min-w-120 text-01052D' data-testid='col-amount'>
      <p>{description}</p>
    </td>
  )
}

const ActionsRenderer = ({ row }) => {
  const { networkId } = useNetwork()

  const handleLinkClick = () => {
    if (!row.hash) { return }
    TransactionHistory.updateProperty(row.hash, 'read', true)
  }

  return (
    <td className='w-48 px-6 py-6' data-testid='col-actions'>
      <div className='flex items-center justify-center gap-6'>
        <a
          href={getTxLink(networkId, { hash: row.hash })}
          target='_blank'
          rel='noreferrer noopener nofollow'
          className='p-1 text-01052D'
          title='Open in explorer'
          onClick={handleLinkClick}
        >
          <span className='sr-only'>Open transaction in explorer</span>
          <OpenInNewIcon className='w-4 h-4' />
        </a>
      </div>
    </td>
  )
}
