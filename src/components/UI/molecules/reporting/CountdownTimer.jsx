export const CountDownTimer = ({ title, startingTime }) => {
  return (
    <div className=" text-9B9B9B mt-4 mb-16 flex justify-center items-center flex-col">
      <span className="text-xs font-semibold">{title}</span>
      <span className="text-h3">{startingTime}</span>
    </div>
  );
};
