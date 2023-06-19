import * as React from 'react'

const BlogIcon = (props) => {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      viewBox='0 0 24 24'
      width='24'
      height='24'
      {...props}
    >
      <path fill='none' d='M0 0h24v24H0z' />
      <path d='M3 3c9.941 0 18 8.059 18 18h-3c0-8.284-6.716-15-15-15V3zm0 7c6.075 0 11 4.925 11 11h-3a8 8 0 0 0-8-8v-3zm0 7a4 4 0 0 1 4 4H3v-4z' />
    </svg>
  )
}

export default BlogIcon
