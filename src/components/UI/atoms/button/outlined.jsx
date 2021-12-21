export const OutlinedButton = ({ onClick, children }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="text-4E7DD9 py-3 px-4 border border-primary rounded-xl hover:bg-4E7DD9 hover:text-FEFEFF"
    >
      {children}
    </button>
  );
};
