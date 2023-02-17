import { CoverDropdown } from '@/common/CoverDropdown'
import ChevronDownIcon from '@/icons/ChevronDownIcon'
import CheckBlue from '@/icons/CheckBlue'
import { classNames } from '@/utils/classnames'

export const CoverOptions = ({ setSelected }) => {
  return (
    <div>
      <CoverDropdown
        onChange={setSelected}
        optionsClass='z-30 px-8 py-6 border shadow-lg border-B0C4DB
        ring-1 ring-black ring-opacity-5 focus:outline-none !mt-2'
        buttonClass='!p-4'
        renderButton={({ name, image }) => (
          <DropdownButton name={name} image={image} />
        )}
        renderOption={({ active, isSelected, name, image }) => (
          <DropdownOption name={name} image={image} active={active} isSelected={isSelected} />
        )}
        optionClass={(active) => classNames(
          'cursor-pointer select-none relative px-1',
          active ? 'text-4e7dd9' : 'text-black'
        )}
        selectedOptionOnTop
      />
    </div>
  )
}

const DropdownButton = ({ name, image }) => (
  <div className='flex items-center justify-between gap-2'>
    <div className='flex items-center gap-2'>
      <img
        src={image || '/images/covers/empty.svg'}
        alt={name}
        className='w-6 h-6'
      />
      <span className='text-sm'>{name}</span>
    </div>

    <ChevronDownIcon className='w-4 h-4' aria-hidden='true' />
  </div>
)

const DropdownOption = ({ name, image, isSelected, active }) => {
  return (
    <>
      <span
        className={classNames(
          'truncate p-2 flex items-center text-sm leading-5 gap-1 overflow-hidden',
          active ? 'bg-EEEEEE bg-opacity-50 rounded-lg' : ''
        )}
      >
        <div className='w-8 h-8 p-1 rounded-full shrink-0'>
          <img
            src={image || '/images/covers/empty.svg'}
            alt={name}
          />
        </div>

        <span className='overflow-hidden truncate'>
          {name}
        </span>

        {isSelected && <CheckBlue className='h-6 ml-auto text-4e7dd9 shrink-0' />}
      </span>
      {isSelected && <hr className='h-px my-2 border-0 bg-B0C4DB dark:bg-B0C4DB' />}
    </>
  )
}
