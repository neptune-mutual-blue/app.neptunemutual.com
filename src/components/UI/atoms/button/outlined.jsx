export const OutlinedButton = ({ onClick, children }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="text-primary py-3 px-4 border border-primary rounded-xl hover:bg-primary hover:text-white-bg"
    >
      {children}
    </button>
  );
};
