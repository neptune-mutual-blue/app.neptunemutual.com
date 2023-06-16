const { Skeleton } = require('@/common/Skeleton/Skeleton')

export const ResolvedTableSkeleton = () => {
  return (
    <div className='mt-6'>
      <div className='relative mt-8 overflow-x-auto bg-white border text-404040 border-B0C4DB rounded-xl'>
        <div className='flex items-center justify-between min-w-full px-6 py-3 border-b border-B0C4DB bg-F9FAFA'>
          <Skeleton className='h-4.5 w-12' />
          <Skeleton className='h-4.5 w-24' />
          <Skeleton className='h-4.5 w-27' />
          <Skeleton className='h-4.5 w-20' />
          <Skeleton className='h-4.5 w-12' />
        </div>

        {
        Array(8).fill(0).map((_, i) => {
          return (
            <div className='flex justify-between p-6' key={i}>
              <Skeleton className='h-6 w-14' />
              <Skeleton className='h-6 w-42' />
              <Skeleton className='h-6 w-28' />
              <Skeleton className='h-6 w-36' />
              <Skeleton className='h-6 w-14' />
            </div>
          )
        })
      }
      </div>
    </div>
  )
}
