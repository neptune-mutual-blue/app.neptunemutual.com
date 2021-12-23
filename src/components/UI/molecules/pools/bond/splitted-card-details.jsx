import { SplitedDetail } from "./splitted-card";

export const SplittedDetailsCards = ({ details }) => {
  return (
    <div className="flex flex-wrap justify-between gap-y-3">
      {details.map((x, idx) => {
        return (
          <SplitedDetail
            key={x.title}
            title={x.title}
            value={x.value}
            valueClasses={x.valueClasses}
            titleClasses={x.titleClasses}
            right={idx % 2 !== 0}
          />
        );
      })}
    </div>
  );
};
