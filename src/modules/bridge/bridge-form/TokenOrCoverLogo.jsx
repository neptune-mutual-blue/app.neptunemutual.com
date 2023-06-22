import { classNames } from '@/utils/classnames'

export const TokenOrCoverLogo = ({ src, alt, wrapperClass = '', ...rest }) => {
  return (
    <div className={classNames('inline-flex justify-center items-center max-w-full bg-DEEAF6 rounded-full w-5 h-5', wrapperClass)}>
      <img
        src={src}
        alt={alt}
        className='w-4.5 h-4.5 inline-block'
        {...rest}
      />
    </div>
  )
}
