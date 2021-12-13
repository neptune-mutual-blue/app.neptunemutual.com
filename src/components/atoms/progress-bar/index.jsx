export const ProgressBar = ({ children, value }) => {
  return (
    <div className="bg-teal-light w-full rounded-full my-2">
      <div
        className="bg-teal-neutral py-1 rounded-full"
        style={{ minWidth: "5px", width: `${value * 100}%` }}
      ></div>
    </div>
  );
};
