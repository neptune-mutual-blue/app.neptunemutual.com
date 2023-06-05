import { Seo } from '@/common/Seo'
import { GovernanceSinglePage } from '@/modules/governance'

export default function ProposalDetails () {
  return (
    <main className='pt-5 pb-32 md:pt-18'>
      <Seo />
      <GovernanceSinglePage />
    </main>
  )
}
