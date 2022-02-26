import { classNames } from "@/utils/classnames";

export const HomeCard = ({ items, className }) => {
  return (
    <div
      className={classNames(
        "w-full lg:w-96 py-6 lg:py-0 lg:h-36 bg-white rounded-2xl shadow-homeCard md:rounded-none lg:rounded-2xl border-0.5 md:border-0  lg:border-0.5 border-B0C4DB lg:border-B0C4DB flex justify-center items-center",
        className
      )}
    >
      {items?.map((item, index) => {
        const firstBorder = index === 0 ? `border-r-0.5  border-AABDCB` : ``;
        return (
          <div
            key={`home-card-${index}`}
            className={`lg:py-4 flex flex-col justify-center items-center flex-1 ${firstBorder}`}
          >
            <h5 className="text-h7 mb-2 lg:mb-0 lg:text-h5 font-sora text-4e7dd9">
              {item?.name}
            </h5>
            <h3 className="text-h5 lg:text-h3 leading-5 font-sora text-black font-bold">
              {item?.amount}
            </h3>
          </div>
        );
      })}
    </div>
  );
};
