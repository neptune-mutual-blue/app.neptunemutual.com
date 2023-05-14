import Link from 'next/link'

import { Container } from '@/common/Container/Container'
import { Grid } from '@/common/Grid/Grid'
import { CardSkeleton } from '@/common/Skeleton/CardSkeleton'
import {
  PoliciesEmptyState
} from '@/modules/my-policies/active/PoliciesEmptyState'
import { CARDS_PER_PAGE } from '@/src/config/constants'
import { Routes } from '@/src/config/routes'
import { useCoversAndProducts2 } from '@/src/context/CoversAndProductsData2'
import { isValidProduct } from '@/src/helpers/cover'
import { PolicyCard } from '@/src/modules/my-policies/PolicyCard'
import { Trans } from '@lingui/macro'

export const PoliciesActivePage = ({ data, loading }) => {
  return (
    <Container className='py-16'>
      <div className='flex justify-end'>
        <Link href={Routes.PolicyTransactions}>
          <a className='text-lg font-medium text-4E7DD9 hover:underline'>
            <Trans>Transaction List</Trans>
          </a>
        </Link>
      </div>
      <ActivePolicies data={data} loading={loading} />
    </Container>
  )
}

function ActivePolicies ({ data, loading }) {
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

  return <PoliciesEmptyState />
}
