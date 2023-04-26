import { classNames } from '@/utils/classnames'

export const Loader = ({ className, ...rest }) => {
  return (
    <svg
      className={classNames(
        'animate-spin',
        className || 'h-12 w-12 -ml-1 mr-3 text-4E7DD9')}
      xmlns='http://www.w3.org/2000/svg'
      fill='none'
      viewBox='0 0 38 38'
      {...rest}
      // stroke='#4E7DD9'
    >
      <g fill='none' fillRule='evenodd'>
        <g transform='translate(1 1)' strokeWidth='2'>
          <circle
            stroke='currentColor'
            strokeOpacity='.25' cx='18' cy='18' r='18'
          />
          <path stroke='currentColor' d='M36 18c0-9.94-8.06-18-18-18' />
        </g>
      </g>
    </svg>

  )
}
