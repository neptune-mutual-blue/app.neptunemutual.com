import ChevronDownIcon from '@/icons/ChevronDownIcon'

const PreviousNext = ({ hasPrevious = true, hasNext = true, onPrevious = () => {}, onNext = () => {} }) => {
  return (
    <div className='flex items-center gap-2'>
      <button disabled={!hasPrevious} onClick={onPrevious} className='disabled:text-999BAB disabled:cursor-not-allowed'>
        <ChevronDownIcon className='w-4 h-4 transform rotate-90' />
      </button>

      <button disabled={!hasNext} onClick={onNext} className='disabled:text-999BAB disabled:cursor-not-allowed'>
        <ChevronDownIcon className='w-4 h-4 transform -rotate-90' />
      </button>
    </div>
  )
}

export default PreviousNext
