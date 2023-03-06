
import { useCoversAndProducts2 } from '@/src/context/CoversAndProductsData2'
import { useSearchResults } from '@/src/hooks/useSearchResults'
import React, { useMemo, useState } from 'react'

import Link from 'next/link'
import { useRouter } from 'next/router'

import { Container } from '@/common/Container/Container'
import { CoverCardWrapper } from '@/common/Cover/CoverCardWrapper'
import { ProductCardWrapper } from '@/common/Cover/ProductCardWrapper'
import { Grid } from '@/common/Grid/Grid'
import { SearchAndSortBar } from '@/common/SearchAndSortBar'
import { SelectListBar } from '@/common/SelectListBar/SelectListBar'
import { CardSkeleton } from '@/common/Skeleton/CardSkeleton'
import {
  CARDS_PER_PAGE,
  homeViewSelectionKey
} from '@/src/config/constants'
import { isValidProduct } from '@/src/helpers/cover'

import {
  DEFAULT_SORT,
  sorter,
  SORT_DATA_TYPES,
  SORT_TYPES
} from '@/utils/sorting'
import {
  t,
  Trans
} from '@lingui/macro'
import { useSortableStats } from '@/src/context/SortableStatsContext'

/**
 * @type {Object.<string, {selector:(any) => any, datatype: any, ascending?: boolean }>}
 */
const sorterData = {
  [SORT_TYPES.ALPHABETIC]: {
    selector: (data) => data.text,
    datatype: SORT_DATA_TYPES.STRING
  },
  [SORT_TYPES.LIQUIDITY]: {
    selector: (data) => data.liquidity,
    datatype: SORT_DATA_TYPES.BIGNUMBER
  },
  [SORT_TYPES.UTILIZATION_RATIO]: {
    selector: (data) => data.utilization,
    datatype: SORT_DATA_TYPES.BIGNUMBER
  }
}

const coversLoading = false
export const AvailableCovers = () => {
  const { query } = useRouter()
  const [sortType, setSortType] = useState(DEFAULT_SORT)
  const { getDedicatedCovers, getDiversifiedCovers, getAllProducts } = useCoversAndProducts2()
  const { getStatsByKey } = useSortableStats()

  const coverView = query[homeViewSelectionKey] || SORT_TYPES.ALL

  let list = getAllProducts()
  if (coverView === SORT_TYPES.DEDICATED_POOL) {
    list = getDedicatedCovers()
  } else if (coverView === SORT_TYPES.DIVERSIFIED_POOL) {
    list = getDiversifiedCovers()
  }

  const { filtered, searchValue, setSearchValue } = useSearchResults({
    list: list,
    filter: (data, searchTerm) => {
      const isProduct = isValidProduct(data.productKey)
      const stats = getStatsByKey(isProduct ? data.productKey : data.coverKey)

      return (stats.text.toLowerCase().includes(searchTerm.toLowerCase()))
    }
  })

  const sortedCovers = useMemo(
    () =>
      sorter({
        ...sorterData[sortType.value],
        list: filtered.map(x => {
          const isProduct = isValidProduct(x.productKey)
          const stats = getStatsByKey(isProduct ? x.productKey : x.coverKey)
          return {
            ...x,
            ...stats
          }
        })
      }),

    [filtered, getStatsByKey, sortType.value]
  )

  const searchHandler = (ev) => {
    setSearchValue(ev.target.value)
  }

  return (
    <Container className='py-16'>
      <div
        id='cover-products'
        className='flex flex-wrap items-center justify-between'
      >
        <Link href='#cover-products'>
          <a>
            <h1 className='mb-3 font-bold xl:mb-0 text-h3 lg:text-h2 font-sora'>
              <Trans>Cover Products</Trans>
            </h1>
          </a>
        </Link>
        <div className='flex flex-wrap items-center justify-end w-full md:flex-nowrap xl:w-auto'>
          <SearchAndSortBar
            loading={coversLoading}
            searchValue={searchValue}
            onSearchChange={searchHandler}
            sortClass='w-auto mb-4 md:mb-0'
            containerClass='flex-col md:flex-row min-w-full md:min-w-sm'
            inputClass='focus:md:w-96 transition-all'
            sortType={sortType}
            setSortType={setSortType}
          />
          <SelectListBar
            loading={coversLoading}
            sortClassContainer='w-full md:w-auto md:ml-2'
            prefix={t`View:` + ' '}
            sortClass='w-auto'
          />
        </div>
      </div>
      <Grid
        className='grid-rows-5 gap-4 mt-14 lg:mb-24 mb-14 lg:min-h-360 lg:grid-rows-4'
        data-testid='body'
      >
        {coversLoading && (
          <CardSkeleton numberOfCards={CARDS_PER_PAGE} className='min-h-301' />
        )}

        {!coversLoading && sortedCovers.length === 0 && (
          <p data-testid='no-data' className='min-h-301'>No data found</p>
        )}

        {!coversLoading &&
          sortedCovers.map((c) => {
            // if (idx > showCount - 1) return null

            if (coverView === SORT_TYPES.ALL && isValidProduct(c.productKey)) {
              return (
                <ProductCardWrapper
                  className='min-h-301'
                  key={c.coverKey + c.productKey}
                  coverKey={c.coverKey}
                  productKey={c.productKey}
                />
              )
            }

            return (
              <CoverCardWrapper
                key={c.coverKey}
                coverKey={c.coverKey}
                className='min-h-301'
              />
            )
          })}
      </Grid>
    </Container>
  )
}
