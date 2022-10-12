import * as React from 'react'

const EthLogo = (props) => (
  <svg
    viewBox='0 0 32 32'
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
    {...props}
  >
    <path fill='#5A72E8' d='M0 0h32v32H0z' />
    <path
      d='m15.632 6-.132.449v13.014l.132.132 6.041-3.571L15.633 6Z'
      fill='#BAC5F6'
    />
    <path d='M15.631 6 9.59 16.024l6.041 3.571V6Z' fill='#fff' />
    <path
      d='m15.633 20.739-.074.09v4.637l.074.217 6.045-8.513-6.045 3.569Z'
      fill='#BAC5F6'
    />
    <path d='M15.631 25.683V20.74l-6.041-3.57 6.041 8.514Z' fill='#fff' />
    <path d='m15.633 19.595 6.041-3.57-6.041-2.747v6.317Z' fill='#788DEC' />
    <path d='m9.59 16.024 6.041 3.571v-6.317L9.59 16.024Z' fill='#BAC5F6' />
  </svg>
)

export default EthLogo
