import { Container } from '@/common/Container/Container'
import { Skeleton } from '@/common/Skeleton/Skeleton'

export const DisputeFormSkeleton = () => {
  return (
    <Container className='pt-12 bg-white border-t pb-44 border-t-B0C4DB max-w-none md:bg-transparent' data-testid='dispute-form-loading-skeleton'>
      <div className='px-2 mx-auto bg-white border rounded-lg max-w-7xl md:py-16 md:px-24 border-B0C4DB'>
        <Skeleton className='w-48 mb-4 h-9' />

        <div className='my-12'>
          <Skeleton className='h-8 mt-6 mb-2 w-28' />
          <Skeleton className='w-full h-19 rounded-2' />
        </div>

        <div className='my-12'>
          <Skeleton className='h-8 mt-6 mb-2 w-28' />
          <Skeleton className='w-full h-19 rounded-2' />
        </div>

        <div className='my-12'>
          <Skeleton className='h-8 mt-6 mb-2 w-28' />
          <Skeleton className='w-full h-42 rounded-2' />
        </div>
      </div>
    </Container>
  )
}
