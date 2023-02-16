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
import { useCoverOrProductData } from '@/src/hooks/useCoverOrProductData'
import { getCoverImgSrc, isValidProduct } from '@/src/helpers/cover'
import { useFetchCoverStats } from '@/src/hooks/useFetchCoverStats'
import { formatCurrency } from '@/utils/formatter/currency'
import { convertFromUnits } from '@/utils/bn'
import { useAppConstants } from '@/src/context/AppConstants'
import { useRouter } from 'next/router'

const { Badge: CardStatusBadge, identifyStatus, E_CARD_STATUS } = CardStatusBadgeDefault

const renderStatus = (row) => {
  const status = identifyStatus(row.status)
  return (
    <td className='max-w-xs px-6 py-4.5 text-sm leading-5 whitespace-nowrap text-01052D'>
      {status !== E_CARD_STATUS.NORMAL && (
        <CardStatusBadge
          className='rounded-1 py-0 leading-4 border-0 tracking-normal inline-block !text-xs'
          status={status}
        />
      )}
    </td>
  )
}

const renderAttestedStake = (row) => {
  return (
    <td className='max-w-xs px-6 py-4.5 text-sm leading-5 text-center whitespace-nowrap text-01052D'>
      <div className='flex items-center justify-center'>

        <Badge className='mr-2 rounded-full bg-21AD8C'>
          Yes
        </Badge>
        <StakeText amount={row.totalAttestedStake} />
      </div>
    </td>
  )
}

const renderRefutedStake = (row) => {
  return (
    <td className='max-w-xs px-6 py-4.5 text-sm leading-5 text-center whitespace-nowrap text-01052D'>
      <div className='flex items-center justify-center'>
        <Badge className='mr-2 rounded-full bg-FA5C2F'>
          No
        </Badge>
        <StakeText amount={row.totalRefutedStake} />

      </div>
    </td>
  )
}

const StakeText = ({ amount }) => {
  const router = useRouter()

  return (
    <div>
      {formatCurrency(
        convertFromUnits(amount),
        router.locale,
        '',
        true,
        true
      ).short}
    </div>
  )
}

const CoverCell = ({ row }) => {
  const { coverInfo } = useCoverOrProductData({ coverKey: row.coverKey, productKey: row.productKey })

  const isDiversified = isValidProduct(coverInfo?.productKey)

  const name = isDiversified ? coverInfo?.infoObj?.productName : coverInfo?.infoObj?.coverName || coverInfo?.infoObj?.projectName || ''
  const imgSrc = getCoverImgSrc({ key: isDiversified ? row.productKey : row.coverKey })

  return (
    <div className='flex items-center max-w-xs px-6 py-4.5 text-sm leading-5 whitespace-nowrap text-01052D'>
      <img
        src={imgSrc}
        alt={name}
        className='w-6 h-6 mr-2'
        data-testid='cover-img'
            // @ts-ignore
        onError={(ev) => (ev.target.src = '/images/covers/empty.svg')}
      />
      <div className='text-sm'>
        {name}
      </div>
    </div>
  )
}

const ProtectionCell = ({ row }) => {
  const router = useRouter()

  const { liquidityTokenDecimals } = useAppConstants()
  const { info, isLoading } = useFetchCoverStats({ coverKey: row.coverKey, productKey: row.productKey })

  const protectionLong = isLoading
    ? ''
    : formatCurrency(
      convertFromUnits(info.activeCommitment, liquidityTokenDecimals).toString(),
      router.locale
    ).short

  return (
    <div>
      {protectionLong}
    </div>
  )
}

const renderCover = (row) => {
  return (
    <td className=''>
      <CoverCell row={row} />
    </td>
  )
}

const renderProtection = (row) => {
  return (
    <td
      className='max-w-xs px-6 py-4.5 text-sm leading-5 text-right whitespace-nowrap text-01052D'
    >
      <ProtectionCell row={row} />
    </td>
  )
}

const columns = [
  {
    name: t`cover`,
    align: 'left',
    renderHeader,
    renderData: renderCover
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
    renderData: renderProtection
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
