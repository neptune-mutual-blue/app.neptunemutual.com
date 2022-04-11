import React, { useEffect, useState } from "react";
import Link from "next/link";

import { Container } from "@/components/UI/atoms/container";
import { Grid } from "@/components/UI/atoms/grid";
import { CoverCard } from "@/components/UI/organisms/cover/card";
import { HomeCard } from "@/components/UI/molecules/home-card";
import { HomeMainCard } from "@/components/UI/molecules/home-card/main";
import { SearchAndSortBar } from "@/components/UI/molecules/search-and-sort";
import IncreaseIcon from "@/icons/IncreaseIcon";
import { Hero } from "@/components/UI/molecules/Hero";
import { NeutralButton } from "@/components/UI/atoms/button/neutral-button";
import { TotalLiquidityChart } from "@/components/UI/molecules/TotalLiquidityChart";
import { getParsedKey } from "@/src/helpers/cover";
import { useCovers } from "@/src/context/Covers";
import { useFetchHeroStats } from "@/src/hooks/useFetchHeroStats";
import { formatCurrency } from "@/utils/formatter/currency";
import { convertFromUnits, toBN } from "@/utils/bn";
import { useProtocolDayData } from "@/src/hooks/useProtocolDayData";
import { classNames } from "@/utils/classnames";
import { useAppConstants } from "@/src/context/AppConstants";
import { useSearchResults } from "@/src/hooks/useSearchResults";
import { formatPercent } from "@/utils/formatter/percent";
import { COVERS_PER_PAGE } from "@/src/config/constants";
import { sortData } from "@/utils/sorting";

export const HomePage = () => {
  const { covers: availableCovers, loading } = useCovers();
  const { data: heroData } = useFetchHeroStats();
  const { poolsTvl } = useAppConstants();

  const [changeData, setChangeData] = useState(null);
  const { data } = useProtocolDayData();

  const [sortType, setSortType] = useState({ name: "A-Z" });
  const [showCount, setShowCount] = useState(COVERS_PER_PAGE);

  useEffect(() => {
    if (data && data.length >= 2) {
      const lastSecond = toBN(data[data.length - 2].totalLiquidity);
      const last = toBN(data[data.length - 1].totalLiquidity);

      const diff =
        lastSecond.isGreaterThan(0) &&
        last.minus(lastSecond).dividedBy(lastSecond);
      setChangeData({
        last: last.toString(),
        diff: diff && diff.absoluteValue().toString(),
        rise: diff && diff.isGreaterThanOrEqualTo(0),
      });
    } else if (data && data.length == 1) {
      setChangeData({
        last: toBN(data[0].totalLiquidity).toString(),
        diff: null,
        rise: false,
      });
    }
  }, [data]);

  const { searchValue, setSearchValue, filtered } = useSearchResults({
    list: availableCovers,
    filter: (item, term) => {
      return item.projectName.toLowerCase().indexOf(term.toLowerCase()) > -1;
    },
  });

  const searchHandler = (ev) => {
    setSearchValue(ev.target.value);
  };

  const handleShowMore = () => {
    setShowCount((val) => val + COVERS_PER_PAGE);
  };

  return (
    <>
      <Hero>
        <Container className="flex flex-col-reverse flex-wrap justify-between py-10 md:py-16 md:px-10 lg:py-28 md:flex-col-reverse lg:flex-row lg:flex-nowrap">
          <div className="pt-10 md:flex md:gap-4 lg:block lg:mr-18 md:w-full lg:w-auto lg:pt-0">
            <div className="flex-1">
              <div className="flex mb-2 md:mb-0 lg:mb-8 md:justify-center lg:justify-start">
                <HomeCard
                  items={[
                    {
                      name: "TVL (Cover)",
                      amount: formatCurrency(
                        convertFromUnits(heroData.tvlCover).toString()
                      ).short,
                    },
                    {
                      name: "TVL (Pool)",
                      amount: formatCurrency(
                        convertFromUnits(poolsTvl).toString()
                      ).short,
                    },
                  ]}
                  className="md:border-0.5 md:border-B0C4DB md:rounded-tl-xl md:rounded-tr-xl"
                />
              </div>
              <div className="flex mb-2 md:mb-0 lg:mb-8 md:justify-center lg:justify-start">
                <HomeCard
                  items={[
                    {
                      name: "Covered",
                      amount: formatCurrency(
                        convertFromUnits(heroData.covered).toString()
                      ).short,
                    },
                    {
                      name: "Cover Fee",
                      amount: formatCurrency(
                        convertFromUnits(heroData.coverFee).toString()
                      ).short,
                    },
                  ]}
                  className="md:border-0.5 md:border-t-0 md:border-B0C4DB md:border-t-transparent md:rounded-bl-xl md:rounded-br-xl"
                />
              </div>
            </div>
            <div className="flex flex-1 md:justify-center lg:justify-start">
              <HomeMainCard heroData={heroData} />
            </div>
          </div>

          <div className="flex flex-col flex-1">
            <div className="pt-6 mb-8">
              <h3 className="mb-1 text-h3 font-sora text-4e7dd9">
                Total Liquidity
              </h3>
              <div className="flex items-center">
                <h2 className="pr-3 font-bold text-black text-h2 font-sora">
                  {
                    formatCurrency(
                      convertFromUnits(changeData?.last || "0").toString()
                    ).short
                  }
                </h2>
                {changeData && changeData.diff && (
                  <h6
                    className={classNames(
                      "text-h6 font-sora font-bold flex items-center",
                      changeData.rise ? "text-21AD8C" : "text-DC2121"
                    )}
                  >
                    <span className="pr-1">
                      <span className="sr-only">Growth</span>
                      <IncreaseIcon
                        width={19}
                        className={changeData.rise ? "" : "transform-flip"}
                      />
                    </span>
                    <span>{formatPercent(changeData.diff)}</span>
                  </h6>
                )}
              </div>
            </div>
            <div className="flex-1 min-h-360">
              <TotalLiquidityChart />
            </div>
          </div>
        </Container>
        <hr className="border-b border-B0C4DB" />
      </Hero>

      <Container className="py-16">
        <div className="flex flex-wrap items-center justify-between gap-6 md:flex-nowrap">
          <h1 className="font-bold text-h3 lg:text-h2 font-sora">
            Available Covers
          </h1>
          <SearchAndSortBar
            searchValue={searchValue}
            onSearchChange={searchHandler}
            sortClass="w-full md:w-48 lg:w-64 rounded-lg"
            containerClass="flex-col md:flex-row min-w-full md:min-w-sm"
            searchClass="w-full md:w-64 rounded-lg"
            sortType={sortType}
            setSortType={setSortType}
          />
        </div>
        <Grid className="gap-4 mt-14 lg:mb-24 mb-14">
          {loading && <>loading...</>}
          {!loading && availableCovers.length === 0 && <>No data found</>}
          {sortData(filtered, sortType.name).map((c, idx) => {
            if (idx > showCount - 1) return;
            return (
              <Link href={`/cover/${getParsedKey(c.key)}/options`} key={c.key}>
                <a className="rounded-3xl focus:outline-none focus-visible:ring-2 focus-visible:ring-4e7dd9">
                  <CoverCard details={c}></CoverCard>
                </a>
              </Link>
            );
          })}
        </Grid>
        {sortData(filtered, sortType.name).length > showCount && (
          <NeutralButton
            className={"rounded-lg border-0.5"}
            onClick={handleShowMore}
          >
            Show More
          </NeutralButton>
        )}
      </Container>
    </>
  );
};
