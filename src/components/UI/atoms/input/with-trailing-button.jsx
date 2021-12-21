export const InputWithTrailingButton = ({ inputProps, unit, buttonProps }) => {
  return (
    <div className="flex rounded-lg shadow-sm text-black text-h4">
      <div className="flex items-stretch flex-grow focus-within:z-10">
        <input
          className="focus:ring-primary focus:border-primary bg-white-bg block w-full rounded-none rounded-l-lg py-6 pl-6 border border-ash-border border-r-0"
          {...inputProps}
        />
      </div>
      {unit && (
        <div className="bg-white-bg border border-ash-border border-l-0 text-dimmed-fg px-4 py-6">
          {unit}
        </div>
      )}
      <button
        className="font-sora -ml-px relative inline-flex items-center space-x-2 p-6 border border-ash-border font-medium rounded-r-lg bg-ash-secondary hover:bg-ash-brand focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
        {...buttonProps}
      ></button>
    </div>
  );
};
