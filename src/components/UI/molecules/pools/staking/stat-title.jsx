export const StatTitle = ({ stakedOne, children }) => {
  return (
    <span className="capitalize font-semibold">
      {children ? children : !stakedOne?.id ? "locking period" : "Your stake"}
    </span>
  );
};
