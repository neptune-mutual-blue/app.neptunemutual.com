import * as React from 'react'

const InfoCircleIcon = (props) => {
  return (
    <svg
      width='12'
      height='12'
      viewBox='0 0 12 12'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      {...props}
    >
      <circle cx='6' cy='6' r='5.25' fill='#9B9B9B' />
      <path
        d='M5.34375 4.5784V3.375H6.65625V4.5784H5.34375ZM5.34375 9.28125V5.33883H6.65625V9.28125H5.34375Z'
        fill='white'
      />
    </svg>
  )
}

export default InfoCircleIcon
