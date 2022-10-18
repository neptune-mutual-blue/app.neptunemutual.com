import * as Tooltip from '@radix-ui/react-tooltip'
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
import { classNames } from '@/utils/classnames'
import { useWeb3React } from '@web3-react/core'
import { getBlockLink, getTxLink } from '@/lib/connect-wallet/utils/explorer'
import { fromNow } from '@/utils/formatter/relative-time'
import { useNetwork } from '@/src/context/Network'
import { TokenAmountSpan } from '@/common/TokenAmountSpan'
import { t, Trans } from '@lingui/macro'
import { usePagination } from '@/src/hooks/usePagination'
import { useStakingTxs } from '@/src/hooks/useStakingTxs'
import { useTokenSymbol } from '@/src/hooks/useTokenSymbol'
import { useTokenDecimals } from '@/src/hooks/useTokenDecimals'
import DateLib from '@/lib/date/DateLib'
import { getTokenImgSrc } from '@/src/helpers/token'

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

const renderWhen = (row) => (
  <td
    className='px-6 py-6'
    title={DateLib.toLongDateFormat(row.createdAtTimestamp)}
  >
    {fromNow(row.createdAtTimestamp)}
  </td>
)

const renderDetails = (row) => <DetailsRenderer row={row} />

const renderAmount = (row) => <BondAmountRenderer row={row} />

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

export const MyStakingTxsTable = () => {
  const { page, limit, setPage } = usePagination()
  const { data, loading, hasMore } = useStakingTxs({ page, limit })

  const { networkId } = useNetwork()
  const { account } = useWeb3React()

  const { blockNumber, transactions } = data

  return (
    <>
      {blockNumber && (
        <p className='mb-8 text-xs font-semibold text-right text-9B9B9B'>
          <Trans>LAST SYNCED:</Trans>{' '}
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
      <TableWrapper>
        <Table>
          <THead columns={columns} />
          {account
            ? (
              <TBody
                isLoading={loading}
                columns={columns}
                data={transactions}
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

const DetailsRenderer = ({ row }) => {
  const tokenSymbol = useTokenSymbol(row.token)
  const tokenDecimals = useTokenDecimals(row.token)
  const getAmount = () => {
    if (row.type === 'RewardsWithdrawn') {
      return row.rewards
    }
    if (row.type === 'Deposited' || row.type === 'Withdrawn') {
      return row.amount
    }
  }

  const getType = () => {
    if (row.type === 'RewardsWithdrawn') {
      return 'Harvested '
    }
    if (row.type === 'Deposited') {
      return 'Staked '
    }
    if (row.type === 'Withdrawn') {
      return 'Withdrawn & Harvested '
    }
  }

  const tokenImg = getTokenImgSrc(tokenSymbol)

  return (
    <td className='max-w-sm px-6 py-6'>
      <div className='flex items-center w-max'>
        <img src={tokenImg} alt='npm' height={32} width={32} />
        <span className='pl-4 text-left whitespace-nowrap'>
          {getType()}
          <TokenAmountSpan
            amountInUnits={
              getAmount()
            }
            symbol={
              tokenSymbol
            }
            decimals={
              tokenDecimals
            }
          />
        </span>
      </div>
    </td>
  )
}

const BondAmountRenderer = ({ row }) => {
  const { register } = useRegisterToken()

  const tokenSymbol = useTokenSymbol(row.token)
  const tokenDecimals = useTokenDecimals(row.token)
  const getAmount = () => {
    // type Deposited, Withdrawn -> amount
    // type rewardwithdrawn -> platformfee, rewards
    if (row.type === 'RewardsWithdrawn') {
      return row.rewards
    }
    if (row.type === 'Deposited' || row.type === 'Withdrawn') {
      return row.amount
    }
  }

  return (
    <td className='max-w-sm px-6 py-6 text-right'>
      <div className='flex items-center justify-end w-max whitespace-nowrap'>
        <TokenAmountSpan
          className={row.type === 'Deposited' ? 'text-404040' : 'text-FA5C2F'}
          amountInUnits={
            getAmount()
          }
          symbol={tokenSymbol}
          decimals={tokenDecimals}
        />
        <button
          className='p-1 ml-3'
          onClick={() =>
            register(
              row.token,
              tokenSymbol,
              tokenDecimals
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
      <div className='flex items-center justify-end'>
        {/* Tooltip */}
        <Tooltip.Root>
          <Tooltip.Trigger className='p-1 mr-4 text-9B9B9B'>
            <span className='sr-only'>
              <Trans>Timestamp</Trans>
            </span>
            <ClockIcon className='w-4 h-4' />
          </Tooltip.Trigger>

          <Tooltip.Content side='top'>
            <div className='max-w-sm p-3 text-sm leading-6 text-white bg-black rounded-xl'>
              <p>
                {/* {DateLib.toLongDateFormat(row.transaction.timestamp, 'UTC')} */}
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
