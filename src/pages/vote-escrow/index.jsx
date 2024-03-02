import React from 'react'

import { ComingSoon } from '@/common/ComingSoon'
import { Container } from '@/common/Container/Container'
import { Loading } from '@/common/Loading'
import { Seo } from '@/common/Seo'
import VoteEscrow from '@/modules/vote-escrow/VoteEscrow'
import { isFeatureEnabled } from '@/src/config/environment'
import { useNetwork } from '@/src/context/Network'

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

  return (
    <main className='pt-16 pb-36' id='vote-escrow-page'>
      <Seo />
      <Container>
        {networkId ? <VoteEscrow /> : <Loading />}
      </Container>
    </main>
  )
}

export default VoteEscrowPage
