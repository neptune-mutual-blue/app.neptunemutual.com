import * as React from 'react'

const BaseGoerliLogo = (props) => {
  return (
    <svg
      viewBox='0 0 32 32'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      {...props}
    >
      <g clipPath='url(#clip0_1101_5707)'>
        <path d='M0 0H32V32H0V0Z' fill='#0052FF' />
        <mask id='mask0_1101_5707' style={{ maskType: 'luminance' }} maskUnits='userSpaceOnUse' x='0' y='0' width='32' height='32'>
          <path d='M32 0H0V32H32V0Z' fill='white' />
        </mask>
        <g mask='url(#mask0_1101_5707)'>
          <path d='M16 32C19.1645 32 22.258 31.0616 24.8892 29.3036C27.5204 27.5454 29.571 25.0466 30.782 22.123C31.993 19.1993 32.31 15.9823 31.6926 12.8786C31.0752 9.77486 29.5514 6.92394 27.3138 4.6863C25.076 2.44866 22.2252 0.924806 19.1214 0.307442C16.0177 -0.30992 12.8007 0.0069325 9.87706 1.21793C6.95344 2.42894 4.45458 4.4797 2.69648 7.11088C0.938384 9.74206 0 12.8355 0 16C0 20.2434 1.68571 24.3132 4.6863 27.3138C7.68688 30.3142 11.7565 32 16 32Z' fill='#0052FF' />
          <path fillRule='evenodd' clipRule='evenodd' d='M15.9624 27.2676C22.1852 27.2676 27.23 22.223 27.23 16C27.23 9.7771 22.1852 4.73242 15.9624 4.73242C10.0588 4.73242 5.21566 9.2726 4.7341 15.0518H21.4546V16.928H4.73242C5.20432 22.7168 10.0519 27.2676 15.9624 27.2676Z' fill='white' />
        </g>
      </g>
      <defs>
        <clipPath id='clip0_1101_5707'>
          <rect width='32' height='32' fill='white' />
        </clipPath>
      </defs>

    </svg>
  )
}

export default BaseGoerliLogo
