import React from 'react'

import { ComingSoon } from '@/common/ComingSoon'
import { Container } from '@/common/Container/Container'
import { Seo } from '@/common/Seo'
import VoteEscrow from '@/modules/vote-escrow/VoteEscrow'
import { isFeatureEnabled } from '@/src/config/environment'

/* istanbul ignore next */
export function getStaticProps () {
  return {
    props: {
      disabled: !isFeatureEnabled('vote-escrow')
    }
  }
}

const VoteEscrowPage = ({ disabled }) => {
  if (disabled) {
    return <ComingSoon />
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
