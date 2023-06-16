import { Skeleton } from '@/common/Skeleton/Skeleton'

export const LiquidityGaugePoolCardsSkeleton = ({ numberOfCards = 5 }) => {
  return (
    <div className='overflow-hidden border divide-y divide-B0C4DB border-B0C4DB rounded-2xl'>
      {
      Array(numberOfCards)
        .fill(0)
        .map((_, i) => {
          return (
            <div key={i} className='p-8 bg-white'>
              <Skeleton className='w-32 h-7' />
              <Skeleton className='h-5 mt-1 w-42' />

              <div className='flex items-center justify-between mt-10'>
                <Skeleton className='h-5 w-54' />
                <Skeleton className='h-12 w-19 rounded-big' />
              </div>
            </div>
          )
        })
    }
    </div>
  )
}
