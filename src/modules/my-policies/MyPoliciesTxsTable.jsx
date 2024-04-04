import { LastSynced } from '@/common/LastSynced'
import { renderHeader } from '@/common/Table/renderHeader'
import {
  Table,
  TableShowMore,
  TableWrapper,
  TBody,
  THead
} from '@/common/Table/Table'
import { TableRowCoverAvatar } from '@/common/TableRowCoverAvatar'
import { TokenAmountSpan } from '@/common/TokenAmountSpan'
import AddCircleIcon from '@/icons/AddCircleIcon'
import ClockIcon from '@/icons/ClockIcon'
import OpenInNewIcon from '@/icons/OpenInNewIcon'
import PolicyReceiptIcon from '@/icons/PolicyReceiptIcon'
import { getTxLink } from '@/lib/connect-wallet/utils/explorer'
import DateLib from '@/lib/date/DateLib'
import { Routes } from '@/src/config/routes'
import { useAppConstants } from '@/src/context/AppConstants'
import { useCoversAndProducts2 } from '@/src/context/CoversAndProductsData2'
import { useNetwork } from '@/src/context/Network'
import {
  getCoverImgSrc,
  isValidProduct
} from '@/src/helpers/cover'
import { usePagination } from '@/src/hooks/usePagination'
import { usePolicyTxs } from '@/src/hooks/usePolicyTxs'
import { useRegisterToken } from '@/src/hooks/useRegisterToken'
import { useSortData } from '@/src/hooks/useSortData'
import { useLanguageContext } from '@/src/i18n/i18n'
import { convertFromUnits } from '@/utils/bn'
import { formatCurrency } from '@/utils/formatter/currency'
import { fromNow } from '@/utils/formatter/relative-time'
import {
  t,
  Trans
} from '@lingui/macro'
import { useLingui } from '@lingui/react'
import * as Tooltip from '@radix-ui/react-tooltip'
import { useWeb3React } from '@web3-react/core'

const renderWhen = (row) => { return <WhenRenderer row={row} /> }

const renderDetails = (row) => { return <DetailsRenderer row={row} /> }

const renderAmount = (row) => { return <CxTokenAmountRenderer row={row} /> }

const renderActions = (row) => { return <ActionsRenderer row={row} /> }

