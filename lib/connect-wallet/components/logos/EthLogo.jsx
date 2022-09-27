import * as React from 'react'

const EthLogo = (props) => (
  <svg
    // width={30}
    // height={49}
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
    viewBox='0 0 30 49'
    {...props}
  >
    <path
      d='m14.832.981-.324 1.093v31.709l.324.32 14.831-8.7L14.832.981Z'
      fill='#343434'
    />
    <path d='M14.831.981 0 25.403l14.831 8.7V.981Z' fill='#8C8C8C' />
    <path
      d='m14.832 36.89-.183.221v11.296l.183.529 14.84-20.741-14.84 8.695Z'
      fill='#3C3C3B'
    />
    <path d='M14.831 48.935V36.89L0 28.194l14.831 20.741Z' fill='#8C8C8C' />
    <path d='m14.832 34.103 14.831-8.7-14.831-6.69v15.39Z' fill='#141414' />
    <path d='m0 25.403 14.831 8.7v-15.39L0 25.403Z' fill='#393939' />
  </svg>
)

export default EthLogo
