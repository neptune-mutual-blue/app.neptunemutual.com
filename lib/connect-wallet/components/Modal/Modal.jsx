import { Root, Overlay, Content, Portal } from "@radix-ui/react-dialog";

export const Modal = ({ isOpen = false, children, onClose }) => (
  <Root open={isOpen} onOpenChange={onClose}>
    <Portal>
      <Overlay className="fixed inset-0 z-40 bg-black bg-opacity-50 backdrop-blur-sm" />

      <Content className="fixed z-50 max-w-full max-h-screen px-4 overflow-y-auto text-center transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 w-max">
        <div className="">{children}</div>
      </Content>
    </Portal>
  </Root>
);
