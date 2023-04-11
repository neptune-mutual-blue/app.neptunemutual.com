import { useMemo } from 'react'

import Link from 'next/link'
import { useRouter } from 'next/router'

import { Container } from '@/common/Container/Container'
import { CoverCardWrapper } from '@/common/Cover/CoverCardWrapper'
import { ProductCardWrapper } from '@/common/Cover/ProductCardWrapper'
import { Grid } from '@/common/Grid/Grid'
import { SearchAndSortBar } from '@/common/SearchAndSortBar'
import { Select } from '@/common/Select'
import { CardSkeleton } from '@/common/Skeleton/CardSkeleton'
import FilterIcon from '@/icons/FilterIcon'
import { CARDS_PER_PAGE } from '@/src/config/constants'
import { useCoversAndProducts2 } from '@/src/context/CoversAndProductsData2'
import { isValidProduct } from '@/src/helpers/cover'
import {
  DEFAULT_SORT_OPTIONS,
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
const defaultSortOption = DEFAULT_SORT_OPTIONS[2]

const getSelectedSortOption = (query) => {
  const selectedSort = typeof query[SortQueryParam] === 'string' ? query[SortQueryParam] : defaultSortOption.value
  return sortOptions.find((item) => item.value === selectedSort) || defaultSortOption
}

const getSelectedViewOption = (query) => {
  const selectedView = typeof query[ViewQueryParam] === 'string' ? query[ViewQueryParam] : defaultViewOption.value
  return viewOptions.find((item) => item.value === selectedView) || defaultViewOption
}

export const AvailableCovers = () => {
  const { query, replace } = useRouter()
  const {
    loading: coversLoading,
    getDedicatedCovers,
    getDiversifiedCovers,
    getAllProducts,
    getCoverByCoverKey,
    getProduct
  } = useCoversAndProducts2()

  const searchTerm = typeof query[SearchQueryParam] === 'string' ? query[SearchQueryParam] : ''
  const selectedSortOption = getSelectedSortOption(query)
  const selectedViewOption = getSelectedViewOption(query)

  const list = useMemo(() => {
    if (selectedViewOption.value === SORT_TYPES.DEDICATED_POOL) {
      return getDedicatedCovers()
    } else if (selectedViewOption.value === SORT_TYPES.DIVERSIFIED_POOL) {
      return getDiversifiedCovers()
    }
    return getAllProducts()
  }, [getAllProducts, getDedicatedCovers, getDiversifiedCovers, selectedViewOption.value])

  const filtered = useMemo(() => {
    return list.filter((item) => {
      try {
        const isDiversifiedProduct = isValidProduct(item.productKey)
        const text = (isDiversifiedProduct
          ? item.productInfoDetails?.productName
          : item?.coverInfoDetails?.coverName || item?.coverInfoDetails?.projectName) || ''

        return toStringSafe(text).includes(toStringSafe(searchTerm))
      } catch (err) { /* swallow */ }

      return true
    })
  }, [list, searchTerm])

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
    const newUrl = { query: { ...query } }
    if (option.value && option.value !== defaultViewOption.value) {
      newUrl.query[ViewQueryParam] = option.value
    } else {
      delete newUrl.query[ViewQueryParam]
    }

    replace(newUrl, undefined, { shallow: true })
  }

  const handleSortFilterChange = (option) => {
    const newUrl = { query: { ...query } }
    if (option.value && option.value !== defaultSortOption.value) {
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
        className='gap-4 mt-14 lg:mb-24 mb-14 lg:min-h-360'
        data-testid='body'
      >
        <Content
          sortedCoversOrProducts={sortedCovers}
          loading={coversLoading}
          selectedViewOption={selectedViewOption}
          getProduct={getProduct}
          getCoverByCoverKey={getCoverByCoverKey}
        />

      </Grid>
    </Container>
  )
}

function Content ({
  loading,
  sortedCoversOrProducts,
  selectedViewOption,
  getProduct,
  getCoverByCoverKey
}) {
  if (loading) {
    return (
      <CardSkeleton numberOfCards={CARDS_PER_PAGE} className='min-h-301' />
    )
  }

  if (sortedCoversOrProducts.length === 0) {
    return <p data-testid='no-data' className='min-h-301'>No data found</p>
  }

  return (
    sortedCoversOrProducts.map((c) => {
      // if (idx > showCount - 1) return null

      if (selectedViewOption.value === SORT_TYPES.ALL && isValidProduct(c.productKey)) {
        return (
          <ProductCardWrapper
            className='min-h-301'
            key={c.coverKey + c.productKey}
            coverKey={c.coverKey}
            productKey={c.productKey}
            productData={getProduct(c.coverKey, c.productKey)}
          />
        )
      }

      return (
        <CoverCardWrapper
          key={c.coverKey}
          coverKey={c.coverKey}
          className='min-h-301'
          coverData={getCoverByCoverKey(c.coverKey)}
        />
      )
    })
  )
}
