import { Container } from '@/common/Container/Container'
import Link from 'next/link'

const options = [
  {
    label: 'Celer',
    value: 'celer',
    href: '/bridge/celer'
  },
  {
    label: 'LayerZero',
    value: 'layer-zero',
    href: '/bridge/layer-zero'
  }
]

export const BridgeSwitch = ({ value }) => {
  return (
    <Container className='flex py-4'>
      <div className='inline-flex p-2 bg-E6EAEF rounded-2 gap-1 mb-1.5'>
        {options.map(option => (
          <Link
            href={option.href}
            key={option.value}
          >
            <a
              className={`rounded-2 py-1 px-2.5 cursor-pointer text-sm ${option.value === value ? ' bg-white' : ''}`}
              tabIndex={option.value === value ? -1 : 0}
            >
              {option.label}
            </a>
          </Link>
        ))}
      </div>
    </Container>
  )
}
