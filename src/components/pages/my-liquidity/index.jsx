import Link from "next/link";

import { Container } from "@/components/UI/atoms/container";
import { Grid } from "@/components/UI/atoms/grid";

import { CoverCard } from "@/components/UI/organisms/cover/my-liquidity/card";
import { useAvailableCovers } from "@/components/pages/home/useAvailableCovers";

export const MyLiquidityPage = () => {
  const { availableCovers } = useAvailableCovers();

  if (!availableCovers) {
    return <>loading...</>;
  }

  return (
    <Container className="py-16">
      <div className="flex justify-end">
        <Link href="/my-liquidity/transactions">
          <a className="text-h4 font-medium text-4E7DD9 hover:underline">
            Transaction List
          </a>
        </Link>
      </div>
      <Grid className="mt-14 mb-24">
        {availableCovers.map((c) => {
          return (
            <Link href={`/my-liquidity/${c.key}`} key={c.name}>
              <a className="rounded-3xl focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-4E7DD9">
                <CoverCard details={c}></CoverCard>
              </a>
            </Link>
          );
        })}
      </Grid>
    </Container>
  );
};
