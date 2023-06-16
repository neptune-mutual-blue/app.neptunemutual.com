import {
  useEffect,
  useState
} from 'react'

import { useRouter } from 'next/router'

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
import { getActionMessage } from '@/src/helpers/notification'
import { LSHistory } from '@/src/services/transactions/history'
import {
  TransactionHistory
} from '@/src/services/transactions/transaction-history'
import { fromNow } from '@/utils/formatter/relative-time'
import {
  t,
  Trans
} from '@lingui/macro'
import { useWeb3React } from '@web3-react/core'
import { renderHeader } from '@/common/Table/renderHeader'
import { useSortData } from '@/src/hooks/useSortData'

const renderWhen = (row) => { return <WhenRenderer row={row} /> }
const renderDetails = (row) => { return <DetailsRenderer row={row} /> }
const renderAmount = (row) => { return <AmountRenderer row={row} /> }
const renderActions = (row) => { return <ActionsRenderer row={row} /> }

export const getColumns = (sorts = {}, handleSort = () => {}) => {
  return [
    {
      name: t`when`,
      align: 'left',
      renderHeader: (col) => { return renderHeader(col, 'timestamp', sorts, handleSort) },
      renderData: renderWhen
    },
    {
      name: t`details`,
      align: 'left',
      renderHeader,
      renderData: renderDetails
    },
    {
      name: t`amount`,
      align: 'right',
      renderHeader,
      renderData: renderAmount
    },
    {
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

  const columns = getColumns(sorts, handleSort)

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
        {
          (page < maxPage) && (
            <TableShowMore
              onShowMore={() => {
                if (page < maxPage) {
                  getNextPage(page + 1)
                }
              }}
            />
          )
        }
      </TableWrapper>
    </>
  )
}

const WhenRenderer = ({ row }) => {
  const router = useRouter()

  return (
    <td
      className='px-6 py-6 text-sm leading-5 w-52 whitespace-nowrap text-01052D'
      title={DateLib.toLongDateFormat(row.timestamp / 1000, router.locale)}
      data-testid='timestamp-col'
    >
      {fromNow(row.timestamp / 1000)}
    </td>
  )
}

const DetailsRenderer = ({ row }) => {
  const { locale } = useRouter()

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
  const { locale } = useRouter()

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
