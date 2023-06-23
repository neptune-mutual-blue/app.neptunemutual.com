import { classNames } from '@/utils/classnames'

export const ModalTitle = ({ children = null, imgSrc, containerClass = '', ...rest }) => {
  return (
    <>
      {imgSrc && (
        <div className={
          classNames('flex items-center justify-center w-10 h-10 p-2 mr-3 border border-black rounded-full bg-DEEAF6', containerClass)
        }
        >
          <img src={imgSrc} alt='logo' className={classNames('inline-block')} {...rest} />
        </div>
      )}
      {children}
    </>
  )
}
