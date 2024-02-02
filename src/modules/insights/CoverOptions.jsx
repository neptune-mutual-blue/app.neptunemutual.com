import { CoverDropdown } from '@/common/CoverDropdown'
import CheckBlue from '@/icons/CheckBlue'
import UpArrowFilled from '@/icons/UpArrowFilled'
import { classNames } from '@/utils/classnames'

export const CoverOptions = ({
  loading,
  covers,
  selected,
  setSelected
}) => {
  return (
    <div>
      <CoverDropdown
        loading={loading}
        coversOrProducts={covers}
        selected={selected}
        setSelected={setSelected}
        className=''
        optionsClass='z-30 !p-4 border ring-0 shadow-cover-dropdown border-B0C4DB
        ring-1 ring-black ring-opacity-5 focus:outline-none rou !mt-2 rounded-2xl'
        buttonClass='!p-4'
        renderButton={({ name, image, open }) => {
          return (
            <DropdownButton name={name} image={image} open={open} />
          )
        }}
        renderOption={({ active, isSelected, name, image }) => {
          return (
            <DropdownOption name={name} image={image} active={active} isSelected={isSelected} />
          )
        }}
        optionClass={(active) => {
          return classNames(
            'cursor-pointer select-none relative !p-0',
            active ? 'text-4E7DD9' : 'text-black'
          )
        }}
      />
    </div>
  )
}

const DropdownButton = ({ name, image, open }) => {
  return (
    <div className='flex items-center justify-between gap-2'>
      <div className='flex items-center gap-2'>
        <img
          src={image || '/images/covers/empty.svg'}
          alt={name}
          className='w-6 h-6 p-0.5'
        />
        <span className='text-sm'>{name}</span>
      </div>

      <UpArrowFilled className={classNames('w-4 h-4 transform', open ? 'rotate-0' : 'rotate-180')} aria-hidden='true' />
    </div>
  )
}

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

        {isSelected && <CheckBlue className='h-6 ml-auto text-4E7DD9 shrink-0' />}
      </span>
    </>
  )
}
