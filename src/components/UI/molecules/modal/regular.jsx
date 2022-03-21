import { Root, Overlay, Content, Portal } from "@radix-ui/react-dialog";

export const Modal = ({ isOpen = false, children, onClose, disabled }) => (
  <Root open={isOpen} onOpenChange={disabled ? () => {} : () => onClose()}>
    <Portal>
      <Overlay className="fixed inset-0 overflow-y-auto bg-black bg-opacity-50 z-40" />

      <Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 overflow-y-auto max-h-screen max-w-full w-max z-50">
        <div className="p-6">{children}</div>
      </Content>
    </Portal>
  </Root>
);
