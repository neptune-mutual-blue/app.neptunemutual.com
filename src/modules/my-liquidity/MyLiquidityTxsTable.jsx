import * as Tooltip from '@radix-ui/react-tooltip'
import { useLiquidityTxs } from '@/src/hooks/useLiquidityTxs'
import {
  Table,
  TableShowMore,
  TableWrapper,
  TBody,
  THead
} from '@/common/Table/Table'
import AddCircleIcon from '@/icons/AddCircleIcon'
import ClockIcon from '@/icons/ClockIcon'
import OpenInNewIcon from '@/icons/OpenInNewIcon'
import { useRegisterToken } from '@/src/hooks/useRegisterToken'
import { convertFromUnits } from '@/utils/bn'
import { classNames } from '@/utils/classnames'
import { useWeb3React } from '@web3-react/core'
import { getBlockLink, getTxLink } from '@/lib/connect-wallet/utils/explorer'
import { fromNow } from '@/utils/formatter/relative-time'
import DateLib from '@/lib/date/DateLib'
import { formatCurrency } from '@/utils/formatter/currency'
import { useNetwork } from '@/src/context/Network'
import { t, Trans } from '@lingui/macro'
import { useRouter } from 'next/router'
import { usePagination } from '@/src/hooks/usePagination'
import { useAppConstants } from '@/src/context/AppConstants'
import { useCoverOrProductData } from '@/src/hooks/useCoverOrProductData'
import { safeFormatBytes32String } from '@/utils/formatter/bytes32String'
import { useEffect, useState } from 'react'
import { CoverAvatar } from '@/common/CoverAvatar'
import { TokenAmountSpan } from '@/common/TokenAmountSpan'
import DownArrow from '@/icons/DownArrow'
import { sortDataByKey } from '@/utils/sorting'

const renderHeader = (col, sortKey, sorts, handleSort) => (
  <th
    scope='col'
    className={classNames(
      'px-6 py-3 font-semibold text-xs leading-4.5 uppercase whitespace-nowrap text-404040',
      col.align === 'right' ? 'text-right' : 'text-left'
    )}
  >
    {
      sortKey
        ? (
          <button
            className={classNames(
              'flex gap-1 w-max cursor-pointer',
              col.align === 'right' ? 'ml-auto' : 'mr-auto'
            )}
            onClick={handleSort ? () => handleSort(col.name, sortKey) : () => {}}
          >
            <span
              className='font-semibold text-xs leading-4.5 uppercase whitespace-nowrap'
            >
              {col.name}
            </span>
            <DownArrow className={classNames(
              'transform',
              sorts[col.name] && (sorts[col.name].type === 'asc' ? 'rotate-180' : 'rotate-0')
            )}
            />
          </button>
          )
        : (
          <>
            {col.name}
          </>
          )
    }
  </th>
)

const renderWhen = (row) => <WhenRenderer row={row} />

const renderDetails = (row) => <DetailsRenderer row={row} />

const renderAmount = (row) => <PodAmountRenderer row={row} />

const renderActions = (row) => <ActionsRenderer row={row} />

