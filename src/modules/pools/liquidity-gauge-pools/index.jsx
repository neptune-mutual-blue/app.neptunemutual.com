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
import {
  LiquidityGaugePoolsCard
} from '@/modules/pools/liquidity-gauge-pools/LiquidityGaugePoolsCard'
import { CARDS_PER_PAGE } from '@/src/config/constants'
import { Routes } from '@/src/config/routes'
import { useAppConstants } from '@/src/context/AppConstants'
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

/**
 * @type {Object.<string, {selector:(any) => any, datatype: any, ascending?: boolean }>}
 */
const sorterData = {
  [SORT_TYPES.TVL]: {
    selector: (pool) => pool.tvl,
    datatype: SORT_DATA_TYPES.BIGNUMBER
  },
  [SORT_TYPES.EMISSIONS]: {
    selector: (pool) => pool.name,
    datatype: SORT_DATA_TYPES.STRING
  },
  [SORT_TYPES.APR]: {
    selector: (pool) => pool.apr,
    datatype: SORT_DATA_TYPES.BIGNUMBER
  }
}

export const LiquidityGaugePoolsPage = () => {
  const [sortType, setSortType] = useState({
    name: t`TVL`,
    value: SORT_TYPES.TVL
  })

  const { data, loading, hasMore, handleShowMore } = useLiquidityGaugePools()
  const { getStatsByKey } = useSortableStats()
  const { getTVLById } = useAppConstants()

  const { searchValue, setSearchValue, filtered } = useSearchResults({
    list: data.pools.map((pool) => ({
      ...pool,
      tvl: getTVLById(pool.id),
      ...getStatsByKey(pool.id)
    })),

    filter: (item, term) => {
      return toStringSafe(item.name).indexOf(toStringSafe(term)) > -1
    }
  })

  const sortedPools = useMemo(
    () =>
      sorter({
        ...sorterData[sortType.value],
        list: filtered
      }),
    [filtered, sortType.value]
  )

  const options = [
    { name: t`TVL`, value: SORT_TYPES.TVL },
    { name: t`Emissions`, value: SORT_TYPES.EMISSIONS },
    { name: t`APR`, value: SORT_TYPES.APR }
  ]

  const liquidityGaugePoolsData = [
    {
      id: 1,
      title: 'Prime dApps',
      subtitle: 'iUSDC-PRIME',
      icons: [
        { src: '/images/covers/aave-v2.svg' },
        { src: '/images/covers/balancer-v2.svg' },
        { src: '/images/covers/curve-v2.svg' }
      ],
      npm: 40023404.34,
      boost: 1,
      APR: 0.1603,
      description: 'The Prime dApps pool comprises the cover portfolios of various platforms including Maker MCD v1, Uniswap v2, Aave v2, and several others.',
      lockup_period: '2023-05-17T18:12:18.205Z',
      reward_token: {
        icon: '/images/tokens/npm.svg',
        name: 'NPM'
      },
      balance: 10000.00,
      emission_received: 163.00,
      tvl: 1200000,
      lock: true,
      stake: false
    },
    {
      id: 2,
      title: 'Popular DeFi Apps',
      subtitle: 'iUSDC-POP',
      icons: [
        { src: '/images/covers/1inch-v2.svg' },
        { src: '/images/covers/aave-v2.svg' },
        { src: '/images/covers/bancor.svg' },
        { src: '/images/covers/bancor.svg' },
        { src: '/images/covers/bancor.svg' }
      ],
      npm: 40023404.34,
      boost: 2.334,
      APR: 0.1603,
      description: 'The Prime dApps pool comprises the cover portfolios of various platforms including Maker MCD v1, Uniswap v2, Aave v2, and several others.',
      lockup_period: '2023-05-17T16:12:18.205Z',
      reward_token: {
        icon: '/images/tokens/npm.svg',
        name: 'NPM'
      },
      balance: 10000.00,
      emission_received: 163.00,
      tvl: 1200000,
      lock: false,
      stake: true
    },
    {
      id: 3,
      title: 'Binance',
      subtitle: 'iUSDC-BNB',
      icons: [
        { src: '/images/covers/binance-v2.svg' }
      ],
      npm: 40023404.34,
      boost: 4,
      APR: 0.1603,
      description: 'The Prime dApps pool comprises the cover portfolios of various platforms including Maker MCD v1, Uniswap v2, Aave v2, and several others.',
      lockup_period: '2023-05-15T15:46:35.542Z',
      reward_token: {
        icon: '/images/tokens/npm.svg',
        name: 'NPM'
      },
      balance: 10000.00,
      emission_received: 163.00,
      tvl: 1200000,
      lock: true,
      stake: true
    }
  ]

  return (
    <Container className='pt-16 pb-36' data-testid='liquidity-gauge-pools-page-container'>
      <div className='flex justify-end mb-14'>
        <div className='items-center justify-between w-full sm:flex'>
          <Link href={Routes.LiquidityGaugePoolsTransactions}>
            <a className='flex justify-center text-lg font-medium sm:inline-flex text-4E7DD9 hover:underline'>
              <Trans>Transaction List</Trans>
            </a>
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
        <Link href='/pools/liquidity-gauge-pools/latest-gauge'>View the Latest Gauge --&gt;</Link>
      </div>

      <Content
        data={liquidityGaugePoolsData || sortedPools}
        loading={loading}
        hasMore={hasMore}
        handleShowMore={handleShowMore}
      />
    </Container>
  )
}

function Content ({ data, loading, hasMore, handleShowMore }) {
  if (data.length) {
    return (
      <LiquidityGaugePoolsCard data={data} />
    )
  }

  if (loading) {
    return (
      <>
        <Grid className='mb-24 mt-14' data-testid='loading-grid'>
          <CardSkeleton numberOfCards={data.length || CARDS_PER_PAGE} />
        </Grid>
        {!loading && hasMore && (
          <NeutralButton
            onClick={handleShowMore}
            data-testid='show-more-button'
          >
            <Trans>Show More</Trans>
          </NeutralButton>
        )}
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
        alt={t`No data found`}
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
