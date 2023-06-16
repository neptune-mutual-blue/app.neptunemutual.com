import { Container } from '@/common/Container/Container'
import { Skeleton } from '@/common/Skeleton/Skeleton'

export const PurchasePageSkeleton = ({ ...rest }) => {
  return (
    <main {...rest}>
      <Container className='pt-5 md:pt-9'>
        <Skeleton className='h-5 w-400 mb-11' />
      </Container>

      <div className='pt-12 pb-24'>
        <Container className='flex justify-center'>
          <div className='w-full md:w-2/3'>
            <div className='flex justify-center w-full mt-12'>
              <div className='flex flex-col w-616'>
                <div className='w-full p-4 rounded-xl bg-FEFEFF md:p-9 border-B0C4DB border-1.5'>
                  <div className='flex items-center justify-center gap-2.5 mb-6'>
                    <Skeleton className='w-8 h-8 rounded-full' />
                    <Skeleton className='w-32 h-5' />
                  </div>

                  <p className='h-px mb-6 bg-left-top bg-repeat-x bg-dashed-border bg-dashed-size' />

                  <Skeleton className='w-11/12 h-8 mx-auto' />

                  <Skeleton className='w-4/5 mx-auto mt-1 mb-8 h-7' />

                  <Skeleton className='w-full h-19 rounded-2' />

                  <Skeleton className='w-full mt-8 h-18 rounded-2' />

                  <Skeleton className='w-48 mt-8' />

                  <div className='flex justify-end gap-4 mt-12'>
                    <Skeleton className='h-12 w-27 rounded-big' />
                    <Skeleton className='h-12 w-27 rounded-big' />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </div>
    </main>
  )
}