/**
 * Returns an array of column objects for the proposals table.
 * Each object represents a column and contains properties such as id, name, alignment, and render functions.
 *
 * @param {import('@lingui/core').I18n} i18n - The I18n instance from Lingui library.
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

export const MyPoliciesTxsTable = () => {
  const { page, limit, setPage } = usePagination()
  const { data, loading, hasMore } = usePolicyTxs({
    page,
    limit
  })

  const { networkId } = useNetwork()
  const { account } = useWeb3React()

  const { blockNumber, transactions } = data

  const { sorts, handleSort, sortedData } = useSortData({ data: transactions })

  const { i18n } = useLingui()

  const columns = getColumns(i18n, sorts, handleSort)

  return (
    <>
      <TableWrapper data-testid='policy-txs-table-wrapper'>
        <Table>
          <THead
            columns={columns}
            data-testid='policy-txs-table-header'
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
              <tbody data-testid='connect-wallet-tbody'>
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
        loading={loading}
        onShowMore={() => {
          setPage((prev) => { return prev + 1 })
        }}
      />
    </>
  )
}

const WhenRenderer = ({ row }) => {
  const { locale } = useLanguageContext()

  return (
    <td
      className='max-w-xs px-6 py-6 text-sm leading-5 whitespace-nowrap text-01052D'
      title={DateLib.toLongDateFormat(row.transaction.timestamp, locale)}
      data-testid='timestamp-col'
    >
      {fromNow(row.transaction.timestamp, locale)}
    </td>
  )
}

const DetailsRenderer = ({ row }) => {
  const productKey = row.productKey
  const coverKey = row.cover.id
  const { liquidityTokenDecimals } = useAppConstants()
  const { loading, getProduct, getCoverByCoverKey } = useCoversAndProducts2()

  const isDiversified = isValidProduct(productKey)
  const coverOrProductData = isDiversified ? getProduct(coverKey, productKey) : getCoverByCoverKey(coverKey)
  const projectOrProductName = isDiversified ? coverOrProductData?.productInfoDetails?.productName : coverOrProductData?.coverInfoDetails.coverName || coverOrProductData?.coverInfoDetails.projectName

  if (loading) {
    return null
  }

  const tokenAmountWithSymbol = <TokenAmountSpan amountInUnits={row.stablecoinAmount} decimals={liquidityTokenDecimals} />

  return (
    <td className='max-w-sm px-6 py-6' data-testid='details-col'>
      <div className='flex items-center whitespace-nowrap'>
        <TableRowCoverAvatar
          imgs={[{
            src: getCoverImgSrc({ key: isDiversified ? productKey : coverKey }),
            alt: projectOrProductName
          }]}
          containerClass='grow-0'
        />
        <span className='pl-4 text-sm leading-5 text-left whitespace-nowrap text-01052D'>
          {row.type === 'CoverPurchased'
            ? (
              <Trans>
                Purchased {tokenAmountWithSymbol} {projectOrProductName} policy
              </Trans>
              )
            : (
              <Trans>
                Claimed {tokenAmountWithSymbol} {projectOrProductName} policy
              </Trans>
              )}
        </span>
      </div>
    </td>
  )
}

const CxTokenAmountRenderer = ({ row }) => {
  const { register } = useRegisterToken()
  const { locale } = useLanguageContext()
  const { liquidityTokenDecimals } = useAppConstants()

  const isClaimTx = row.type === 'Claimed'

  // @todo: cxTokenAmount will not be equal to stablecoinAmount, if they don't have same decimals
  const amount = isClaimTx ? row.cxTokenAmount : row.stablecoinAmount
  const decimals =
    isClaimTx ? row.cxToken.tokenDecimals : liquidityTokenDecimals
  const formattedCurrency = formatCurrency(
    convertFromUnits(amount, decimals),
    // convertFromUnits(row.cxTokenAmount, row.cxToken.tokenDecimals),
    locale,
    row.cxToken.tokenSymbol,
    true
  )

  return (
    <td className='max-w-sm px-6 py-6 text-right' data-testid='col-amount'>
      <div className='flex items-center justify-end text-sm leading-6 whitespace-nowrap'>
        <span
          className={isClaimTx ? 'text-FA5C2F' : 'text-01052D'}
          title={formattedCurrency.long}
        >
          {formattedCurrency.short}
        </span>
        <button
          className='p-1 ml-3'
          onClick={() => {
            return register(
              row.cxToken.id,
              row.cxToken.tokenSymbol,
              row.cxToken.tokenDecimals
            )
          }}
          title='Add to metamask'
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
  const { locale } = useLanguageContext()

  const isCoverPurchase = row.type === 'CoverPurchased'

  return (
    <td className='px-6 py-6 min-w-120' data-testid='col-actions'>
      <div className='flex items-center justify-end'>
        {/* Tooltip */}
        <Tooltip.Root>
          <Tooltip.Trigger className='p-1 mr-4 text-01052D'>
            <span className='sr-only'>
              <Trans>Timestamp</Trans>
            </span>
            <ClockIcon className='w-4 h-4 text-01052D' />
          </Tooltip.Trigger>

          <Tooltip.Content side='top'>
            <div className='max-w-sm p-3 text-sm leading-6 text-white bg-black rounded-xl'>
              <p>
                {DateLib.toLongDateFormat(
                  row.transaction.timestamp,
                  locale,
                  'UTC'
                )}
              </p>
            </div>
            <Tooltip.Arrow offset={16} className='fill-black' />
          </Tooltip.Content>
        </Tooltip.Root>

        {isCoverPurchase && (
          <a
            href={Routes.ViewPolicyReceipt(row.transaction.id, networkId)}
            target='_blank'
            rel='noreferrer noopener nofollow'
            className='p-1 mr-4 text-black'
            title='View Receipt'
          >
            <span className='sr-only'>View Receipt</span>
            <PolicyReceiptIcon className='w-4 h-4' />
          </a>
        )}

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
