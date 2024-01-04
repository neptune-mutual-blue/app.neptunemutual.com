import React from 'react'

import { Container } from '@/common/Container/Container'
import { Hero } from '@/common/Hero'
import { Skeleton } from '@/common/Skeleton/Skeleton'

const InsightsSkeleton = () => {
  return (
    <Hero big>
      <Container className='flex flex-col justify-between gap-8 px-4 py-8 lg:gap-8 md:py-16 md:px-6 lg:flex-row lg:py-28 lg:px-8'>
        <Skeleton className='lg:flex-2 w-full h-[600px] rounded-2xl' />
        <Skeleton className='lg:flex-1 h-[600px] rounded-2xl' />
      </Container>
    </Hero>
  )
}

export default InsightsSkeleton
