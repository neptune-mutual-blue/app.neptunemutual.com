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
import { useBondTxs } from '@/src/hooks/useBondTxs'
import { usePagination } from '@/src/hooks/usePagination'
import { useRegisterToken } from '@/src/hooks/useRegisterToken'
import { useSortData } from '@/src/hooks/useSortData'
import { fromNow } from '@/utils/formatter/relative-time'
import {
  t,
  Trans
} from '@lingui/macro'
import { useLingui } from '@lingui/react'
import * as Tooltip from '@radix-ui/react-tooltip'
import { useWeb3React } from '@web3-react/core'

const renderWhen = (row) => {
  return (
    <td
      className='px-6 py-6'
      title={DateLib.toLongDateFormat(row.transaction.timestamp)}
    >
      {fromNow(row.transaction.timestamp)}
    </td>
  )
}

const renderDetails = (row) => { return <DetailsRenderer row={row} /> }

const renderAmount = (row) => { return <BondAmountRenderer row={row} /> }

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
      renderHeader: (col) => { return renderHeader(col, 'transaction.timestamp', sorts, handleSort) },
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

export const MyBondTxsTable = () => {
  const { page, limit, setPage } = usePagination()
  const { data, loading, hasMore } = useBondTxs({ page, limit })

  const { networkId } = useNetwork()
  const { account } = useWeb3React()

  const { blockNumber, transactions } = data

  const { sorts, handleSort, sortedData } = useSortData({ data: transactions })

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

      <TableShowMore
        show={hasMore && account}
        onShowMore={() => {
          setPage((prev) => { return prev + 1 })
        }}
        loading={loading}
      />
    </>
  )
}

const DetailsRenderer = ({ row }) => {
  return (
    <td className='max-w-sm px-6 py-6 text-sm leading-5 text-01052D'>
      <div className='flex items-center w-max'>
        <img src='/images/tokens/npm.svg' alt='npm' height={32} width={32} />
        <span className='pl-4 text-left whitespace-nowrap'>
          {row.type === 'BondCreated' ? 'Bonded ' : 'Claimed '}
          <TokenAmountSpan
            amountInUnits={
              row.type === 'BondCreated' ? row.lpTokenAmount : row.claimAmount
            }
            symbol={
              row.type === 'BondCreated'
                ? row.bondPool.lpTokenSymbol
                : row.bondPool.token1Symbol
            }
            decimals={
              row.type === 'BondCreated'
                ? row.lpTokenDecimals
                : row.bondPool.token1Decimals
            }
          />
        </span>
      </div>
    </td>
  )
}

const BondAmountRenderer = ({ row }) => {
  const { register } = useRegisterToken()

  return (
    <td className='max-w-sm px-6 py-6 text-right'>
      <div className='flex items-center justify-end text-sm leading-6 w-max whitespace-nowrap'>
        <TokenAmountSpan
          className={row.type === 'BondCreated' ? 'text-01052D' : 'text-FA5C2F'}
          amountInUnits={
            row.type === 'BondCreated' ? row.npmToVestAmount : row.claimAmount
          }
          symbol={row.bondPool.token1Symbol}
          decimals={row.bondPool.token1Decimals}
        />
        <button
          className='p-1 ml-3'
          onClick={() => {
            return register(
              row.bondPool.token1,
              row.bondPool.token1Symbol,
              row.bondPool.token1Decimals
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
          <Tooltip.Trigger className='p-1 mr-4 text-sm leading-5 text-01052D'>
            <span className='sr-only'>
              <Trans>Timestamp</Trans>
            </span>
            <ClockIcon className='w-4 h-4' />
          </Tooltip.Trigger>

          <Tooltip.Content side='top'>
            <div className='max-w-sm p-3 text-sm leading-6 text-white bg-black rounded-xl'>
              <p>
                {DateLib.toLongDateFormat(row.transaction.timestamp, 'UTC')}
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
