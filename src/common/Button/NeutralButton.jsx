import { classNames } from '@/utils/classnames'

export const NeutralButton = ({ onClick, children, className = '', ...rest }) => {
  return (
    <button
      type='button'
      onClick={onClick}
      className={classNames(
        'block rounded-lg bg-E6EAEF hover:bg-opacity-80 disabled:bg-EEEEEE disabled:text-9B9B9B uppercase text-black py-3 px-4 border-none mx-auto focus:outline-none focus-visible:ring-2 focus-visible:ring-4E7DD9 tracking-wide',
        // 'leading-5 !p-4',
        className
      )}
      {...rest}
    >
      {children}
    </button>
  )
}
