import { useState } from 'react'

import Link from 'next/link'

import { Container } from '@/common/Container/Container'
import { SearchAndSortBar } from '@/common/SearchAndSortBar'
import { Routes } from '@/src/config/routes'
import { SORT_TYPES } from '@/utils/sorting'
import {
  t,
  Trans
} from '@lingui/macro'

export const LiquidityGaugePoolsPage = () => {
  const [sortType, setSortType] = useState({
    name: t`A-Z`,
    value: SORT_TYPES.ALPHABETIC
  })

  const [searchValue, setSearchValue] = useState('')

  const options = [
    { name: t`TVL`, value: SORT_TYPES.TVL },
    { name: t`Emissions`, value: SORT_TYPES.EMISSIONS },
    { name: t`APR`, value: SORT_TYPES.APR }
  ]

  return (
    <Container className='pt-16 pb-36' data-testid='pod-staking-page-container'>
      <div className='flex justify-end'>
        <div className='items-center justify-between w-full sm:flex'>
          <Link href={Routes.StakingPoolsTransactions}>
            <a className='flex justify-center font-medium sm:inline-flex text-lg text-4E7DD9 hover:underline'>
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
      <div className='flex justify-end mt-14 text-4E7DD9 text-md font-semibold'>
        <Link href='/pools/liquidity-gauge-pools/latest-gauge'>View the Latest Gauge --&gt;</Link>
      </div>

    </Container>
  )
}
