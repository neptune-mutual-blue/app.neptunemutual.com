import React, { useMemo, useState } from "react";
import Link from "next/link";

import { Container } from "@/common/Container/Container";
import { Grid } from "@/common/Grid/Grid";
import { CoverCard } from "@/common/Cover/CoverCard";
import { SearchAndSortBar } from "@/common/SearchAndSortBar";
import { NeutralButton } from "@/common/Button/NeutralButton";
import { useSearchResults } from "@/src/hooks/useSearchResults";
import { CARDS_PER_PAGE } from "@/src/config/constants";
import { SORT_TYPES, SORT_DATA_TYPES, sorter } from "@/utils/sorting";
import { CardSkeleton } from "@/common/Skeleton/CardSkeleton";
import { Trans } from "@lingui/macro";
import {
  safeFormatBytes32String,
  safeParseBytes32String,
} from "@/utils/formatter/bytes32String";
import { toStringSafe } from "@/utils/string";
import { useSortableStats } from "@/src/context/SortableStatsContext";
import { useRouter } from "next/router";
import { useQueryCover } from "@/src/hooks/useQueryCover";

/**
 * @type {Object.<string, {selector:(any) => any, datatype: any, ascending?: boolean }>}
 */
const sorterData = {
  [SORT_TYPES.ALPHABETIC]: {
    selector: (cover) => cover.projectName,
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

function getBasePath(array) {
  return array.filter(Boolean).join("/");
}

export const AvailableProducts = () => {
  const { getStatsByKey } = useSortableStats();
  const {
    query: { cover_id = "" },
  } = useRouter();

  const coverKey = safeFormatBytes32String(cover_id);
  const { data, loading } = useQueryCover(coverKey);

  const basePathArray = ["covers", cover_id];
  const [sortType, setSortType] = useState({ name: SORT_TYPES.ALPHABETIC });
  const [showCount, setShowCount] = useState(CARDS_PER_PAGE);

  const { searchValue, setSearchValue, filtered } = useSearchResults({
    list: (data?.products || []).map((product) => ({
      ...product,
      ...getStatsByKey(product.productKey),
    })),
    filter: (item, term) => {
      return (
        toStringSafe(item.ipfsData?.productName).indexOf(toStringSafe(term)) >
        -1
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
          <Trans>{data?.ipfsData?.coverName}</Trans>
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
        {loading && <CardSkeleton numberOfCards={CARDS_PER_PAGE} />}
        {!loading && data?.products?.length === 0 && (
          <p data-testid="no-data">No data found</p>
        )}
        {sortedProducts.map((c, idx) => {
          if (idx > showCount - 1) return;

          const product_Id = safeParseBytes32String(c.ipfsData.productKey);
          const details = {
            id: c.id,
            projectName: c.ipfsData.productName,
            coverKey: c.coverKey,
            productKey: c.ipfsData.productKey,
            pricingFloor: c.ipfsData.pricingFloor,
            pricingCeiling: c.ipfsData.pricingCeiling,
            products: [],
          };

          return (
            <Link
              href={`/${getBasePath(basePathArray)}/${product_Id}/options`}
              key={c.id}
            >
              <a
                className="rounded-3xl focus:outline-none focus-visible:ring-2 focus-visible:ring-4e7dd9"
                data-testid="cover-link"
              >
                <CoverCard details={details} />
              </a>
            </Link>
          );
        })}
      </Grid>
      {sortedProducts.length > showCount && (
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
