import Link from 'next/link'

import { Container } from '@/common/Container/Container'
import { Grid } from '@/common/Grid/Grid'
import { CardSkeleton } from '@/common/Skeleton/CardSkeleton'
import { CARDS_PER_PAGE } from '@/src/config/constants'
import { Routes } from '@/src/config/routes'
import { useCoversAndProducts2 } from '@/src/context/CoversAndProductsData2'
import { isValidProduct } from '@/src/helpers/cover'
import { useExpiredPolicies } from '@/src/hooks/useExpiredPolicies'
import { PolicyCard } from '@/src/modules/my-policies/PolicyCard'
import {
  t,
  Trans
} from '@lingui/macro'

export const PoliciesExpiredPage = () => {
  const {
    data: { expiredPolicies },
    loading
  } = useExpiredPolicies()

  return (
    <Container className='py-16'>
      <div className='flex justify-end'>
        <Link href={Routes.PolicyTransactions}>
          <a className='text-lg font-medium text-4E7DD9 hover:underline'>
            <Trans>Transaction List</Trans>
          </a>
        </Link>
      </div>
      <ExpiredPolicies data={expiredPolicies} loading={loading} />
    </Container>
  )
}

function ExpiredPolicies ({ data, loading }) {
  const { loading: dataLoading, getProduct, getCoverByCoverKey } = useCoversAndProducts2()

  if (loading || dataLoading) {
    return (
      <Grid className='mb-24 mt-14'>
        <CardSkeleton
          numberOfCards={CARDS_PER_PAGE}
          statusBadge={false}
          subTitle={false}
        />
      </Grid>
    )
  }

  if (data.length) {
    return (
      <Grid className='mb-24 mt-14'>
        {data.map((policyInfo) => {
          const isDiversified = isValidProduct(policyInfo.productKey)

          return (
            <PolicyCard
              key={policyInfo.id}
              policyInfo={policyInfo}
              coverOrProductData={isDiversified ? getProduct(policyInfo.coverKey, policyInfo.productKey) : getCoverByCoverKey(policyInfo.coverKey)}
            />
          )
        })}
      </Grid>
    )
  }

  return (
    <div
      className='flex flex-col items-center w-full pt-20'
      data-testid='empty-text'
    >
      <img
        src='/images/covers/empty-list-illustration.svg'
        alt={t`No data found`}
        className='w-48 h-48'
      />
      <p className='max-w-full mt-8 text-center text-md text-404040 w-96'>
        <Trans>
          When a policy&apos;s duration ends, it automatically moves to this
          section. Explore products on the home screen to view available
          protections.
        </Trans>
      </p>
    </div>
  )
}
