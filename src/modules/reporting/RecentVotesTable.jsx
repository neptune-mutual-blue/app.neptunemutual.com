import { useRouter } from 'next/router'

import { LastSynced } from '@/common/LastSynced'
import { renderHeader } from '@/common/Table/renderHeader'
import {
  Table,
  TableShowMore,
  TableWrapper,
  TBody,
  THead
} from '@/common/Table/Table'
import OpenInNewIcon from '@/icons/OpenInNewIcon'
import { getTxLink } from '@/lib/connect-wallet/utils/explorer'
import DateLib from '@/lib/date/DateLib'
import { useAppConstants } from '@/src/context/AppConstants'
import { useNetwork } from '@/src/context/Network'
import { usePagination } from '@/src/hooks/usePagination'
import { useRecentVotes } from '@/src/hooks/useRecentVotes'
import { useSortData } from '@/src/hooks/useSortData'
import { convertFromUnits } from '@/utils/bn'
import { classNames } from '@/utils/classnames'
import { formatCurrency } from '@/utils/formatter/currency'
import { fromNow } from '@/utils/formatter/relative-time'
import { Trans } from '@lingui/macro'

const renderWhen = (row) => { return <WhenRenderer row={row} /> }

const renderAccount = (row) => {
  return (
    <td className='px-6 py-6 text-sm leading-5 text-01052D'>
      <span className='whitespace-nowrap'>{row.witness}</span>
    </td>
  )
}

const renderAmount = (row) => { return <AmountRenderer row={row} /> }

const renderActions = (row) => { return <ActionsRenderer row={row} /> }

export const getColumns = (sorts = {}, handleSort = () => {}) => {
  return [
    {
      name: 'when',
      renderTitle: <Trans>when</Trans>,
      align: 'left',
      renderHeader: (col) => { return renderHeader(col, 'transaction.timestamp', sorts, handleSort) },
      renderData: renderWhen
    },
    {
      name: 'Account',
      renderTitle: <Trans>Account</Trans>,
      align: 'left',
      renderHeader,
      renderData: renderAccount
    },
    {
      name: 'Weight',
      renderTitle: <Trans>Weight</Trans>,
      align: 'right',
      renderHeader,
      renderData: renderAmount
    },
    {
      name: '',
      renderTitle: '',
      align: 'right',
      renderHeader,
      renderData: renderActions
    }
  ]
}

export const RecentVotesTable = ({ coverKey, productKey, incidentDate }) => {
  const { page, limit, setPage } = usePagination()
  const { data, loading, hasMore } = useRecentVotes({
    coverKey,
    productKey,
    incidentDate,
    page,
    limit
  })

  const { transactions, blockNumber } = data
  const { networkId } = useNetwork()

  const { sorts, handleSort, sortedData } = useSortData({ data: transactions })

  const columns = getColumns(sorts, handleSort)

  return (
    <>
      <h3 className='mb-6 text-lg font-bold text-center mt-14 md:text-left'>
        <Trans>Recent Votes</Trans>
      </h3>

      <TableWrapper>
        <Table>
          <THead
            columns={columns}
            title={<LastSynced blockNumber={blockNumber} networkId={networkId} />}
          />
          <TBody
            isLoading={loading}
            columns={columns}
            data={sortedData}
          />
        </Table>
      </TableWrapper>

      <TableShowMore
        show={hasMore}
        loading={loading}
        onShowMore={() => {
          setPage((prev) => { return prev + 1 })
        }}
      />
    </>
  )
}

const WhenRenderer = ({ row }) => {
  const router = useRouter()

  return (
    <td
      className='max-w-xs px-6 py-6 text-sm leading-5 w-max whitespace-nowrap text-01052D'
      title={DateLib.toLongDateFormat(row.transaction.timestamp, router.locale)}
    >
      {fromNow(row.transaction.timestamp)}
    </td>
  )
}

const AmountRenderer = ({ row }) => {
  const router = useRouter()
  const { NPMTokenSymbol } = useAppConstants()

  return (
    <td className='max-w-sm px-6 py-6'>
      <div className='flex items-center justify-end whitespace-nowrap'>
        <div
          className={classNames(
            'w-4 h-4 mr-4 rounded',
            row.voteType === 'Attested' ? 'bg-21AD8C' : 'bg-FA5C2F'
          )}
        />
        <div
          className='text-sm leading-6 text-right text-01052D'
          title={
            formatCurrency(
              convertFromUnits(row.stake),
              router.locale,
              NPMTokenSymbol,
              true
            ).long
          }
        >
          {
            formatCurrency(
              convertFromUnits(row.stake),
              router.locale,
              NPMTokenSymbol,
              true
            ).short
          }
        </div>
      </div>
    </td>
  )
}

const ActionsRenderer = ({ row }) => {
  const { networkId } = useNetwork()

  return (
    <td className='px-6 py-6 min-w-60'>
      <div className='flex items-center justify-end'>
        <a
          href={getTxLink(networkId, { hash: row.transaction.id })}
          target='_blank'
          rel='noreferrer noopener nofollow'
          className='p-1 text-black'
          title='Open in explorer'
        >
          <span className='sr-only'>Open in explorer</span>
          <OpenInNewIcon className='w-4 h-4' />
        </a>
      </div>
    </td>
  )
}
