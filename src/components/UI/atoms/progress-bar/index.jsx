export const ProgressBar = ({ value }) => {
  return (
    <div className="bg-CEEBED w-full rounded-full my-2">
      <div
        className="bg-21AD8C py-1 rounded-full min-w-5"
        style={{ width: `${value * 100}%` }}
      ></div>
    </div>
  );
};
