import { Badge } from "@/common/Badge/Badge";
import { classNames } from "@/utils/classnames";

export const ResolvedStatusBadge = ({ status }) => {
  const isTeal = ["Incident Happened", "Claimable"].includes(status);
  const isGray = ["Diversified"].includes(status);

  if (!status || status == "Normal") {
    return null;
  }

  return (
    <Badge
      className={classNames(
        "!rounded-lg p-2 leading-4 border-0 font-semibold",
        isTeal && "bg-E5F4F5 text-21AD8C",
        isGray && "bg-f1f3f6 text-364253",
        !isGray && !isTeal && "bg-FEEBE6 text-FA5C2F"
      )}
    >
      {status}
    </Badge>
  );
};
