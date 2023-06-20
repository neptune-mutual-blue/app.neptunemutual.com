import {
  useEffect,
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
import { Routes } from '@/src/config/routes'
import { useCoversAndProducts2 } from '@/src/context/CoversAndProductsData2'
import { isValidProduct } from '@/src/helpers/cover'
import { useSearchResults } from '@/src/hooks/useSearchResults'
import { safeFormatBytes32String } from '@/utils/formatter/bytes32String'
import { scrollElementIntoView } from '@/utils/scroll'
import {
  DEFAULT_SORT,
  SORT_DATA_TYPES,
  SORT_TYPES,
  sorter
} from '@/utils/sorting'
import { Trans } from '@lingui/macro'

const homeViewSelectionKey = 'view'

/**
 * @type {Object.<string, {selector:(any) => any, datatype: any, ascending?: boolean }>}
 */
const sorterData = {
  [SORT_TYPES.ALPHABETIC]: {
    selector: (data) => { return data.text },
    datatype: SORT_DATA_TYPES.STRING
  },
  [SORT_TYPES.LIQUIDITY]: {
    selector: (data) => { return data.capacity },
    datatype: SORT_DATA_TYPES.BIGNUMBER
  },
  [SORT_TYPES.UTILIZATION_RATIO]: {
    selector: (data) => { return data.utilizationRatio },
    datatype: SORT_DATA_TYPES.BIGNUMBER
  }
}

export const ProductsGrid = () => {
  const [sortType, setSortType] = useState(DEFAULT_SORT)

  const router = useRouter()
  const { coverId } = router.query
  const coverKey = safeFormatBytes32String(coverId)

  const { loading, getProductsByCoverKey, getCoverByCoverKey, getProduct } = useCoversAndProducts2()

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
    () => {
      return sorter({
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
      })
    },

    [filtered, sortType.value]
  )

  const searchHandler = (ev) => {
    setSearchValue(ev.target.value)
  }

  useEffect(() => {
    scrollElementIntoView('diversified-products-container', 150)
  }, [])

  return (
    <Container className='py-16' data-testid='available-covers-container' id='diversified-products-container'>
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
            <a className='inline-flex items-center px-4 py-3 mr-6 tracking-wide text-black uppercase border-none rounded-lg bg-E6EAEF hover:bg-opacity-80 disabled:bg-EEEEEE disabled:text-9B9B9B focus:outline-none focus-visible:ring-2 focus-visible:ring-4E7DD9'>
              <LeftArrow />
              <Trans>Back</Trans>
            </a>
          </Link>
          <h1 className='font-bold text-display-xs lg:text-display-sm'>
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

      <Grid className='grid-rows-5 gap-4 mt-14 lg:mb-24 mb-14 lg:grid-rows-4'>

        <Content
          loading={loading}
          data={sortedCovers}
          getProduct={getProduct}
        />
      </Grid>

    </Container>
  )
}

function Content ({
  data = [],
  loading = false,
  getProduct
}) {
  if (loading) {
    return <CardSkeleton className='min-h-301' numberOfCards={6} />
  }

  if (data.length === 0) {
    return (
      <p data-testid='no-data' className='min-h-301'>
        <Trans>No Data Found</Trans>
      </p>
    )
  }

  return (
    <>
      {data.map(({ coverKey, productKey }) => {
        return (
          <ProductCardWrapper
            key={coverKey + productKey}
            coverKey={coverKey}
            productKey={productKey}
            productData={getProduct(coverKey, productKey)}
          />
        )
      })}
    </>
  )
}
