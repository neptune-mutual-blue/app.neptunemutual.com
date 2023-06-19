import * as React from 'react'

const LargeGridIcon = ({ color, props }) => {
  return (
    <svg
      width={16}
      height={16}
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      {...props}
    >
      <rect
        x={2}
        y={2}
        width={12}
        height={12}
        rx={0.667}
        stroke={color}
        strokeWidth={1.5}
      />
      <path d='M8 2v12M2 8h12' stroke={color} strokeWidth={1.5} />
    </svg>
  )
}

export default LargeGridIcon
