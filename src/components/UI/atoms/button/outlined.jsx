export const OutlinedButton = ({ onClick, children }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="text-4E7DD9 py-3 px-4 border border-4E7DD9 rounded-xl"
    >
      {children}
    </button>
  );
};
