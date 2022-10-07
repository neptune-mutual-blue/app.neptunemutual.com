import CloseIcon from '@/icons/CloseIcon'
import ExclamationCircleIcon from '@/icons/ExclamationCircleIcon'
import { classNames } from '@/utils/classnames'
import { useState } from 'react'

export const Alert = ({ children, info = undefined, className = '' }) => {
  const [showAlert, setShowAlert] = useState(true)

  if (!showAlert) {
    return null
  }

  return (
    <div
      className={classNames(
        className,
        'border border-l-4 rounded p-5',
        info ? 'border-4e7dd9 bg-F4F8FC' : 'border-E52E2E bg-E52E2E bg-opacity-3'
      )}
    >
      <div className='flex items-start'>
        <div aria-label='Alert' className='flex-shrink-0 pt-0.5'>
          <ExclamationCircleIcon
            className={classNames(
              'h-6 w-6',
              info ? 'text-4e7dd9' : 'text-E52E2E'
            )}
            aria-hidden='true'
          />
        </div>
        <div className='ml-3'>{children}</div>
        <span className={classNames('cursor-pointer', info ? 'hidden' : 'text-E52E2E')} onClick={() => setShowAlert(false)}>
          <CloseIcon className='w-4 h-4' aria-hidden='true' />
        </span>
      </div>
    </div>
  )
}
