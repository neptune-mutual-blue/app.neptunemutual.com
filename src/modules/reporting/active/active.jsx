import { useMemo, useState } from "react";
import { NeutralButton } from "@/common/Button/NeutralButton";
import { Container } from "@/common/Container/Container";
import { Grid } from "@/common/Grid/Grid";
import { SearchAndSortBar } from "@/common/SearchAndSortBar";
import { ActiveReportingCard } from "@/src/modules/reporting/active/ActiveReportingCard";
import { ActiveReportingEmptyState } from "@/src/modules/reporting/active/ActiveReportingEmptyState";
import { useActiveReportings } from "@/src/hooks/useActiveReportings";
import Link from "next/link";
import { useSearchResults } from "@/src/hooks/useSearchResults";
import { sorter, SORT_DATA_TYPES, SORT_TYPES } from "@/utils/sorting";
import { CardSkeleton } from "@/common/Skeleton/CardSkeleton";
import { CARDS_PER_PAGE } from "@/src/config/constants";
import { t, Trans } from "@lingui/macro";
import { useRouter } from "next/router";
import { safeParseBytes32String } from "@/utils/formatter/bytes32String";
import { toStringSafe } from "@/utils/string";
import { useSortableStats } from "@/src/context/SortableStatsContext";
import { isValidProduct } from "@/src/helpers/cover";

/**
 * @type {Object.<string, {selector:(any) => any, datatype: any, ascending?: boolean }>}
 */
const sorterData = {
  [SORT_TYPES.ALPHABETIC]: {
    selector: (report) => report.info.projectName,
    datatype: SORT_DATA_TYPES.STRING,
  },
  [SORT_TYPES.UTILIZATION_RATIO]: {
    selector: (report) => report.utilization,
    datatype: SORT_DATA_TYPES.BIGNUMBER,
  },
  [SORT_TYPES.INCIDENT_DATE]: {
    selector: (report) => report.incidentDate,
    datatype: SORT_DATA_TYPES.BIGNUMBER,
  },
};

export const ReportingActivePage = () => {
  const {
    data: { incidentReports },
    loading,
    hasMore,
    handleShowMore,
  } = useActiveReportings();

  const [sortType, setSortType] = useState({
    name: t`${SORT_TYPES.INCIDENT_DATE}`,
  });
  const router = useRouter();

  const { getStatsByKey } = useSortableStats();

  const { searchValue, setSearchValue, filtered } = useSearchResults({
    list: incidentReports.map((report) => ({
      ...report,
      ...getStatsByKey(report.id),
    })),
    filter: (cover, term) => {
      return (
        toStringSafe(cover.info.projectName).indexOf(toStringSafe(term)) > -1
      );
    },
  });

  const activeCardInfoArray = useMemo(
    () =>
      sorter({
        ...sorterData[sortType.name],
        list: filtered,
      }),

    [filtered, sortType.name]
  );

  const options = useMemo(() => {
    if (router.locale) {
      return [
        { name: t`${SORT_TYPES.ALPHABETIC}` },
        { name: t`${SORT_TYPES.UTILIZATION_RATIO}` },
        { name: t`${SORT_TYPES.INCIDENT_DATE}` },
      ];
    }

    return [
      { name: SORT_TYPES.ALPHABETIC },
      { name: SORT_TYPES.UTILIZATION_RATIO },
      { name: SORT_TYPES.INCIDENT_DATE },
    ];
  }, [router.locale]);

  return (
    <Container className={"pt-16 pb-36"}>
      <div className="flex sm:justify-end">
        <SearchAndSortBar
          searchValue={searchValue}
          onSearchChange={(event) => {
            setSearchValue(event.target.value);
          }}
          searchAndSortOptions={options}
          sortType={sortType}
          setSortType={setSortType}
          containerClass="flex-col sm:flex-row w-full sm:w-auto"
          searchClass="w-full sm:w-auto"
        />
      </div>

      <Content
        data={activeCardInfoArray}
        loading={loading}
        hasMore={hasMore}
        handleShowMore={handleShowMore}
      />
    </Container>
  );
};

function Content({ data, loading, hasMore, handleShowMore }) {
  if (data.length) {
    return (
      <>
        <Grid className="mb-24 mt-14">
          {data.map((report) => {
            const isDiversified = isValidProduct(report.productKey);

            const cover_id = safeParseBytes32String(report.coverKey);
            const product_id = safeParseBytes32String(report.productKey);

            return (
              <Link
                href={
                  isDiversified
                    ? `/reporting/${cover_id}/product/${product_id}/${report.incidentDate}/details`
                    : `/reporting/${cover_id}/${report.incidentDate}/details`
                }
                key={report.id}
              >
                <a className="rounded-3xl focus:outline-none focus-visible:ring-2 focus-visible:ring-4e7dd9">
                  <ActiveReportingCard
                    id={report.id}
                    coverKey={report.coverKey}
                    productKey={report.productKey}
                    incidentDate={report.incidentDate}
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
          >
            <Trans>Show More</Trans>
          </NeutralButton>
        )}
      </>
    );
  }

  if (loading) {
    return (
      <Grid className="mb-24 mt-14">
        <CardSkeleton numberOfCards={data.length || CARDS_PER_PAGE} />
      </Grid>
    );
  }

  return <ActiveReportingEmptyState />;
}
