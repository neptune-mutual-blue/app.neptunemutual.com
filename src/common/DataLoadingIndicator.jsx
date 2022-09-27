import RefreshDoubleIcon from '@/icons/RefreshDoubleIcon'

export const DataLoadingIndicator = ({ message }) => {
  return (
    <div className='flex items-center justify-end px-2 py-1 mt-2 text-xs tracking-normal'>
      {message
        ? (
          <>
            <RefreshDoubleIcon className='w-3 h-3 mr-2 text-4e7dd9 animate-spin' />
            <p>{message}</p>
          </>
          )
        : (
          <>&nbsp;</>
          )}
    </div>
  )
}
