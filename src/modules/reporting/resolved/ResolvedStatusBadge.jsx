import { Badge } from "@/common/Badge/Badge";
import { classNames } from "@/utils/classnames";

export const ResolvedStatusBadge = ({ status }) => {
  const isRed = ["Incident Happened", "Claimable"].includes(status);
  const isGreen = ["False Reporting"].includes(status);

  if (!status || status == "Normal") {
    return null;
  }

  return (
    <Badge
      className={classNames(
        "!rounded-lg p-2 leading-4 border-0 font-semibold tracking-normal !text-sm",
        isRed && "bg-FEEBE6 text-FA5C2F",
        isGreen && "bg-E5F4F5 text-21AD8C"
      )}
    >
      {status}
    </Badge>
  );
};
