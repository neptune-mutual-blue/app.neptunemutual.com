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
import { TokenAmountSpan } from '@/common/TokenAmountSpan'
import AddCircleIcon from '@/icons/AddCircleIcon'
import ClockIcon from '@/icons/ClockIcon'
import OpenInNewIcon from '@/icons/OpenInNewIcon'
import { getTxLink } from '@/lib/connect-wallet/utils/explorer'
import DateLib from '@/lib/date/DateLib'
import { useAppConstants } from '@/src/context/AppConstants'
import { useCoversAndProducts2 } from '@/src/context/CoversAndProductsData2'
import { useNetwork } from '@/src/context/Network'
import { getCoverImgSrc } from '@/src/helpers/cover'
import { useLiquidityTxs } from '@/src/hooks/useLiquidityTxs'
import { usePagination } from '@/src/hooks/usePagination'
import { useRegisterToken } from '@/src/hooks/useRegisterToken'
import { useSortData } from '@/src/hooks/useSortData'
import { convertFromUnits } from '@/utils/bn'
import { formatCurrency } from '@/utils/formatter/currency'
import { fromNow } from '@/utils/formatter/relative-time'
import {
  t,
  Trans
} from '@lingui/macro'
import * as Tooltip from '@radix-ui/react-tooltip'
import { useWeb3React } from '@web3-react/core'
import { TableRowCoverAvatar } from '@/common/TableRowCoverAvatar'

const renderWhen = (row) => { return <WhenRenderer row={row} /> }

const renderDetails = (row) => { return <DetailsRenderer row={row} /> }

const renderAmount = (row) => { return <PodAmountRenderer row={row} /> }

const renderActions = (row) => { return <ActionsRenderer row={row} /> }

export const getColumns = (sorts = {}, handleSort = () => {}) => {
  return [
    {
      name: t`when`,
      align: 'left',
      renderHeader: (col) => { return renderHeader(col, 'transaction.timestamp', sorts, handleSort) },
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

export const MyLiquidityTxsTable = () => {
  const { page, limit, setPage } = usePagination()
  const { data, loading, hasMore } = useLiquidityTxs({
    page,
    limit
  })

  const { networkId } = useNetwork()
  const { account } = useWeb3React()

  const { blockNumber, transactions } = data

  const { sorts, handleSort, sortedData } = useSortData({ data: transactions })

  const columns = getColumns(sorts, handleSort)

  return (
    <>
      <TableWrapper data-testid='table-wrapper'>
        <Table>
          <THead
            columns={columns}
            data-testid='table-head'
            title={<LastSynced blockNumber={blockNumber} networkId={networkId} />}
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
      </TableWrapper>

      <TableShowMore
        show={hasMore && account}
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
      className='max-w-xs px-6 py-6 text-sm leading-5 whitespace-nowrap text-01052D'
      title={DateLib.toLongDateFormat(row.transaction.timestamp, router.locale)}
    >
      {fromNow(row.transaction.timestamp)}
    </td>
  )
}

const DetailsRenderer = ({ row }) => {
  const coverKey = row.cover.id
  const { liquidityTokenDecimals } = useAppConstants()

  const { loading, getCoverByCoverKey, getProductsByCoverKey } = useCoversAndProducts2()
  const coverData = getCoverByCoverKey(coverKey)

  if (loading) {
    return null
  }

  const tokenAmountWithSymbol = (
    <TokenAmountSpan
      amountInUnits={row.liquidityAmount}
      decimals={liquidityTokenDecimals}
    />
  )

  const isDiversified = coverData?.supportsProducts
  const projectName = coverData.coverInfoDetails.coverName || coverData.coverInfoDetails.projectName

  return (
    <td className='max-w-sm px-6 py-6'>
      <div className='flex items-center gap-2 w-max'>
        <TableRowCoverAvatar
          imgs={isDiversified
            ? getProductsByCoverKey(coverKey).map(x => {
              return {
                src: getCoverImgSrc({ key: x.productKey }),
                alt: x.productInfoDetails?.productName
              }
            })
            : [{
                src: getCoverImgSrc({ key: coverKey }),
                alt: projectName
              }]}
        />
        <span className='text-sm leading-5 text-left whitespace-nowrap text-01052D'>
          {row.type === 'PodsIssued'
            ? (
              <Trans>
                Added {tokenAmountWithSymbol} to {projectName} Cover
              </Trans>
              )
            : (
              <Trans>
                Removed {tokenAmountWithSymbol} from {projectName} Cover
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
          onClick={() => { return register(row.vault.id, tokenSymbol, tokenDecimals) }}
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
    <td className='w-48 px-6 py-6 min-w-120'>
      <div className='flex items-center justify-center gap-6'>
        {/* Tooltip */}
        {/* @ts-ignore */}
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
