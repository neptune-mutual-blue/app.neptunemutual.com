import React, { useMemo, useState, useEffect } from 'react'

import { Container } from '@/common/Container/Container'
import { Grid } from '@/common/Grid/Grid'
import { SearchAndSortBar } from '@/common/SearchAndSortBar'
import { NeutralButton } from '@/common/Button/NeutralButton'
import { useSearchResults } from '@/src/hooks/useSearchResults'
import { CARDS_PER_PAGE, homeViewSelectionKey } from '@/src/config/constants'
import { SORT_TYPES, SORT_DATA_TYPES, sorter } from '@/utils/sorting'
import { CardSkeleton } from '@/common/Skeleton/CardSkeleton'
import { Trans, t } from '@lingui/macro'
import { toStringSafe } from '@/utils/string'
import { useSortableStats } from '@/src/context/SortableStatsContext'
import { CoverCardWrapper } from '@/common/Cover/CoverCardWrapper'
import { useFlattenedCoverProducts } from '@/src/hooks/useFlattenedCoverProducts'
import { ProductCardWrapper } from '@/common/Cover/ProductCardWrapper'
import { useCovers } from '@/src/hooks/useCovers'
import { isValidProduct } from '@/src/helpers/cover'
import { utils } from '@neptunemutual/sdk'
import { SelectListBar } from '@/common/SelectListBar/SelectListBar'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { logCoverProductsSearch, logCoverProductsSort } from '@/src/services/logs'
import { useWeb3React } from '@web3-react/core'

/**
 * @type {Object.<string, {selector:(any) => any, datatype: any, ascending?: boolean }>}
 */
const sorterData = {
  [SORT_TYPES.ALPHABETIC]: {
    selector: (cover) => cover.infoObj?.productName || cover.infoObj?.coverName,
    datatype: SORT_DATA_TYPES.STRING
  },
  [SORT_TYPES.LIQUIDITY]: {
    selector: (cover) => cover.liquidity,
    datatype: SORT_DATA_TYPES.BIGNUMBER
  },
  [SORT_TYPES.UTILIZATION_RATIO]: {
    selector: (cover) => cover.utilization,
    datatype: SORT_DATA_TYPES.BIGNUMBER
  }
}

export const AvailableCovers = () => {
  const { query } = useRouter()
  const { account } = useWeb3React()
  const coverView = query[homeViewSelectionKey] || SORT_TYPES.ALL

  const { data: groupCovers, loading: groupCoversLoading } = useCovers({
    supportsProducts: coverView === SORT_TYPES.DIVERSIFIED_POOL
  })
  const { data: flattenedCovers, loading: flattenedCoversLoading } =
    useFlattenedCoverProducts()
  const { getStatsByKey } = useSortableStats()
  const [sortType, setSortType] = useState({
    name: t`A-Z`,
    value: SORT_TYPES.ALL
  })
  const [showCount, setShowCount] = useState(12)

  const coversLoading =
    coverView === SORT_TYPES.ALL ? flattenedCoversLoading : groupCoversLoading
  const availableCovers =
    coverView === SORT_TYPES.ALL ? flattenedCovers : groupCovers

  const { searchValue, setSearchValue, filtered } = useSearchResults({
    list: availableCovers.map((cover) => {
      const _productKey =
        cover?.productKey &&
        cover.productKey !== utils.keyUtil.toBytes32('').substring(0, 10)
          ? cover.productKey
          : null
      const id = _productKey ? cover.productKey : cover?.coverKey
      const stats = getStatsByKey(id)

      return {
        ...cover,
        ...stats
      }
    }),
    filter: (item, term) => {
      return (
        toStringSafe(
          item.infoObj?.productName || item.infoObj?.coverName
        ).indexOf(toStringSafe(term)) > -1
      )
    }
  })

  const sortedCovers = useMemo(
    () =>
      sorter({
        ...sorterData[sortType.value],
        list: filtered
      }),

    [filtered, sortType.value]
  )

  const searchHandler = (ev) => {
    setSearchValue(ev.target.value)
    logCoverProductsSearch(account ?? null, ev.target.value)
  }

  const handleShowMore = () => {
    setShowCount((val) => val + CARDS_PER_PAGE)
  }

  useEffect(() => {
    logCoverProductsSort(account ?? null, sortType)
  }, [account, sortType])

  return (
    <Container className='py-16' data-testid='available-covers-container'>
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
            searchValue={searchValue}
            onSearchChange={searchHandler}
            sortClass='w-auto mb-4 md:mb-0'
            containerClass='flex-col md:flex-row min-w-full md:min-w-sm'
            inputClass='focus:md:w-96 transition-all'
            sortType={sortType}
            setSortType={setSortType}
          />
          <SelectListBar
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

        {!coversLoading && availableCovers.length === 0 && (
          <p data-testid='no-data' className='min-h-301'>No data found</p>
        )}

        {!coversLoading &&
          sortedCovers.map((c, idx) => {
            if (idx > showCount - 1) return null

            if (coverView === SORT_TYPES.ALL && isValidProduct(c.productKey)) {
              return (
                <ProductCardWrapper
                  className='min-h-301'
                  key={c.id}
                  coverKey={c.coverKey}
                  productKey={c.productKey}
                />
              )
            }

            return (
              <CoverCardWrapper
                key={c.id}
                coverKey={c.coverKey}
                className='min-h-301'
              />
            )
          })}
      </Grid>

      {sortedCovers.length > showCount && (
        <NeutralButton
          onClick={handleShowMore}
          data-testid='show-more-button'
        >
          <Trans>Show More</Trans>
        </NeutralButton>
      )}
    </Container>
  )
}
