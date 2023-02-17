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

const RenderCover = ({ coverFee }) => {
  const router = useRouter()
  const { liquidityTokenDecimals } = useAppConstants()
  return (
    <td
      className='px-6 py-4 text-sm leading-5 text-01052D'
    >
      <span>
        {formatCurrency(
          convertFromUnits(
            coverFee,
            liquidityTokenDecimals
          ).toString(),
          router.locale
        ).short}
      </span>
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

const RenderTVL = ({ tvl }) => {
  const router = useRouter()
  const { liquidityTokenDecimals } = useAppConstants()

  return (
    <td
      className='px-6 py-4 text-sm leading-5 text-right text-01052D'
    >
      <span>
        {formatCurrency(
          convertFromUnits(
            tvl,
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
    renderData: (row) => <RenderNetwork LogoIcon={row.LogoIcon} name={row.name} />
  },
  {
    name: t`Cover Fee Earned`,
    align: 'left',
    renderHeader: col => renderHeader(col, null, null, null, 'xs:text-999BAB lg:text-404040'),
    renderData: (row) => <RenderCover coverFee={row.coverFee} />
  },
  {
    name: t`TVL`,
    align: 'right',
    renderHeader: col => renderHeader(col, null, null, null, 'xs:text-999BAB lg:text-404040'),
    renderData: (row) => <RenderTVL tvl={row.tvl} />
  },
  {
    name: t`Capacity`,
    align: 'right',
    renderHeader: col => renderHeader(col, null, null, null, 'xs:text-999BAB lg:text-404040'),
    renderData: (row) => <RenderCapacity capacity={row.capacity} />
  }
]

export const AnalyticsTVLTable = ({ data, loading }) => {
  return (
    <div>
      <hr className='border-t-0.5 border-t-B0C4DB' />

      <div className='flex justify-between pt-6 pb-6 lg:pt-10 flex-start lg:pb-25px'>
        <div>
          <h2 className='text-h3'>TVL Distribution </h2>
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
