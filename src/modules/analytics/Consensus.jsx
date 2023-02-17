import {
  Table,
  TableWrapper,
  TBody,
  THead
} from '@/common/Table/Table'
import { t } from '@lingui/macro'
import { renderHeader } from '@/common/Table/renderHeader'
import * as CardStatusBadgeDefault from '@/common/CardStatusBadge'
import { Badge } from '@/common/Badge/Badge'
import { useCoverOrProductData } from '@/src/hooks/useCoverOrProductData'
import { getCoverImgSrc, isValidProduct } from '@/src/helpers/cover'
import { useFetchCoverStats } from '@/src/hooks/useFetchCoverStats'
import { formatCurrency } from '@/utils/formatter/currency'
import { convertFromUnits } from '@/utils/bn'
import { useAppConstants } from '@/src/context/AppConstants'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

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

const renderAttestedStake = (row, { locale, NPMTokenSymbol }) => {
  return (
    <td className='max-w-xs px-6 py-4.5 text-sm leading-5 whitespace-nowrap text-01052D'>
      <div className='flex items-center justify-center'>

        <Badge className='mr-2 rounded-full bg-21AD8C'>
          Yes
        </Badge>
        <StakeText
          amount={row.totalAttestedStake}
          locale={locale}
          NPMTokenSymbol={NPMTokenSymbol}
        />
      </div>
    </td>
  )
}

const renderRefutedStake = (row, { locale, NPMTokenSymbol }) => {
  return (
    <td className='max-w-xs px-6 py-4.5 text-sm leading-5 whitespace-nowrap text-01052D'>
      <div className='flex items-center justify-center'>
        <Badge className='mr-2 rounded-full bg-FA5C2F'>
          No
        </Badge>
        <StakeText
          amount={row.totalRefutedStake}
          locale={locale}
          NPMTokenSymbol={NPMTokenSymbol}
        />

      </div>
    </td>
  )
}

const StakeText = ({ amount, locale, NPMTokenSymbol }) => {
  const textForm = formatCurrency(
    convertFromUnits(amount),
    locale,
    NPMTokenSymbol,
    true,
    true
  )

  return (
    <div title={textForm.long}>
      {textForm.short.split(' ')[0]}
    </div>
  )
}

const CoverCell = ({ row, setData, index }) => {
  const { coverInfo } = useCoverOrProductData({ coverKey: row.coverKey, productKey: row.productKey })

  const isDiversified = isValidProduct(coverInfo?.productKey)

  const name = isDiversified ? coverInfo?.infoObj?.productName : coverInfo?.infoObj?.coverName || coverInfo?.infoObj?.projectName || ''
  const imgSrc = getCoverImgSrc({ key: isDiversified ? row.productKey : row.coverKey })

  useEffect(() => {
    setData((_data) => {
      const newRow = row
      newRow.coverInfo = coverInfo
      newRow.name = name
      newRow.imgSrc = imgSrc
      _data.incidentReports[index] = newRow

      return _data
    })
  }, [coverInfo, row, imgSrc, index, name, setData])

  return (
    <div
      className='flex items-center max-w-15 px-6 py-4.5 text-sm leading-5 text-01052D cursor-pointer'
    >
      <img
        src={imgSrc}
        alt={name}
        className='w-6 h-6 mr-2'
        data-testid='cover-img'
            // @ts-ignore
        onError={(ev) => (ev.target.src = '/images/covers/empty.svg')}
      />
      <div className='text-sm whitespace-nowrap overflow-ellipsis overflow-hidden' title={name}>
        {name}
      </div>
    </div>
  )
}

const ProtectionCell = ({ row, locale, liquidityTokenDecimals, index, setData }) => {
  const { info, isLoading } = useFetchCoverStats({ coverKey: row.coverKey, productKey: row.productKey })

  const protectionLong = isLoading
    ? {
        short: '',
        long: ''
      }
    : formatCurrency(
      convertFromUnits(info.activeCommitment, liquidityTokenDecimals).toString(),
      locale
    )

  useEffect(() => {
    setData((_data) => {
      const newRow = row
      newRow.coverStats = info
      newRow.coverStatsLoading = isLoading
      _data.incidentReports[index] = newRow

      return _data
    })
  }, [info, row, isLoading, setData, index])

  return (
    <div title={protectionLong.long}>
      {protectionLong.short}
    </div>
  )
}

const renderCover = (row, { data, setData }, index) => {
  return (
    <td className=''>
      <CoverCell row={row} data={data} setData={setData} index={index} />
    </td>
  )
}

const renderProtection = (row, { liquidityTokenDecimals, locale, setData }, index) => {
  return (
    <td
      className='max-w-xs px-6 py-4.5 text-sm leading-5 text-right whitespace-nowrap text-01052D'
    >
      <ProtectionCell row={row} liquidityTokenDecimals={liquidityTokenDecimals} locale={locale} setData={setData} index={index} />
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
    name: t`attested`,
    align: 'left',
    renderHeader,
    renderData: renderAttestedStake
  },
  {
    name: t`refuted`,
    align: 'left',
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

function Consensus ({ data, loading, setData, setConsensusIndex }) {
  const router = useRouter()
  const { liquidityTokenDecimals, NPMTokenSymbol } = useAppConstants()

  return (
    <div>
      <div className='text-xl'>Protocols In Consensus</div>

      <TableWrapper>
        <Table>
          <THead
            columns={columns}
          />
          <TBody
            isLoading={loading}
            extraData={{
              locale: router.locale,
              liquidityTokenDecimals,
              setData,
              setConsensusIndex,
              NPMTokenSymbol
            }}
            onRowClick={(idx) => {
              setConsensusIndex(idx)
            }}
            columns={columns}
            data={loading ? [] : data.incidentReports}
          />
        </Table>
      </TableWrapper>
    </div>
  )
}

export default Consensus
