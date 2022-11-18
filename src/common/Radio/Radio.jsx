import { classNames } from '@/utils/classnames'

export const Radio = ({ label, id, disabled, className = '', labelClass = '', ...rest }) => {
  return (
    <div
      className={classNames(
        'flex items-center w-full flex-1',
        className,
        disabled && 'cursor-not-allowed'
      )}
    >
      <input
        className={classNames(
          'w-5 h-5 bg-EEEEEE border-B0C4DB z-20',
          disabled && 'cursor-not-allowed'
        )}
        type='radio'
        id={id}
        disabled={disabled}
        {...rest}
      />
      <label
        className={classNames(
          'text-sm uppercase flex-1', labelClass,
          disabled && 'cursor-not-allowed'
        )}
        htmlFor={id}
      >
        {label}
      </label>
    </div>
  )
}
