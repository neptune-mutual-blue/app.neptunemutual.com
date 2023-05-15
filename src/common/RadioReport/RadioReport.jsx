import { classNames } from '@/utils/classnames'

export const RadioReport = ({ label, id, disabled, checked, ...rest }) => {
  return (
    <label
      htmlFor={id}
      className={classNames(
        'w-full mb-4 bg-white border rounded-lg sm:mb-0 sm:bg-transparent sm:rounded-none sm:border-0 lg:mr-4  xl:mr-16',
        'flex items-center p-6 sm:p-0',
        checked ? 'border-2 border-4E7DD9' : 'border-B0C4DB',
        disabled && 'cursor-not-allowed'
      )}
    >
      <input
        className={classNames(
          'w-5 h-5 mr-2 bg-EEEEEE border-B0C4DB',
          disabled && 'cursor-not-allowed'
        )}
        type='radio'
        id={id}
        disabled={disabled}
        checked={checked}
        {...rest}
      />
      <span
        className={classNames(
          'text-sm uppercase',
          disabled && 'cursor-not-allowed'
        )}

      >
        {label}
      </span>
    </label>
  )
}
