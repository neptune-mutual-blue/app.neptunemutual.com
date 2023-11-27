import { classNames } from '@/utils/classnames'

/**
 *
 * @type {React.FC<React.ComponentProps<"label">>} props
 */
export const Label = (props) => {
  const { children, className, htmlFor } = props

  return (
    <label
      className={classNames(
        'block uppercase text-black text-md font-semibold',
        className
      )}
      htmlFor={htmlFor}
      data-testid='label-mock-component'
    >
      {children}
    </label>
  )
}
