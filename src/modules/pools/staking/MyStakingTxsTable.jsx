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
import { useNetwork } from '@/src/context/Network'
import { getTokenImgSrc } from '@/src/helpers/token'
import { usePagination } from '@/src/hooks/usePagination'
import { useRegisterToken } from '@/src/hooks/useRegisterToken'
import { useSortData } from '@/src/hooks/useSortData'
import { useStakingTxs } from '@/src/hooks/useStakingTxs'
import { fromNow } from '@/utils/formatter/relative-time'
import {
  t,
  Trans
} from '@lingui/macro'
import * as Tooltip from '@radix-ui/react-tooltip'
import { useWeb3React } from '@web3-react/core'

const renderWhen = (row) => (
  <td
    className='px-6 py-6'
    title={DateLib.toLongDateFormat(row.createdAtTimestamp)}
  >
    {fromNow(row.createdAtTimestamp)}
  </td>
)

const renderDetails = (row) => <DetailsRenderer row={row} />

const renderAmount = (row) => <PoolAmountRenderer row={row} />

const renderActions = (row) => <ActionsRenderer row={row} />

export const getColumns = (sorts = {}, handleSort = () => {}) => [
  {
    name: t`when`,
    align: 'left',
    renderHeader: (col) => renderHeader(col, 'createdAtTimestamp', sorts, handleSort),
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

export const MyStakingTxsTable = () => {
  const { page, limit, setPage } = usePagination()
  const { data, loading, hasMore } = useStakingTxs({ page, limit })

  const { networkId } = useNetwork()
  const { account } = useWeb3React()

  const { blockNumber, transactions } = data

  const { sorts, handleSort, sortedData } = useSortData({ data: transactions })

  const columns = getColumns(sorts, handleSort)

  return (
    <>
      <TableWrapper>
        <Table>
          <THead
            columns={columns}
            title={<LastSynced blockNumber={blockNumber} networkId={networkId} />}
          />
          {account
            ? (
              <TBody
                isLoading={loading}
                columns={columns}
                data={sortedData}
              />
              )
            : (
              <tbody>
                <tr className='w-full text-center'>
                  <td className='p-6' colSpan={columns.length}>
                    <Trans>Please connect your wallet</Trans>
                  </td>
                </tr>
              </tbody>
              )}
        </Table>
        {(hasMore && account) && (
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

const getAppropriateData = (row) => {
  if (row.type === 'Deposited') {
    const data = {
      symbol: row.pool.stakingTokenSymbol,
      tokenDecimals: row.pool.stakingTokenDecimals,
      amountToShow: row.amount,
      poolName: row.pool.name,
      imgSrc: [getTokenImgSrc(row.pool.stakingTokenSymbol), getTokenImgSrc(row.pool.rewardTokenSymbol)]
    }

    const stakeAmountWithSymbol = (
      <TokenAmountSpan
        className='text-sm leading-5 text-01052D'
        amountInUnits={data.amountToShow} symbol={data.symbol} decimals={data.tokenDecimals}
      />
    )

    return {
      ...data,
      textToShow: (
        <Trans>Staked {stakeAmountWithSymbol} on {data.poolName}</Trans>
      )
    }
  }
  if (row.type === 'RewardsWithdrawn') {
    const data = {
      symbol: row.pool.rewardTokenSymbol,
      tokenDecimals: row.pool.rewardTokenDecimals,
      amountToShow: row.rewards,
      poolName: row.pool.name,
      imgSrc: [getTokenImgSrc(row.pool.stakingTokenSymbol), getTokenImgSrc(row.pool.rewardTokenSymbol)]
    }

    const harvestAmountWithSymbol = (
      <TokenAmountSpan
        className='text-sm leading-5 text-01052D'
        amountInUnits={data.amountToShow} symbol={data.symbol} decimals={data.tokenDecimals}
      />
    )

    return {
      ...data,
      textToShow: (
        <Trans>Harvested {harvestAmountWithSymbol} on {data.poolName}</Trans>
      )
    }
  }
  if (row.type === 'Withdrawn') {
    const data = {
      symbol: `${row.pool.stakingTokenSymbol}`,
      tokenDecimals: row.pool.stakingTokenDecimals,
      amountToShow: row.amount,
      poolName: row.pool.name,
      imgSrc: [getTokenImgSrc(row.pool.stakingTokenSymbol), getTokenImgSrc(row.pool.rewardTokenSymbol)]
    }

    const withdrawAmountWithSymbol = (
      <TokenAmountSpan
        className='text-sm leading-5 text-01052D'
        amountInUnits={data.amountToShow} symbol={data.symbol} decimals={data.tokenDecimals}
      />
    )

    return {
      ...data,
      textToShow: (
        <Trans>Withdrawn {withdrawAmountWithSymbol} from {data.poolName}</Trans>
      )
    }
  }
}

const DetailsRenderer = ({ row }) => {
  const data = getAppropriateData(row)

  return (
    <td className='max-w-sm px-6 py-6'>
      <div className='flex items-center w-max'>
        {data.imgSrc.length === 1
          ? (<img src={data.imgSrc[0]} alt='npm' height={24} width={24} />)
          : (
            <div className='relative inline-block'>
              <div className='flex items-center justify-center'>
                <img src={data.imgSrc[1]} height={24} width={24} className='z-20' alt='rewardTokenSymbol' />
              </div>
              <div className='absolute top-0 z-10 flex items-center justify-center -left-4'>
                <img src={data.imgSrc[0]} alt='stakingTokenSymbol' height={24} width={24} className='inline-block' />
              </div>
            </div>
            )}
        <span className='pl-2 text-sm leading-5 text-left whitespace-nowrap text-01052D'>
          {data.textToShow}
        </span>
      </div>
    </td>
  )
}

const PoolAmountRenderer = ({ row }) => {
  const { register } = useRegisterToken()

  const data = getAppropriateData(row)

  return (
    <td className='max-w-sm px-6 py-6 text-right'>
      <div className='flex items-center justify-end w-full text-sm leading-6 whitespace-nowrap'>
        <TokenAmountSpan
          className={row.type === 'Deposited' ? 'text-01052D' : 'text-FA5C2F'}
          amountInUnits={
            data.amountToShow
          }
          symbol={data.symbol}
          decimals={data.tokenDecimals}
        />
        <button
          className='p-1 ml-3'
          onClick={() =>
            register(
              row.token,
              data.symbol,
              data.tokenDecimals
            )}
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

  return (
    <td className='px-6 py-6 min-w-120'>
      <div className='flex items-center justify-center gap-6'>
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
                {DateLib.toLongDateFormat(row.createdAtTimestamp, 'UTC')}
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
          title='Open in explorer'
        >
          <span className='sr-only'>Open in explorer</span>
          <OpenInNewIcon className='w-4 h-4' />
        </a>
      </div>
    </td>
  )
}
