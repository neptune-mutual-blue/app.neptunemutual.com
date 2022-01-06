import { classNames } from "@/utils/classnames";

export const HorizantalChartLegend = () => {
  return (
    <div className="flex justify-center space-x-6 flex-wrap mt-6 mb-12">
      <LegendItem variant={"success"}>Incident Occured</LegendItem>
      <LegendItem variant={"error"}>False Reporting</LegendItem>
    </div>
  );
};

const LegendItem = ({ variant, children }) => {
  return (
    <div className="flex items-center">
      <div
        className={classNames(
          "w-4 h-4 mr-2.5 rounded",
          variant === "success" ? "bg-21AD8C" : "bg-FA5C2F"
        )}
      ></div>
      <p
        className={classNames(
          "text-sm font-semibold",
          variant === "success" ? "text-21AD8C" : "text-FA5C2F"
        )}
      >
        {children}
      </p>
    </div>
  );
};
