import { convertToIconVariant } from '@/common/TransactionList'
import OpenInNewIcon from '@/icons/OpenInNewIcon'
import { getTxLink } from '@/lib/connect-wallet/utils/explorer'
import DateLib from '@/lib/date/DateLib'
import { useNetwork } from '@/src/context/Network'
import { getActionMessage } from '@/src/helpers/notification'
import { LSHistory } from '@/src/services/transactions/history'
import { TransactionHistory } from '@/src/services/transactions/transaction-history'
import { classNames } from '@/utils/classnames'
import { fromNow } from '@/utils/formatter/relative-time'
import { useWeb3React } from '@web3-react/core'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

const { TableWrapper, Table, THead, TBody, TableShowMore } = require('@/common/Table/Table')
const { t, Trans } = require('@lingui/macro')

const renderHeader = (col) => (
  <th
    scope='col'
    className={classNames(
      'px-6 py-6 font-bold text-sm uppercase whitespace-nowrap',
      col.align === 'right' ? 'text-right' : 'text-left'
    )}
  >
    {col.name}
  </th>
)

const renderWhen = (row) => <WhenRenderer row={row} />
const renderDetails = (row) => <DetailsRenderer row={row} />
const renderAmount = (row) => <AmountRenderer row={row} />
const renderActions = (row) => <ActionsRenderer row={row} />

const columns = [
  {
    name: t`when`,
    align: 'left',
    renderHeader,
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

const MyTransactionsTable = () => {
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

  useEffect(() => {
    if (account && networkId) LSHistory.setId(account, networkId)
    const history = LSHistory.get(page)
    setListOfTransactions((current) => {
      const hashes = current.map(({ hash }) => hash)

      return [
        ...current,
        ...history.data.filter((item) => !hashes.includes(item.hash))
      ]
    })
    setMaxPage(history.maxPage)

    const updateListener = TransactionHistory.on((item) => {
      setListOfTransactions((items) =>
        items.map((_item) => {
          if (_item.hash === item.hash) {
            Object.assign(_item, item)
          }

          return _item
        })
      )
    })

    return () => {
      updateListener.off()
    }
  }, [page, account, networkId])

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
                // isLoading={false}
                columns={columns}
                data={listOfTransactions}
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
              // isLoading={loading}
              onShowMore={() => {
                if (page < maxPage) {
                  setPage((curPage) => curPage + 1)
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
      className='max-w-xs px-6 py-6 whitespace-nowrap'
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
    <td className='max-w-sm px-6 py-6' data-testid='details-col'>
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
    <td className='max-w-sm px-6 py-6 text-right' data-testid='col-amount'>
      <p>{description}</p>
    </td>
  )
}

const ActionsRenderer = ({ row }) => {
  const { networkId } = useNetwork()

  return (
    <td className='px-6 py-6 min-w-120' data-testid='col-actions'>
      <div className='flex items-center justify-end'>
        <a
          href={getTxLink(networkId, { hash: row.hash })}
          target='_blank'
          rel='noreferrer noopener nofollow'
          className='p-1 text-black'
          title='Open in explorer'
        >
          <span className='sr-only'>Open transaction in explorer</span>
          <OpenInNewIcon className='w-4 h-4' />
        </a>
      </div>
    </td>
  )
}

export { MyTransactionsTable }
