import React from 'react'

import { ComingSoon } from '@/common/ComingSoon'
import { Container } from '@/common/Container/Container'
import { Loading } from '@/common/Loading'
import { Seo } from '@/common/Seo'
import VoteEscrow from '@/modules/vote-escrow/VoteEscrow'
import { isFeatureEnabled } from '@/src/config/environment'

import { slugToNetworkId } from '@/src/config/networks'
import { getNetworks } from '@/src/ssg/static-paths'
import { ChainConfig } from '@/src/config/hardcoded'

export const getStaticPaths = async () => {
  return {
    paths: getNetworks(),
    fallback: false
  }
}

export const getStaticProps = async ({ params }) => {
  return {
    props: {
      networkId: slugToNetworkId[params.network]
    }
  }
}

export default function VoteEscrowPage ({ networkId }) {
  const disabled = !isFeatureEnabled('vote-escrow', networkId)

  if (disabled) {
    return <ComingSoon />
  }

  if (!ChainConfig[networkId]) {
    return <Loading />
  }

  return (
    <main className='pt-16 pb-36' id='vote-escrow-page'>
      <Seo />
      <Container>
        <VoteEscrow networkId={networkId} />
      </Container>
    </main>
  )
}
