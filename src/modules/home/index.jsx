import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";

import { Container } from "@/common/Container/Container";
import { Grid } from "@/common/Grid/Grid";
import { CoverCard } from "@/common/Cover/CoverCard";
import { HomeCard } from "@/common/HomeCard/HomeCard";
import { HomeMainCard } from "@/common/HomeCard/HomeMainCard";
import { SearchAndSortBar } from "@/common/SearchAndSortBar";
import IncreaseIcon from "@/icons/IncreaseIcon";
import { Hero } from "@/common/Hero";
import { NeutralButton } from "@/common/Button/NeutralButton";
import { TotalLiquidityChart } from "@/common/TotalLiquidityChart";
import { safeParseBytes32String } from "@/src/helpers/cover";
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
import { getProperty, sortList, SORT_TYPES } from "@/utils/sorting";
import { CardSkeleton } from "@/common/Skeleton/CardSkeleton";
import { t, Trans } from "@lingui/macro";
import { useRouter } from "next/router";

export const HomePage = () => {
  const { covers: availableCovers, loading } = useCovers();
  const { data: heroData } = useFetchHeroStats();
  const { poolsTvl } = useAppConstants();
  const router = useRouter();

  const [changeData, setChangeData] = useState(null);
  const { data } = useProtocolDayData();

  const [sortType, setSortType] = useState({ name: SORT_TYPES.AtoZ });
  const [showCount, setShowCount] = useState(COVERS_PER_PAGE);

  const { searchValue, setSearchValue, filtered } = useSearchResults({
    list: availableCovers,
    filter: (item, term) =>
      item.projectName.toLowerCase().includes(term.toLowerCase()),
  });

  const sortedCovers = useMemo(
    () => sortList(filtered, getSortCallback(sortType.name), sortType.name),
    [filtered, sortType.name]
  );

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
                      name: t`TVL (Cover)`,
                      amount: formatCurrency(
                        convertFromUnits(heroData.tvlCover).toString(),
                        router.locale
                      ).short,
                    },
                    {
                      name: t`TVL (Pool)`,
                      amount: formatCurrency(
                        convertFromUnits(poolsTvl).toString(),
                        router.locale
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
                      name: t`Covered`,
                      amount: formatCurrency(
                        convertFromUnits(heroData.covered).toString(),
                        router.locale
                      ).short,
                    },
                    {
                      name: t`Cover Fee`,
                      amount: formatCurrency(
                        convertFromUnits(heroData.coverFee).toString(),
                        router.locale
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
                <Trans>Total Liquidity</Trans>
              </h3>
              <div className="flex items-center">
                <h2 className="pr-3 font-bold text-black text-h2 font-sora">
                  {
                    formatCurrency(
                      convertFromUnits(changeData?.last || "0").toString(),
                      router.locale
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
                    <span>{formatPercent(changeData.diff, router.locale)}</span>
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
            <Trans>Available Covers</Trans>
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
          {loading && <CardSkeleton numberOfCards={COVERS_PER_PAGE} />}
          {!loading && availableCovers.length === 0 && <>No data found</>}
          {sortedCovers.map((c, idx) => {
            if (idx > showCount - 1) return;
            return (
              <Link
                href={`/cover/${safeParseBytes32String(c.key)}/options`}
                key={c.key}
              >
                <a className="rounded-3xl focus:outline-none focus-visible:ring-2 focus-visible:ring-4e7dd9">
                  <CoverCard details={c} />
                </a>
              </Link>
            );
          })}
        </Grid>
        {sortedCovers.length > showCount && (
          <NeutralButton
            className={"rounded-lg border-0.5"}
            onClick={handleShowMore}
          >
            <Trans>Show More</Trans>
          </NeutralButton>
        )}
      </Container>
    </>
  );
};

const SORT_CALLBACK = {
  [SORT_TYPES.AtoZ]: (cover) => cover.projectName,
  [SORT_TYPES.Liquidity]: (cover) => {
    const liquidity = getProperty(cover, "liquidity", "0");

    return toBN(liquidity);
  },
  [SORT_TYPES.Utilization]: (cover) => {
    const utilization = getProperty(cover, "utilization", "0");

    return Number(utilization);
  },
};

const getSortCallback = (sortTypeName) =>
  getProperty(SORT_CALLBACK, sortTypeName, SORT_CALLBACK[SORT_TYPES.AtoZ]);
