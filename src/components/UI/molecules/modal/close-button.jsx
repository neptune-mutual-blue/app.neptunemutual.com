import CloseIcon from "@/icons/close.jsx";

export const ModalCloseButton = ({ onClick }) => (
  <button
    onClick={onClick}
    className="absolute right-12 top-9 flex justify-center items-center text-black focus:outline-none focus-visible:ring-2 focus-visible:ring-364253 rounded"
  >
    <span className="sr-only">Close</span>
    <CloseIcon width={24} />
  </button>
);
