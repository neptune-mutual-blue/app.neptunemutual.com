import Link from "next/link";

import { Container } from "@/components/UI/atoms/container";
import { Grid } from "@/components/UI/atoms/grid";

import { CoverCard } from "@/components/UI/organisms/cover/card";
import { useAvailableCovers } from "@/components/pages/home/useAvailableCovers";
import React from "react";

import { HomeCard } from "@/components/UI/molecules/home-card";
import { HomeMainCard } from "@/components/UI/molecules/home-card/main";
import { SearchAndSortBar } from "@/components/UI/molecules/pools/search-and-sort";
import IncreaseIcon from "@/icons/increase";

export const HomePage = () => {
  const { availableCovers } = useAvailableCovers();

  if (!availableCovers) {
    return <>loading...</>;
  }

  return (
    <main>
      <div
        className="py-10 md:py-16 md:px-10 lg:py-28"
        style={{
          backgroundImage: "url(/gradient.png)",
          backgroundSize: "cover",
          backgroundPosition: "left",
        }}
      >
        <Container>
          <div className="flex flex-wrap flex-col-reverse md:flex-col-reverse lg:flex-row lg:flex-nowrap">
            <div className="pt-16 lg:pr-16 md:w-full lg:w-auto lg:pt-0">
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
              <div className="mb-8 flex md:justify-center lg:justify-start">
                <HomeMainCard />
              </div>
            </div>

            <div>
              <div className="pt-6 pb-10">
                <h3 className="text-h3 text-4E7DD9 pl-5">Total Liquidity</h3>
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
              <div>
                <img src="/home/home-chart.png" alt="home chart" />
              </div>
            </div>
          </div>
        </Container>
      </div>

      <div className="py-16 bg-F1F3F6 border-t-2 border-t-B0C4DB">
        <Container>
          <div className="flex justify-between">
            <h1 className="text-h2 font-sora font-bold">Available Covers</h1>
            <SearchAndSortBar />
          </div>
          <Grid className="mt-14 mb-24">
            {availableCovers.map((c) => {
              console.log(availableCovers, `availableCovers`);
              return (
                <Link href={`/cover/${c.key}`} key={c.name}>
                  <a className="rounded-3xl focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-black focus:outline-none">
                    <CoverCard details={c}></CoverCard>
                  </a>
                </Link>
              );
            })}
          </Grid>
        </Container>
      </div>
    </main>
  );
};
