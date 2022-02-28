import RefreshDoubleIcon from "@/icons/RefreshDoubleIcon";
import DateLib from "@/lib/date/DateLib";
import { convertFromUnits, convertUintToPercentage } from "@/utils/bn";
import { formatCurrency } from "@/utils/formatter/currency";
import { formatPercent } from "@/utils/formatter/percent";

export const PolicyFeesAndExpiry = ({ fetching, data, coverPeriod }) => {
  const { fee, rate } = data;

  const rateConverted = convertUintToPercentage(rate);
  const coverFee = convertFromUnits(fee).toString();

  const next = DateLib.addMonths(new Date(), coverPeriod - 1);
  const expires = DateLib.getEomInUTC(next);

  return (
    <>
      <div className="text-xs tracking-normal px-2 py-1 mt-14 flex justify-end items-center">
        {fetching && (
          <>
            <RefreshDoubleIcon className="w-3 h-3 text-4e7dd9 animate-spin mr-2" />
            <p>Fetching...</p>
          </>
        )}
      </div>
      <hr className="mb-4 border-t border-d4dfee" />
      <table className="w-full uppercase text-black text-h6 font-semibold">
        <tbody>
          <tr className="flex justify-between mt-3">
            <th>Fees</th>
            <td className="text-4e7dd9">{formatPercent(rateConverted)}</td>
          </tr>
          <tr className="flex justify-between mt-3">
            <th>Cover Fee</th>
            <td
              className="text-4e7dd9"
              title={formatCurrency(coverFee, "DAI", true).long}
            >
              {formatCurrency(coverFee, "DAI", true).short}
            </td>
          </tr>
          <tr className="flex justify-between mt-3">
            <th>Claim Expiry</th>
            <td className="text-4e7dd9" title={expires.toString()}>
              {DateLib.toLongDateFormat(expires, "UTC")}
            </td>
          </tr>
        </tbody>
      </table>
      <hr className="mt-4 border-t border-d4dfee" />
    </>
  );
};
