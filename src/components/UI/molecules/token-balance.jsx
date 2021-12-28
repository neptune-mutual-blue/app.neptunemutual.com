import Link from "next/link";
import OpenInNewIcon from "@/icons/open-in-new";
import AddCircleIcon from "@/icons/add-circle";

export const TokenBalance = ({ value, unit }) => {
  const amount = value !== undefined && !isNaN(parseInt(value)) ? value : 0;

  return (
    <div className="flex justify-between items-start text-9B9B9B px-3 mt-2">
      <p>
        Balance: {amount} {unit}
      </p>
      <div className="flex">
        <Link href="#">
          <a className="ml-3">
            <span className="sr-only">Open In Explorer</span>
            <OpenInNewIcon width={24} fill="currentColor" />
          </a>
        </Link>
        <button className="ml-3">
          <span className="sr-only">Add to Metamask</span>
          <AddCircleIcon width={24} fill="currentColor" />
        </button>
      </div>
    </div>
  );
};
