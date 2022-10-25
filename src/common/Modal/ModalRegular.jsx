import { classNames } from '@/utils/classnames'
import { Root, Overlay, Content, Portal } from '@radix-ui/react-dialog'

export const ModalRegular = ({
  isOpen = false,
  children,
  onClose,
  disabled = false,
  rootProps = {},
  overlayClass = '',
  defaultContentClassNames = 'fixed z-50 w-full h-full px-4 transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 max-h-90vh flex justify-center items-center',
  className = '',
  container = document.body,
  noBlur = false,
  ...rest
}) => (
  <Root
    open={isOpen}
    {...rootProps}
  >
    <Portal container={container}>
      <Overlay
        className={classNames(
          'fixed inset-0 z-40 overflow-y-auto bg-black bg-opacity-30',
          !noBlur && 'backdrop-blur-md',
          overlayClass
        )}
      />
      <Content
        className={classNames(defaultContentClassNames, className)}
        onEscapeKeyDown={disabled ? () => {} : onClose}
        {...rest}
      >
        {children}
      </Content>

    </Portal>
  </Root>
)
