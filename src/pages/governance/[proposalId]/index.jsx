import dynamic from 'next/dynamic'

import { ComingSoon } from '@/common/ComingSoon'
import { Seo } from '@/common/Seo'
import ProposalSkeleton from '@/modules/governance/ProposalSkeleton'
import { isFeatureEnabled } from '@/src/config/environment'
import { useNetwork } from '@/src/context/Network'

const DynamicGovernanceSinglePage = dynamic(() => { return import('@/modules/governance').then((mod) => { return mod.GovernanceSinglePage }) }, {
  loading: () => { return <ProposalSkeleton /> }
})

export default function ProposalDetails () {
  const { networkId } = useNetwork()

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
