import { useMemo } from 'react'

import { useRouter } from 'next/router'

import { LastSynced } from '@/common/LastSynced'
import { renderHeader } from '@/common/Table/renderHeader'
import {
  Table,
  TableWrapper,
  TBody,
  THead
} from '@/common/Table/Table'
import { TableRowCoverAvatar } from '@/common/TableRowCoverAvatar'
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
import { useBlockHeight } from '@/src/hooks/useBlockHeight'
import { useLiquidityGaugePools } from '@/src/hooks/useLiquidityGaugePools'
import { useLiquidityGaugePoolTxs } from '@/src/hooks/useLiquidityGaugePoolTxs'
import { useRegisterToken } from '@/src/hooks/useRegisterToken'
import { useSortData } from '@/src/hooks/useSortData'
import { useTokenDecimals } from '@/src/hooks/useTokenDecimals'
import { useTokenSymbol } from '@/src/hooks/useTokenSymbol'
import { fromNow } from '@/utils/formatter/relative-time'
import {
  t,
  Trans
} from '@lingui/macro'
import { useLingui } from '@lingui/react'
import * as Tooltip from '@radix-ui/react-tooltip'
import { useWeb3React } from '@web3-react/core'

const WhenRenderer = ({ row }) => {
  const router = useRouter()

  return (
    <td
      className='max-w-xs px-6 py-6 text-sm leading-5 whitespace-nowrap text-01052D'
      title={DateLib.toLongDateFormat(row.blockTimestamp, router.locale)}
    >
      {fromNow(row.blockTimestamp)}
    </td>
  )
}

const DetailsRenderer = ({ row }) => {
  const tokenSymbol = useTokenSymbol(row.token)
  const tokenDecimals = useTokenDecimals(row.token)

  const tokenAmountWithSymbol = (
    <TokenAmountSpan
      className='text-sm leading-5 text-01052D'
      amountInUnits={row.amount}
      symbol={tokenSymbol}
      decimals={tokenDecimals}
    />
  )

  let textToShow = <></>
  if (row.event === 'Removed') {
    textToShow = (
      <Trans>
        Removed {tokenAmountWithSymbol} from {row.poolName} Pool
      </Trans>
    )
  } else if (row.event === 'Get Reward') {
    textToShow = (
      <Trans>
        Withdrawn reward of {tokenAmountWithSymbol} from {row.poolName} Pool
      </Trans>
    )
  } else if (row.event === 'Added') {
    textToShow = (
      <Trans>
        Locked {tokenAmountWithSymbol} in {row.poolName} Pool
      </Trans>
    )
  }

  return (
    <td className='max-w-sm px-6 py-6'>
      <div className='flex items-center gap-2 w-max'>
        <TableRowCoverAvatar
          imgs={row.imgSrc}
        />
        <span className='text-sm leading-5 text-left whitespace-nowrap text-01052D'>
          {textToShow}
        </span>
      </div>
    </td>
  )
}

const PoolAmountRenderer = ({ row }) => {
  const { register } = useRegisterToken()

  const tokenSymbol = useTokenSymbol(row.token)
  const tokenDecimals = useTokenDecimals(row.token)

  return (
    <td className='max-w-sm px-6 py-6 text-right'>
      <div className='flex items-center justify-end w-full text-sm leading-6 whitespace-nowrap'>
        <TokenAmountSpan
          className={row.event === 'Removed' ? 'text-FA5C2F' : ''}
          amountInUnits={row.amount}
          symbol={tokenSymbol}
          decimals={tokenDecimals}
        />
        <button
          className='p-1 ml-3'
          onClick={() => {
            return register(
              row.token,
              tokenSymbol,
              tokenDecimals
            )
          }}
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

const renderWhen = (row) => { return <WhenRenderer row={row} /> }

const renderDetails = (row) => { return <DetailsRenderer row={row} /> }

const renderAmount = (row) => { return <PoolAmountRenderer row={row} /> }

const renderActions = (row) => { return <ActionsRenderer row={row} /> }

/**
 * Returns an array of column objects for the proposals table.
 * Each object represents a column and contains properties such as id, name, alignment, and render functions.
 *
 * @param {import('@lingui/core').I18n} i18n - The I18n instance from Lingui library.
 * @param {Object} sorts - An object representing the current sort settings.
 * @param {Function} handleSort - A function to handle sorting events.
 * @returns {Array<{id: string, name: string, align: string, renderHeader: Function, renderData: (row: any, extraData: any, index: number) => React.JSX.Element}>} An array of column objects.
 */
const getColumns = (i18n, sorts = {}, handleSort = () => {}) => {
  return [
    {
      id: 'when',
      name: t(i18n)`when`,
      align: 'left',
      renderHeader: (col) => { return renderHeader(col, 'blockTimestamp', sorts, handleSort) },
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

export const LiquidityGaugeTxsTable = () => {
  const { data, loading } = useLiquidityGaugePoolTxs()
  const { NPMTokenDecimals } = useAppConstants()
  const { data: pools } = useLiquidityGaugePools({ NPMTokenDecimals })
  const { getCoverByCoverKey, getProductsByCoverKey } = useCoversAndProducts2()

  const { networkId } = useNetwork()
  const { account } = useWeb3React()
  const blockNumber = useBlockHeight()

  const updateData = useMemo(() => {
    return data.map(txData => {
      const coverData = getCoverByCoverKey(txData.key)
      const isDiversified = coverData?.supportsProducts
      const projectName = coverData?.coverInfoDetails?.coverName || coverData?.coverInfoDetails?.projectName
      const pool = pools.find(x => { return x.key === txData.key })

      return {
        ...txData,
        poolName: pool?.name || '',
        imgSrc: isDiversified
          ? getProductsByCoverKey(txData.key).map(x => {
            return {
              src: getCoverImgSrc({ key: x.productKey }),
              alt: x.productInfoDetails?.productName
            }
          })
          : [{
              src: getCoverImgSrc({ key: txData.key }),
              alt: projectName
            }]
      }
    })
  }, [data, getCoverByCoverKey, getProductsByCoverKey, pools])

  const { sorts, handleSort, sortedData } = useSortData({ data: updateData })

  const { i18n } = useLingui()

  const columns = getColumns(i18n, sorts, handleSort)

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