export const getColumns = (sorts = {}, handleSort = () => {}) => [
  {
    name: t`when`,
    align: 'left',
    renderHeader: (col) => renderHeader(col, 'transaction.timestamp', sorts, handleSort),
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

const Title = ({ blockNumber, networkId }) => (
  <>
    {blockNumber && (
      <p
        className='font-semibold w-max text-h5 text-1D2939'
        data-testid='block-number'
      >
        <Trans>Last Synced:</Trans>{' '}
        <a
          href={getBlockLink(networkId, blockNumber)}
          target='_blank'
          rel='noreferrer noopener nofollow'
          className='pl-1 text-4e7dd9'
        >
          #{blockNumber}
        </a>
      </p>
    )}
  </>
)

export const MyLiquidityTxsTable = () => {
  const { page, limit, setPage } = usePagination()
  const { data, loading, hasMore } = useLiquidityTxs({
    page,
    limit
  })
  const [sorts, setSorts] = useState({})

  const { networkId } = useNetwork()
  const { account } = useWeb3React()

  const { blockNumber, transactions } = data
  const [sortedData, setSortedData] = useState(transactions)

  useEffect(() => {
    setSortedData(transactions)
  }, [transactions])

  const handleSort = (colName, sortKey) => {
    const _sorts = {
      ...sorts,
      [colName]: !sorts[colName]
        ? { type: 'asc', key: sortKey }
        : {
            ...sorts[colName],
            type: sorts[colName].type === 'asc' ? 'desc' : 'asc'
          }
    }
    setSorts(_sorts)

    const _sortedData = sortDataByKey(transactions, sortKey, _sorts[colName].type)
    setSortedData([..._sortedData])
  }

  const columns = getColumns(sorts, handleSort)
  return (
    <>
      <TableWrapper data-testid='table-wrapper'>
        <Table>
          <THead
            columns={columns}
            data-testid='table-head'
            title={<Title blockNumber={blockNumber} networkId={networkId} />}
            theadClass='bg-f6f7f9'
          />
          {account
            ? (
              <TBody isLoading={loading} columns={columns} data={sortedData} />
              )
            : (
              <tbody data-testid='no-account-message'>
                <tr className='w-full text-center first'>
                  <td className='p-6' colSpan={columns.length}>
                    <Trans>Please connect your wallet</Trans>
                  </td>
                </tr>
              </tbody>
              )}
        </Table>
        {hasMore && (
          <TableShowMore
            isLoading={loading}
            onShowMore={() => {
              setPage((prev) => prev + 1)
            }}
          />
        )}
      </TableWrapper>
    </>
  )
}

const WhenRenderer = ({ row }) => {
  const router = useRouter()

  return (
    <td
      className='max-w-xs px-6 py-6 text-sm leading-5 whitespace-nowrap text-01052D'
      title={DateLib.toLongDateFormat(row.transaction.timestamp, router.locale)}
    >
      {fromNow(row.transaction.timestamp)}
    </td>
  )
}

const DetailsRenderer = ({ row }) => {
  const productKey = safeFormatBytes32String('')
  const { coverInfo } = useCoverOrProductData({
    coverKey: row.cover.id,
    productKey: productKey
  })
  const { liquidityTokenDecimals } = useAppConstants()
  const isDiversified = coverInfo?.supportsProducts

  if (!coverInfo) {
    return null
  }

  const tokenAmountWithSymbol = (
    <TokenAmountSpan
      amountInUnits={row.liquidityAmount}
      decimals={liquidityTokenDecimals}
    />
  )

  const coverOrProjectName = coverInfo.infoObj.coverName || coverInfo.infoObj.projectName

  return (
    <td className='max-w-sm px-6 py-6'>
      <div className='flex items-center gap-1 w-max'>
        <CoverAvatar
          coverInfo={coverInfo}
          isDiversified={isDiversified}
          containerClass='grow-0'
          xs
        />
        <span className='text-sm leading-5 text-left whitespace-nowrap text-01052D'>
          {row.type === 'PodsIssued'
            ? (
              <Trans>
                Added {tokenAmountWithSymbol} to {coverOrProjectName} Cover
              </Trans>
              )
            : (
              <Trans>
                Removed {tokenAmountWithSymbol} from {coverOrProjectName} Cover
              </Trans>
              )}
        </span>
      </div>
    </td>
  )
}

const PodAmountRenderer = ({ row }) => {
  const { register } = useRegisterToken()
  const tokenSymbol = row.vault.tokenSymbol
  const tokenDecimals = row.vault.tokenDecimals

  const router = useRouter()

  return (
    <td className='max-w-sm px-6 py-6 text-right'>
      <div className='flex items-center justify-end text-sm leading-6 whitespace-nowrap'>
        <span
          className={row.type === 'PodsIssued' ? 'text-01052D' : 'text-FA5C2F'}
          title={
            formatCurrency(
              convertFromUnits(row.podAmount, tokenDecimals),
              router.locale,
              tokenSymbol,
              true
            ).long
          }
        >
          {
            formatCurrency(
              convertFromUnits(row.podAmount, tokenDecimals),
              router.locale,
              tokenSymbol,
              true
            ).short
          }
        </span>
        <button
          className='p-1 ml-3'
          onClick={() => register(row.vault.id, tokenSymbol, tokenDecimals)}
          title='Add to Metamask'
        >
          <span className='sr-only'>Add to metamask</span>
          <AddCircleIcon className='w-4 h-4' />
        </button>
      </div>
    </td>
  )
}

const ActionsRenderer = ({ row }) => {
  const { networkId } = useNetwork()
  const router = useRouter()

  return (
    <td className='px-6 py-6 min-w-120'>
      <div className='flex items-center justify-end'>
        {/* Tooltip */}
        <Tooltip.Root>
          <Tooltip.Trigger className='p-1 mr-4 text-01052D'>
            <span className='sr-only'>
              <Trans>Timestamp</Trans>
            </span>
            <ClockIcon className='w-4 h-4' />
          </Tooltip.Trigger>

          <Tooltip.Content side='top'>
            <div className='max-w-sm p-3 text-sm leading-6 text-white bg-black rounded-xl'>
              <p>
                {DateLib.toLongDateFormat(
                  row.transaction.timestamp,
                  router.locale,
                  'UTC'
                )}
              </p>
            </div>
            <Tooltip.Arrow offset={16} className='fill-black' />
          </Tooltip.Content>
        </Tooltip.Root>

        <a
          href={getTxLink(networkId, { hash: row.transaction.id })}
          target='_blank'
          rel='noreferrer noopener nofollow'
          className='p-1 text-black'
          title='Open in Explorer'
        >
          <span className='sr-only'>Open in explorer</span>
          <OpenInNewIcon className='w-4 h-4' />
        </a>
      </div>
    </td>
  )
}
