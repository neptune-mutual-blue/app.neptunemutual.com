import RefreshDoubleIcon from "@/icons/RefreshDoubleIcon";
import DateLib from "@/lib/date/DateLib";
import { convertFromUnits } from "@/utils/bn";
import { unixToDate } from "@/utils/date";

export const PolicyFeesAndExpiry = ({ fetching, data, claimEnd }) => {
  const { fee = "0", rate = "0" } = data;

  const feePercent = convertFromUnits(rate)
    .multipliedBy(100)
    .decimalPlaces(2)
    .toString();
  const coverFee = convertFromUnits(fee).decimalPlaces(3).toString();

  let ce = DateLib.addMonths(DateLib.unix() * 1000, parseInt(claimEnd, 10) - 1);
  ce = DateLib.endOfMonth(ce);
  ce = DateLib.endOfDay(ce);
  const claimExpiry = `${unixToDate(ce / 1000, "MMM DD, YYYY HH:mm")} UTC`;

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
            <td className="text-4e7dd9">{feePercent} %</td>
          </tr>
          <tr className="flex justify-between mt-3">
            <th>Cover Fee</th>
            <td className="text-4e7dd9">{coverFee} DAI</td>
          </tr>
          <tr className="flex justify-between mt-3">
            <th>Claim Expiry</th>
            <td className="text-4e7dd9">{claimExpiry}</td>
          </tr>
        </tbody>
      </table>
      <hr className="mt-4 border-t border-d4dfee" />
    </>
  );
};
