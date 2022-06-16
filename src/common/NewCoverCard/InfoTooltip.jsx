import { classNames } from "@/utils/classnames";
import * as Tooltip from "@radix-ui/react-tooltip";

export const InfoTooltip = ({
  children,
  infoComponent,
  position = "top",
  className = "",
  arrow = true,
}) => (
  <Tooltip.Root delayDuration={200}>
    <Tooltip.Trigger asChild>{children}</Tooltip.Trigger>
    <Tooltip.Content
      className={classNames(
        "flex flex-col gap-y-1 text-xs leading-4 font-poppins max-w-52 text-white bg-black z-60 rounded-1 shadow-tx-overview",
        className ? className : "p-4"
      )}
      side={position}
      sideOffset={5}
      // alignOffset={4}
    >
      {arrow && (
        <Tooltip.Arrow className="" offset={4} fill="#01052D" height={7} />
      )}
      {infoComponent}
    </Tooltip.Content>
  </Tooltip.Root>
);
