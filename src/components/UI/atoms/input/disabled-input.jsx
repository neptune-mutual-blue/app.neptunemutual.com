export const DisabledInput = ({ value, unit, id }) => {
  return (
    <div className="flex text-h4 text-9B9B9B">
      <div className="flex items-stretch flex-grow">
        <input
          id={id}
          className="cursor-not-allowed block w-full rounded-l-lg py-6 pl-6 border border-B0C4DB border-r-0"
          value={value}
          disabled
        />
      </div>
      {unit && (
        <div className="cursor-not-allowed border border-B0C4DB border-l-0 rounded-r-lg px-4 py-6">
          {unit}
        </div>
      )}
    </div>
  );
};
