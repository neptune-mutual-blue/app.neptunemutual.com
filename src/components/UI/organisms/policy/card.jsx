import { Badge } from "@/components/UI/atoms/badge";
import { Divider } from "@/components/UI/atoms/divider";
import { OutlinedCard } from "@/components/UI/molecules/outlined-card";
import { classNames } from "@/utils/classnames";
import Link from "next/link";

export const PolicyCard = ({ details }) => {
  const { name, imgSrc, status, claimBefore, purchasedPolicy, claimable, key } =
    details;

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
                status
                  ? status.toLowerCase() === "reporting"
                    ? " text-FA5C2F border-FA5C2F"
                    : ""
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
            Claim Before
          </span>
          <span
            className={classNames(claimable ? "text-FA5C2F" : "text-7398C0")}
          >
            {claimBefore}
          </span>
        </div>
        <div className="flex flex-col">
          <span className="font-semibold text-black text-sm pb-2">
            Purchased Policy
          </span>
          <span className="text-7398C0 text-right">{purchasedPolicy}</span>
        </div>
      </div>

      {claimable && (
        <Link href={`/my-policies/${key}/claim`}>
          <a className="flex justify-center py-2.5 w-full bg-4e7dd9 text-white text-sm font-semibold rounded-lg mt-2 mb-4">
            CLAIM
          </a>
        </Link>
      )}
    </OutlinedCard>
  );
};
