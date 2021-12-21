export const ProgressBar = ({ children, value }) => {
  return (
    <div className="bg-CEEBED w-full rounded-full my-2">
      <div
        className="bg-21AD8C py-1 rounded-full"
        style={{ minWidth: "5px", width: `${value * 100}%` }}
      ></div>
    </div>
  );
};
