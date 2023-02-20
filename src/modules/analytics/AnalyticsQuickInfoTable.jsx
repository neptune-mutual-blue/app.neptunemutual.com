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
import { utils } from '@neptunemutual/sdk'
import { useCoverOrProductData } from '@/src/hooks/useCoverOrProductData'

import { useRouter } from 'next/router'
import { useAppConstants } from '@/src/context/AppConstants'

import { renderHeader } from '@/src/common/Table/renderHeader'
import PreviousNext from '@/src/common/PreviousNext'
import {
  useFlattenedCoverProducts
} from '@/src/hooks/useFlattenedCoverProducts'
import { useFetchCoverStats } from '@/src/hooks/useFetchCoverStats'
import { convertFromUnits, toBN } from '@/utils/bn'
import { useState } from 'react'

const RenderNetwork = ({ coverKey, productKey }) => {
  const { coverInfo } = useCoverOrProductData({ coverKey, productKey: productKey })
  const isDiversified = isValidProduct(coverInfo?.productKey)
  const name = isDiversified ? coverInfo?.infoObj?.productName : coverInfo?.infoObj?.coverName || coverInfo?.infoObj?.projectName || ''
  const imgSrc = getCoverImgSrc({ key: isDiversified ? productKey : coverKey })

  return (
    <td className='px-6 py-4'>
      <div className='flex flex-row text-sm leading-5 text-01052D whitespace-nowrap'>
        <img src={imgSrc} alt={coverInfo?.infoObj?.coverName || coverInfo?.infoObj?.projectName} width='24' height='24' className='mr-2 rounded-full shrink-0' />
        <span> {name}  </span>
      </div>
    </td>
  )
}

const RenderUtilisationRatio = ({ coverKey, productKey }) => {
  const router = useRouter()
  const _productKey = isValidProduct(productKey) ? productKey : utils.keyUtil.toBytes32('')
  const { coverInfo } = useCoverOrProductData({ coverKey, productKey: _productKey })

  const { info: coverStats } = useFetchCoverStats({
    coverKey: coverKey,
    productKey: _productKey
  })

  const isDiversified = coverInfo?.supportsProducts
  const { activeCommitment, availableLiquidity } = coverStats

  const liquidity = isDiversified
    ? coverStats.totalPoolAmount
    : toBN(availableLiquidity).plus(activeCommitment).toString()
  const utilization = toBN(liquidity).isEqualTo(0)
    ? '0'
    : toBN(activeCommitment).dividedBy(liquidity).decimalPlaces(2).toString()

  return (
    <td
      className='px-6 py-4 text-sm leading-5 text-01052D'
    >
      <div className='inline-block px-2 py-2 text-sm text-21AD8C bg-EAF7F8 rounded-xl'>
        {formatPercent(utilization, router.locale)}
      </div>
    </td>
  )
}

const RenderCapacity = ({ coverKey, productKey }) => {
  const { liquidityTokenDecimals } = useAppConstants()
  const router = useRouter()
  const _productKey = isValidProduct(productKey) ? productKey : utils.keyUtil.toBytes32('')
  const { coverInfo } = useCoverOrProductData({ coverKey, productKey: _productKey })

  const { info: coverStats } = useFetchCoverStats({
    coverKey: coverKey,
    productKey: _productKey
  })

  const isDiversified = coverInfo?.supportsProducts
  const { activeCommitment, availableLiquidity } = coverStats

  const liquidity = isDiversified
    ? coverStats.totalPoolAmount // for diversified cover -> liquidity does not consider capital efficiency
    : toBN(availableLiquidity).plus(activeCommitment).toString()

  return (
    <td
      className='px-6 py-4 text-sm leading-5 text-right text-01052D'
    >
      <span>
        {
        formatCurrency(
          convertFromUnits(liquidity, liquidityTokenDecimals).toString(),
          router.locale
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
    renderData: (row) => <RenderNetwork productKey={row.productKey} coverKey={row.coverKey} />
  },
  {
    name: t`Utilization Ratio`,
    align: 'left',
    renderHeader: col => renderHeader(col, null, null, null, 'xs:text-999BAB lg:text-404040'),
    renderData: (row) => <RenderUtilisationRatio productKey={row.productKey} coverKey={row.coverKey} />
  },
  {
    name: t`Capacity`,
    align: 'right',
    renderHeader: col => renderHeader(col, null, null, null, 'xs:text-999BAB lg:text-404040'),
    renderData: (row) => <RenderCapacity productKey={row.productKey} coverKey={row.coverKey} />
  }
]

const ROWS_PER_PAGE = 3
export const AnalyticsQuickInfoTable = () => {
  const { data: flattenedCovers, loading: flattenedCoversLoading } = useFlattenedCoverProducts()
  const [page, setPage] = useState(1)

  const paginateLeft = () => {
    setPage(page - 1)
  }
  const paginateRight = () => {
    setPage(page + 1)
  }

  const paginatedData = flattenedCovers.slice((page - 1) * ROWS_PER_PAGE, (page - 1) * ROWS_PER_PAGE + ROWS_PER_PAGE)

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
            hasNext={page < (Math.abs(flattenedCovers.length / ROWS_PER_PAGE))}
          />
        </div>
      </div>
      <TableWrapper className='mt-0'>
        <Table>
          <THead theadClass='bg-f6f7f9' columns={columns} />
          <TBody
            isLoading={flattenedCoversLoading}
            columns={columns}
            data={paginatedData}
          />
        </Table>
      </TableWrapper>
    </div>
  )
}
