import { Root, Overlay, Content, Portal } from "@radix-ui/react-dialog";

export const Modal = ({ isOpen = false, children, onClose }) => (
  <Root open={isOpen} onOpenChange={onClose}>
    <Portal>
      <Overlay className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-40" />

      <Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 overflow-y-auto max-h-screen max-w-full w-max px-4 text-center z-50">
        <div className="">{children}</div>
      </Content>
    </Portal>
  </Root>
);
