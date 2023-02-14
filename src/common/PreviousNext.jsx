import ChevronLeftLgIcon from '@/icons/ChevronLeftLgIcon'
import ChevronRightLgIcon from '@/icons/ChevronRightLgIcon'
import React from 'react'

function PreviousNext ({ onNext, onPrevious, hasPrevious, hasNext }) {
  return (
    <div className='flex'>
      <ChevronLeftLgIcon onClick={hasPrevious ? onPrevious : undefined} className='w-4 h-4 mr-5 cursor-pointer' stroke={hasPrevious ? 'black' : '#999BAB'} />
      <ChevronRightLgIcon onClick={hasNext ? onNext : undefined} className='w-4 h-4 cursor-pointer' stroke={hasNext ? 'black' : '#999BAB'} />
    </div>
  )
}

export default PreviousNext
