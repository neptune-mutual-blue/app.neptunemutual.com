import { classNames } from '@/utils/classnames'

export const CoverProfileInfoShort = ({
  imgSrc,
  title,
  className,
  fontSizeClass = 'text-lg'
}) => {
  return (
    <div
      className={classNames(
        'container mx-auto flex items-center mb-12',
        className
      )}
      data-testid='cover-profile-info-short'
    >
      <div className='mr-4 border rounded-full w-11 border-B0C4DB'>
        <img
          src={imgSrc}
          alt={title}
          onError={(ev) => { return (ev.target.src = '/images/covers/empty.svg') }}
        />
      </div>
      <div>
        <h4 className={classNames('font-bold', fontSizeClass)}>
          {title}
        </h4>
      </div>
    </div>
  )
}
