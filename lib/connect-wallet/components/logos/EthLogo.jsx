import * as React from 'react'

const EthLogo = (props) => (
  <svg
    width={40}
    height={40}
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
    {...props}
  >
    <path fill='#5A72E8' d='M0 0h40v40H0z' />
    <g clipPath='url(#a)'>
      <path
        d='m19.54 7.5-.165.56V24.33l.165.165 7.552-4.464L19.54 7.5Z'
        fill='#BAC5F6'
      />
      <path d='m19.536 7.5-7.552 12.53 7.552 4.464V7.5Z' fill='#fff' />
      <path
        d='m19.538 25.923-.093.114v5.795l.093.271 7.556-10.641-7.556 4.461Z'
        fill='#BAC5F6'
      />
      <path d='M19.536 32.103v-6.18l-7.552-4.461 7.552 10.641Z' fill='#fff' />
      <path d='m19.535 24.495 7.552-4.464-7.552-3.432v7.896Z' fill='#788DEC' />
      <path
        d='m11.984 20.031 7.552 4.464v-7.896l-7.552 3.432Z'
        fill='#BAC5F6'
      />
    </g>
    <defs>
      <clipPath id='a'>
        <path fill='#fff' transform='translate(7.5 7.5)' d='M0 0h25v25H0z' />
      </clipPath>
    </defs>
  </svg>
)

export default EthLogo
