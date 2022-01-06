export const InputWithTrailingButton = ({ inputProps, unit, buttonProps }) => {
  return (
    <div className="flex rounded-lg text-black text-h4">
      <div className="flex items-stretch flex-grow">
        <input
          className="focus:ring-4E7DD9 focus:border-4E7DD9 bg-white block w-full rounded-none rounded-l-lg py-6 pl-6 border border-B0C4DB border-r-0"
          {...inputProps}
        />
      </div>
      {unit && (
        <div className="whitespace-nowrap bg-white border border-B0C4DB border-l-0 text-9B9B9B px-4 py-6">
          {unit}
        </div>
      )}
      <button
        className="font-sora -ml-px relative inline-flex items-center space-x-2 p-6 border border-B0C4DB font-medium rounded-r-lg bg-DAE2EB hover:bg-DEEAF6 focus:outline-none focus:ring-1 focus:ring-4E7DD9 focus:border-4E7DD9"
        {...buttonProps}
      ></button>
    </div>
  );
};
