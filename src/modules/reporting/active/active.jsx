import {
  useMemo,
  useState
} from 'react'

import Link from 'next/link'

import { NeutralButton } from '@/common/Button/NeutralButton'
import { Container } from '@/common/Container/Container'
import { Grid } from '@/common/Grid/Grid'
import { SearchAndSortBar } from '@/common/SearchAndSortBar'
import { CardSkeleton } from '@/common/Skeleton/CardSkeleton'
import { CARDS_PER_PAGE } from '@/src/config/constants'
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
import {
  t,
  Trans
} from '@lingui/macro'

/**
 * @type {Object.<string, {selector:(any) => any, datatype: any, ascending?: boolean }>}
 */
const sorterData = {
  [SORT_TYPES.ALPHABETIC]: {
    selector: (report) => report.stats.text,
    datatype: SORT_DATA_TYPES.STRING
  },
  [SORT_TYPES.UTILIZATION_RATIO]: {
    selector: (report) => report.stats.utilization,
    datatype: SORT_DATA_TYPES.BIGNUMBER
  },
  [SORT_TYPES.INCIDENT_DATE]: {
    selector: (report) => report.stats.incidentDate,
    datatype: SORT_DATA_TYPES.BIGNUMBER
  }
}

const sortOptions = [
  { name: t`A-Z`, value: SORT_TYPES.ALPHABETIC },
  { name: t`Utilization ratio`, value: SORT_TYPES.UTILIZATION_RATIO },
  { name: t`Incident date`, value: SORT_TYPES.INCIDENT_DATE }
]
const defaultSortOption = sortOptions[2]

export const ReportingActivePage = () => {
  const {
    data: { incidentReports },
    loading,
    hasMore,
    handleShowMore
  } = useActiveReportings()

  const [sortType, setSortType] = useState(defaultSortOption)

  const { getStatsByKey } = useSortableStats()

  const { searchValue, setSearchValue, filtered } = useSearchResults({
    list: (incidentReports || []).map((report) => ({
      ...report,
      stats: getStatsByKey(report.id)
    })),
    filter: (report, term) => toStringSafe(report.stats.text).includes(toStringSafe(term))
  })

  const activeCardInfoArray = useMemo(
    () =>
      sorter({
        ...sorterData[sortType.value],
        list: filtered
      }),

    [filtered, sortType.value]
  )

  return (
    <Container className='pt-16 pb-36'>
      <div className='flex sm:justify-end'>
        <SearchAndSortBar
          searchValue={searchValue}
          onSearchChange={(event) => setSearchValue(event.target.value)}
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
  const { loading, getProduct, getCoverByCoverKey } = useCoversAndProducts2()

  if (loadingProp) {
    return (
      <div data-testid='active-reportings-card-skeleton'>
        <Grid className='w-full gap-4 mt-14 lg:mb-24 mb-14'>
          <CardSkeleton numberOfCards={data.length || CARDS_PER_PAGE} />
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
              <Link
                href={Routes.ViewReport(
                  report.coverKey,
                  report.productKey,
                  report.incidentDate
                )}
                key={report.id}
              >
                <a className='rounded-3xl focus:outline-none focus-visible:ring-2 focus-visible:ring-4E7DD9'>
                  {loading
                    ? <CardSkeleton numberOfCards={1} />
                    : <ActiveReportingCard
                        id={report.id}
                        coverKey={report.coverKey}
                        productKey={report.productKey}
                        incidentDate={report.incidentDate}
                        coverOrProductData={coverOrProductData}
                      />}
                </a>
              </Link>
            )
          })}
        </Grid>

        {!loading && hasMore && (
          <NeutralButton
            onClick={handleShowMore}
            data-testid='has-more-button'
          >
            <Trans>Show More</Trans>
          </NeutralButton>
        )}
      </>
    )
  }

  return <ActiveReportingEmptyState />
}
