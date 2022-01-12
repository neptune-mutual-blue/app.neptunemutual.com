import Link from "next/link";

import { Container } from "@/components/UI/atoms/container";
import { Grid } from "@/components/UI/atoms/grid";

import { CoverCard } from "@/components/UI/organisms/cover/card";
import { useAvailableCovers } from "@/components/pages/home/useAvailableCovers";
import React from "react";

import { HomeCard } from "@/components/UI/molecules/home-card";
import { HomeMainCard } from "@/components/UI/molecules/home-card/main";
import { SearchAndSortBar } from "@/components/UI/molecules/search-and-sort";
import IncreaseIcon from "@/icons/increase";
import { Hero } from "@/components/UI/molecules/Hero";
import { NeutralButton } from "@/components/UI/atoms/button/neutral-button";
import { TotalLiquidityChart } from "@/components/UI/molecules/TotalLiquidityChart";

export const HomePage = () => {
  const { availableCovers } = useAvailableCovers();

  if (!availableCovers) {
    return <>loading...</>;
  }

  return (
    <>
      <Hero>
        <Container className="py-10 md:py-16 md:px-10 lg:py-28 justify-between flex flex-wrap flex-col-reverse md:flex-col-reverse lg:flex-row lg:flex-nowrap">
          <div className="pt-16 lg:mr-18 md:w-full lg:w-auto lg:pt-0">
            <div className="mb-8 flex md:justify-center lg:justify-start">
              <HomeCard
                items={[
                  { name: "TVL (Cover)", amount: "$ 120M" },
                  { name: "TVL (Pool)", amount: "$ 100M" },
                ]}
              />
            </div>
            <div className="mb-8 flex md:justify-center lg:justify-start">
              <HomeCard
                items={[
                  { name: "Covered", amount: "$ 12.5M" },
                  { name: "Cover Fee", amount: "$ 200K" },
                ]}
              />
            </div>
            <div className="flex md:justify-center lg:justify-start">
              <HomeMainCard />
            </div>
          </div>

          <div className="flex-1 flex flex-col">
            <div className="pt-6 mb-8">
              <h3 className="text-h3 font-sora text-4e7dd9 mb-1">
                Total Liquidity
              </h3>
              <div className="flex items-center">
                <h2 className="text-h2 text-black font-sora font-bold pr-3">
                  $ 250.32M
                </h2>
                <h6 className="text-h6 text-21AD8C font-sora font-bold flex items-center">
                  <span className="pr-1">
                    <span className="sr-only">Growth</span>
                    <IncreaseIcon width={19} />
                  </span>
                  <span>15.32%</span>
                </h6>
              </div>
            </div>
            <div className="flex-1">
              <TotalLiquidityChart />
            </div>
          </div>
        </Container>
        <hr className="border-b border-B0C4DB" />
      </Hero>

      <Container className="py-16">
        <div className="flex justify-between flex-wrap gap-6">
          <h1 className="text-h2 font-sora font-bold">Available Covers</h1>
          <SearchAndSortBar />
        </div>
        <Grid className="mt-14 mb-24">
          {availableCovers.map((c) => {
            return (
              <Link href={`/cover/${c.key}`} key={c.name}>
                <a className="rounded-3xl focus:outline-none focus-visible:ring-2 focus-visible:ring-4e7dd9">
                  <CoverCard details={c}></CoverCard>
                </a>
              </Link>
            );
          })}
        </Grid>
        <NeutralButton className={"rounded-lg"}>Show More</NeutralButton>
      </Container>
    </>
  );
};
