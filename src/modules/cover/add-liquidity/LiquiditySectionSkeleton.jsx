import { Container } from '@/common/Container/Container'
import { Skeleton } from '@/common/Skeleton/Skeleton'
import { HeroSkeleton } from '@/modules/reporting/ReportDetailsSkeleton'

export const LiquiditySectionSkeleton = ({ ...rest }) => {
  return (
    <div {...rest}>
      <HeroSkeleton />

      <div className='pt-12 pb-24 border-t border-t-B0C4DB'>
        <Container className=''>
          <Skeleton className='h-8 mb-6 w-96' />

          <Skeleton className='w-full h-4' />
          <Skeleton className='w-40 h-4 mt-1.5' />

          <Skeleton className='h-8 mt-6 mb-12 w-36' />

          <Skeleton className='w-full h-4' />
          <Skeleton className='w-full h-4 mt-1.5' />
          <Skeleton className='w-full h-4 mt-1.5' />
          <Skeleton className='w-full h-4 mt-1.5' />
          <Skeleton className='w-full h-4 mt-1.5' />
          <Skeleton className='h-4 mt-1.5 w-96' />
        </Container>
      </div>
    </div>
  )
}
