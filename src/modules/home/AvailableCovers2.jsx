
import { useCoversAndProducts2 } from '@/src/context/CoversAndProductsData2'
import { useMemo } from 'react'

import Link from 'next/link'
import { useRouter } from 'next/router'

import { Container } from '@/common/Container/Container'
import { CoverCardWrapper } from '@/common/Cover/CoverCardWrapper'
import { ProductCardWrapper } from '@/common/Cover/ProductCardWrapper'
import { Grid } from '@/common/Grid/Grid'
import { SearchAndSortBar } from '@/common/SearchAndSortBar'
import { CardSkeleton } from '@/common/Skeleton/CardSkeleton'
import {
  CARDS_PER_PAGE
} from '@/src/config/constants'
import { isValidProduct } from '@/src/helpers/cover'

import { Select } from '@/common/Select'
import FilterIcon from '@/icons/FilterIcon'
import {
  DEFAULT_SORT_OPTIONS,
  sorter,
  SORT_DATA_TYPES,
  SORT_TYPES
} from '@/utils/sorting'
import {
  t,
  Trans
} from '@lingui/macro'

/**
 * @type {Object.<string, {selector:(any) => any, datatype: any, ascending?: boolean }>}
 */
const sorterData = {
  [SORT_TYPES.ALPHABETIC]: {
    selector: (data) => data.text,
    datatype: SORT_DATA_TYPES.STRING
  },
  [SORT_TYPES.LIQUIDITY]: {
    selector: (data) => data.capacity,
    datatype: SORT_DATA_TYPES.BIGNUMBER
  },
  [SORT_TYPES.UTILIZATION_RATIO]: {
    selector: (data) => data.utilizationRatio,
    datatype: SORT_DATA_TYPES.BIGNUMBER
  }
}

const viewOptions = [
  { name: t`All`, value: SORT_TYPES.ALL },
  { name: t`Diversified Pool`, value: SORT_TYPES.DIVERSIFIED_POOL },
  { name: t`Dedicated Pool`, value: SORT_TYPES.DEDICATED_POOL }
]
const defaultViewOption = viewOptions[0]

const ViewQueryParam = 'view'
const SortQueryParam = 'sort'
const SearchQueryParam = 'search'

const sortOptions = DEFAULT_SORT_OPTIONS
const defaultSortOption = DEFAULT_SORT_OPTIONS[1]

export const AvailableCovers = () => {
  const { query, replace } = useRouter()
  const { loading: coversLoading, getDedicatedCovers, getDiversifiedCovers, getAllProducts } = useCoversAndProducts2()

  const searchTerm = typeof query[SearchQueryParam] === 'string' ? query[SearchQueryParam] : ''

  const selectedSort = query[SortQueryParam] || defaultSortOption.value
  const selectedSortOption = sortOptions.find((item) => item.value === selectedSort)

  const selectedView = query[ViewQueryParam] || defaultViewOption.value
  const selectedViewOption = viewOptions.find((item) => item.value === selectedView)

  let list = getAllProducts()
  if (selectedView === SORT_TYPES.DEDICATED_POOL) {
    list = getDedicatedCovers()
  } else if (selectedView === SORT_TYPES.DIVERSIFIED_POOL) {
    list = getDiversifiedCovers()
  }

  const filtered = list.filter((item) => {
    try {
      const isDiversifiedProduct = isValidProduct(item.productKey)
      const text = (isDiversifiedProduct
        ? item.productInfoDetails?.productName
        : item?.coverInfoDetails?.coverName || item?.coverInfoDetails?.projectName) || ''

      return text.toLowerCase().includes(searchTerm.toLowerCase())
    } catch (err) { /* swallow */ }

    return true
  })

  const sortedCovers = useMemo(
    () =>
      sorter({
        ...sorterData[selectedSortOption.value],
        list: filtered.map(item => {
          const isDiversifiedProduct = isValidProduct(item.productKey)
          const text = (isDiversifiedProduct
            ? item.productInfoDetails?.productName
            : item?.coverInfoDetails?.coverName || item?.coverInfoDetails?.projectName) || ''
          return { ...item, text }
        })
      }),
    [filtered, selectedSortOption.value]
  )

  const handleViewFilterChange = (option) => {
    replace(
      {
        query: { ...query, [ViewQueryParam]: option.value }
      },
      undefined,
      { shallow: true }
    )
  }

  const handleSortFilterChange = (option) => {
    const newUrl = { query: { ...query } }
    if (option.value) {
      newUrl.query[SortQueryParam] = option.value
    } else {
      delete newUrl.query[SortQueryParam]
    }

    replace(newUrl, undefined, { shallow: true })
  }

  const handleSearchTextChange = (ev) => {
    const newUrl = { query: { ...query } }
    if (ev.target.value) {
      newUrl.query[SearchQueryParam] = ev.target.value
    } else {
      delete newUrl.query[SearchQueryParam]
    }

    replace(newUrl, undefined, { shallow: true })
  }

  return (
    <Container className='py-16'>
      <div
        id='cover-products'
        className='flex flex-wrap items-center justify-between'
      >
        <Link href='#cover-products'>
          <a>
            <h1 className='mb-3 font-bold xl:mb-0 text-display-xs lg:text-display-sm'>
              <Trans>Cover Products</Trans>
            </h1>
          </a>
        </Link>
        <div className='flex flex-wrap items-center justify-end w-full md:flex-nowrap xl:w-auto'>
          <SearchAndSortBar
            loading={coversLoading}
            searchValue={searchTerm}
            onSearchChange={handleSearchTextChange}
            sortClass='w-auto mb-4 md:mb-0'
            containerClass='flex-col md:flex-row min-w-full md:min-w-sm'
            inputClass='focus:md:w-96 transition-all'
            sortType={selectedSortOption}
            setSortType={handleSortFilterChange}
            optionsProp={sortOptions}
          />

          <div className='w-full md:w-auto md:ml-2'>
            <Select
              prefix={t`View:` + ' '}
              options={viewOptions}
              selected={selectedViewOption}
              setSelected={handleViewFilterChange}
              className='w-auto'
              icon={<FilterIcon height={18} aria-hidden='true' />}
              direction='right'
              loading={coversLoading}
            />
          </div>
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

            if (selectedView === SORT_TYPES.ALL && isValidProduct(c.productKey)) {
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
