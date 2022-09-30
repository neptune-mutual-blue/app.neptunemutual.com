import { classNames } from '@/utils/classnames'
import { Root, Overlay, Content, Portal, Close } from '@radix-ui/react-dialog'
import CloseIcon from '@/icons/CloseIcon'

export const ModalRegular = ({
  isOpen = false,
  children,
  rootProps = {},
  onClose,
  overlayClass = '',
  defaultContentClassNames = 'fixed z-50 max-w-screen max-h-screen px-4 transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 w-max max-w-90vw',
  className = '',
  container = document.body,
  ...rest
}) => (
  <Root
    open={isOpen}
    {...rootProps}
  >
    <Portal container={container}>
      <Overlay
        className={classNames(
          'fixed inset-0 z-40 overflow-y-auto bg-black bg-opacity-15',
          overlayClass
        )}
      />
      <Content
        className={classNames(defaultContentClassNames, className)}
        {...rest}
      >
        <>
          <Close asChild onClick={onClose} className='absolute z-10 right-7 top-3 cursor-pointer'>
            <div aria-label='Close'><CloseIcon className='w-5 h-5' /></div>
          </Close>
          {children}
        </>
      </Content>

    </Portal>
  </Root>
)
