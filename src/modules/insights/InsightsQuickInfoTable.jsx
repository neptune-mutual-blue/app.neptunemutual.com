import {
  Table,
  TableWrapper,
  TBody,
  THead
} from '@/common/Table/Table'
import { getCoverImgSrc, isValidProduct } from '@/src/helpers/cover'
import { formatPercent } from '@/utils/formatter/percent'
import { formatCurrency } from '@/utils/formatter/currency'

import { t } from '@lingui/macro'

import { renderHeader } from '@/src/common/Table/renderHeader'
import PreviousNext from '@/src/common/PreviousNext'

import { convertFromUnits, toBN } from '@/utils/bn'
import { useState } from 'react'
import { useCovers } from '@/src/hooks/useCovers'
import { sorter, SORT_DATA_TYPES } from '@/utils/sorting'
import { useAppConstants } from '@/src/context/AppConstants'
import { useRouter } from 'next/router'

const RenderNetwork = ({ coverKey, productKey, infoObj }) => {
  const isDiversified = isValidProduct(productKey)
  const name = isDiversified ? infoObj?.productName : infoObj?.coverName || infoObj?.projectName || ''
  const imgSrc = getCoverImgSrc({ key: isDiversified ? productKey : coverKey })

  return (
    <td className='px-6 py-4 w-80'>
      <div
        className='flex flex-row text-sm leading-5 text-01052D whitespace-nowrap'
        title={name}
      >
        <img
          src={imgSrc}
          alt={infoObj?.coverName || infoObj?.projectName}
          width='24'
          height='24'
          className='mr-2 rounded-full shrink-0'
        />
        <span> {name}  </span>
      </div>
    </td>
  )
}

const RenderUtilisationRatio = ({ stats, locale }) => {
  return (
    <td
      className='px-6 py-4 text-sm leading-5 text-01052D'
    >
      <div
        className='inline-block px-2 py-2 text-sm text-21AD8C bg-EAF7F8 rounded-xl'
        title={formatPercent(stats.utilization, locale)}
      >
        {formatPercent(stats.utilization, locale)}
      </div>
    </td>
  )
}

const RenderCapacity = ({ stats, locale, liquidityTokenDecimals }) => {
  return (
    <td
      className='px-6 py-4 text-sm leading-5 text-right text-01052D'
    >
      <span
        title={
          formatCurrency(
            convertFromUnits(stats.liquidity, liquidityTokenDecimals).toString(),
            locale
          ).long
        }
      >
        {
        formatCurrency(
          convertFromUnits(stats.liquidity, liquidityTokenDecimals).toString(),
          locale
        ).short
      }
      </span>
    </td>
  )
}

const columns = [
  {
    name: t`Cover`,
    align: 'left',
    renderHeader: col => renderHeader(col, null, null, null, 'xs:text-999BAB lg:text-404040'),
    renderData: (row) => <RenderNetwork infoObj={row.infoObj} productKey={row.productKey} coverKey={row.coverKey} />
  },
  {
    name: t`Utilization Ratio`,
    align: 'left',
    renderHeader: col => renderHeader(col, null, null, null, 'xs:text-999BAB lg:text-404040'),
    renderData: (row, { locale }) => <RenderUtilisationRatio stats={row.stats} locale={locale} />
  },
  {
    name: t`Capacity`,
    align: 'right',
    renderHeader: col => renderHeader(col, null, null, null, 'xs:text-999BAB lg:text-404040'),
    renderData: (row, { locale, liquidityTokenDecimals }) => <RenderCapacity stats={row.stats} liquidityTokenDecimals={liquidityTokenDecimals} locale={locale} />
  }
]

const ROWS_PER_PAGE = 3
export const InsightsQuickInfoTable = ({ flattenedCovers, loading }) => {
  useCovers({ supportsProducts: true, fetchInfo: true })
  const [page, setPage] = useState(1)

  const paginateLeft = () => {
    setPage(page - 1)
  }
  const paginateRight = () => {
    setPage(page + 1)
  }

  const { locale } = useRouter()
  const { liquidityTokenDecimals } = useAppConstants()

  const filtered = flattenedCovers.filter(cover => {
    return toBN(cover.stats.utilization).isGreaterThanOrEqualTo(0.7)
  })

  const sorted = sorter({
    datatype: SORT_DATA_TYPES.BIGNUMBER,
    list: [...filtered],
    selector: (cover) => cover?.stats.utilization
  })
  const paginatedData = sorted.slice((page - 1) * ROWS_PER_PAGE, (page - 1) * ROWS_PER_PAGE + ROWS_PER_PAGE)

  return (
    <div>
      <hr className='border-t-0.5 border-t-B0C4DB' />

      <div className='flex justify-between pt-6 pb-6 lg:pt-10 flex-start lg:pb-25px'>
        <div>
          <h2 className='text-h3'>Top Covers </h2>
        </div>
        <div className='flex gap-x-5'>
          <PreviousNext
            onPrevious={paginateLeft}
            onNext={paginateRight}
            hasPrevious={page > 1}
            hasNext={page < (Math.floor(sorted.length / ROWS_PER_PAGE))}
          />
        </div>
      </div>
      <TableWrapper className='mt-0'>
        <Table>
          <THead theadClass='bg-f6f7f9' columns={columns} />
          <TBody
            isLoading={loading}
            columns={columns}
            data={paginatedData}
            extraData={{ locale, liquidityTokenDecimals }}
          />
        </Table>
      </TableWrapper>
    </div>
  )
}
