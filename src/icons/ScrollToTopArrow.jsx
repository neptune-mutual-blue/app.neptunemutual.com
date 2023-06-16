import * as React from 'react'

const ScrollToTopArrow = (props) => {
  return (
    <svg
      width={11}
      height={7}
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      {...props}
    >
      <path
        d='m1 6 4.5-4L10 6'
        stroke='#fff'
        strokeWidth={2}
        strokeLinecap='round'
      />
    </svg>
  )
}

export default ScrollToTopArrow
