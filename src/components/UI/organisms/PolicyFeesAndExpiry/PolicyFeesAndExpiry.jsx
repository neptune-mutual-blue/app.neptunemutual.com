import RefreshDoubleIcon from "@/icons/RefreshDoubleIcon";
import dayjs from "dayjs";

export const PolicyFeesAndExpiry = ({
  fetching,
  fees,
  feeAmount,
  claimEnd,
}) => {
  const claimEpiry = `${dayjs()
    .add(parseInt(claimEnd, 10) - 1, "month")
    .endOf("month")
    .format("MMM DD, YYYY HH:mm")} UTC`;

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
            <td className="text-4e7dd9">{fees} %</td>
          </tr>
          <tr className="flex justify-between mt-3">
            <th>Cover Fee</th>
            <td className="text-4e7dd9">{feeAmount} DAI</td>
          </tr>
          <tr className="flex justify-between mt-3">
            <th>Claim Expiry</th>
            <td className="text-4e7dd9">{claimEpiry}</td>
          </tr>
        </tbody>
      </table>
      <hr className="mt-4 border-t border-d4dfee" />
    </>
  );
};
