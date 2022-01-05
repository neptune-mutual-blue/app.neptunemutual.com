export const RegularInput = ({ inputProps, buttonProps }) => {
  return (
    <div className="flex rounded-lg shadow-sm text-black text-h4">
      <div className="flex items-stretch flex-grow focus-within:z-10">
        <input
          className="focus:ring-4E7DD9 focus:border-4E7DD9 bg-white block w-full rounded-lg py-6 pl-6 border border-B0C4DB"
          {...inputProps}
        />
      </div>
    </div>
  );
};
