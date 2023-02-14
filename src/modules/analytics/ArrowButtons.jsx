import ChevronDownIcon from '@/icons/ChevronDownIcon'

export const ArrowButtons = ({ hasPrev = true, hasNext = true, onPrev = () => {}, onNext = () => {} }) => {
  return (
    <div className='flex items-center gap-2'>
      <button disabled={!hasPrev} onClick={onPrev} className='disabled:opacity-75 disabled:cursor-not-allowed'>
        <ChevronDownIcon className='w-4 h-4 transform rotate-90' />
      </button>

      <button disabled={!hasNext} onClick={onNext} className='disabled:opacity-75 disabled:cursor-not-allowed'>
        <ChevronDownIcon className='w-4 h-4 transform -rotate-90' />
      </button>
    </div>
  )
}
