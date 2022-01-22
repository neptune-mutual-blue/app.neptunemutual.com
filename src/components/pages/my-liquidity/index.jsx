import Link from "next/link";

import { Container } from "@/components/UI/atoms/container";
import { Grid } from "@/components/UI/atoms/grid";

import { CoverCard } from "@/components/UI/organisms/cover/my-liquidity/card";
import { getParsedKey } from "@/src/helpers/cover";
import { useMyLiquidities } from "@/src/hooks/useMyLiquidities";

export const MyLiquidityPage = () => {
  const { data } = useMyLiquidities();
  const { myLiquidities } = data;

  if (!myLiquidities) {
    return <>loading...</>;
  }

  return (
    <Container className="py-16">
      <div className="flex justify-end">
        <Link href="/my-liquidity/transactions">
          <a className="text-h4 font-medium text-4e7dd9 hover:underline">
            Transaction List
          </a>
        </Link>
      </div>
      <Grid className="mt-14 mb-24">
        {myLiquidities.map((x) => {
          return (
            <Link href={`/my-liquidity/${getParsedKey(x.cover.id)}`} key={x.id}>
              <a className="rounded-3xl focus:outline-none focus-visible:ring-2 focus-visible:ring-4e7dd9">
                <CoverCard
                  coverKey={x.cover.id}
                  totalPODs={x.totalPODs}
                ></CoverCard>
              </a>
            </Link>
          );
        })}
      </Grid>
    </Container>
  );
};
