import CloseIcon from '@/icons/CloseIcon'
import ExclamationCircleIcon from '@/icons/ExclamationCircleIcon'
import { classNames } from '@/utils/classnames'
import { useState } from 'react'

export const Alert = ({ children, info = undefined, className = '', closable = false }) => {
  const [show, setShow] = useState(true)

  if (!show) {
    return null
  }

  return (
    <div
      className={classNames(
        className,
        'border border-l-4 rounded p-5',
        info ? 'border-4e7dd9 bg-F4F8FC' : 'border-E52E2E bg-E52E2E bg-opacity-5'
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
        <p className='ml-3 text-E52E2E'>{children}</p>
        {closable
          ? <button
              type='button'
              className='p-1 ml-1 text-E52E2E'
              onClick={() => setShow(false)}
            >
            <CloseIcon className='w-4 h-4' aria-hidden='true' />

            {/* eslint-disable-next-line react/jsx-closing-tag-location */}
          </button>
          : <></>}
      </div>
    </div>
  )
}
