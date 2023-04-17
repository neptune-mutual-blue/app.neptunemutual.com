import React from 'react'

function CheckCircleWithBorderIcon (props) {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width='14'
      height='14'
      fill='none'
      viewBox='0 0 14 14'
      {...props}
    >
      <circle
        cx='6.667'
        cy='6.667'
        r='6'
        fill='currentColor'
        stroke='#fff'
        strokeWidth='1.333'
      />
      <path
        stroke='#fff'
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth='1.333'
        d='M4 7.132l1.636 1.533 3.697-3.333'
      />
    </svg>
  )
}

export default CheckCircleWithBorderIcon
