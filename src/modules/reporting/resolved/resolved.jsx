import {
  Fragment,
  useMemo,
  useState
} from 'react'

import { useRouter } from 'next/router'

import {
  Badge,
  E_CARD_STATUS,
  identifyStatus
} from '@/common/CardStatusBadge'
import { Container } from '@/common/Container/Container'
import { SearchAndSortBar } from '@/common/SearchAndSortBar'
import { renderHeader } from '@/common/Table/renderHeader'
import {
  Table,
  TableShowMore,
  TableWrapper,
  THead
} from '@/common/Table/Table'
import DateLib from '@/lib/date/DateLib'
import { ResolvedTBodyRow } from '@/modules/reporting/resolved/ResolvedTBodyRow'
import { ReportStatus } from '@/src/config/constants'
import { Routes } from '@/src/config/routes'
import { useCoversAndProducts2 } from '@/src/context/CoversAndProductsData2'
import { useSortableStats } from '@/src/context/SortableStatsContext'
import { isValidProduct } from '@/src/helpers/cover'
import { useResolvedReportings } from '@/src/hooks/useResolvedReportings'
import { useSearchResults } from '@/src/hooks/useSearchResults'
import { convertFromUnits } from '@/utils/bn'
import { formatCurrency } from '@/utils/formatter/currency'
import { getUtcFormatString } from '@/utils/formatter/relative-time'
import {
  sorter, SORT_DATA_TYPES,
  SORT_TYPES
} from '@/utils/sorting'
import { toStringSafe } from '@/utils/string'
import {
  t
} from '@lingui/macro'
import { ResolvedTableSkeleton } from '@/modules/reporting/resolved/ResolvedTableSkeleton'

/**
 * @type {Object.<string, {selector:(any) => any, datatype: any, ascending?: boolean }>}
 */
const sorterData = {
  [SORT_TYPES.ALPHABETIC]: {
    selector: (report) => report.stats.text,
    datatype: SORT_DATA_TYPES.STRING
  },
  [SORT_TYPES.INCIDENT_DATE]: {
    selector: (report) => report.stats.incidentDate,
    datatype: SORT_DATA_TYPES.BIGNUMBER
  },
  [SORT_TYPES.RESOLVED_DATE]: {
    selector: (report) => report.stats.resolvedOn,
    datatype: SORT_DATA_TYPES.BIGNUMBER
  }
}

const options = [
  { name: t`A-Z`, value: SORT_TYPES.ALPHABETIC },
  { name: t`Incident date`, value: SORT_TYPES.INCIDENT_DATE },
  { name: t`Resolved date`, value: SORT_TYPES.RESOLVED_DATE }
]
const defaultSelectedOption = options[2]

const renderCover = (row) => {
  return (
    <td className='max-w-xs px-6 py-6 text-sm'>
      <span className='flex items-center w-max'>
        <img
          src={row.imgSrc}
          alt={
            row.projectOrProductName
          }
          className='rounded-full bg-DEEAF6'
          width={24}
          height={24}
        />
        <p className='ml-2 text-sm text-black grow'>
          {row.projectOrProductName}
        </p>
      </span>
    </td>
  )
}

const renderDateAndTime = (row) => {
  return (
    <td className='px-6 py-6 text-sm leading-5 max-w-180 text-404040'>
      <span
        className='w-max'
        title={DateLib.toLongDateFormat(row.resolvedOn, row.locale)}
      >
        {getUtcFormatString(row.resolvedOn, row.locale)}
      </span>
    </td>
  )
}

const renderStatus = (row) => {
  const status = identifyStatus(row.status)
  return (
    <td className='px-6 py-6 text-right'>
      {status !== E_CARD_STATUS.NORMAL && (
        <Badge
          className='rounded-1 py-0 leading-4 border-0 tracking-normal inline-block !text-xs'
          status={status}
        />
      )}
    </td>
  )
}

const renderTotalAttestedStake = (row) => {
  if (!row.totalAttestedStake) {
    return null
  }

  return (
    <td
      className='px-6 py-6 text-sm leading-5 text-01052D w-52'
      title={
        formatCurrency(
          convertFromUnits(row?.totalAttestedStake),
          row.locale,
          row.NPMTokenSymbol,
          true
        ).long
      }
    >
      {
          formatCurrency(
            convertFromUnits(row?.totalAttestedStake),
            row.locale,
            row.NPMTokenSymbol,
            true
          ).short
        }
    </td>
  )
}

