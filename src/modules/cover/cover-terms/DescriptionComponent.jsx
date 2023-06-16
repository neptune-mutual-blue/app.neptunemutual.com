import { classNames } from '@/utils/classnames'
import React from 'react'

/**
 * @typedef {{
 * parent: number,
 * parentClass?: string,
 * text?: string | string[],
 * textClass?: string,
 * ulClass?: string,
 * listStyle?: string,
 * listItemClass?: string,
 * bullets?: string[] | {title: string, text: string | string[]}[]
 * }} Child
 *
 * @param {Object} props
 * @param {string | JSX.Element} props.title
 * @param {string | (string | JSX.Element)[]} [props.text]
 * @param {(string | JSX.Element)[]} [props.bullets]
 * @param {'disc' | 'none' | 'decimal'} [props.listStyle]
 * @param {string} [props.listItemClass]
 * @param {string} [props.ulClass]
 * @param {string} [props.wrapperClass]
 * @param {Child[]} [props.childLists]
 * @returns {JSX.Element}
 */
export const DescriptionComponent = ({
  title,
  text = [],
  bullets = [],
  listStyle = 'disc',
  listItemClass = '',
  ulClass = '',
  wrapperClass = '',
  childLists = []
}) => {
  return (
    <div className={classNames(wrapperClass)}>
      {title &&
      (typeof title === 'string'
        ? <h2 className='text-display-sm'>{title}</h2>
        : <>{title}</>
      )}

      {text && Array.isArray(text)
        ? (
          <>
            {text.map((t, i) => { return <p key={i} className='mt-4'>{t}</p> })}
          </>
          )
        : <p className='mt-4'>{text}</p>}

      {bullets && (
        <ul className={classNames('pl-6 mt-4', `list-${listStyle}`, ulClass)}>

          {bullets.map((point, idx) => {
            const childList = childLists.find(n => { return n.parent === idx })

            return (
              <React.Fragment key={idx}>
                <li className={classNames(listItemClass, childList?.parentClass ?? '')}>{point}</li>

                {childList && (
                  <>
                    {
                  childList.text &&
                    <div className={classNames('mt-4 space-y-4', childList.textClass ?? '')}>
                      {
                        Array.isArray(childList.text)
                          ? childList.text.map((t, i) => { return <p key={i}>{t}</p> })
                          : <p>{childList.text}</p>
                      }
                    </div>
                  }

                    {
                    childList.bullets && (
                      <ul
                        className={classNames('pl-6', `list-disc list-${childList.listStyle}`, childList.ulClass ?? '')}
                      >
                        {
                        childList.bullets.map((p, i) => {
                          return (
                            <React.Fragment key={i}>
                              <li className={childList.listItemClass ?? ''}>{p?.title ?? p}</li>
                              {
                              p.text &&
                                <div className='mt-4 space-y-4'>
                                  {
                                    Array.isArray(p.text)
                                      ? p.text.map((t, i) => { return <p key={i}>{t}</p> })
                                      : <p>{p.text}</p>
                                  }
                                </div>
                            }
                            </React.Fragment>
                          )
                        }
                        )
                      }
                      </ul>
                    )
                  }
                  </>
                )}
              </React.Fragment>
            )
          })}
        </ul>
      )}
    </div>
  )
}
