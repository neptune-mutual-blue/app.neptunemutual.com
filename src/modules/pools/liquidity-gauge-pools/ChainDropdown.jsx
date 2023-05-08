import React, {
  useEffect,
  useRef,
  useState
} from 'react'

import Link from 'next/link'

import { OutlinedButton } from '@/common/Button/OutlinedButton'
import { Checkbox } from '@/common/Checkbox/Checkbox'
import ChevronDownIcon from '@/icons/ChevronDownIcon'
import ExternalLinkIcon from '@/icons/ExternalLinkIcon'
import SearchIcon from '@/icons/SearchIcon'
import { useOnClickOutside } from '@/src/hooks/useClickOutside'

const ChainDropdown = ({ options, selected, onSelectionChange }) => {
  const [open, setOpen] = useState(false)

  const [search, setSearch] = useState('')

  const changeSelection = (value) => {
    if (selected.includes(value)) {
      onSelectionChange(selected.filter((e) => e !== value))
    } else {
      onSelectionChange([...selected, value])
    }
  }

  const ref = useRef()

  useOnClickOutside(ref, () => {
    setOpen(false)
  })

  useEffect(() => {
    if (!open) {
      setSearch('')
    }
  }, [open])

  return (
    <div className='relative'>
      <div className='flex justify-between items-center mb-12'>
        <button
          onClick={() => {
            setOpen(!open)
          }} className='inline-flex items-center gap-2 text-sm border-1 border-4E7DD9 rounded-2 py-3 px-4 cursor-pointer'
        >
          <div className='text-9B9B9B'>Filter Chain: </div>
          <div>
            {selected.length === 0 && 'All'}
            {selected.length === 1 && options.find(opt => opt.value === selected[0]).label}
            {selected.length > 1 && selected.length + ' Chains'}
          </div>
          <ChevronDownIcon className='h-4 w-4' />
        </button>
        <Link href='#'>
          <div className='text-4E7DD9 text-md cursor-pointer font-semibold flex items-center gap-1'>
            Submit Your Vote <ExternalLinkIcon />
          </div>
        </Link>
      </div>

      {open && (
        <div ref={ref} className='absolute z-60 top-[calc(100%+8px)] left-0 shadow-xl border-1 border-D0D5DD w-[238px] rounded-2'>
          <div className='m-2.5 flex items-center'>

            <input
              className='w-full px-4 py-2 leading-5 outline-none' value={search} onChange={(e) => {
                setSearch(e.target.value)
              }} placeholder='Search Chain'
            />
            <SearchIcon className='h-4 w-4' />
          </div>
          <hr className='border-t-1 border-D0D5DD' />

          <div className='max-h-[280px] overflow-y-auto'>
            <div
              onClick={() => {
                onSelectionChange([])
              }} className='py-2.5 px-4 flex items-center gap-1 text-sm hover:bg-EEEEEE cursor-pointer'
            >
              <Checkbox
                checked={selected.length === 0}
                className='h-4 w-4 border-1 border-C2C7D0'
              /> All
            </div>
            {options.filter(opt => opt.label.toLowerCase().includes(search.toLowerCase())).map((option) => (
              <button
                onClick={() => {
                  changeSelection(option.value)
                }} className='py-2.5 px-4 w-full flex items-center gap-1 text-sm hover:bg-EEEEEE cursor-pointer' key={option.value}
              >
                <Checkbox
                  checked={selected.includes(option.value)}
                  className='h-4 w-4 border-1 border-C2C7D0'
                />{option.label}
              </button>
            ))}
          </div>
          <hr className='border-t-1 border-D0D5DD' />
          <div className='p-4'>

            <OutlinedButton
              className='border-D0D5DD text-344054 hover:text-344054 text-sm font-semibold w-full rounded-2 normal-case' onClick={() => {
                onSelectionChange([])
              }}
            >Clear All
            </OutlinedButton>
          </div>
        </div>

      )}
    </div>
  )
}

export default ChainDropdown
