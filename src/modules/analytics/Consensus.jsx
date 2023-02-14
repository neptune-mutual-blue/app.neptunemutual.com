import {
  Table,
  TableWrapper,
  TBody,
  THead
} from '@/common/Table/Table'
import { t } from '@lingui/macro'
import { renderHeader } from '@/common/Table/renderHeader'
import { useConsensusAnalytics } from '@/src/hooks/useConsensusAnalytics'
import * as CardStatusBadgeDefault from '@/common/CardStatusBadge'
import { Badge } from '@/common/Badge/Badge'

const { Badge: CardStatusBadge, identifyStatus, E_CARD_STATUS } = CardStatusBadgeDefault

const renderStatus = (row) => {
  const status = identifyStatus(row.status)
  return (
    <td className='text-right'>
      {status !== E_CARD_STATUS.NORMAL && (
        <CardStatusBadge
          className='rounded-1 py-0 leading-4 border-0 tracking-normal inline-block !text-xs'
          status={status}
        />
      )}
    </td>
  )
}

const renderAttestedStake = () => {
  return (
    <td className='text-right'>
      <Badge className='rounded-full bg-21AD8C'>
        Yes
      </Badge>
    </td>
  )
}

const renderRefutedStake = () => {
  return (
    <td className='text-right'>
      <Badge className='rounded-full bg-FA5C2F'>
        No
      </Badge>
    </td>
  )
}

const columns = [
  {
    name: t`cover`,
    align: 'left',
    renderHeader,
    renderData: () => {
      return (
        <td
          className='max-w-xs px-6 py-4.5 text-sm leading-5 whitespace-nowrap text-01052D'
        >
          Hi
        </td>
      )
    }
  },
  {
    name: t`status`,
    align: 'left',
    renderHeader,
    renderData: renderStatus
  },
  {
    name: t`total attested stake`,
    align: 'right',
    renderHeader,
    renderData: renderAttestedStake
  },
  {
    name: t`total refuted stake`,
    align: 'right',
    renderHeader,
    renderData: renderRefutedStake
  },
  {
    name: t`protection`,
    align: 'right',
    renderHeader,
    renderData: () => {
      return (
        <td
          className='max-w-xs px-6 py-4.5 text-sm leading-5 text-right whitespace-nowrap text-01052D'
        >
          Hi
        </td>
      )
    }
  }
]

function Consensus () {
  const { data, loading } = useConsensusAnalytics()

  return (
    <div>
      <div className='text-xl'>Protocols In Consensus</div>

      <TableWrapper>
        <Table>
          <THead
            columns={columns}
          />
          <TBody
            extraData={{}}
            columns={columns}
            data={loading ? [] : data.incidentReports}
          />
        </Table>
      </TableWrapper>
    </div>
  )
}

export default Consensus
