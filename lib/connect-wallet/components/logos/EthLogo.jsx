import * as React from 'react'

const EthLogo = (props) => (
  <svg
    width={13}
    height={20}
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
    {...props}
  >
    <path
      d='M6.632 0 6.5.449v13.014l.132.132 6.041-3.571L6.632 0Z'
      fill='#BAC5F6'
    />
    <path d='M6.631 0 .59 10.024l6.041 3.571V0Z' fill='#fff' />
    <path
      d='m6.633 14.739-.074.09v4.637l.074.217 6.045-8.513-6.045 3.569Z'
      fill='#BAC5F6'
    />
    <path d='M6.631 19.683V14.74L.59 11.169l6.041 8.514Z' fill='#fff' />
    <path d='m6.633 13.595 6.041-3.57-6.041-2.747v6.317Z' fill='#788DEC' />
    <path d='m.59 10.024 6.041 3.571V7.278L.59 10.024Z' fill='#BAC5F6' />
  </svg>
)

export default EthLogo
