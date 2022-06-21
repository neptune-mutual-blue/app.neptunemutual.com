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
import { useFetchBasketProducts } from "@/src/hooks/useFetchBasketProducts.js";

/**
 *
 * @typedef {import('@/src/services/contracts/getBasketProducts').IProduct} IProduct
 *
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

export const ProductsGrid = () => {
  const { getStatsByKey } = useSortableStats();

  const [sortType, setSortType] = useState({ name: SORT_TYPES.ALPHABETIC });
  const [showCount, setShowCount] = useState(CARDS_PER_PAGE);

  const router = useRouter();
  const { cover_id } = router.query;
  const coverKey = safeFormatBytes32String(cover_id);

  const { products, loading } = useFetchBasketProducts(coverKey);

  const { searchValue, setSearchValue, filtered } = useSearchResults({
    list: products.map((cover) => ({
      ...cover,
      ...getStatsByKey(cover.coverKey),
    })),
    filter: (item, term) => {
      return (
        toStringSafe(item.ipfsData.productName).indexOf(toStringSafe(term)) > -1
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
          <Trans>Available Products</Trans>
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
      <Content
        data={sortedProducts.slice(0, showCount)}
        loading={loading}
        hasMore={false}
        handleShowMore={handleShowMore}
      />
    </Container>
  );
};

/**
 *
 * @param {{
 * data: IProduct[];
 * loading: boolean;
 * hasMore: boolean;
 * handleShowMore: function;
 * }} ContentProps
 */
function Content({ data, loading, hasMore, handleShowMore }) {
  if (data.length) {
    return (
      <>
        <Grid className="gap-4 mt-14 lg:mb-24 mb-14">
          {data.map(({ id, coverKey, productKey, ipfsData }) => {
            const product_id = safeParseBytes32String(productKey);
            const cover_id = safeParseBytes32String(coverKey);
            const details = {
              id,
              projectName: ipfsData.productName,
              coverKey: coverKey,
              productKey: productKey,
              pricingFloor: 0,
              pricingCeiling: 0,
            };
            return (
              <Link href={`/covers/${cover_id}/${product_id}/options`} key={id}>
                <a
                  className="rounded-3xl focus:outline-none focus-visible:ring-2 focus-visible:ring-4e7dd9"
                  data-testid="cover-link"
                >
                  <CoverCard
                    details={details}
                    progressFgColor="bg-4e7dd9"
                    progressBgColor="bg-4e7dd9/10"
                  />
                </a>
              </Link>
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