const renderTotalRefutedStake = (row) => {
  if (!row.totalAttestedStake) {
    return null
  }

  return (
    <td
      className='px-6 py-2 text-sm leading-5 text-01052D w-52'
      title={
        formatCurrency(
          convertFromUnits(row.totalRefutedStake),
          row.locale,
          row.NPMTokenSymbol,
          true
        ).long
      }
    >
      {
        formatCurrency(
          convertFromUnits(row.totalRefutedStake),
          row.locale,
          row.NPMTokenSymbol,
          true
        ).short
      }
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
    name: t`total attested stake`,
    align: 'left',
    renderHeader,
    renderData: renderTotalAttestedStake
  },
  {
    name: t`total refuted stake`,
    align: 'left',
    renderHeader,
    renderData: renderTotalRefutedStake
  },
  {
    name: t`date and time`,
    align: 'left',
    renderHeader,
    renderData: renderDateAndTime
  },
  {
    name: t`status`,
    align: 'right',
    renderHeader,
    renderData: renderStatus
  }
]

const getUrl = (reportId) => {
  const keysArray = reportId.split('-')
  const coverKey = keysArray[0]
  const productKey = keysArray[1]
  const timestamp = keysArray[2]

  return Routes.ViewReport(coverKey, productKey, timestamp)
}

export const ReportingResolvedPage = () => {
  const router = useRouter()
  const {
    data: { incidentReports },
    loading,
    hasMore,
    handleShowMore
  } = useResolvedReportings()

  const [sortType, setSortType] = useState(defaultSelectedOption)
  const { getStatsByKey } = useSortableStats()

  const { loading: dataLoading, getProduct, getCoverByCoverKey } = useCoversAndProducts2()

  const { searchValue, setSearchValue, filtered } = useSearchResults({
    list: incidentReports.map((report) => {
      return {
        ...report,
        stats: getStatsByKey(report.id)
      }
    }),
    filter: (item, term) => {
      return (
        toStringSafe(item.stats.text).indexOf(toStringSafe(term)) > -1
      )
    }
  })

  const sortedResolvedReports = useMemo(
    () =>
      sorter({
        ...sorterData[sortType.value],
        list: filtered
      }),

    [filtered, sortType.value]
  )

  const resolvedReportsWithData = useMemo(() => {
    return sortedResolvedReports.map(report => {
      const { coverKey, productKey } = report

      const isDiversified = isValidProduct(productKey)
      const coverOrProductData = isDiversified ? getProduct(coverKey, productKey) : getCoverByCoverKey(coverKey)

      return {
        report,
        coverOrProductData
      }
    })
  }, [getCoverByCoverKey, getProduct, sortedResolvedReports])

  return (
    <Container className='pt-16 pb-36'>
      <div className='flex justify-end'>
        <SearchAndSortBar
          searchValue={searchValue}
          onSearchChange={(event) => {
            setSearchValue(event.target.value)
          }}
          optionsProp={options}
          sortType={sortType}
          setSortType={setSortType}
          containerClass='flex-col sm:flex-row w-full p-8 bg-DAE2EB/[0.3] rounded-2xl z-10'
          searchClass='w-full'
          reportingResolved
        />
      </div>

      {
        (loading || dataLoading)
          ? (
            <ResolvedTableSkeleton />
            )
          : (
            <div className='mt-6'>
              <TableWrapper>
                <Table>
                  <THead
                    rowClass='border-t-0'
                    columns={columns}
                  />
                  <tbody
                    className='divide-y divide-DAE2EB'
                    data-testid='app-table-body'
                  >
                    {resolvedReportsWithData.length === 0 && (
                      <tr className='text-center'>
                        <td className='px-0 py-6' colSpan={columns.length}>
                          {loading ? t`loading...` : t`No data found`}
                        </td>
                      </tr>
                    )}
                    {resolvedReportsWithData.map(({ report, coverOrProductData }) => {
                      const resolvedOn = report.emergencyResolved
                        ? report.emergencyResolveTransaction?.timestamp
                        : report.resolveTransaction?.timestamp

                      return (
                        <Fragment key={report.id}>
                          <tr
                            className='cursor-pointer hover:bg-F4F8FC'
                            onClick={() => router.push(getUrl(report.id))}
                          >
                            <ResolvedTBodyRow
                              columns={columns}
                              report={report}
                              coverOrProductData={coverOrProductData}
                              resolvedOn={resolvedOn}
                              status={ReportStatus[report.status]}
                            />
                          </tr>
                        </Fragment>
                      )
                    })}
                  </tbody>
                </Table>
                {hasMore && (
                  <TableShowMore isLoading={loading} onShowMore={handleShowMore} />
                )}
              </TableWrapper>
            </div>
            )
      }

    </Container>
  )
}
