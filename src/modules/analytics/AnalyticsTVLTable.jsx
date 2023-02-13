import {
  Table,
  TableWrapper,
  TBody,
  THead
} from '@/common/Table/Table'

import { useWeb3React } from '@web3-react/core'
import { t, Trans } from '@lingui/macro'

import { formatCurrency } from '@/utils/formatter/currency'
import { convertFromUnits } from '@/utils/bn'
import { useRouter } from 'next/router'
import { useAppConstants } from '@/src/context/AppConstants'

import { renderHeader } from '@/src/common/Table/renderHeader'

import { useFetchAnalyticsTVLStats } from '@/src/services/aggregated-stats/analytics'

const RenderNetwork = ({ LogoIcon, name }) => (
  <td
    className='px-6 py-6'
  >
    <div className='flex flex-row '>
      <LogoIcon width='24' height='24' style={{ borderRadius: '50%', marginRight: '8px' }} />
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

export const AnalyticsTVLTable = () => {
  const { data: TVLStats, loading } = useFetchAnalyticsTVLStats()

  const { account } = useWeb3React()

  return (
    <div>
      <hr className='h-px border-0.5 border-B0C4DB' />

      <div className='flex flex-start justify-between pt-10 pb-25px'>
        <div>
          <h2> TVL Distribution </h2>
        </div>
      </div>
      <TableWrapper className='border-collapse rounded-2xl border-B0C4DB '>
        <Table>
          <THead theadClass='bg-f6f7f9 text-black font-normal border-b-1 border-B0C4DB rounded-2xl text-404040' columns={columns} />
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
