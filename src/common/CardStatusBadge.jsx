import { Badge } from "@/common/Badge/Badge";
import { classNames } from "@/utils/classnames";

export const CardStatusBadge = ({ status }) => {
  const isRed = ["Incident Happened", "Claimable"].includes(status);
  const isGray = ["Diversified"].includes(status);

  if (!status || status == "Normal") {
    return null;
  }

  return (
    <Badge
      className={classNames(
        "!rounded",
        isRed && "bg-FA5C2F",
        isGray && "bg-364253",
        !isGray && !isRed && "bg-21AD8C"
      )}
      data-testid="card-badge"
    >
      {status}
    </Badge>
  );
};
