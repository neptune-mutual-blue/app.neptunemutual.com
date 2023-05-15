import { useEffect } from 'react'

import LoadingIcon from '@/lib/toast/components/icons/LoadingIcon'
import MinimizeIcon from '@/lib/toast/components/icons/MinimizeIcon'

import CloseIcon from './components/icons/CloseIcon'
import InfoIcon from './components/icons/InfoIcon'
import SuccessIcon from './components/icons/SuccessIcon'
import WarningIcon from './components/icons/WarningIcon'
import { classNames } from './utils'

export const VARIANTS = {
  Info: {
    icon: <InfoIcon className='w-6 h-6 text-FA5C2F' aria-hidden='true' />,
    name: 'Info'
  },
  Error: {
    icon: <MinimizeIcon className='w-6 h-6 text-FA5C2F' aria-hidden='true' />,
    name: 'Error'
  },
  Warning: {
    icon: <WarningIcon className='w-6 h-6 text-FA5C2F' aria-hidden='true' />,
    name: 'Warning'
  },
  Success: {
    icon: <SuccessIcon className='w-6 h-6 text-21AD8C' aria-hidden='true' />,
    name: 'Success'
  },
  Loading: {
    icon: <LoadingIcon className='w-6 h-6 text-999BAB' aria-hidden='true' />,
    name: 'Loading'
  }
}

const ToastMessage = ({
  id,
  header,
  message,
  lifetime,
  onRemove,
  icon,
  type,
  title
}) => {
  const Var = type
    ? VARIANTS[type]
    : {
        icon: icon,
        name: header
      }

  useEffect(() => {
    if (lifetime && onRemove) {
      setTimeout(() => {
        onRemove(id)
      }, lifetime)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lifetime])

  return (
    <div
      className={classNames(
        'w-full bg-3A4557 bg-opacity-95 text-white shadow-toast rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden',
        type && 'max-h-40'
      )}
      data-testid='toast-message'
    >
      <div className='px-4 py-6'>
        <div className='flex items-start'>
          <div className='flex-shrink-0'>{Var.icon}</div>

          <div className='flex-1 w-0 ml-3'>
            <p className='font-light text-md'>
              {title || Var.name}
            </p>
            <div className='mt-3 text-sm text-EEEEEE'>{message}</div>
          </div>
          <div className='flex flex-shrink-0 ml-4'>
            <button
              className='inline-flex rounded-md text-EEEEEE focus:outline-none focus:ring-1 focus:ring-4E7DD9'
              onClick={() => {
                onRemove && onRemove(id)
              }}
            >
              <span className='sr-only'>Close</span>
              <CloseIcon className='w-5 h-5' aria-hidden='true' />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ToastMessage
