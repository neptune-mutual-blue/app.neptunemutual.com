export const HeroStat = ({ title, children, ...rest }) => {
  return (
    <div
      className='w-full pt-6 text-center border-t md:w-auto mt-12 mb- md:m-0 md:pt-0 border-B0C4DB md:border-0 md:ml-auto lg:text-right'
      {...rest}
    >
      <h5 className='text-md'>{title}</h5>
      <p className='font-semibold text-4E7DD9 sm:t md:text-display-sm'>{children}</p>
    </div>
  )
}
