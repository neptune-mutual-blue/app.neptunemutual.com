import {
  useMemo,
  useState
} from 'react'

import Link from 'next/link'

// import { NeutralButton } from '@/common/Button/NeutralButton'
import { Container } from '@/common/Container/Container'
import { SearchAndSortBar } from '@/common/SearchAndSortBar'
import {
  LiquidityGaugePoolCardsSkeleton
} from '@/modules/pools/liquidity-gauge-pools/LiquidityGaugePoolCardsSkeleton'
import {
  LiquidityGaugePoolsList
} from '@/modules/pools/liquidity-gauge-pools/LiquidityGaugePoolsList'
import { Routes } from '@/src/config/routes'
import { useAppConstants } from '@/src/context/AppConstants'
// import { useAppConstants } from '@/src/context/AppConstants'
import { useSortableStats } from '@/src/context/SortableStatsContext'
import { useLiquidityGaugePools } from '@/src/hooks/useLiquidityGaugePools'
import { useSearchResults } from '@/src/hooks/useSearchResults'
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
import { useLingui } from '@lingui/react'

/**
 * @type {Object.<string, {selector:(any) => any, datatype: any, ascending?: boolean }>}
 */
const sorterData = {
  [SORT_TYPES.TVL]: {
    selector: (pool) => { return pool.tvl },
    datatype: SORT_DATA_TYPES.BIGNUMBER
  },
  [SORT_TYPES.EMISSIONS]: {
    selector: (pool) => { return pool.name },
    datatype: SORT_DATA_TYPES.STRING
  }
}

export const LiquidityGaugePoolsPage = () => {
  const { i18n } = useLingui()

  const [sortType, setSortType] = useState({
    name: t(i18n)`TVL`,
    value: SORT_TYPES.TVL
  })

  const { NPMTokenDecimals } = useAppConstants()
  const { data: pools, loading } = useLiquidityGaugePools({ NPMTokenDecimals })
  const { getStatsByKey } = useSortableStats()

  const { searchValue, setSearchValue, filtered } = useSearchResults({
    list: pools.map((pool) => {
      return {
        ...pool,
        // tvl: getTVLById(pool.id),
        ...getStatsByKey(pool.id)
      }
    }),

    filter: (item, term) => {
      return toStringSafe(item.name).indexOf(toStringSafe(term)) > -1
    }
  })

  const sortedPools = useMemo(
    () => {
      return sorter({
        ...sorterData[sortType.value],
        list: filtered
      })
    },
    [filtered, sortType.value]
  )

  const options = [
    { name: t(i18n)`TVL`, value: SORT_TYPES.TVL },
    { name: t(i18n)`Emissions`, value: SORT_TYPES.EMISSIONS }
  ]

  return (
    <Container className='pt-7 md:pt-16 pb-36' data-testid='liquidity-gauge-pools-page-container'>
      <div className='flex justify-end mb-7 md:mb-14'>
        <div className='items-start justify-between w-full md:items-center sm:flex'>
          <Link
            href={Routes.LiquidityGaugePoolsTransactions}
            className='flex justify-start mb-6 text-lg font-medium md:mb-0 md:justify-center sm:inline-flex text-4E7DD9 hover:underline'
          >

            <Trans>Transaction List</Trans>

          </Link>
          <SearchAndSortBar
            searchValue={searchValue}
            onSearchChange={(event) => {
              setSearchValue(event.target.value)
            }}
            sortClass='w-full md:w-48 lg:w-64 rounded-lg'
            containerClass='flex-col md:flex-row min-w-fit md:min-w-sm'
            searchClass='w-full md:w-64 rounded-lg'
            optionsProp={options}
            sortType={sortType}
            setSortType={setSortType}
          />
        </div>
      </div>

      <div className='flex justify-end font-semibold text-4E7DD9 text-md mb-[18px]'>
        <Link href='/governance'>View the Latest Gauge --&gt;</Link>
      </div>

      <Content
        data={sortedPools}
        loading={loading}
        // hasMore={hasMore}
        // handleShowMore={handleShowMore}
      />
    </Container>
  )
}

function Content ({
  data,
  loading
  // hasMore,
  // handleShowMore
}) {
  const { i18n } = useLingui()

  if (data.length) {
    return (
      <LiquidityGaugePoolsList pools={data} />
    )
  }

  if (loading) {
    return (
      <>
        <LiquidityGaugePoolCardsSkeleton />
        {/* {!loading && hasMore && (
          <NeutralButton
            onClick={handleShowMore}
            data-testid='show-more-button'
          >
            <Trans>Show More</Trans>
          </NeutralButton>
        )} */}
      </>
    )
  }

  return (
    <div
      className='flex flex-col items-center w-full pt-20'
      data-testid='no-pools-container'
    >
      <img
        src='/images/covers/empty-list-illustration.svg'
        alt={t(i18n)`No data found`}
        className='w-48 h-48'
      />
      <p className='max-w-full mt-8 text-center text-md text-404040 w-96'>
        <Trans>
          No <span className='whitespace-nowrap'>liquidity gauge pools found.</span>
        </Trans>
      </p>
    </div>
  )
}
