import Link from 'next/link'

import { Container } from '@/common/Container/Container'
import {
  MyLiquidityCoverCard
} from '@/common/Cover/MyLiquidity/MyLiquidityCoverCard'
import { Grid } from '@/common/Grid/Grid'
import { CardSkeleton } from '@/common/Skeleton/CardSkeleton'
import { Routes } from '@/src/config/routes'
import { useCoversAndProducts } from '@/src/context/CoversAndProductsData'
import { useNetwork } from '@/src/context/Network'
import {
  t,
  Trans
} from '@lingui/macro'
import { useLingui } from '@lingui/react'

export const MyLiquidityPage = ({ myLiquidities, loading }) => {
  const { networkId } = useNetwork()

  return (
    <Container className='py-16' data-testid='page-container'>
      <div className='flex justify-end'>
        <Link
          href={Routes.LiquidityTransactions(networkId)}
          className='text-lg font-medium text-4E7DD9 hover:underline'
        >

          <Trans>Transaction List</Trans>

        </Link>
      </div>

      <MyLiquidities data={myLiquidities} loading={loading} />
    </Container>
  )
}

function MyLiquidities ({ data, loading }) {
  const { networkId } = useNetwork()
  const { loading: isSummaryLoading, getCoverByCoverKey, getProductsByCoverKey } = useCoversAndProducts()

  const { i18n } = useLingui()

  if (loading || isSummaryLoading) {
    return (
      <Grid className='mb-24 mt-14' data-testid='loading-grid'>
        <CardSkeleton
          numberOfCards={15}
          statusBadge={false}
          subTitle={false}
        />
      </Grid>
    )
  }

  if (data.length === 0) {
    return (
      <div
        className='flex flex-col items-center w-full pt-20'
        data-testid='no-liquidities-grid'
      >
        <img
          src='/images/covers/empty-list-illustration.svg'
          alt={t(i18n)`No data found`}
          className='w-48 h-48'
        />
        <p className='max-w-full mt-8 text-center text-md text-404040 w-96'>
          <Trans>
            Liquidity providers collectively own a liquidity pool. To become a
            liquidity provider, select a cover from the home screen.
          </Trans>
        </p>
      </div>
    )
  }

  return (
    <Grid className='mb-24 mt-14' data-testid='liquidities-grid'>
      {data.map((x) => {
        const coverKey = x.coverKey
        const coverData = getCoverByCoverKey(x.coverKey)
        const isDiversified = coverData?.supportsProducts

        return (
          (
            <Link
              href={Routes.MyCoverLiquidity(coverKey, networkId)}
              key={x.coverKey}
              className='rounded-3xl focus:outline-none focus-visible:ring-2 focus-visible:ring-4E7DD9'
              data-testid='liquidity-cover-card'
            >

              <MyLiquidityCoverCard
                coverKey={coverKey}
                coverData={coverData}
                totalPODs={x.balance}
                tokenSymbol={x.tokenSymbol}
                subProducts={isDiversified ? getProductsByCoverKey(coverKey) : null}
              />

            </Link>
          )
        )
      })}
    </Grid>
  )
}
