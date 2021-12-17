export const CoverDetails = ({ fees, daiValue, claimEnd }) => {
  const formatDate = () => {
    let date = new Date();
    let dateToShow = claimEnd.substr(0, 3);
    dateToShow = dateToShow + ` 31, ${date.getUTCFullYear()} 12:00 UTC`;
    return dateToShow;
  };

  return (
    <div className="w-lgInput flex flex-col justify-between px-3 mt-14">
      <div className="mb-2" style={{ color: "#D4DFEE" }}>
        <hr></hr>
      </div>
      <table className="w-lgInput">
        <tbody>
          <tr className="flex justify-between mt-3 font-poppins text-body font-semibold uppercase">
            <th>Fees</th>
            <td className="text-primary px-4">{fees} %</td>
          </tr>
          <tr className="flex justify-between mt-3 font-poppins text-body font-semibold uppercase">
            <th>Cover Fee</th>
            <td className="text-primary px-4">{(fees / 100) * daiValue} DAI</td>
          </tr>
          <tr className="flex justify-between mt-3 font-poppins text-body font-semibold uppercase">
            <th>Claim Expiry</th>
            <td className="text-primary px-4">{formatDate()}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};
