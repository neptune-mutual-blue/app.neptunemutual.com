import React, { useMemo, useState } from "react";

import { Container } from "@/common/Container/Container";
import { Grid } from "@/common/Grid/Grid";
import { SearchAndSortBar } from "@/common/SearchAndSortBar";
import { NeutralButton } from "@/common/Button/NeutralButton";
import { useSearchResults } from "@/src/hooks/useSearchResults";
import { CARDS_PER_PAGE } from "@/src/config/constants";
import { SORT_TYPES, SORT_DATA_TYPES, sorter } from "@/utils/sorting";
import { CardSkeleton } from "@/common/Skeleton/CardSkeleton";
import { Trans } from "@lingui/macro";
import { toStringSafe } from "@/utils/string";
import { useSortableStats } from "@/src/context/SortableStatsContext";
import { CoverCardWrapper } from "@/common/Cover/CoverCardWrapper";
import { LayoutButtons } from "@/common/LayoutButtons/LayoutButtons";
import { useFlattenedCoverProducts } from "@/src/hooks/useFlattenedCoverProducts";
import { ProductCardWrapper } from "@/common/Cover/ProductCardWrapper";
import { useCovers } from "@/src/hooks/useCovers";
import { isValidProduct } from "@/src/helpers/cover";
import { utils } from "@neptunemutual/sdk";

/**
 * @type {Object.<string, {selector:(any) => any, datatype: any, ascending?: boolean }>}
 */
const sorterData = {
  [SORT_TYPES.ALPHABETIC]: {
    selector: (cover) => cover.infoObj?.productName || cover.infoObj?.coverName,
    datatype: SORT_DATA_TYPES.STRING,
  },
  [SORT_TYPES.LIQUIDITY]: {
    selector: (cover) => cover.liquidity,
    datatype: SORT_DATA_TYPES.BIGNUMBER,
  },
  [SORT_TYPES.UTILIZATION_RATIO]: {
    selector: (cover) => cover.utilization,
    datatype: SORT_DATA_TYPES.BIGNUMBER,
  },
};

export const AvailableCovers = () => {
  const { data: groupCovers, loading: groupCoversLoading } = useCovers();
  const { data: flattenedCovers, loading: flattenedCoversLoading } =
    useFlattenedCoverProducts();
  const { getStatsByKey } = useSortableStats();

  const [sortType, setSortType] = useState({ name: SORT_TYPES.ALPHABETIC });
  const [showCount, setShowCount] = useState(CARDS_PER_PAGE);
  const [coverView, setCoverView] = useState("products");

  const coversLoading =
    coverView == "products" ? flattenedCoversLoading : groupCoversLoading;
  const availableCovers =
    coverView == "products" ? flattenedCovers : groupCovers;

  const { searchValue, setSearchValue, filtered } = useSearchResults({
    list: availableCovers.map((cover) => {
      const _productKey =
        cover?.productKey &&
        cover.productKey !== utils.keyUtil.toBytes32("").substring(0, 10)
          ? cover.productKey
          : null;
      const id = _productKey ? cover.productKey : cover?.coverKey;
      const stats = getStatsByKey(id);

      return {
        ...cover,
        ...stats,
      };
    }),
    filter: (item, term) => {
      return (
        toStringSafe(
          item.infoObj?.productName || item.infoObj?.coverName
        ).indexOf(toStringSafe(term)) > -1
      );
    },
  });

  const sortedCovers = useMemo(
    () =>
      sorter({
        ...sorterData[sortType.name],
        list: filtered,
      }),

    [filtered, sortType.name]
  );

  const searchHandler = (ev) => {
    setSearchValue(ev.target.value);
  };

  const handleShowMore = () => {
    setShowCount((val) => val + CARDS_PER_PAGE);
  };

  return (
    <Container className="py-16" data-testid="available-covers-container">
      <div className="flex flex-wrap items-center justify-between gap-6 md:flex-nowrap">
        <h1 className="font-bold text-h3 lg:text-h2 font-sora">
          <Trans>Cover Products</Trans>
        </h1>
        <div className="flex flex-wrap items-center justify-center w-full sm:flex-nowrap sm:w-auto">
          <SearchAndSortBar
            searchValue={searchValue}
            onSearchChange={searchHandler}
            sortClass="w-full md:w-48 lg:w-64 rounded-lg"
            containerClass="flex-col md:flex-row min-w-full md:min-w-sm"
            searchClass="w-full md:w-64 rounded-lg"
            sortType={sortType}
            setSortType={setSortType}
          />
          <LayoutButtons coverView={coverView} setCoverView={setCoverView} />
        </div>
      </div>
      <Grid className="gap-4 mt-14 lg:mb-24 mb-14">
        {coversLoading && <CardSkeleton numberOfCards={CARDS_PER_PAGE} />}
        {!coversLoading && availableCovers.length === 0 && (
          <p data-testid="no-data">No data found</p>
        )}
        {sortedCovers.map((c, idx) => {
          if (idx > showCount - 1) return;

          if (coverView == "products" && isValidProduct(c.productKey)) {
            return (
              <ProductCardWrapper
                key={c.id}
                coverKey={c.coverKey}
                productKey={c.productKey}
              />
            );
          }

          return <CoverCardWrapper key={c.id} coverKey={c.coverKey} />;
        })}
      </Grid>
      {sortedCovers.length > showCount && (
        <NeutralButton
          className={"rounded-lg border-0.5"}
          onClick={handleShowMore}
          data-testid="show-more-button"
        >
          <Trans>Show More</Trans>
        </NeutralButton>
      )}
    </Container>
  );
};
