import { classNames } from '@/utils/classnames'

export const HomeCard = ({ items, className, showDivider = true }) => {
  return (
    <div
      className={classNames(
        'w-full lg:w-96 py-6 lg:py-0 lg:h-full bg-white rounded-2xl shadow-homeCard md:rounded-none lg:rounded-2xl border-0.5 md:border-0  lg:border-0.5 border-B0C4DB lg:border-B0C4DB flex justify-center items-center',
        className
      )}
    >
      {items?.map((item, index) => {
        const firstBorder =
          showDivider && index === 0 ? 'border-r-0.5 border-E8E8ED' : ''

        return (
          <div
            key={`home-card-${index}`}
            className={`lg:py-4 flex flex-col justify-center items-center text-center flex-1 ${firstBorder}`}
          >
            <p className='mb-2 leading-5 text-xs lg:mb-0 lg:text-md text-9B9B9B'>
              {item?.name}
            </p>
            <p className='font-bold leading-5 text-black text-md lg:text-display-xs'>
              {item?.amount}
            </p>
          </div>
        )
      })}
    </div>
  )
}
