import { classNames } from '@/utils/classnames'

export const CoverDropdownOption = ({ selected, active, name, image }) => {
  return (
    <span
      className={classNames(
        'truncate px-4 py-2 flex items-center',
        selected ? 'font-medium' : 'font-normal',
        active ? 'bg-EEEEEE bg-opacity-50 rounded-lg' : ''
      )}
    >
      <div className='w-8 h-8 p-1 mr-2 rounded-full bg-DEEAF6'>
        <img
          src={image}
          alt={
            name
          }
        />
      </div>
      {name}
    </span>
  )
}
