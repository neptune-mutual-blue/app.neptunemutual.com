import { classNames } from '@/utils/classnames'

export const getNumber = (num, offset = 0) => {
  if ((num - offset) > 10000) { return '10k+' }
  if ((num - offset) > 1000) { return '1k+' }
  if ((num - offset) > 99) { return '99+' }
  if ((num - offset) > 10) { return '10+' }

  return (num - offset).toString()
}

export const IconWithBadge = ({ number, children }) => {
  return (
    <div className='relative'>
      {children}

      {(number > 0) && (
        <div
          className={classNames(
            'bg-E52E2E py-0.5 pb-px px-1 rounded-1',
            'text-white text-badge',
            'absolute -top-1 -right-1'
          )}
        >
          {getNumber(number)}
        </div>)}
    </div>
  )
}
