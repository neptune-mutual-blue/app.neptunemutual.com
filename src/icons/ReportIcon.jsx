import * as React from 'react'

const ReportIcon = (props) => {
  return (
    <svg
      viewBox='0 0 21 24'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      {...props}
    >
      <rect width={21} height={24} rx={4} fill='currentColor' />
      <path
        d='M4 7h2.5m2 0h9M4 12h2.5m2 0h9M4 17h2.5m2 0h9'
        stroke='#EEE'
        strokeWidth={2}
      />
    </svg>
  )
}

export default ReportIcon
