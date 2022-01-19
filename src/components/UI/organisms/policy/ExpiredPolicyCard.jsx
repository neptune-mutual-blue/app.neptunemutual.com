import { Badge } from "@/components/UI/atoms/badge";
import { Divider } from "@/components/UI/atoms/divider";
import { OutlinedCard } from "@/components/UI/molecules/outlined-card";
import { classNames } from "@/utils/classnames";
import { unixToDate } from "@/utils/date";

export const ExpiredPolicyCard = ({ details }) => {
  const { name, status, expiresOn, purchasedPolicy, key } = details;

  const imgSrc = `/images/covers/${key}.png`;

  return (
    <OutlinedCard className="bg-white p-6" type="normal">
      <div className="flex justify-between">
        <div>
          <div className="w-18 h-18 bg-DEEAF6 p-3 rounded-full">
            <img src={imgSrc} alt={name} className="inline-block max-w-full" />
          </div>
          <h4 className="text-h4 font-sora font-semibold uppercase mt-4">
            {name}
          </h4>
        </div>
        <div>
          {status && (
            <Badge
              className={classNames(
                status?.toLowerCase().indexOf("reporting") > -1
                  ? " text-FA5C2F border-FA5C2F"
                  : ""
              )}
            >
              {status}
            </Badge>
          )}
        </div>
      </div>

      {/* Divider */}
      <Divider />

      {/* Stats */}
      <div className="flex justify-between text-sm px-1 pb-4">
        <div className="flex flex-col">
          <span className="font-semibold text-black text-sm pb-2">
            Expired On
          </span>
          <span className="text-7398C0">
            {unixToDate(expiresOn, "YYYY/MM/DD HH:mm") + " UTC"}
          </span>
        </div>
        <div className="flex flex-col">
          <span className="font-semibold text-black text-sm pb-2">
            Purchased Policy
          </span>
          <span className="text-7398C0 text-right">{purchasedPolicy}</span>
        </div>
      </div>
    </OutlinedCard>
  );
};
