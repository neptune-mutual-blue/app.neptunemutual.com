import React from 'react'

import { ComingSoon } from '@/common/ComingSoon'
import { Container } from '@/common/Container/Container'
import { Loading } from '@/common/Loading'
import { Seo } from '@/common/Seo'
import VoteEscrow from '@/modules/vote-escrow/VoteEscrow'
import { isFeatureEnabled } from '@/src/config/environment'
import { ChainConfig } from '@/src/config/hardcoded'
import { slugToNetworkId } from '@/src/config/networks'
import { getTitle } from '@/src/ssg/seo'
import { getNetworks } from '@/src/ssg/static-paths'

export const getStaticPaths = async () => {
  return {
    paths: getNetworks(),
    fallback: false
  }
}

export const getStaticProps = async ({ params }) => {
  return {
    props: {
      networkId: slugToNetworkId[params.network],
      title: getTitle({
        networkId: slugToNetworkId[params.network],
        pageAction: 'Vote Escrow'
      })
    }
  }
}

export default function VoteEscrowPage ({ networkId, title }) {
  const disabled = !isFeatureEnabled('vote-escrow', networkId)

  if (disabled) {
    return <ComingSoon />
  }

  if (!ChainConfig[networkId]) {
    return <Loading />
  }

  return (
    <main className='pt-16 pb-36' id='vote-escrow-page'>
      <Seo title={title} />
      <Container>
        <VoteEscrow networkId={networkId} />
      </Container>
    </main>
  )
}
