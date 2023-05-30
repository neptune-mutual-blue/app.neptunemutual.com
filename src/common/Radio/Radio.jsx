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
          'text-sm uppercase flex-1 ml-2', labelClass,
          disabled && 'cursor-not-allowed'
        )}
        htmlFor={id}
      >
        {label}
      </label>
    </div>
  )
}

export const CustomRadio = ({ label, id, disabled, className = '', labelClass = '', ...rest }) => {
  return (
    <div
      className={classNames(
        'flex items-center w-full flex-1 z-10',
        className,
        disabled && 'cursor-not-allowed'
      )}
    >
      <input
        className={classNames(
          'cursor-pointer relative appearance-none rounded-full w-5 h-5 bg-transparent border-1.5 border-B0C4DB z-20 focus:outline-none focus:border-B0C4DB m-0 p-0',
          disabled && 'cursor-not-allowed'
        )}
        type='radio'
        id={id}
        disabled={disabled}
        {...rest}
      />

      <div className={classNames('w-5 h-5 bg-EEEEEE rounded-full z-[19] absolute flex align-middle justify-center')}>  {rest.checked && <div className={classNames('w-3 h-3 bg-4E7DD9 rounded-full my-auto')} />} </div>

      <label
        className={classNames(
          'cursor-pointer text-sm uppercase flex-1 ml-2', labelClass,
          disabled && 'cursor-not-allowed'
        )}
        htmlFor={id}
      >
        {label}
      </label>
    </div>
  )
}
