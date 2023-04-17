import { classNames } from '@/utils/classnames'

const InputWithIcon = ({ handleChange, Icon, inputProps, className = '' }) => {
  return (
    <div
      className={
        classNames('flex w-full gap-2 items-center py-3 px-4 rounded-2 border border-B0C4DB', className)
      }
    >
      <input
        className='flex-grow outline-none'
        placeholder='Search'
        {...inputProps}
        onChange={e => handleChange(e.target.value)}
      />
      {Icon}
    </div>
  )
}

export { InputWithIcon }
