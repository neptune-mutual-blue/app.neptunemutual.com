import {
  Table,
  TableWrapper,
  TBody,
  THead
} from '@/common/Table/Table'

import { t } from '@lingui/macro'

import { formatCurrency } from '@/utils/formatter/currency'
import { convertFromUnits } from '@/utils/bn'
import { useRouter } from 'next/router'
import { useAppConstants } from '@/src/context/AppConstants'

import { renderHeader } from '@/src/common/Table/renderHeader'

const RenderNetwork = ({ LogoIcon, name }) => (
  <td
    className='px-6 py-4'
  >
    <div className='flex flex-row text-sm leading-5 text-01052D whitespace-nowrap'>
      <LogoIcon width='24' height='24' className='mr-2 rounded-full shrink-0' />
      <span> {name} </span>
    </div>
  </td>
)

const RenderUtilisationRatio = ({ coverFee }) => {
  const router = useRouter()
  const { liquidityTokenDecimals } = useAppConstants()
  return (
    <td
      className='px-6 py-4 text-sm leading-5 text-01052D'
    >
      <div className='inline-block px-2 py-2 text-21AD8C text-sm bg-EAF7F8 rounded-xl'>
        {formatCurrency(
          convertFromUnits(
            coverFee,
            liquidityTokenDecimals
          ).toString(),
          router.locale
        ).short}
      </div>
    </td>
  )
}

const RenderCapacity = ({ capacity }) => {
  const router = useRouter()
  const { liquidityTokenDecimals } = useAppConstants()
  return (
    <td
      className='px-6 py-4 text-sm leading-5 text-right text-01052D'
    >
      <span>
        {formatCurrency(
          convertFromUnits(
            capacity,
            liquidityTokenDecimals
          ).toString(),
          router.locale
        ).short}
      </span>
    </td>
  )
}

const columns = [
  {
    name: t`Network`,
    align: 'left',
    renderHeader: col => renderHeader(col, null, null, null, 'xs:text-999BAB lg:text-404040'),
    renderData: RenderNetwork
  },
  {
    name: t`Utilisation Ratio`,
    align: 'left',
    renderHeader: col => renderHeader(col, null, null, null, 'xs:text-999BAB lg:text-404040'),
    renderData: RenderUtilisationRatio
  },
  {
    name: t`Capacity`,
    align: 'right',
    renderHeader: col => renderHeader(col, null, null, null, 'xs:text-999BAB lg:text-404040'),
    renderData: RenderCapacity
  }
]

export const AnalyticsQuickInfoTable = ({ data, loading }) => {
  return (
    <div>
      <hr className='border-t-0.5 border-t-B0C4DB' />

      <div className='flex justify-between pt-6 pb-6 lg:pt-10 flex-start lg:pb-25px'>
        <div>
          <h2 className='text-h3'>Top Covers </h2>
        </div>
      </div>
      <TableWrapper className='mt-0'>
        <Table>
          <THead theadClass='bg-f6f7f9' columns={columns} />
          <TBody
            isLoading={loading}
            columns={columns}
            data={data}
          />
        </Table>
      </TableWrapper>
    </div>
  )
}
