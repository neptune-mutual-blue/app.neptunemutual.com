import { useRouter } from 'next/router'

import { Badge } from '@/common/Badge/Badge'
import {
  Badge as CardStatusBadge,
  E_CARD_STATUS,
  identifyStatus
} from '@/common/CardStatusBadge'
import { Loading } from '@/common/Loading'
import { renderHeader } from '@/common/Table/renderHeader'
import {
  Table,
  TableWrapper,
  TBody,
  THead
} from '@/common/Table/Table'
import { useAppConstants } from '@/src/context/AppConstants'
import { useCoversAndProducts } from '@/src/context/CoversAndProductsData'
import {
  getCoverImgSrc,
  isValidProduct
} from '@/src/helpers/cover'
import { formatCurrency } from '@/utils/formatter/currency'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { convertFromUnits } from '@/utils/bn'

const renderStatus = (row) => {
  const status = identifyStatus(row.coverOrProductData.productStatusEnum)

  return (
    <td className='max-w-xs p-4 text-sm leading-5 whitespace-nowrap text-01052D'>
      {status !== E_CARD_STATUS.NORMAL && (
        <CardStatusBadge
          className='rounded-1 py-0.5 !px-1.5 leading-4.5 border-0 tracking-normal inline-block !text-xs'
          status={status}
        />
      )}
    </td>
  )
}

const renderAttestedStake = (row, { locale, NPMTokenSymbol }) => {
  return (
    <td className='max-w-xs p-4 pr-8 text-sm leading-5 text-center whitespace-nowrap text-01052D'>
      <div className='flex items-center justify-center'>

        <Badge className='mr-2 rounded-full bg-21AD8C'>
          Yes
        </Badge>
        <StakeText
          amount={row.totalAttestationStake}
          locale={locale}
          NPMTokenSymbol={NPMTokenSymbol}
        />
      </div>
    </td>
  )
}

const renderRefutedStake = (row, { locale, NPMTokenSymbol }) => {
  return (
    <td className='max-w-xs p-4 text-sm leading-5 text-center pr-7 whitespace-nowrap text-01052D'>
      <div className='flex items-center justify-center'>
        <Badge className='mr-2 rounded-full bg-FA5C2F'>
          No
        </Badge>
        <StakeText
          amount={row.totalRefutationStake}
          locale={locale}
          NPMTokenSymbol={NPMTokenSymbol}
        />

      </div>
    </td>
  )
}

const StakeText = ({ amount, locale, NPMTokenSymbol }) => {
  const textForm = formatCurrency(
    amount,
    locale,
    NPMTokenSymbol,
    true
  )

  return (
    <div title={textForm.long}>
      {textForm.short.split(' ')[0]}
    </div>
  )
}

const renderCover = (row, _extraData) => {
  const isDiversified = isValidProduct(row.productKey)
  const imgSrc = getCoverImgSrc({ key: isDiversified ? row.productKey : row.coverKey })

  return (
    <td className='px-6 py-4 pr-9'>
      <div className='flex items-center text-sm leading-5 cursor-pointer w-[154px] text-01052D'>
        <img
          src={imgSrc}
          alt={row.projectOrProductName}
          className='w-6 h-6 mr-2'
          data-testid='cover-img'
            // @ts-ignore
          onError={(ev) => { if (!ev.target.src.endsWith('/images/covers/empty.svg')) { ev.target.src = '/images/covers/empty.svg' } }}
        />
        <div className='overflow-hidden text-sm overflow-ellipsis' title={row.projectOrProductName}>
          {row.projectOrProductName}
        </div>
      </div>
    </td>
  )
}

const renderProtection = (row, { locale, liquidityTokenDecimals }) => {
  const protection = formatCurrency(
    convertFromUnits(row.coverOrProductData.commitment.toString(), liquidityTokenDecimals),
    locale
  )

  return (
    <td className='max-w-xs px-6 py-5 text-sm leading-5 text-right whitespace-nowrap text-01052D'>
      <div title={protection.long}>
        {protection.short}
      </div>
    </td>
  )
}

/**
 * Returns an array of column objects for the proposals table.
 * Each object represents a column and contains properties such as id, name, alignment, and render functions.
 *
 * @param {import('@lingui/core').I18n} i18n - The I18n instance from Lingui library.
 * @returns {Array<{id: string, name: string, align: string, renderHeader: Function, renderData: (row: any, extraData: any, index: number) => React.JSX.Element}>} An array of column objects.
 */
const getColumns = (i18n) => {
  return [
    {
      id: 'cover',
      name: t(i18n)`cover`,
      align: 'left',
      renderHeader,
      renderData: renderCover
    },
    {
      id: 'status',
      name: t(i18n)`status`,
      align: 'left',
      renderHeader,
      renderData: renderStatus
    },
    {
      id: 'attested',
      name: t(i18n)`attested`,
      align: 'left',
      renderHeader,
      renderData: renderAttestedStake
    },
    {
      id: 'refuted',
      name: t(i18n)`refuted`,
      align: 'left',
      renderHeader,
      renderData: renderRefutedStake
    },
    {
      id: 'protection',
      name: t(i18n)`protection`,
      align: 'right',
      renderHeader,
      renderData: renderProtection
    }
  ]
}

function Consensus ({ data, loading, setConsensusIndex }) {
  const router = useRouter()
  const { liquidityTokenDecimals, NPMTokenSymbol } = useAppConstants()
  const { loading: dataLoading, getProduct, getCoverByCoverKey } = useCoversAndProducts()

  const reports = loading ? [] : data.incidentReports || []
  const rowsData = reports.map(report => {
    const coverKey = report.coverKey
    const productKey = report.productKey

    const isDiversified = isValidProduct(productKey)
    const coverOrProductData = isDiversified ? getProduct(coverKey, productKey) : getCoverByCoverKey(coverKey)
    const projectOrProductName = isDiversified ? coverOrProductData?.productInfoDetails?.productName : coverOrProductData?.coverInfoDetails.coverName || coverOrProductData?.coverInfoDetails.projectName

    return {
      ...report,
      coverOrProductData,
      projectOrProductName
    }
  })

  const { i18n } = useLingui()

  const columns = getColumns(i18n)

  if (dataLoading) {
    return <Loading />
  }

  return (
    <div>
      <div className='text-xl'>Protocols In Consensus</div>

      <TableWrapper className='xl:overflow-x-hidden'>
        <Table>
          <THead
            columns={columns}
          />
          <TBody
            isLoading={loading}
            extraData={{
              locale: router.locale,
              liquidityTokenDecimals,
              setConsensusIndex,
              NPMTokenSymbol
            }}
            onRowClick={(idx) => {
              setConsensusIndex(idx)
            }}
            columns={columns}
            data={rowsData}
          />
        </Table>
      </TableWrapper>
    </div>
  )
}

export default Consensus
