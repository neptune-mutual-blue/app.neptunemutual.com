export const DisabledInput = ({ value, unit }) => {
  return (
    <div className="flex rounded-lg shadow-sm text-black text-h4">
      <div className="flex items-stretch flex-grow focus-within:z-10">
        <input
          className="cursor-not-allowed text-9B9B9B focus:ring-B0C4DB focus:outline-none focus:border-B0C4DB bg-FEFEFF block w-full rounded-none rounded-l-lg py-6 pl-6 border border-B0C4DB border-r-0"
          value={value}
          disabled
        />
      </div>
      {unit && (
        <div className="bg-FEFEFF border border-B0C4DB border-l-0 text-9B9B9B px-4 py-6">
          {unit}
        </div>
      )}
    </div>
  );
};
