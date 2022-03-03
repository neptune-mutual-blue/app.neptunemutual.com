import * as Dialog from "@radix-ui/react-dialog";

export const Modal = ({ isOpen = false, children, onClose, disabled }) => (
  <Dialog.Root
    open={isOpen}
    onOpenChange={disabled ? () => {} : () => onClose()}
  >
    <Dialog.Portal>
      <Dialog.Overlay className="fixed inset-0 overflow-y-auto bg-black bg-opacity-50" />

      {/* This element is to trick the browser into centering the modal contents. */}
      <span className="inline-block h-screen align-middle" aria-hidden="true">
        &#8203;
      </span>
      <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 overflow-y-auto max-h-screen w-full md:w-auto">
        <div className="p-6">{children}</div>
      </Dialog.Content>
    </Dialog.Portal>
  </Dialog.Root>
);
