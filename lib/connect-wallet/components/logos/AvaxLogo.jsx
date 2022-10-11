import * as React from 'react'

const AvaxLogo = (props) => (
  <svg
    viewBox='0 0 32 32'
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
    {...props}
  >
    <path fill='#E84142' d='M0 0h32v32H0z' />
    <g clipPath='url(#a)'>
      <path
        d='M21.256 17.338c.462-.79 1.207-.79 1.67 0l2.875 5.004c.462.791.084 1.436-.84 1.436h-5.794c-.913 0-1.29-.645-.84-1.436l2.93-5.004Zm-5.563-9.634c.462-.79 1.197-.79 1.659 0l.64 1.145 1.511 2.632a2.713 2.713 0 0 1 0 2.382l-5.07 8.708a2.67 2.67 0 0 1-2.078 1.207H8.146c-.923 0-1.301-.635-.84-1.436l8.387-14.638Z'
        fill='#fff'
      />
    </g>
    <defs>
      <clipPath id='a'>
        <path fill='#fff' transform='translate(6 6)' d='M0 0h20v20H0z' />
      </clipPath>
    </defs>
  </svg>
)

export default AvaxLogo
