import { Container } from '@/common/Container/Container'
import { Grid } from '@/common/Grid/Grid'
import { CardSkeleton } from '@/common/Skeleton/CardSkeleton'
import { Skeleton } from '@/common/Skeleton/Skeleton'

export const ProductsGridSkeleton = () => {
  return (
    <>
      <hr className='border-b border-B0C4DB' />
      <Container className='py-16'>
        <div className='flex flex-wrap items-center justify-between gap-6 md:flex-nowrap'>
          <div className='flex items-center'>
            <Skeleton className='w-24 h-12 mr-6 rounded-lg' />
            <Skeleton className='h-10 w-52' />
          </div>

          <div className='flex gap-2'>
            <Skeleton className='w-64 rounded-lg h-13' />
            <Skeleton className='w-64 rounded-lg h-13' />
          </div>
        </div>

        <Grid
          className='gap-4 mt-14 lg:mb-24 mb-14 lg:min-h-360'
          data-testid='covers-skeleton'
        >
          <CardSkeleton numberOfCards={12} className='min-h-301' data-testid='cards-skeleton' />
        </Grid>
      </Container>
    </>
  )
}
