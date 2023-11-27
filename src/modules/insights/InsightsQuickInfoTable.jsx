import {
  useMemo,
  useState
} from 'react'

import { useRouter } from 'next/router'

import {
  Table,
  TableWrapper,
  TBody,
  THead
} from '@/common/Table/Table'
import PreviousNext from '@/src/common/PreviousNext'
import { renderHeader } from '@/src/common/Table/renderHeader'
import { useAppConstants } from '@/src/context/AppConstants'
import { useCoversAndProducts2 } from '@/src/context/CoversAndProductsData2'
import {
  getCoverImgSrc,
  isValidProduct
} from '@/src/helpers/cover'
import {
  convertFromUnits,
  toBN
} from '@/utils/bn'
import { formatCurrency } from '@/utils/formatter/currency'
import { formatPercent } from '@/utils/formatter/percent'
import {
  SORT_DATA_TYPES,
  sorter
} from '@/utils/sorting'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'

const RenderProductName = ({ coverKey, productKey, data }) => {
  const isDiversified = isValidProduct(productKey)
  const coverOrProductName = !isDiversified
    ? data?.coverInfoDetails?.coverName || data?.coverInfoDetails?.projectName
    : data?.productInfoDetails?.productName
  const imgSrc = getCoverImgSrc({ key: isDiversified ? productKey : coverKey })

  return (
    <td className='px-6 py-4 min-w-300 w-80'>
      <div
        className='flex flex-row text-sm leading-5 whitespace-normal text-01052D'
        title={coverOrProductName}
      >
        <img
          src={imgSrc}
          alt={coverOrProductName}
          width='24'
          height='24'
          className='mr-2 rounded-full shrink-0'
        />
        <span> {coverOrProductName}  </span>
      </div>
    </td>
  )
}

const RenderUtilizationRatio = ({ ratio, locale }) => {
  return (
    <td
      className='px-6 py-2.5 text-sm leading-5 text-01052D'
    >
      <div
        className='inline-block px-2 py-2 text-sm rounded-lg text-21AD8C bg-EAF7F8'
        title={formatPercent(ratio, locale)}
      >
        {formatPercent(ratio, locale)}
      </div>
    </td>
  )
}

const RenderCapacity = ({ capacity, locale, liquidityTokenDecimals }) => {
  return (
    <td
      className='px-6 py-4 text-sm leading-5 text-right text-01052D'
    >
      <span
        title={
          formatCurrency(
            convertFromUnits(capacity, liquidityTokenDecimals).toString(),
            locale
          ).long
        }
      >
        {
        formatCurrency(
          convertFromUnits(capacity, liquidityTokenDecimals).toString(),
          locale
        ).short
      }
      </span>
    </td>
  )
}

const getColumns = (i18n) => {
  return [
    {
      id: 'cover',
      name: t(i18n)`Cover`,
      align: 'left',
      renderHeader: col => { return renderHeader(col, null, null, null, 'xs:text-999BAB lg:text-404040') },
      renderData: (row) => { return <RenderProductName data={row} productKey={row.productKey} coverKey={row.coverKey} /> }
    },
    {
      id: 'utilization ratio',
      name: t(i18n)`Utilization Ratio`,
      align: 'left',
      renderHeader: col => { return renderHeader(col, null, null, null, 'xs:text-999BAB lg:text-404040') },
      renderData: (row, { locale }) => { return <RenderUtilizationRatio ratio={row.utilizationRatio} locale={locale} /> }
    },
    {
      id: 'capacity',
      name: t(i18n)`Capacity`,
      align: 'right',
      renderHeader: col => { return renderHeader(col, null, null, null, 'xs:text-999BAB lg:text-404040') },
      renderData: (row, { locale, liquidityTokenDecimals }) => { return <RenderCapacity capacity={row.capacity} liquidityTokenDecimals={liquidityTokenDecimals} locale={locale} /> }
    }
  ]
}

const ROWS_PER_PAGE = 3

export const InsightsQuickInfoTable = () => {
  const [page, setPage] = useState(1)

  const paginateLeft = () => {
    setPage(page - 1)
  }
  const paginateRight = () => {
    setPage(page + 1)
  }

  const { loading, getAllProducts } = useCoversAndProducts2()
  const topCovers = useMemo(() => {
    const products = getAllProducts()
      .filter(x => { return toBN(x.utilizationRatio).isGreaterThanOrEqualTo(0.7) })

    const result = sorter({
      datatype: SORT_DATA_TYPES.BIGNUMBER,
      list: products,
      selector: x => { return x.utilizationRatio }
    })

    return result
  }, [getAllProducts])

  const { locale } = useRouter()
  const { liquidityTokenDecimals } = useAppConstants()

  const paginatedData = topCovers.slice((page - 1) * ROWS_PER_PAGE, (page - 1) * ROWS_PER_PAGE + ROWS_PER_PAGE)

  const { i18n } = useLingui()

  const columns = getColumns(i18n)

  return (
    <div>
      <hr className='border-t-0.5 border-t-B0C4DB' />

      <div className='flex justify-between pt-6 pb-6 lg:pt-10 flex-start lg:pb-25px'>
        <div>
          <h2 className='text-display-xs'>Top Covers </h2>
        </div>
        <div className='flex gap-x-5'>
          <PreviousNext
            onPrevious={paginateLeft}
            onNext={paginateRight}
            hasPrevious={page > 1}
            hasNext={page < (Math.ceil(topCovers.length / ROWS_PER_PAGE))}
          />
        </div>
      </div>
      <TableWrapper className='mt-0'>
        <Table>
          <THead theadClass='bg-F6F7F9' columns={columns} />
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
