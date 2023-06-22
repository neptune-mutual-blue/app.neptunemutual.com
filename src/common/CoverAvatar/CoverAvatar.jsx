import { classNames } from '@/utils/classnames'

export const CoverAvatar = ({
  imgs = [],
  containerClass = 'grow'
}) => {
  if (!imgs || imgs.length < 1) {
    return null
  }

  return (
    <div className={classNames('flex items-center', containerClass)}>
      {imgs.length > 1
        ? (
          <>
            {imgs.slice(0, 3).map((item, idx) => {
              return (
                <div
                  className={classNames(
                    'inline-block max-w-full bg-FEFEFF rounded-full p-0.5 w-14 h-14 lg:w-18 lg:h-18',
                    idx !== 0 && '-ml-7 lg:-ml-9'
                  )}
                  key={item.src}
                >
                  <img
                    src={item.src}
                    alt={item.alt}
                    className='w-full h-full rounded-full bg-DEEAF6 p-3.5'
                    data-testid='cover-img'
                    onError={(ev) => { return (ev.target.src = '/images/covers/empty.svg') }}
                  />
                </div>
              )
            })}

            {imgs.length > 3 && (
              <p className='text-xs opacity-40 text-01052D ml-2'>
                +{imgs.length - 3} MORE
              </p>

            )}
          </>
          )
        : (
          <div
            className='inline-flex items-center justify-center max-w-full p-4 rounded-full bg-DEEAF6 w-14 h-14 lg:w-18 lg:h-18'
          >
            <img
              src={imgs[0].src}
              alt={imgs[0].alt}
              className='inline-block'
              data-testid='cover-img'
              onError={(ev) => { return (ev.target.src = '/images/covers/empty.svg') }}
            />
          </div>
          )}
    </div>
  )
}
