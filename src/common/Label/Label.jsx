import { classNames } from '@/utils/classnames'

export const Label = ({ children, className, htmlFor = '' }) => {
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
