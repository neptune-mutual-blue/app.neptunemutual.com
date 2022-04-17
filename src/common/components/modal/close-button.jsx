import CloseIcon from "@/icons/CloseIcon";

export const ModalCloseButton = ({ onClick, disabled }) => (
  <button
    onClick={disabled ? () => {} : onClick}
    className="absolute right-12 top-9 flex justify-center items-center text-black focus:outline-none focus-visible:ring-2 focus-visible:ring-364253 rounded"
  >
    <span className="sr-only">Close</span>
    <CloseIcon width={24} height={24} />
  </button>
);
