import CheckCircleWithBorderIcon from '@/icons/CheckCircleWithBorderIcon'
import { classNames } from '@/utils/classnames'

const TokenAvatar = ({ className = '', src = '', verified = false }) => {
  return (
    <div className='relative'>
      <div className={classNames('w-5 h-5 bg-9B9B9B rounded-full overflow-hidden', className)}>
        {src && (
          <img
            src={src}
            className='w-full h-full'
            alt='token cover image'
            onError={(ev) => (ev.target.src = '/images/covers/empty.svg')}
          />
        )}
      </div>

      {
        verified && <CheckCircleWithBorderIcon className='text-4e7dd9 w-3.5 h-3.5 absolute -right-1 bottom-px' />
      }
    </div>
  )
}

export { TokenAvatar }
