import dayjs from "dayjs";

export const PolicyFeesAndExpiry = ({ fees, feeAmount, claimEnd }) => {
  const claimEpiry = `${dayjs()
    .add(parseInt(claimEnd, 10) - 1, "month")
    .endOf("month")
    .format("MMM DD, YYYY HH:mm")} UTC`;

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
            <td className="text-4e7dd9 px-4">{claimEpiry}</td>
          </tr>
        </tbody>
      </table>
    </>
  );
};
