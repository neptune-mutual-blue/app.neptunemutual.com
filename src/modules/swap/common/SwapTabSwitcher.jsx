import Link from 'next/link'

const options = [
  {
    label: 'Swap',
    value: 'swap',
    href: '/swap'
  },
  {
    label: 'Pool',
    value: 'pool',
    href: '/swap/pool'
  }
]

const SwapTabSwitcher = ({ value }) => {
  return (
    <div className='inline-flex p-2 bg-E6EAEF rounded-2 gap-1 mb-1.5'>
      {options.map(option => (
        <Link
          href={option.href}
          key={option.value}
        >
          <div
            className={`rounded-2 py-1 px-2.5 cursor-pointer text-sm ${option.value === value ? ' bg-white' : ''}`}
          >
            {option.label}
          </div>
        </Link>
      ))}
    </div>
  )
}

export default SwapTabSwitcher
