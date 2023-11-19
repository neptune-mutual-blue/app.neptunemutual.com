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
import { CARDS_PER_PAGE } from '@/src/config/constants'
import { Routes } from '@/src/config/routes'
import { useAppConstants } from '@/src/context/AppConstants'
import { useSortableStats } from '@/src/context/SortableStatsContext'
import { usePodStakingPools } from '@/src/hooks/usePodStakingPools'
import { useSearchResults } from '@/src/hooks/useSearchResults'
import { PodStakingCard } from '@/src/modules/pools/pod-staking/PodStakingCard'
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
    selector: (pool) => { return pool.name },
    datatype: SORT_DATA_TYPES.STRING
  },
  [SORT_TYPES.TVL]: {
    selector: (pool) => { return pool.tvl },
    datatype: SORT_DATA_TYPES.BIGNUMBER
  },
  [SORT_TYPES.APR]: {
    selector: (pool) => { return pool.apr },
    datatype: SORT_DATA_TYPES.BIGNUMBER
  }
}

export const PodStakingPage = () => {
  const [sortType, setSortType] = useState({
    name: t`A-Z`,
    value: SORT_TYPES.ALPHABETIC
  })

  const { data, loading, hasMore, handleShowMore } = usePodStakingPools()
  const { getStatsByKey } = useSortableStats()
  const { getTVLById } = useAppConstants()

  const { searchValue, setSearchValue, filtered } = useSearchResults({
    list: data.pools.map((pool) => {
      return {
        ...pool,
        tvl: getTVLById(pool.id),
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
    { name: t`A-Z`, value: SORT_TYPES.ALPHABETIC },
    { name: t`TVL`, value: SORT_TYPES.TVL },
    { name: t`APR`, value: SORT_TYPES.APR }
  ]

  return (
    <Container className='pt-16 pb-36' data-testid='pod-staking-page-container'>
      <div className='flex justify-end'>
        <div className='items-center justify-between w-full sm:flex'>
          <Link href={Routes.PodStakingPoolsTransactions}>
            <a className='flex justify-center text-lg font-medium sm:inline-flex text-4E7DD9 hover:underline'>
              <Trans>Transaction List</Trans>
            </a>
          </Link>
          <SearchAndSortBar
            searchValue={searchValue}
            onSearchChange={(event) => {
              setSearchValue(event.target.value)
            }}
            sortClass='w-full md:w-48 lg:w-64 rounded-lg z-10'
            containerClass='flex-col md:flex-row min-w-full md:min-w-sm'
            searchClass='w-full md:w-64 rounded-lg'
            optionsProp={options}
            sortType={sortType}
            setSortType={setSortType}
          />
        </div>
      </div>

      <Content
        data={sortedPools}
        loading={loading}
        hasMore={hasMore}
        handleShowMore={handleShowMore}
      />
    </Container>
  )
}

function Content ({ data, loading, hasMore, handleShowMore }) {
  const { getPriceByAddress } = useAppConstants()

  if (data.length) {
    return (
      <>
        <Grid className='mb-24 mt-14' data-testid='pools-grid'>
          {data.map((poolData) => {
            return (
              <PodStakingCard
                key={poolData.id}
                data={poolData}
                tvl={poolData.tvl}
                getPriceByAddress={getPriceByAddress}
              />
            )
          })}
        </Grid>

        <TableShowMore
          show={hasMore}
          onShowMore={handleShowMore}
          loading={loading}
          data-testid='show-more-button'
        />
      </>
    )
  }

  if (loading) {
    return (
      <Grid className='mb-24 mt-14' data-testid='loading-grid'>
        <CardSkeleton numberOfCards={data.length || CARDS_PER_PAGE} />
      </Grid>
    )
  }

  return (
    <div
      className='flex flex-col items-center w-full pt-20'
      data-testid='no-pools-container'
    >
      <img
        src='/images/covers/empty-list-illustration.svg'
        alt={t`No data found`}
        className='w-48 h-48'
      />
      <p className='max-w-full mt-8 text-center text-md text-404040 w-96'>
        <Trans>
          No <span className='whitespace-nowrap'>POD staking pools found.</span>
        </Trans>
      </p>
    </div>
  )
}
