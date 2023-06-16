import { Container } from '@/common/Container/Container'
import { SecondaryCard } from '@/common/SecondaryCard/SecondaryCard'
import { Skeleton } from '@/common/Skeleton/Skeleton'
import { HeroSkeleton } from '@/modules/reporting/ReportDetailsSkeleton'

export const NewReportSkeleton = () => {
  return (
    <>
      <HeroSkeleton />

      <div className='pt-12 pb-24 border-t border-t-B0C4DB'>
        <Container className='grid grid-cols-3 md:gap-32'>
          <div className='col-span-3 row-start-3 md:col-span-2 md:row-start-auto'>
            <Skeleton className='w-40 h-6 mt-10 mb-6' />

            <div className='space-y-1.5'>
              {
              Array(5).fill(0).map((_, i) => { return <Skeleton className='w-full h-4' key={i} /> })
            }
              <Skeleton className='w-1/2 h-4' />
            </div>

            <Skeleton className='w-40 h-6 mt-10 mb-6' />

            <div className='space-y-1.5'>
              {
              Array(5).fill(0).map((_, i) => { return <Skeleton className='w-full h-4' key={i} /> })
            }
              <Skeleton className='w-1/2 h-4' />
            </div>

            <Skeleton className='w-40 h-6 mt-10 mb-6' />

            <div className='space-y-1.5'>
              {
              Array(2).fill(0).map((_, i) => { return <Skeleton className='w-full h-4' key={i} /> })
            }
              <Skeleton className='w-1/2 h-4' />
            </div>
          </div>

          <div className='col-span-3 row-start-2 lg:col-auto lg:row-start-auto'>
            <SecondaryCard>
              <div className='flex flex-wrap justify-between md:block'>
                <Skeleton className='w-4/6 h-7 bg-B2C4DC' />
                <Skeleton className='w-2/3 h-5 mt-1 mb-6 bg-B2C4DC' />

                <Skeleton className='hidden w-2/3 h-6 mt-1 mb-6 md:block bg-B2C4DC' />
                <Skeleton className='hidden w-3/4 h-6 mt-3 md:block bg-B2C4DC' />
              </div>
            </SecondaryCard>
          </div>
        </Container>
      </div>
    </>
  )
}
