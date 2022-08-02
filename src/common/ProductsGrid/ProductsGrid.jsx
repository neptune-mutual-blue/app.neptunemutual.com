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
import { safeFormatBytes32String } from "@/utils/formatter/bytes32String";
import { toStringSafe } from "@/utils/string";
import { useSortableStats } from "@/src/context/SortableStatsContext";
import { useRouter } from "next/router";
import { ProductCardWrapper } from "@/common/Cover/ProductCardWrapper";
import { useCoverOrProductData } from "@/src/hooks/useCoverOrProductData";
import LeftArrow from "@/icons/LeftArrow";

/**
 *
 *
 * @type {Object.<string, {selector:(any) => any, datatype: any, ascending?: boolean }>}
 */
const sorterData = {
  [SORT_TYPES.ALPHABETIC]: {
    selector: (cover) => cover.infoObj.productName,
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

export const ProductsGrid = () => {
  const { getStatsByKey } = useSortableStats();

  const [sortType, setSortType] = useState({ name: SORT_TYPES.ALPHABETIC });
  const [showCount, setShowCount] = useState(CARDS_PER_PAGE);

  const router = useRouter();
  const { cover_id } = router.query;
  const coverKey = safeFormatBytes32String(cover_id);

  const productKey = safeFormatBytes32String("");
  const coverInfo = useCoverOrProductData({ coverKey, productKey });

  const { searchValue, setSearchValue, filtered } = useSearchResults({
    list: (coverInfo?.products || []).map((cover) => ({
      ...cover,
      ...getStatsByKey(cover.productKey),
    })),
    filter: (item, term) => {
      return (
        toStringSafe(item.infoObj.productName).indexOf(toStringSafe(term)) > -1
      );
    },
  });

  const sortedProducts = useMemo(
    () =>
      sorter({
        ...sorterData[sortType.name],
        list: filtered,
      }),

    [filtered, sortType.name]
  );

  const isLastPage =
    sortedProducts.length === 0 || sortedProducts.length <= showCount;

  const searchHandler = (ev) => {
    setSearchValue(ev.target.value);
  };

  const handleShowMore = () => {
    setShowCount((val) => val + CARDS_PER_PAGE);
  };

  if (!coverInfo) {
    null;
  }

  return (
    <Container className="py-16" data-testid="available-covers-container">
      <div className="flex flex-wrap items-center justify-between gap-6 md:flex-nowrap">
        <div className="flex items-center">
          <button
            onClick={router.back}
            className={
              "flex group items-center rounded-big bg-9B9B9B/30 px-4 py-2 mr-4"
            }
          >
            <LeftArrow />
            <Trans>Back</Trans>
          </button>
          <h1 className="font-bold text-h3 lg:text-h2 font-sora">
            {coverInfo?.infoObj?.coverName}
          </h1>
        </div>

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
      <Content
        data={sortedProducts.slice(0, showCount)}
        hasMore={!isLastPage}
        handleShowMore={handleShowMore}
      />
    </Container>
  );
};

/**
 *
 * @param {{
 * data: any[];
 * loading?: boolean;
 * hasMore: boolean;
 * handleShowMore: function;
 * }} ContentProps
 */
function Content({
  data,
  loading = false,
  hasMore = false,
  handleShowMore = () => {},
}) {
  if (data.length) {
    return (
      <>
        <Grid className="gap-4 mt-14 lg:mb-24 mb-14">
          {data.map(({ id, coverKey, productKey }) => {
            return (
              <ProductCardWrapper
                key={id}
                coverKey={coverKey}
                productKey={productKey}
              />
            );
          })}
        </Grid>
        {!loading && hasMore && (
          <NeutralButton
            className={"rounded-lg border-0.5"}
            onClick={handleShowMore}
            data-testid="show-more-button"
          >
            <Trans>Show More</Trans>
          </NeutralButton>
        )}
      </>
    );
  }

  if (loading) {
    return (
      <Grid className="mb-24 mt-14" data-testid="loading-grid">
        <CardSkeleton numberOfCards={data.length || CARDS_PER_PAGE} />
      </Grid>
    );
  }

  return <p data-testid="no-data">No data found</p>;
}
