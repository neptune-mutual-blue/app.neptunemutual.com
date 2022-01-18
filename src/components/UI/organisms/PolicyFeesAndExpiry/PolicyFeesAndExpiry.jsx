import { monthNames } from "@/lib/dates";

export const PolicyFeesAndExpiry = ({ fees, feeAmount, claimEnd }) => {
  const formatDate = () => {
    const now = new Date();
    const monthName = monthNames[(now.getMonth() + claimEnd - 1) % 12];

    return `End of ${monthName}, ${now.getFullYear()} 12:00 UTC`;
  };

  return (
    <>
      <hr className="mt-14 mb-2 border-t border-d4dfee" />
      <table className="w-full uppercase text-black text-h6 font-semibold">
        <tbody>
          <tr className="flex justify-between mt-3">
            <th>Fees</th>
            <td className="text-4e7dd9 px-4">{fees} %</td>
          </tr>
          <tr className="flex justify-between mt-3">
            <th>Cover Fee</th>
            <td className="text-4e7dd9 px-4">{feeAmount} DAI</td>
          </tr>
          <tr className="flex justify-between mt-3">
            <th>Claim Expiry</th>
            <td className="text-4e7dd9 px-4">{formatDate()}</td>
          </tr>
        </tbody>
      </table>
    </>
  );
};
