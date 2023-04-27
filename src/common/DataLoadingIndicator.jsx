import RefreshDoubleIcon from '@/icons/RefreshDoubleIcon'
import { classNames } from '@/lib/toast/utils'

export const DataLoadingIndicator = ({ className = 'px-2 py-1 mt-2', message }) => {
  return (
    <div className={classNames('flex items-center justify-end text-xs tracking-normal', className)}>
      {message
        ? (
          <>
            <RefreshDoubleIcon className='w-3 h-3 mr-2 text-4E7DD9 animate-spin' />
            <p>{message}</p>
          </>
          )
        : (
          <>&nbsp;</>
          )}
    </div>
  )
}
