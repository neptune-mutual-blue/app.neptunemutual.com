import dynamic from 'next/dynamic'

import { ComingSoon } from '@/common/ComingSoon'
import { Seo } from '@/common/Seo'
import ProposalSkeleton from '@/modules/governance/ProposalSkeleton'
import { isFeatureEnabled } from '@/src/config/environment'

const DynamicGovernanceSinglePage = dynamic(() => { return import('@/modules/governance').then((mod) => { return mod.GovernanceSinglePage }) }, {
  loading: () => { return <ProposalSkeleton /> }
})

export default function ProposalDetails ({ networkId }) {
  const disabled = !isFeatureEnabled('governance', networkId)

  if (disabled) {
    return <ComingSoon />
  }

  return (
    <main className='pt-5 pb-32 md:pt-18'>
      <Seo />
      <DynamicGovernanceSinglePage />
    </main>
  )
}
