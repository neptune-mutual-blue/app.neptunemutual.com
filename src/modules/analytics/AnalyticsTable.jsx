import {
  Table,
  TableWrapper,
  TBody,
  THead
} from '@/common/Table/Table'

import { classNames } from '@/utils/classnames'
import { useWeb3React } from '@web3-react/core'
import { t, Trans } from '@lingui/macro'

import { formatCurrency } from '@/utils/formatter/currency'
import { convertFromUnits } from '@/utils/bn'
import { useRouter } from 'next/router'
import { useAppConstants } from '@/src/context/AppConstants'

import { AnalyticsTitle } from '@/src/modules/analytics/AnalyticsTitle'
import { AnalyticsStats } from '@/src/modules/analytics/AnalyticsStats'

import { useFetchAnalyticsTVLStats } from '@/src/services/aggregated-stats/analytics'

const renderHeader = (col) => (
  <th
    scope='col'
    className={classNames(
      'px-6 py-6 font-bold text-sm uppercase whitespace-nowrap',
      col.align === 'right' ? 'text-right' : 'text-left'
    )}
  >
    {col.name}
  </th>
)

const RenderNetwork = ({ LogoIcon, name }) => (
  <td
    className='px-6 py-6'
  >
    <div className='flex flex-row '>
      <LogoIcon width='32' height='32' classnames='inline-block' style={{ borderRadius: '50%', marginRight: '4px' }} />
      <span> {name} </span>
    </div>
  </td>
)

const RenderCover = ({ coverFee }) => {
  const router = useRouter()
  const { liquidityTokenDecimals } = useAppConstants()
  return (
    <td
      className='px-6 py-6'
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
      className='px-6 py-6'
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

const RenderTVL = () => <td />
const columns = [
  {
    name: t`Network`,
    align: 'left',
    renderHeader,
    renderData: RenderNetwork
  },
  {
    name: t`Cover Fee Earned`,
    align: 'left',
    renderHeader,
    renderData: RenderCover
  },
  {
    name: t`TVL`,
    align: 'right',
    renderHeader,
    renderData: RenderTVL
  },
  {
    name: t`Capacity`,
    align: 'left',
    renderHeader,
    renderData: RenderCapacity
  }
]

export const AnalyticsTable = () => {
  const { data: TVLStats, loading } = useFetchAnalyticsTVLStats()

  const { account } = useWeb3React()

  return (
    <div>
      <hr className='h-px bg-B0C4DB border-0 dark:bg-B0C4DB' />

      <div className='flex flex-start justify-between pt-16 pb-8'>
        <div>
          <h2> TVL Distribution </h2>
        </div>
      </div>
      <TableWrapper className='border-collapse rounded-2xl border-1 border-B0C4DB'>
        <Table>
          <THead theadClass='bg-f6f7f9 text-black font-normal border-b-1 border-B0C4DB rounded-2xl' columns={columns} />
          {account
            ? (
              <TBody
                isLoading={loading}
                columns={columns}
                data={TVLStats}
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
    </div>
  )
}
