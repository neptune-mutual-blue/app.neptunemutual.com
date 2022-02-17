import { unixToDate } from "@/utils/date";
import * as Tooltip from "@radix-ui/react-tooltip";
import dayjs from "dayjs";

export const DateToolTip = ({ children, date }) => {
  const getToolTipDate = (date) => {
    let dateToShow = unixToDate(date, "YYYY-MM-DD");
    return `${dayjs(dateToShow).toString()}+000 (Pacific Time)`;
  };

  return (
    <>
      <Tooltip.Root>
        <Tooltip.Trigger>{children}</Tooltip.Trigger>
        <Tooltip.Content side="top">
          <div className="text-sm leading-6 bg-black p-6 rounded-xl max-w-sm">
            <p className="text-AABDCB mt-2">{getToolTipDate(date)}</p>
          </div>

          <Tooltip.Arrow offset={16} className="fill-black" />
        </Tooltip.Content>
      </Tooltip.Root>
    </>
  );
};
