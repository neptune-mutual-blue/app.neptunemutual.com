import { classNames } from '@/utils/classnames'

/**
 *
 * @type {React.FC<React.ComponentProps<"div">>} props
 */
export const Container = (props) => {
  const { children, className, ...rest } = props

  return (
    <div
      className={classNames(
        'max-w-7xl mx-auto px-4 sm:px-6 md:px-8',
        className
      )}
      {...rest}
    >
      {children}
    </div>
  )
}
