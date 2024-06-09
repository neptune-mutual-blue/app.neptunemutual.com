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
import {
  Loading,
  NoDataFound
} from '@/common/Loading'
import { SearchAndSortBar } from '@/common/SearchAndSortBar'
import { renderHeader } from '@/common/Table/renderHeader'
import {
  Table,
  TableShowMore,
  TableWrapper,
  THead
} from '@/common/Table/Table'
import DateLib from '@/lib/date/DateLib'
import {
  ResolvedTableSkeleton
} from '@/modules/reporting/resolved/ResolvedTableSkeleton'
import { ResolvedTBodyRow } from '@/modules/reporting/resolved/ResolvedTBodyRow'
import { ReportStatus } from '@/src/config/constants'
import { Routes } from '@/src/config/routes'
import { useCoversAndProducts } from '@/src/context/CoversAndProductsData'
import { useSortableStats } from '@/src/context/SortableStatsContext'
import { isValidProduct } from '@/src/helpers/cover'
import { useResolvedReportings } from '@/src/hooks/useResolvedReportings'
import { useSearchResults } from '@/src/hooks/useSearchResults'
import { convertFromUnits } from '@/utils/bn'
import { formatCurrency } from '@/utils/formatter/currency'
import { getUtcFormatString } from '@/utils/formatter/relative-time'
import {
  SORT_DATA_TYPES,
  SORT_TYPES,
  sorter
} from '@/utils/sorting'
import { toStringSafe } from '@/utils/string'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'

/**
 * @type {Object.<string, {selector:(any) => any, datatype: any, ascending?: boolean }>}
 */
const sorterData = {
  [SORT_TYPES.ALPHABETIC]: {
    selector: (report) => { return report.stats.text },
    datatype: SORT_DATA_TYPES.STRING
  },
  [SORT_TYPES.INCIDENT_DATE]: {
    selector: (report) => { return report.stats.incidentDate },
    datatype: SORT_DATA_TYPES.BIGNUMBER
  },
  [SORT_TYPES.RESOLVED_DATE]: {
    selector: (report) => { return report.stats.resolvedOn },
    datatype: SORT_DATA_TYPES.BIGNUMBER
  }
}

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

/**
 * Returns an array of column objects for the proposals table.
 * Each object represents a column and contains properties such as id, name, alignment, and render functions.
 *
 * @param {import('@lingui/core').I18n} i18n - The I18n instance from Lingui library.
 * @returns {Array<{id: string, name: string, align: string, renderHeader: Function, renderData: (row: any, extraData: any, index: number) => React.JSX.Element}>} An array of column objects.
 */
const getColumns = (i18n) => {
  return [
    {
      id: 'cover',
      name: t(i18n)`cover`,
      align: 'left',
      renderHeader,
      renderData: renderCover
    },
    {
      id: 'total attested stake',
      name: t(i18n)`total attested stake`,
      align: 'left',
      renderHeader,
      renderData: renderTotalAttestedStake
    },
    {
      id: 'total refuted stake',
      name: t(i18n)`total refuted stake`,
      align: 'left',
      renderHeader,
      renderData: renderTotalRefutedStake
    },
    {
      id: 'date and time',
      name: t(i18n)`date and time`,
      align: 'left',
      renderHeader,
      renderData: renderDateAndTime
    },
    {
      id: 'status',
      name: t(i18n)`status`,
      align: 'right',
      renderHeader,
      renderData: renderStatus
    }
  ]
}

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

  const { i18n } = useLingui()

  const options = [
    { name: t(i18n)`A-Z`, value: SORT_TYPES.ALPHABETIC },
    { name: t(i18n)`Incident date`, value: SORT_TYPES.INCIDENT_DATE },
    { name: t(i18n)`Resolved date`, value: SORT_TYPES.RESOLVED_DATE }
  ]
  const defaultSelectedOption = options[2]

  const [sortType, setSortType] = useState(defaultSelectedOption)
  const { getStatsByKey } = useSortableStats()

  const { loading: dataLoading, getProduct, getCoverByCoverKey } = useCoversAndProducts()

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
    () => {
      return sorter({
        ...sorterData[sortType.value],
        list: filtered
      })
    },

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

  const columns = getColumns(i18n)

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
                          {loading ? <Loading /> : <NoDataFound />}
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
                            onClick={() => { return router.push(getUrl(report.id)) }}
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
              </TableWrapper>

              <TableShowMore
                show={hasMore}
                onShowMore={handleShowMore}
                loading={loading}
              />
            </div>
            )
      }

    </Container>
  )
}
