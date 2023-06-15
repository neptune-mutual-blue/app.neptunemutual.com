import { CoverAvatar } from '@/common/CoverAvatar'
import { LastSynced } from '@/common/LastSynced'
import { renderHeader } from '@/common/Table/renderHeader'
import {
  Table,
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
import { getCoverImgSrc } from '@/src/helpers/cover'
import { useBlockHeight } from '@/src/hooks/useBlockHeight'
import { useLiquidityGaugePoolTxs } from '@/src/hooks/useLiquidityGaugePoolTxs'
import { useRegisterToken } from '@/src/hooks/useRegisterToken'
import { useSortData } from '@/src/hooks/useSortData'
import { useTokenDecimals } from '@/src/hooks/useTokenDecimals'
import { useTokenSymbol } from '@/src/hooks/useTokenSymbol'
import { safeParseBytes32String } from '@/utils/formatter/bytes32String'
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
    title={DateLib.toLongDateFormat(row.blockTimestamp)}
  >
    {fromNow(row.blockTimestamp)}
  </td>
)

const renderDetails = (row) => <DetailsRenderer row={row} />

const renderAmount = (row) => <PoolAmountRenderer row={row} />

const renderActions = (row) => <ActionsRenderer row={row} />

export const getColumns = (sorts = {}, handleSort = () => {}) => [
  {
    name: t`when`,
    align: 'left',
    renderHeader: (col) => renderHeader(col, 'blockTimestamp', sorts, handleSort),
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

export const LiquidityGaugeTxsTable = () => {
  const { data, loading } = useLiquidityGaugePoolTxs()

  const { networkId } = useNetwork()
  const { account } = useWeb3React()
  const blockNumber = useBlockHeight()

  const { sorts, handleSort, sortedData } = useSortData({ data: data })

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
      </TableWrapper>
    </>
  )
}

const getAppropriateData = (row, tokenSymbol, tokenDecimals) => {
  const data = {
    symbol: tokenSymbol,
    tokenDecimals: tokenDecimals,
    amountToShow: row.amount,
    imgSrc: [{ src: getCoverImgSrc({ key: row.key }), alt: `${safeParseBytes32String(row.key)} token logo` }]
  }

  return {
    ...data,
    textToShow: (
      <Trans>
        {row.event}
        <TokenAmountSpan
          className='text-sm leading-5 text-01052D'
          amountInUnits={data.amountToShow}
          symbol={data.symbol}
          decimals={data.tokenDecimals}
        />
      </Trans>
    )
  }
}

const DetailsRenderer = ({ row }) => {
  const tokenSymbol = useTokenSymbol(row.token)
  const tokenDecimals = useTokenDecimals(row.token)

  const data = getAppropriateData(row, tokenSymbol, tokenDecimals)

  if (!data) {
    return null
  }

  return (
    <td className='max-w-sm px-6 py-6'>
      <div className='flex items-center gap-2 w-max'>
        <CoverAvatar
          imgs={data.imgSrc}
          containerClass='grow-0'
          size='xs'
        />
        <span className='text-sm leading-5 text-left whitespace-nowrap text-01052D'>
          {data.textToShow}
        </span>
      </div>
    </td>
  )
}

const PoolAmountRenderer = ({ row }) => {
  const { register } = useRegisterToken()

  const tokenSymbol = useTokenSymbol(row.token)
  const tokenDecimals = useTokenDecimals(row.token)

  const data = getAppropriateData(row, tokenSymbol, tokenDecimals)

  if (!data) {
    return null
  }

  return (
    <td className='max-w-sm px-6 py-6 text-right'>
      <div className='flex items-center justify-end w-full text-sm leading-6 whitespace-nowrap'>
        <TokenAmountSpan
          className={row.event === 'Added' ? 'text-01052D' : 'text-FA5C2F'}
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
                {DateLib.toLongDateFormat(row.blockTimestamp, 'UTC')}
              </p>
            </div>
            <Tooltip.Arrow offset={16} className='fill-black' />
          </Tooltip.Content>
        </Tooltip.Root>

        <a
          href={getTxLink(networkId, { hash: row.transactionHash })}
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
