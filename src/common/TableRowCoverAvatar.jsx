
import { classNames } from '@/utils/classnames'
import { TripleDotsIcon } from '@/icons/TripleDotsIcon'
import { InfoTooltip } from '@/common/Cover/InfoTooltip'

export const TableRowCoverAvatar = ({
  imgs = [],
  containerClass = 'grow'
}) => {
  const sizeClasses = {
    diversifiedWrapper: 'w-7 h-7',
    diversifiedImg: 'p-0.5',
    dedicatedWrapper: 'w-7 h-7',
    dedicatedImg: 'w-4.5 h-4.5',
    ml: '-ml-2.5'
  }

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
                    'inline-block max-w-full bg-FEFEFF rounded-full p-0.5',
                    idx !== 0 && sizeClasses.ml,
                    sizeClasses.diversifiedWrapper
                  )}
                  key={item.src}
                >
                  <img
                    src={item.src}
                    alt={item.alt}
                    className={classNames(
                      'w-full h-full rounded-full bg-DEEAF6',
                      sizeClasses.diversifiedImg
                    )}
                    data-testid='cover-img'
                    onError={(ev) => { return (ev.target.src = '/images/covers/empty.svg') }}
                  />
                </div>
              )
            })}

            {imgs.length > 3 && (
              <InfoTooltip infoComponent={`${imgs.length - 3} more`} className='p-1 px-2'>
                <div
                  className={classNames(
                    'z-0 bg-FEFEFF rounded-full p-0.5',
                    sizeClasses.ml,
                    sizeClasses.diversifiedWrapper
                  )}
                >
                  <div className='flex items-center justify-center w-full h-full rounded-full bg-DEEAF6'>
                    <TripleDotsIcon />
                  </div>
                </div>
              </InfoTooltip>
            )}
          </>
          )
        : (
          <div
            className={classNames(
              'inline-flex justify-center items-center max-w-full bg-DEEAF6 rounded-full',
              sizeClasses.dedicatedWrapper
            )}
          >
            <img
              src={imgs[0].src}
              alt={imgs[0].alt}
              className={classNames('inline-block', sizeClasses.dedicatedImg)}
              data-testid='cover-img'
              onError={(ev) => { return (ev.target.src = '/images/covers/empty.svg') }}
            />
          </div>
          )}
    </div>
  )
}
