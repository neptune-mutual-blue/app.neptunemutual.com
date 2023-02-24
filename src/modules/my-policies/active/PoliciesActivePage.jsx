import Link from 'next/link'

import { Container } from '@/common/Container/Container'
import { Grid } from '@/common/Grid/Grid'
import { PolicyCard } from '@/src/modules/my-policies/PolicyCard'
import { CardSkeleton } from '@/common/Skeleton/CardSkeleton'
import { CARDS_PER_PAGE } from '@/src/config/constants'
import { Trans } from '@lingui/macro'
import { Routes } from '@/src/config/routes'
import { PoliciesEmptyState } from '@/modules/my-policies/active/PoliciesEmptyState'

export const PoliciesActivePage = ({ data, loading }) => {
  return (
    <Container className='py-16'>
      <div className='flex justify-end'>
        <Link href={Routes.PolicyTransactions}>
          <a className='font-medium text-h4 text-4e7dd9 hover:underline'>
            <Trans>Transaction List</Trans>
          </a>
        </Link>
      </div>
      <ActivePolicies data={data} loading={loading} />
    </Container>
  )
}

function ActivePolicies ({ data, loading }) {
  if (loading) {
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
          return <PolicyCard key={policyInfo.id} policyInfo={policyInfo} />
        })}
      </Grid>
    )
  }

  return <PoliciesEmptyState />
}
