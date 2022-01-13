import { OutlinedCard } from "@/components/UI/molecules/outlined-card";
import Link from "next/link";

export const CoverPurchaseResolutionSources = ({
  children = null,
  knowledgebase,
  twitter,
  covername,
}) => {
  return (
    <div>
      <OutlinedCard className="bg-DEEAF6 p-10">
        <h3 className="text-h4 font-sora font-semibold">Resolution Sources</h3>
        <p className="text-sm mt-1 mb-6 opacity-50">7 days reporting period</p>

        <Link href={knowledgebase}>
          <a
            target="_blank"
            className="block text-4e7dd9 hover:underline mt-3 capitalize"
          >
            {covername} Knowledgebase
          </a>
        </Link>

        <Link href={twitter}>
          <a
            target="_blank"
            className="block text-4e7dd9 hover:underline mt-3 capitalize"
          >
            {covername} Twitter
          </a>
        </Link>

        {children ? (
          children
        ) : (
          <>
            <hr className="mt-4 mb-6 border-t border-B0C4DB/60" />
            <div className="flex justify-between">
              <span className="">Available Liquidity:</span>
              <strong className="text-right font-bold">$ 750k</strong>
            </div>
          </>
        )}
      </OutlinedCard>
    </div>
  );
};
