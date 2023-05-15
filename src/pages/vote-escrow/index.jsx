import React from 'react'

import { Container } from '@/common/Container/Container'
import { Seo } from '@/common/Seo'
import VoteEscrow from '@/modules/vote-escrow/VoteEscrow'

const VoteEscrowPage = () => {
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
