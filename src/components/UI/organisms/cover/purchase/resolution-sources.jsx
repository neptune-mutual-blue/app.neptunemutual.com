import { OutlinedCard } from "@/components/UI/molecules/outlined-card";
import Link from "next/link";

export const CoverPurchaseResolutionSources = ({ children = null }) => {
  return (
    <div>
      <OutlinedCard className="bg-DEEAF6 p-10">
        <h3 className="text-h4 font-sora font-semibold">Resolution Sources</h3>
        <p className="text-sm mt-1 mb-6 opacity-50">7 days reporting period</p>

        <Link href="#">
          <a className="block text-4E7DD9 hover:underline mt-3">
            Uniswap Knowledgebase
          </a>
        </Link>

        <Link href="#">
          <a className="block text-4E7DD9 hover:underline mt-3">
            Uniswap Twitter
          </a>
        </Link>

        <hr className="mt-4 mb-6 border-t border-B0C4DB/60" />

        {children
          ? children 
          : (
            <div className="flex justify-between">
              <span className="">Available Liquidity:</span>
              <strong className="text-right font-bold">$ 750k</strong>
            </div>
          )}
      </OutlinedCard>
    </div>
  );
};
