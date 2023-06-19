import * as React from 'react'

const ClockIcon = (props) => {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      fill='none'
      viewBox='0 0 24 24'
      stroke='currentColor'
      {...props}
    >
      <path
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth={2}
        d='M12 8v4l3 3m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0z'
      />
    </svg>
  )
}

export default ClockIcon
