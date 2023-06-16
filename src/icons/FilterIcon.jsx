const FilterIcon = (props) => {
  return (
    <svg
      width={16}
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      {...props}
    >
      <path
        d='m12.5 2.75-4.5 6-4.5-6h9ZM7.933 8.839Z'
        strokeWidth={1.5}
        stroke='#9B9B9B'
      />
      <path
        d='m6.666 8 .813 1.016a.667.667 0 0 0 1.04 0L9.334 8v5.333a.667.667 0 0 1-.667.667H7.333a.667.667 0 0 1-.667-.667V8Z'
        fill='#9B9B9B'
      />
    </svg>
  )
}

export default FilterIcon
