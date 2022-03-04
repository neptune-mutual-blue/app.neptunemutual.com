import * as Dialog from "@radix-ui/react-dialog";

export const Modal = ({ isOpen = false, children, onClose }) => (
  <Dialog.Root open={isOpen} onOpenChange={onClose}>
    <Dialog.Portal>
      <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm" />

      {/* This element is to trick the browser into centering the modal contents. */}
      <span className="inline-block h-screen align-middle" aria-hidden="true">
        &#8203;
      </span>

      <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 overflow-y-auto max-h-screen max-w-full w-max px-4 text-center">
        <div className="">{children}</div>
      </Dialog.Content>
    </Dialog.Portal>
  </Dialog.Root>
);
