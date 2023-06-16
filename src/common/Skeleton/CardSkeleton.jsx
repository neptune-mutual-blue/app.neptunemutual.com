import { OutlinedCard } from '@/common/OutlinedCard/OutlinedCard'
import { Divider } from '@/common/Divider/Divider'
import { classNames } from '@/utils/classnames'

export const CardSkeleton = ({
  numberOfCards = 1,
  statusBadge = true,
  subTitle = true,
  lineContent = 3,
  className = '',
  ...rest
}) => {
  const cardsArray = new Array(numberOfCards).fill(1) // convert number of card to array
  const lineContentArray = new Array(lineContent).fill(1) // convert number of line content to array

  return (
    <>
      {cardsArray.map((_, i) => {
        return (
          <OutlinedCard
            key={i}
            className={classNames('p-6 bg-white', className)}
            {...rest}
          >
            <div className='flex justify-between animate-pulse'>
              <div className='rounded-full h-14 lg:h-18 w-14 lg:w-18 bg-skeleton' />
              {statusBadge && (
                <div
                  className='w-40 h-6 rounded-full bg-skeleton'
                  data-testid='card-status-badge'
                />
              )}
            </div>
            <div className='w-3/5 h-5 mt-4 rounded-full bg-skeleton' />
            {subTitle && (
              <div
                className='w-2/4 h-4 mt-3 rounded-full bg-skeleton'
                data-testid='card-subtitle'
              />
            )}
            <Divider className='mb-4 lg:mb-8' />
            {lineContentArray.map((_, i) => {
              return (
                <div
                  key={i}
                  className='h-3 mt-3 rounded-full bg-skeleton'
                  data-testid='card-line-content'
                />
              )
            })}
          </OutlinedCard>
        )
      })}
    </>
  )
}
