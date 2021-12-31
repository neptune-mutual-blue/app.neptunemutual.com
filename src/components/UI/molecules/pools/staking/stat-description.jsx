import { amountFormatter } from "@/utils/formatter";

export const StatDescription = ({ stakedOne, lockingPeriod, children }) => {
  if (children) {
    return <span className="text-7398C0 uppercase pt-2">{children}</span>;
  }
  return (
    <span className="text-7398C0 uppercase pt-2">
      {!stakedOne?.id
        ? `${lockingPeriod} hours`
        : `${amountFormatter(stakedOne?.stakedAmt)} NPM`}
    </span>
  );
};
