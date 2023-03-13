import React, {
  useMemo,
  useState
} from 'react'

import Link from 'next/link'
import { useRouter } from 'next/router'

import { Container } from '@/common/Container/Container'
import { ProductCardWrapper } from '@/common/Cover/ProductCardWrapper'
import { Grid } from '@/common/Grid/Grid'
import { SearchAndSortBar } from '@/common/SearchAndSortBar'
import { CardSkeleton } from '@/common/Skeleton/CardSkeleton'
import LeftArrow from '@/icons/LeftArrow'
import {
  homeViewSelectionKey
} from '@/src/config/constants'
import { Routes } from '@/src/config/routes'
import { useSearchResults } from '@/src/hooks/useSearchResults'
import { safeFormatBytes32String } from '@/utils/formatter/bytes32String'
import {
  DEFAULT_SORT,
  SORT_DATA_TYPES,
  SORT_TYPES,
  sorter
} from '@/utils/sorting'
import { Trans } from '@lingui/macro'
import { useCoversAndProducts2 } from '@/src/context/CoversAndProductsData2'
import { isValidProduct } from '@/src/helpers/cover'

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

export const ProductsGrid = () => {
  const [sortType, setSortType] = useState(DEFAULT_SORT)

  const router = useRouter()
  const { coverId } = router.query
  const coverKey = safeFormatBytes32String(coverId)

  const { loading, getProductsByCoverKey, getCoverByCoverKey } = useCoversAndProducts2()

  const coverData = getCoverByCoverKey(coverKey)

  const { searchValue, setSearchValue, filtered } = useSearchResults({
    list: getProductsByCoverKey(coverKey),
    filter: (data, searchTerm) => {
      const isDiversifiedProduct = isValidProduct(data.productKey)
      const text = isDiversifiedProduct
        ? data.productInfoDetails?.productName
        : data?.coverInfoDetails.coverName || data?.coverInfoDetails.projectName

      return (text.toLowerCase().includes(searchTerm.toLowerCase()))
    }
  })

  const sortedCovers = useMemo(
    () =>
      sorter({
        ...sorterData[sortType.value],
        list: filtered.map(data => {
          const isDiversifiedProduct = isValidProduct(data.productKey)
          const text = isDiversifiedProduct
            ? data.productInfoDetails?.productName
            : data?.coverInfoDetails.coverName || data?.coverInfoDetails.projectName
          return {
            ...data,
            text
          }
        })
      }),

    [filtered, sortType.value]
  )

  const searchHandler = (ev) => {
    setSearchValue(ev.target.value)
  }

  return (
    <Container className='py-16' data-testid='available-covers-container'>
      <div className='flex flex-wrap items-center justify-between gap-6 md:flex-nowrap'>
        <div className='flex items-center'>
          <Link
            href={{
              pathname: Routes.Home,
              query: {
                [homeViewSelectionKey]: SORT_TYPES.DIVERSIFIED_POOL
              }
            }}
            scroll={false}
          >
            <a className='inline-flex items-center px-4 py-3 mr-6 tracking-wide text-black uppercase border-none rounded-lg font-inter bg-E6EAEF hover:bg-opacity-80 disabled:bg-EEEEEE disabled:text-9B9B9B focus:outline-none focus-visible:ring-2 focus-visible:ring-4e7dd9'>
              <LeftArrow />
              <Trans>Back</Trans>
            </a>
          </Link>
          <h1 className='font-bold text-h3 lg:text-h2 font-inter'>
            {coverData?.coverInfoDetails?.coverName || coverData?.coverInfoDetails?.productName || ''}
          </h1>
        </div>

        <SearchAndSortBar
          searchValue={searchValue}
          onSearchChange={searchHandler}
          sortClass='w-full md:w-48 lg:w-64 rounded-lg'
          containerClass='flex-col md:flex-row min-w-full md:min-w-sm'
          searchClass='w-full md:w-64 rounded-lg'
          sortType={sortType}
          setSortType={setSortType}
        />
      </div>

      <Content
        loading={loading}
        data={sortedCovers}
      />
    </Container>
  )
}

function Content ({
  data = [],
  loading = false
}) {
  return (
    <>
      <Grid className='grid-rows-5 gap-4 mt-14 lg:mb-24 mb-14 lg:grid-rows-4'>

        {data.map(({ id, coverKey, productKey }) => {
          return (
            <ProductCardWrapper
              key={id}
              coverKey={coverKey}
              productKey={productKey}
            />
          )
        })}
        {loading && <CardSkeleton className='min-h-301' numberOfCards={6} />}
        {data.length === 0 && (
          <p data-testid='no-data' className='min-h-301'>
            <Trans>No Data Found</Trans>
          </p>
        )}
      </Grid>

    </>
  )
}
