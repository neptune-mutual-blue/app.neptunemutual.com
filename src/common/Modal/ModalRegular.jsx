import { classNames } from "@/utils/classnames";
import { Root, Overlay, Content, Portal } from "@radix-ui/react-dialog";

export const ModalRegular = ({
  isOpen = false,
  children,
  onClose,
  disabled = false,
  rootProps = {},
  overlayClass = "",
  defaultContentClassNames = "fixed z-50 max-w-screen max-h-screen px-4 transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 w-max max-w-90vw",
  className = "",
  container = document.body,
  ...rest
}) => (
  <Root
    open={isOpen}
    onOpenChange={disabled ? () => {} : () => onClose()}
    {...rootProps}
  >
    <Portal container={container}>
      <Overlay
        className={classNames(
          "fixed inset-0 z-40 overflow-y-auto bg-black bg-opacity-50",
          overlayClass
        )}
      />
      <Content
        className={classNames(defaultContentClassNames, className)}
        {...rest}
      >
        {children}
      </Content>
    </Portal>
  </Root>
);
