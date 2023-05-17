import { classNames } from '@/utils/classnames'

/**
 *
 * @param {Object} props
 * @param {string} [props.className]
 * @param {JSX.Element | JSX.Element[]} props.children
 * @returns
 */
export const NavContainer = ({ children, className, ...rest }) => {
  return (
    <div
      className={classNames(
        'max-w-desktop mx-auto px-4 sm:px-6 md:px-8',
        className
      )}
      {...rest}
    >
      {children}
    </div>
  )
}
