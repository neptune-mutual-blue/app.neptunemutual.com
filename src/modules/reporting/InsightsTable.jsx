import { classNames } from "@/utils/classnames";

export const InsightsTable = ({ insights = [] }) => {
  return (
    <>
      <table className="w-full text-sm">
        <tbody>
          {insights.map((insight) => {
            return (
              <tr key={insight.title}>
                <InsightsTh
                  className={classNames(
                    insight.variant === "success" && "text-para text-0FB88F",
                    insight.variant === "error" && "text-para text-FA5C2F",
                    !insight.variant && "opacity-50"
                  )}
                >
                  {insight.title}
                </InsightsTh>
                <InsightsTd>{insight.value}</InsightsTd>
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
};

const InsightsTh = ({ children, className }) => {
  return (
    <th
      scope="row"
      className={classNames(
        "text-left py-1 font-normal leading-none whitespace-nowrap",
        className
      )}
    >
      {children}
    </th>
  );
};

const InsightsTd = ({ children, className }) => {
  return (
    <td
      className={classNames(
        "text-right py-1 text-404040 whitespace-nowrap",
        className
      )}
    >
      {children}
    </td>
  );
};
