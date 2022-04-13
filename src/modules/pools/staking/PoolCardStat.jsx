export const PoolCardStat = ({ title, value, tooltip }) => {
  return (
    <span title={tooltip}>
      <h5 className="capitalize font-semibold">{title}</h5>
      <p className="text-7398C0 mt-2">{value}</p>
    </span>
  );
};
