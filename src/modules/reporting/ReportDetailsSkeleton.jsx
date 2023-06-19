import { Container } from '@/common/Container/Container'
import { Divider } from '@/common/Divider/Divider'
import { Hero } from '@/common/Hero'
import { OutlinedCard } from '@/common/OutlinedCard/OutlinedCard'
import { Skeleton } from '@/common/Skeleton/Skeleton'

export const HeroSkeleton = ({ infoOnRight = false, ...rest }) => {
  return (
    <Hero {...rest}>
      <Container className='px-2 pt-5 pb-20 md:py-20 min-h-[312px]'>
        <Skeleton className='h-5 w-72 mb-11' />

        <div className='flex items-center gap-6'>
          <Skeleton className='w-24 h-24 rounded-full' />
          <div>
            <Skeleton className='w-64 h-9' />
            <Skeleton className='h-6 mt-1 w-18' />
            <div className='flex gap-4 mt-4'>
              {
              Array(4).fill(0).map((_, i) => { return <Skeleton key={i} className='w-6 h-6' /> })
            }
            </div>
          </div>

          {
          infoOnRight && (
            <div className='ml-auto'>
              <Skeleton className='h-6 ml-auto w-27' />
              <Skeleton className='mt-1 h-9 w-54' />
            </div>
          )
        }
        </div>
      </Container>
    </Hero>
  )
}

export const ReportDetailsSkeleton = () => {
  return (
    <>
      <HeroSkeleton />

      <hr className='border-B0C4DB' />

      <Container className='py-16' data-testid='report-detail-skeleton'>
        <OutlinedCard className='grid-cols-4 bg-white md:grid'>
          <div className='col-span-3 p-10 md:border-r border-B0C4DB pb-72'>
            <Skeleton className='h-8 w-42' />
            <Skeleton className='w-full mt-6 h-13' />

            <div className='flex justify-center gap-6 mt-6 mb-12'>
              <Skeleton className='w-48 h-5' />
              <Skeleton className='w-48 h-5' />
            </div>

            <Divider className='my-8' />

            <div className='flex justify-around'>
              <Skeleton className='rounded-lg h-14 w-80' />
              <Skeleton className='rounded-lg h-14 w-80' />
            </div>
          </div>
          <div className='col-span-1 p-10'>
            <Skeleton className='mb-4 h-7 w-13' />

            <div className='space-y-1'>
              <div className='flex justify-between'>
                <Skeleton className='w-24 h-7' />
                <Skeleton className='w-6 h-7' />
              </div>

              <div className='flex justify-between'>
                <Skeleton className='h-7 w-14' />
                <Skeleton className='w-20 h-7' />
              </div>

              <div className='flex justify-between'>
                <Skeleton className='w-10 h-7' />
                <Skeleton className='w-6 h-7' />
              </div>

              <div className='flex justify-between'>
                <Skeleton className='h-7 w-14' />
                <Skeleton className='w-20 h-7' />
              </div>
            </div>

            <hr className='mt-4 mb-6 border-t border-D4DFEE' />

            <div className='space-y-1'>
              <div className='flex justify-between'>
                <Skeleton className='w-24 h-7' />
                <Skeleton className='w-6 h-7' />
              </div>

              <div className='flex justify-between'>
                <Skeleton className='h-7 w-14' />
                <Skeleton className='w-20 h-7' />
              </div>

              <div className='flex justify-between'>
                <Skeleton className='w-10 h-7' />
                <Skeleton className='w-6 h-7' />
              </div>

              <div className='flex justify-between'>
                <Skeleton className='h-7 w-14' />
                <Skeleton className='w-20 h-7' />
              </div>
            </div>

            <hr className='mt-6 mb-6 border-t border-D4DFEE' />

            <Skeleton className='w-40 mb-4 h-7' />
            <Skeleton className='w-32 h-6 mb-4' />

            <hr className='mt-8 mb-6 border-t border-D4DFEE' />

            <Skeleton className='w-40 mb-4 h-7' />
            <Skeleton className='w-40 h-5 mb-4' />

          </div>

        </OutlinedCard>
      </Container>
    </>
  )
}
