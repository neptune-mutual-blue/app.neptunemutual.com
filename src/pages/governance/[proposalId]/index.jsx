import { ComingSoon } from '@/common/ComingSoon'
import { Seo } from '@/common/Seo'
import { GovernanceSinglePage } from '@/modules/governance'
import { isFeatureEnabled } from '@/src/config/environment'

const disabled = !isFeatureEnabled('governance')

export default function ProposalDetails () {
  if (disabled) {
    return <ComingSoon />
  }

  return (
    <main className='pt-5 pb-32 md:pt-18'>
      <Seo />
      <GovernanceSinglePage />
    </main>
  )
}
