import * as React from 'react'

const MinimizeIcon = (props) => {
  return (
    <svg
      width='24'
      height='24'
      viewBox='0 0 24 24'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      {...props}
    >
      <circle cx='12' cy='12' r='12' fill='currentColor' />
      <path d='M7 12H17' stroke='#fff' strokeWidth='2' />
    </svg>
  )
}

export default MinimizeIcon
