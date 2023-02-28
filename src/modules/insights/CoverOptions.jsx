import { CoverDropdown } from '@/common/CoverDropdown'
import CheckBlue from '@/icons/CheckBlue'
import { classNames } from '@/utils/classnames'
import UpArrowFilled from '@/icons/UpArrowFilled'

export const CoverOptions = ({ setSelected }) => {
  return (
    <div>
      <CoverDropdown
        onChange={setSelected}
        className=''
        optionsClass='z-30 !p-4 border ring-0 shadow-cover-dropdown border-B0C4DB
        ring-1 ring-black ring-opacity-5 focus:outline-none rou !mt-2 rounded-2xl'
        buttonClass='!p-4'
        renderButton={({ name, image, open }) => (
          <DropdownButton name={name} image={image} open={open} />
        )}
        renderOption={({ active, isSelected, name, image }) => (
          <DropdownOption name={name} image={image} active={active} isSelected={isSelected} />
        )}
        optionClass={(active) => classNames(
          'cursor-pointer select-none relative !p-0',
          active ? 'text-4e7dd9' : 'text-black'
        )}
      />
    </div>
  )
}

const DropdownButton = ({ name, image, open }) => (
  <div className='flex items-center justify-between gap-2'>
    {
      name
        ? (
          <div className='flex items-center gap-2'>
            <img
              src={image || '/images/covers/empty.svg'}
              alt={name}
              className='w-6 h-6 p-0.5'
            />
            <span className='text-sm'>{name}</span>
          </div>
          )
        : (
          <i className='text-sm text-728FB2'>Fetching...</i>
          )
    }

    <UpArrowFilled className={classNames('w-4 h-4 transform', open ? 'rotate-0' : 'rotate-180')} aria-hidden='true' />
  </div>
)

const DropdownOption = ({ name, image, isSelected, active }) => {
  return (
    <>
      <span
        className={classNames(
          'truncate p-2 rounded-1 flex items-center text-sm leading-5 gap-1 overflow-hidden',
          active ? 'bg-EEEEEE bg-opacity-50 rounded-lg' : ''
        )}
      >
        <div className='w-6 h-6 p-0.5 rounded-full shrink-0'>
          <img
            src={image || '/images/covers/empty.svg'}
            alt={name}
          />
        </div>

        <span className='truncate whitespace-normal max-h-10'>
          {name}
        </span>

        {isSelected && <CheckBlue className='h-6 ml-auto text-4e7dd9 shrink-0' />}
      </span>
    </>
  )
}
