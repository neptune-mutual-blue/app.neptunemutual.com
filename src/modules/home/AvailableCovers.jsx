import React, { useMemo, useState } from "react";

import { Container } from "@/common/Container/Container";
import { Grid } from "@/common/Grid/Grid";
import { SearchAndSortBar } from "@/common/SearchAndSortBar";
import { NeutralButton } from "@/common/Button/NeutralButton";
import { useSearchResults } from "@/src/hooks/useSearchResults";
import { CARDS_PER_PAGE } from "@/src/config/constants";
import { SORT_TYPES, SORT_DATA_TYPES, sorter } from "@/utils/sorting";
import { CardSkeleton } from "@/common/Skeleton/CardSkeleton";
import { Trans, t } from "@lingui/macro";
import { toStringSafe } from "@/utils/string";
import { useSortableStats } from "@/src/context/SortableStatsContext";
import { CoverCardWrapper } from "@/common/Cover/CoverCardWrapper";
import { useFlattenedCoverProducts } from "@/src/hooks/useFlattenedCoverProducts";
import { ProductCardWrapper } from "@/common/Cover/ProductCardWrapper";
import { useCovers } from "@/src/hooks/useCovers";
import { isValidProduct } from "@/src/helpers/cover";
import { utils } from "@neptunemutual/sdk";
import { SelectListBar } from "@/common/SelectListBar/SelectListBar";
import { classNames } from "@/utils/classnames";

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
  const [coverView, setCoverView] = useState({
    name: t`All`,
    value: SORT_TYPES.ALL,
  });
  const { data: groupCovers, loading: groupCoversLoading } = useCovers({
    supportsProducts:
      coverView.value === SORT_TYPES.DIVERSIFIED_POOL ? true : false,
  });
  const { data: flattenedCovers, loading: flattenedCoversLoading } =
    useFlattenedCoverProducts();
  const { getStatsByKey } = useSortableStats();
  const [sortType, setSortType] = useState({
    name: t`A-Z`,
    value: SORT_TYPES.ALL,
  });
  const [showCount, setShowCount] = useState(CARDS_PER_PAGE);
  const [toggleInputWidth, setToggleInputWidth] = useState(false);

  const coversLoading =
    coverView.value === SORT_TYPES.ALL
      ? flattenedCoversLoading
      : groupCoversLoading;
  const availableCovers =
    coverView.value === SORT_TYPES.ALL ? flattenedCovers : groupCovers;

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
        ...sorterData[sortType.value],
        list: filtered,
      }),

    [filtered, sortType.value]
  );

  const searchHandler = (ev) => {
    setSearchValue(ev.target.value);
  };

  const searchOnFocusHandler = () => {
    setToggleInputWidth(true);
  };

  const searchOnBlurHandler = () => {
    setToggleInputWidth(false);
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
            searchOnFocus={searchOnFocusHandler}
            searchOnBlur={searchOnBlurHandler}
            sortClass="w-auto mb-4 md:mb-0"
            containerClass="flex-col md:flex-row min-w-full md:min-w-sm"
            searchClass={classNames(
              "w-full rounded-lg",
              toggleInputWidth && "xl:w-96"
            )}
            sortType={sortType}
            setSortType={setSortType}
          />
          <SelectListBar
            sortClassContainer="w-full md:w-auto md:ml-2"
            prefix={t`View:` + " "}
            sortClass="w-auto"
            sortType={coverView}
            setSortType={setCoverView}
          />
        </div>
      </div>
      <Grid className="gap-4 mt-14 lg:mb-24 mb-14" data-testid="body">
        {coversLoading && <CardSkeleton numberOfCards={CARDS_PER_PAGE} />}
        {!coversLoading && availableCovers.length === 0 && (
          <p data-testid="no-data">No data found</p>
        )}
        {sortedCovers.map((c, idx) => {
          if (idx > showCount - 1) return;

          if (
            coverView.value === SORT_TYPES.ALL &&
            isValidProduct(c.productKey)
          ) {
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
          className={
            "rounded-lg border-0 bg-E6EAEF !text-black font-poppins leading-5 !p-4"
          }
          onClick={handleShowMore}
          data-testid="show-more-button"
        >
          <Trans>Show More</Trans>
        </NeutralButton>
      )}
    </Container>
  );
};
