import { classNames } from '@/utils/classnames'

const getNumber = num => {
  if (num > 10000) return '10k+'
  if (num > 1000) return '1k+'
  if (num > 99) return '99+'
  if (num > 10) return '10+'
  return num.toString()
}
export const IconWithBadge = ({ number, children }) => {
  return (
    <div className='relative'>
      {children}

      {(number > 0) && (
        <div
          className={classNames(
            'bg-E52E2E py-0.5 pb-px px-1 rounded-1',
            'text-white text-badge font-inter',
            'absolute -top-1 -right-1'
          )}
        >
          {getNumber(number)}
        </div>)}
    </div>
  )
}
