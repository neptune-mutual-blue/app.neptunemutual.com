import { Badge } from "@/src/common/components/badge";
import { classNames } from "@/utils/classnames";

export const CardStatusBadge = ({ status }) => {
  const isRed = ["Incident Happened", "Claimable"].includes(status);

  if (!status || status == "Normal") {
    return null;
  }

  return (
    <Badge
      className={classNames(isRed && "text-FA5C2F", !isRed && "text-21AD8C")}
    >
      {status}
    </Badge>
  );
};
