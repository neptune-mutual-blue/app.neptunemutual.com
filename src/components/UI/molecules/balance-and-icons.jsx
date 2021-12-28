import Link from "next/link";
import OpenInNewIcon from "@/icons/open-in-new";
import AddCircleIcon from "@/icons/add-circle";

export const BalanceAndIcons = ({ value, unit }) => {
  return (
    <div className="flex justify-between items-start text-9B9B9B px-3 mt-2">
      <p>
        {value !== undefined && !isNaN(parseInt(value)) && (
          <>
            Balance: {value} {unit}
          </>
        )}
      </p>
      <div className="flex">
        <Link href="#">
          <a className="ml-3">
            <span className="sr-only">Open In New Tab</span>
            <OpenInNewIcon width={24} fill="currentColor" />
          </a>
        </Link>
        <Link href="#">
          <a className="ml-3">
            <span className="sr-only">Add to Metamask</span>
            <AddCircleIcon width={24} fill="currentColor" />
          </a>
        </Link>
      </div>
    </div>
  );
};
