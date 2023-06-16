import { useState } from 'react'

import CloseIcon from '@/icons/CloseIcon'
import ExclamationCircleIcon from '@/icons/ExclamationCircleIcon'
import { classNames } from '@/utils/classnames'

export const Alert = ({ children, info = undefined, className = '', closable = false, printable = false }) => {
  const [show, setShow] = useState(true)

  if (!show) {
    return null
  }

  return (
    <div
      className={classNames(
        className,
        'border border-l-4 rounded p-5 mt-8',
        info ? 'border-4E7DD9 bg-F4F8FC text-4E7DD9' : 'border-E52E2E bg-E52E2E bg-opacity-5 text-E52E2E',
        printable && 'bg-transparent leading-6'
      )}
    >
      <div className='flex items-start'>
        <div aria-label='Alert' className='flex-shrink-0 pt-0.5'>
          <ExclamationCircleIcon
            className='w-6 h-6'
            aria-hidden='true'
          />
        </div>
        <div className='flex-1 ml-3'>{children}</div>
        {closable
          ? <button
              type='button'
              className='p-1 ml-1'
              onClick={() => { return setShow(false) }}
            >
            <CloseIcon className='w-4 h-4' aria-hidden='true' />

            {/* eslint-disable-next-line react/jsx-closing-tag-location */}
          </button>
          : null}
      </div>
    </div>
  )
}
