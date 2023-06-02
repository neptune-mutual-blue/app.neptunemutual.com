import { classNames } from '@/utils/classnames'

/**
 * @typedef {Object} ContainerProps
 * @property {string} [className]
 * @property {JSX.Element | JSX.Element[]} children
 */

/**
 *
 * @param {ContainerProps & React.HTMLAttributes<HTMLDivElement>} props
 * @returns
 */
export const Container = ({ children, className, ...rest }) => {
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
