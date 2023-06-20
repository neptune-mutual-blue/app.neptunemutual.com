import { Container } from '@/common/Container/Container'
import { Divider } from '@/common/Divider/Divider'
import { Skeleton } from '@/common/Skeleton/Skeleton'
import { HeroSkeleton } from '@/modules/reporting/ReportDetailsSkeleton'

const CoverLiquiditySkeleton = () => {
  return (
    <>
      <HeroSkeleton infoOnRight />

      <div className='pt-12 pb-24 border-t border-t-B0C4DB' data-testid='cover-liquidity-skeleton'>
        <Container className='grid grid-cols-3 lg:gap-32'>
          <div className='col-span-3 md:col-span-2'>
            <div className='space-y-1.5'>
              <Skeleton className='w-full h-4' />
              <Skeleton className='w-full h-4' />
              <Skeleton className='w-2/3 h-4' />
            </div>

            <Skeleton className='w-1/3 h-6 mt-6' />

            <div className='mt-12'>
              <Skeleton className='w-48 h-6 mb-4' />
              <Skeleton className='w-450 h-19 rounded-2' />
              <Skeleton className='h-5 mt-2 w-27' />
              <Skeleton className='h-5 mt-1 w-27' />
            </div>

            <div className='mt-16'>
              <Skeleton className='w-48 h-6 mb-4' />
              <Skeleton className='w-450 h-19 rounded-2' />
              <Skeleton className='h-5 mt-2 w-27' />
              <Skeleton className='h-5 mt-1 w-27' />
            </div>

            <div className='mt-16'>
              <Skeleton className='w-48 h-6 mb-4' />
              <Skeleton className='w-450 h-19 rounded-2' />
            </div>
          </div>

          <div className='col-span-3 row-start-2 lg:col-auto lg:row-start-auto'>
            <Skeleton className='px-8 py-10 bg-opacity-25 rounded-3xl'>
              <>
                <Skeleton className='w-2/3 h-5' />
                <Skeleton className='w-2/3 h-4 mt-1' />
                <Skeleton className='w-2/4 h-5 mt-6' />
                <Skeleton className='w-3/4 h-5 mt-3' />

                <Divider className='mt-4 mb-6' />

                <div className='flex justify-between'>
                  <Skeleton className='h-6 w-28' />
                  <Skeleton className='h-6 w-14' />
                </div>
                <div className='flex justify-between mt-2'>
                  <Skeleton className='h-6 w-28' />
                  <Skeleton className='w-24 h-6' />
                </div>

                <Skeleton className='w-4/6 h-12 mx-auto mt-8 rounded-big' />
              </>
            </Skeleton>
          </div>
        </Container>
      </div>
    </>
  )
}

export { CoverLiquiditySkeleton }
