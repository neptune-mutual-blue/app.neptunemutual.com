import {
  useMemo,
  useState
} from 'react'

import Link from 'next/link'

import { Container } from '@/common/Container/Container'
import { Grid } from '@/common/Grid/Grid'
import { SearchAndSortBar } from '@/common/SearchAndSortBar'
import { CardSkeleton } from '@/common/Skeleton/CardSkeleton'
import { TableShowMore } from '@/common/Table/Table'
import { Routes } from '@/src/config/routes'
import { useCoversAndProducts2 } from '@/src/context/CoversAndProductsData2'
import { useSortableStats } from '@/src/context/SortableStatsContext'
import { isValidProduct } from '@/src/helpers/cover'
import { useActiveReportings } from '@/src/hooks/useActiveReportings'
import { useSearchResults } from '@/src/hooks/useSearchResults'
import {
  ActiveReportingCard
} from '@/src/modules/reporting/active/ActiveReportingCard'
import {
  ActiveReportingEmptyState
} from '@/src/modules/reporting/active/ActiveReportingEmptyState'
import {
  SORT_DATA_TYPES,
  SORT_TYPES,
  sorter
} from '@/utils/sorting'
import { toStringSafe } from '@/utils/string'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { useNetwork } from '@/src/context/Network'

/**
 * @type {Object.<string, {selector:(any) => any, datatype: any, ascending?: boolean }>}
 */
const sorterData = {
  [SORT_TYPES.ALPHABETIC]: {
    selector: (report) => { return report.stats.text },
    datatype: SORT_DATA_TYPES.STRING
  },
  [SORT_TYPES.UTILIZATION_RATIO]: {
    selector: (report) => { return report.stats.utilization },
    datatype: SORT_DATA_TYPES.BIGNUMBER
  },
  [SORT_TYPES.INCIDENT_DATE]: {
    selector: (report) => { return report.stats.incidentDate },
    datatype: SORT_DATA_TYPES.BIGNUMBER
  }
}

export const ReportingActivePage = () => {
  const {
    data: { incidentReports },
    loading,
    hasMore,
    handleShowMore
  } = useActiveReportings()

  const { i18n } = useLingui()

  const sortOptions = [
    { name: t(i18n)`A-Z`, value: SORT_TYPES.ALPHABETIC },
    { name: t(i18n)`Utilization ratio`, value: SORT_TYPES.UTILIZATION_RATIO },
    { name: t(i18n)`Incident date`, value: SORT_TYPES.INCIDENT_DATE }
  ]
  const defaultSortOption = sortOptions[2]

  const [sortType, setSortType] = useState(defaultSortOption)

  const { getStatsByKey } = useSortableStats()

  const { searchValue, setSearchValue, filtered } = useSearchResults({
    list: (incidentReports || []).map((report) => {
      return {
        ...report,
        stats: getStatsByKey(report.id)
      }
    }),
    filter: (report, term) => { return toStringSafe(report.stats.text).includes(toStringSafe(term)) }
  })

  const activeCardInfoArray = useMemo(
    () => {
      return sorter({
        ...sorterData[sortType.value],
        list: filtered
      })
    },

    [filtered, sortType.value]
  )

  return (
    <Container className='pt-16 pb-36'>
      <div className='flex sm:justify-end'>
        <SearchAndSortBar
          searchValue={searchValue}
          onSearchChange={(event) => { return setSearchValue(event.target.value) }}
          optionsProp={sortOptions}
          sortType={sortType}
          setSortType={setSortType}
          containerClass='flex-col sm:flex-row w-full sm:w-auto'
          searchClass='w-full sm:w-auto'
        />
      </div>

      <Content
        data={activeCardInfoArray}
        loading={loading}
        hasMore={hasMore}
        handleShowMore={handleShowMore}
      />
    </Container>
  )
}

function Content ({ data, loading: loadingProp, hasMore, handleShowMore }) {
  const { networkId } = useNetwork()
  const { loading, getProduct, getCoverByCoverKey } = useCoversAndProducts2()

  if (loadingProp) {
    return (
      <div data-testid='active-reportings-card-skeleton'>
        <Grid className='w-full gap-4 mt-14 lg:mb-24 mb-14'>
          <CardSkeleton numberOfCards={15} />
        </Grid>
      </div>
    )
  }

  if (data.length > 0) {
    return (
      <>
        <Grid className='mb-24 mt-14' data-testid='active-page-grid'>
          {data.map((report) => {
            const isDiversified = isValidProduct(report.productKey)
            const coverOrProductData = isDiversified ? getProduct(report.coverKey, report.productKey) : getCoverByCoverKey(report.coverKey)

            return (
              (
                <Link
                  href={Routes.ViewReport(
                    report.coverKey,
                    report.productKey,
                    report.incidentDate,
                    networkId
                  )}
                  key={report.id}
                  className='rounded-3xl focus:outline-none focus-visible:ring-2 focus-visible:ring-4E7DD9'
                >

                  {loading
                    ? <CardSkeleton numberOfCards={1} />
                    : <ActiveReportingCard
                        id={report.id}
                        coverKey={report.coverKey}
                        productKey={report.productKey}
                        incidentDate={report.incidentDate}
                        coverOrProductData={coverOrProductData}
                      />}

                </Link>
              )
            )
          })}
        </Grid>

        <TableShowMore
          show={hasMore}
          onShowMore={handleShowMore}
          loading={loading}
          data-testid='has-more-button'
        />
      </>
    )
  }

  return <ActiveReportingEmptyState />
}
