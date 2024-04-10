import React from 'react'

import { ComingSoon } from '@/common/ComingSoon'
import { Container } from '@/common/Container/Container'
import { Seo } from '@/common/Seo'
import VoteEscrow from '@/modules/vote-escrow/VoteEscrow'
import { isFeatureEnabled } from '@/src/config/environment'
import { Loading } from '@/common/Loading'
import { useNetwork } from '@/src/context/Network'
import { ChainConfig } from '@/src/config/hardcoded'

/* istanbul ignore next */
export function getStaticProps () {
  return {
    props: {
      disabled: !isFeatureEnabled('vote-escrow')
    }
  }
}

const VoteEscrowPage = ({ disabled }) => {
  const { networkId } = useNetwork()

  if (disabled) {
    return <ComingSoon />
  }

  if (!networkId || !ChainConfig[networkId] || !ChainConfig[networkId].veNPM || !ChainConfig[networkId].veNPM.address) {
    return <Loading />
  }

  return (
    <main className='pt-16 pb-36' id='vote-escrow-page'>
      <Seo />
      <Container>
        <VoteEscrow />
      </Container>
    </main>
  )
}

export default VoteEscrowPage
