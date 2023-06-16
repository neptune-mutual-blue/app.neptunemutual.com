import * as React from 'react'

const CheckCircleFilledIcon = (props) => {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width='16'
      height='16'
      fill='none'
      viewBox='0 0 16 16'
      {...props}
    >
      <rect width='16' height='16' fill='currentColor' rx='8' />
      <path
        stroke='#fff'
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth='1.667'
        d='M12 5l-5.5 5.5L4 8'
      />
    </svg>
  )
}

export default CheckCircleFilledIcon
