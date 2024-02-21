import { useRouter } from 'next/router'

import {
  Table,
  TableWrapper,
  TBody,
  THead
} from '@/common/Table/Table'
import {
  ChainLogos,
  NetworkNames
} from '@/lib/connect-wallet/config/chains'
import { renderHeader } from '@/src/common/Table/renderHeader'
import { formatCurrency } from '@/utils/formatter/currency'

const RenderNetwork = ({ networkId }) => {
  const LogoIcon = ChainLogos[networkId]
  const networkName = NetworkNames[networkId]

  return (
    <td
      className='px-6 py-4'
    >
      <div className='flex flex-row text-sm leading-5 w-54 text-01052D' title={networkName}>
        <LogoIcon width='24' height='24' className='mr-2 rounded-full shrink-0' />
        <span> {networkName} </span>
      </div>
    </td>
  )
}

const RenderCover = ({ coverFee }) => {
  const router = useRouter()

  return (
    <td
      className='px-6 py-4 text-sm leading-5 text-01052D'
    >
      <span
        title={
          formatCurrency(coverFee, router.locale).long
        }
      >
        {formatCurrency(coverFee, router.locale).short}
      </span>
    </td>
  )
}

const RenderCapacity = ({ capacity }) => {
  const router = useRouter()

  return (
    <td
      className='px-6 py-4 text-sm leading-5 text-right text-01052D'
    >
      <span
        title={
          formatCurrency(capacity, router.locale).long
        }
      >
        {formatCurrency(capacity, router.locale).short}
      </span>
    </td>
  )
}

const RenderTVL = ({ tvl }) => {
  const router = useRouter()

  return (
    <td
      className='px-6 py-4 text-sm leading-5 text-right text-01052D'
    >
      <span
        title={
          formatCurrency(tvl, router.locale).long
        }
      >
        {formatCurrency(tvl, router.locale).short}
      </span>
    </td>
  )
}

/**
 * Returns an array of column objects for the proposals table.
 * Each object represents a column and contains properties such as id, name, alignment, and render functions.
 *
 * @returns {Array<{id: string, name: string, align: string, renderHeader: Function, renderData: (row: any, extraData: any, index: number) => React.JSX.Element}>} An array of column objects.
 */
const getColumns = () => {
  return [
    {
      id: 'Network',
      name: 'Network',
      align: 'left',
      renderHeader: col => { return renderHeader(col, null, null, null, 'xs:text-999BAB lg:text-404040') },
      renderData: (row) => { return <RenderNetwork networkId={row.networkId} /> }
    },
    {
      id: 'Cover Fee Earned',
      name: 'Cover Fee Earned',
      align: 'left',
      renderHeader: col => { return renderHeader(col, null, null, null, 'xs:text-999BAB lg:text-404040') },
      renderData: (row) => { return <RenderCover coverFee={row.coverFee} /> }
    },
    {
      id: 'TVL',
      name: 'TVL',
      align: 'right',
      renderHeader: col => { return renderHeader(col, null, null, null, 'xs:text-999BAB lg:text-404040') },
      renderData: (row) => { return <RenderTVL tvl={row.tvl} /> }
    },
    {
      id: 'Capacity',
      name: 'Capacity',
      align: 'right',
      renderHeader: col => { return renderHeader(col, null, null, null, 'xs:text-999BAB lg:text-404040') },
      renderData: (row) => { return <RenderCapacity capacity={row.capacity} /> }
    }
  ]
}

export const InsightsTVLTable = ({ data, loading }) => {
  const columns = getColumns()

  return (
    <div>
      <hr className='border-t-0.5 border-t-B0C4DB' />

      <div className='flex justify-between pt-6 pb-6 lg:pt-10 flex-start lg:pb-25px'>
        <div>
          <h2 className='text-display-xs'>TVL Distribution </h2>
        </div>
      </div>
      <TableWrapper className='mt-0'>
        <Table>
          <THead theadClass='bg-F6F7F9' columns={columns} />
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
