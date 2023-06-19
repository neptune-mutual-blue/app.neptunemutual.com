import { classNames } from '@/utils/classnames'

export const DescriptionComponent = ({
  title,
  text,
  className = '',
  titleClassName = '',
  bullets = true
}) => {
  if (!text) { return null }

  return (
    <div className={className}>
      <h4
        className={classNames(
          'font-bold text-md sm:text-lg leading-5',
          titleClassName
        )}
      >
        {title}
      </h4>

      <div className='mt-2 text-md sm:text-lg'>
        {Array.isArray(text)
          ? (
            <div className='space-y-4'>
              {text.map((t, i) => {
                return Array.isArray(t)
                  ? (
                    <ul
                      key={i}
                      className={classNames(
                        bullets ? 'list-disc pl-6' : 'list-none pl-3'
                      )}
                    >
                      {t.map((item, idx) => {
                        return Array.isArray(item)
                          ? (
                            <ul
                              key={idx}
                              className={classNames(
                                bullets ? 'list-disc pl-6' : 'list-none pl-3'
                              )}
                            >
                              {item.map((listItem, index) => {
                                return (
                                  <li key={index}>{listItem}</li>
                                )
                              })}
                            </ul>
                            )
                          : (
                            <li key={idx}>{item}</li>
                            )
                      }
                      )}
                    </ul>
                    )
                  : (
                    <p key={i}>{t}</p>
                    )
              }
              )}
            </div>
            )
          : (
            <p>{text}</p>
            )}
      </div>
    </div>
  )
}
