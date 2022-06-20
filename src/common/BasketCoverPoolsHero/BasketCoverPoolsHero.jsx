import { SearchAndSortBar } from "@/common/SearchAndSortBar";
import { Trans, t } from "@lingui/macro";
import React, { useState } from "react";
import { HomeCard } from "@/common/HomeCard/HomeCard";
import { HomeMainCard } from "@/common/HomeCard/HomeMainCard";
import { useFetchHeroStats } from "@/src/hooks/useFetchHeroStats";
import { formatCurrency } from "@/utils/formatter/currency";
import { convertFromUnits } from "@/utils/bn";
import { useAppConstants } from "@/src/context/AppConstants";
import { useRouter } from "next/router";
import { useSearchResults } from "@/src/hooks/useSearchResults";
import { SORT_TYPES } from "@/utils/sorting";
import { toStringSafe } from "@/utils/string";
import { useSortableStats } from "@/src/context/SortableStatsContext";
import { useCovers } from "@/src/context/Covers";

const GridComponent = ({ children }) => (
  <div className="flex items-center border-AABDCB/50 font-sora">{children}</div>
);

export const BasketCoverPoolsHero = () => {
  const { data: heroData } = useFetchHeroStats();
  const { poolsTvl, liquidityTokenDecimals } = useAppConstants();
  const router = useRouter();

  const {
    covers: availableCovers,
    //  loading
  } = useCovers();
  const { getStatsByKey } = useSortableStats();

  const [sortType, setSortType] = useState({ name: SORT_TYPES.ALPHABETIC });

  const {
    searchValue,
    setSearchValue,
    // filtered
  } = useSearchResults({
    list: availableCovers.map((cover) => ({
      ...cover,
      ...getStatsByKey(cover.key),
    })),
    filter: (item, term) => {
      return toStringSafe(item.projectName).indexOf(toStringSafe(term)) > -1;
    },
  });

  // const sortedCovers = useMemo(
  //   () =>
  //     sorter({
  //       ...sorterData[sortType.name],
  //       list: filtered,
  //     }),

  //   [filtered, sortType.name]
  // );

  const searchHandler = (ev) => {
    setSearchValue(ev.target.value);
  };

  const homeCardClassName = "bg-transparent border-none !shadow-0 !h-fit";

  return (
    <div className="border-b bg-EEF4FF border-B0C4DB">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 md:px-8">
        <div className="grid items-stretch grid-cols-1 py-10 divide-x md:grid-cols-3">
          <GridComponent>
            <HomeCard
              className={homeCardClassName}
              showDivider={false}
              items={[
                {
                  name: t`TVL (Cover)`,
                  amount: formatCurrency(
                    convertFromUnits(
                      heroData.tvlCover,
                      liquidityTokenDecimals
                    ).toString(),
                    router.locale
                  ).short,
                },
                {
                  name: t`TVL (Pool)`,
                  amount: formatCurrency(
                    convertFromUnits(
                      poolsTvl,
                      liquidityTokenDecimals
                    ).toString(),
                    router.locale
                  ).short,
                },
              ]}
            />
          </GridComponent>
          <GridComponent>
            <HomeCard
              className={homeCardClassName}
              showDivider={false}
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
            />
          </GridComponent>
          <GridComponent>
            <HomeMainCard className={homeCardClassName} heroData={heroData} />
          </GridComponent>
        </div>
        <div className="border-t py-14 border-AABDCB/50">
          <div className="flex flex-wrap items-center justify-between gap-6 md:flex-nowrap">
            <h1 className="font-bold text-h3 lg:text-h2 font-sora">
              <Trans>Basket Cover Pools</Trans>
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
        </div>
      </div>
    </div>
  );
};
