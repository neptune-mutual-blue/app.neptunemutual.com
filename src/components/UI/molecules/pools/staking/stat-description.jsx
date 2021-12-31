import { amountFormatter } from "@/utils/formatter";

export const StatDescription = ({ stakedOne, lockingPeriod, children }) => (
  <span className="text-7398C0 uppercase pt-2">
    {children
      ? children
      : !stakedOne?.id
      ? `${lockingPeriod} hours`
      : `${amountFormatter(stakedOne?.stakedAmt)} NPM`}
  </span>
);
