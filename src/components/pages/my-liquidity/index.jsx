import Link from "next/link";

import { Container } from "@/components/UI/atoms/container";
import { Grid } from "@/components/UI/atoms/grid";

import { MyLiquidityCoverCard } from "@/components/UI/organisms/cover/my-liquidity/MyLiquidityCoverCard";
import { getParsedKey } from "@/src/helpers/cover";
import { useMyLiquidities } from "@/src/hooks/useMyLiquidities";

export const MyLiquidityPage = () => {
  const { data, loading } = useMyLiquidities();
  const { myLiquidities } = data;

  return (
    <Container className="py-16">
      <div className="flex justify-end">
        <Link href="/my-liquidity/transactions">
          <a className="text-h4 font-medium text-4e7dd9 hover:underline">
            Transaction List
          </a>
        </Link>
      </div>
      {loading && myLiquidities.length === 0 && (
        <div className="text-center py-10">Loading...</div>
      )}
      {!loading && myLiquidities.length === 0 && (
        <div className="w-full flex flex-col items-center pt-20">
          <img
            src="/images/covers/empty-list-illustration.svg"
            alt="no data found"
            className="w-48 h-48"
          />
          <p className="text-h5 text-404040 text-center mt-8 w-96 max-w-full">
            You haven&#x2019;t provided liquidity for any policy(cover) yet. All
            policies to which you have provided liquidity will be{" "}
            <span className="whitespace-nowrap">displayed here.</span>
          </p>
        </div>
      )}
      <Grid className="mt-14 mb-24">
        {myLiquidities.map((x) => {
          return (
            <Link href={`/my-liquidity/${getParsedKey(x.cover.id)}`} key={x.id}>
              <a className="rounded-3xl focus:outline-none focus-visible:ring-2 focus-visible:ring-4e7dd9">
                <MyLiquidityCoverCard
                  coverKey={x.cover.id}
                  totalPODs={x.totalPODs}
                ></MyLiquidityCoverCard>
              </a>
            </Link>
          );
        })}
      </Grid>
    </Container>
  );
};
