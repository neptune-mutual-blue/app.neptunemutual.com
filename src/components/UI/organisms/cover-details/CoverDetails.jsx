export const CoverDetails = ({ fees, daiValue, claimEnd }) => {
  const formatDate = () => {
    let date = new Date();
    let dateToShow = claimEnd.substr(0, 3);
    dateToShow = dateToShow + `31, ${date.getUTCFullYear()} 12:00 UTC`;
    return dateToShow;
  };

  return (
    <div className="w-lgInput flex flex-col justify-between px-3 mt-14">
      <div className="mb-2" style={{ color: "#D4DFEE" }}>
        <hr></hr>
      </div>
      <div className="flex justify-between mt-3 font-poppins text-body font-semibold uppercase">
        <p className="">Fees</p>
        <p className="text-primary">{fees} %</p>
      </div>
      <div className="flex justify-between mt-3 font-poppins text-body font-semibold uppercase">
        <p>Cover Fee</p>
        <p className="text-primary">{(fees / 100) * daiValue} DAI</p>
      </div>
      <div className="flex justify-between mt-3 font-poppins text-body font-semibold uppercase">
        <p>Claim Expiry</p>
        <p className="text-primary">{formatDate()}</p>
      </div>
    </div>
  );
};
