import CloseIcon from "@/icons/close.jsx";

export const ModalCloseButton = ({ onClick }) => (
  <button
    onClick={onClick}
    className="absolute right-12 top-7 flex justify-center items-center text-gray-300 hover:text-black focus:text-black focus:outline-none focus-visible:ring-2 focus-visible:ring-364253 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
  >
    <span className="sr-only">Close</span>
    <CloseIcon width={24} />
  </button>
);
