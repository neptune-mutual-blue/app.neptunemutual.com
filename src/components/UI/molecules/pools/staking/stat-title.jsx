export const StatTitle = ({ stakedOne, children }) => {
  if (children) {
    return <span className="capitalize font-semibold">{children}</span>;
  }
  return (
    <span className="capitalize font-semibold">
      {!stakedOne?.id ? "locking period" : "Your stake"}
    </span>
  );
};
