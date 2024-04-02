import dynamic from 'next/dynamic'

import { ComingSoon } from '@/common/ComingSoon'
import { Seo } from '@/common/Seo'
import ProposalSkeleton from '@/modules/governance/ProposalSkeleton'
import { isFeatureEnabled } from '@/src/config/environment'
import { slugToNetworkId } from '@/src/config/networks'
import { getTitle } from '@/src/ssg/seo'

const DynamicGovernanceSinglePage = dynamic(() => { return import('@/modules/governance').then((mod) => { return mod.GovernanceSinglePage }) }, {
  loading: () => { return <ProposalSkeleton /> }
})

export async function getStaticPaths () {
  return { paths: [], fallback: 'blocking' }
}

export async function getStaticProps ({ params }) {
  const networkId = slugToNetworkId[params.network]

  if (!networkId) {
    return {
      notFound: true
    }
  }

  return {
    props: {
      networkId,
      proposalId: params.proposalId,
      title: getTitle({
        networkId,
        pageAction: 'Proposal Details'
      })
    },
    revalidate: 10 // In seconds
  }
}

export default function ProposalDetails ({ networkId, proposalId, title }) {
  const disabled = !isFeatureEnabled('governance', networkId)

  if (disabled) {
    return <ComingSoon />
  }

  return (
    <main className='pt-5 pb-32 md:pt-18'>
      <Seo title={title} />
      <DynamicGovernanceSinglePage proposalId={proposalId} />
    </main>
  )
}
