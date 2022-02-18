import { useCountdown } from "@/lib/countdown/useCountdown";
import DateLib from "@/lib/date/DateLib";

const getTime = () => {
  return DateLib.unix().toString();
};

const formatCount = (n) => String(n).padStart(2, "0");

export const CountDownTimer = ({ title, target }) => {
  const { hours, minutes, seconds } = useCountdown({
    target,
    getTime,
  });

  const time = `${formatCount(hours)}:${formatCount(minutes)}:${formatCount(
    seconds
  )}`;
  return (
    <div className=" text-9B9B9B mt-4 mb-16 flex justify-center items-center flex-col">
      <span className="text-xs font-semibold uppercase">{title}</span>
      <span className="text-h3">{time}</span>
    </div>
  );
};
