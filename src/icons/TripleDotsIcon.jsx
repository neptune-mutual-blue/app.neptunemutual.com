import React from 'react'

const TripleDotsIcon = ({ ...props }) => {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width='12'
      height='3'
      fill='none'
      viewBox='0 0 12 3'
      {...props}
    >
      <circle cx='1.5' cy='1.5' r='1.5' fill='currentColor' />
      <circle cx='6' cy='1.5' r='1.5' fill='currentColor' />
      <circle cx='10.5' cy='1.5' r='1.5' fill='currentColor' />
    </svg>
  )
}

export { TripleDotsIcon }
