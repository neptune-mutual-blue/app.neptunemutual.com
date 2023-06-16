import { Container } from '@/common/Container/Container'
import { Hero } from '@/common/Hero'
import { Skeleton } from '@/common/Skeleton/Skeleton'

export const HomeHeroSkeleton = ({ ...rest }) => {
  return (
    <Hero big>
      <Container
        {...rest}
        className='flex flex-col-reverse items-stretch justify-between py-10 lg:gap-8 md:py-16 md:px-10 lg:py-28 md:flex-col-reverse lg:flex-row'
      >
        <div className='pt-10 md:flex lg:flex-col md:gap-4 md:w-full lg:w-auto lg:pt-0'>
          <div className='flex-1 lg:flex-2 lg:flex lg:flex-col'>
            <div
              className='flex mb-2 md:mb-0 lg:mb-8 md:justify-center lg:justify-start lg:flex-1'
            >
              <Skeleton className='w-96 h-44 rounded-2xl' />
            </div>
            <div
              className='flex mb-2 md:mb-0 lg:mb-8 md:justify-center lg:justify-start lg:flex-1'
            >
              <Skeleton className='w-96 h-44 rounded-2xl' />
            </div>
          </div>
          <div
            className='flex flex-1 md:justify-center lg:justify-start'
          >
            <Skeleton className='rounded-2xl w-96 h-52' />
          </div>
        </div>

        <div className='w-full h-full px-6 py-8 lg:p-14'>
          <Skeleton className='h-5 mb-1 w-14' />
          <Skeleton className='h-8 mb-8 w-52' />
          <Skeleton className='flex flex-col w-full min-h-360' />
          <Skeleton className='w-full mt-8 h-18' />
        </div>
      </Container>
    </Hero>
  )
}
