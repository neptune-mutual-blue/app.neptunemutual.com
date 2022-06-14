import { classNames } from "@/utils/classnames";

export const StatusBadge = ({ status }) => (
  <div
    className={classNames(
      "text-xs leading-4.5 py-0.5 px-1.5 rounded-1 font-poppins text-white",
      status === "Incident Happened" || status === "Claimable"
        ? "bg-FA5C2F"
        : "bg-21AD8C"
    )}
  >
    {status}
  </div>
);
