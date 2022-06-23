import { useMemo, useState } from "react";
import { NeutralButton } from "@/common/Button/NeutralButton";
import { Container } from "@/common/Container/Container";
import { Grid } from "@/common/Grid/Grid";
import { SearchAndSortBar } from "@/common/SearchAndSortBar";
import { ResolvedReportingCard } from "@/src/modules/reporting/resolved/ResolvedReportingCard";
import { ReportStatus } from "@/src/config/constants";
import { useResolvedReportings } from "@/src/hooks/useResolvedReportings";
import { useSearchResults } from "@/src/hooks/useSearchResults";
import Link from "next/link";
import { CardSkeleton } from "@/common/Skeleton/CardSkeleton";
import { CARDS_PER_PAGE } from "@/src/config/constants";
import { sorter, SORT_DATA_TYPES, SORT_TYPES } from "@/utils/sorting";
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
  [SORT_TYPES.INCIDENT_DATE]: {
    selector: (report) => report.incidentDate,
    datatype: SORT_DATA_TYPES.BIGNUMBER,
  },
  [SORT_TYPES.RESOLVED_DATE]: {
    selector: (report) => report.resolvedOn,
    datatype: SORT_DATA_TYPES.BIGNUMBER,
  },
};

export const ReportingResolvedPage = () => {
  const {
    data: { incidentReports },
    loading,
    hasMore,
    handleShowMore,
  } = useResolvedReportings();

  const [sortType, setSortType] = useState({
    name: t`${SORT_TYPES.RESOLVED_DATE}`,
  });
  const router = useRouter();
  const { getStatsByKey } = useSortableStats();

  const { searchValue, setSearchValue, filtered } = useSearchResults({
    list: incidentReports.map((report) => {
      return {
        ...report,
        info: { projectName: "" },
        ...getStatsByKey(report.id),
      };
    }),
    filter: (item, term) => {
      return (
        toStringSafe(item.info.projectName).indexOf(toStringSafe(term)) > -1
      );
    },
  });

  const resolvedCardInfoArray = useMemo(
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
        { name: t`${SORT_TYPES.INCIDENT_DATE}` },
        { name: t`${SORT_TYPES.RESOLVED_DATE}` },
      ];
    }

    return [
      { name: SORT_TYPES.ALPHABETIC },
      { name: SORT_TYPES.INCIDENT_DATE },
      { name: SORT_TYPES.RESOLVED_DATE },
    ];
  }, [router.locale]);

  return (
    <Container className={"pt-16 pb-36"}>
      <div className="flex justify-end">
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
        data={resolvedCardInfoArray}
        loading={loading}
        hasMore={hasMore}
        handleShowMore={handleShowMore}
      />
    </Container>
  );
};

function getUrl(reportId) {
  let keysArray = reportId.split("-");
  let coverKey = keysArray[0];
  let productKey = keysArray[1];
  let timestamp = keysArray[2];
  let isProductValid = isValidProduct(productKey);

  if (isProductValid) {
    return `/reporting/${safeParseBytes32String(
      coverKey
    )}/product/${safeParseBytes32String(productKey)}/${timestamp}/details`;
  }
  return `/reporting/${safeParseBytes32String(coverKey)}/${timestamp}/details`;
}

function Content({ data, loading, hasMore, handleShowMore }) {
  if (data.length) {
    return (
      <>
        <Grid className="mb-24 mt-14">
          {data.map((report) => {
            const resolvedOn = report.emergencyResolved
              ? report.emergencyResolveTransaction?.timestamp
              : report.resolveTransaction?.timestamp;
            return (
              <Link href={getUrl(report.id)} key={report.id}>
                <a className="rounded-3xl focus:outline-none focus-visible:ring-2 focus-visible:ring-4e7dd9">
                  <ResolvedReportingCard
                    id={report.id}
                    coverKey={report.coverKey}
                    productKey={report.productKey}
                    resolvedOn={resolvedOn}
                    status={ReportStatus[report.status]}
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
        <CardSkeleton
          numberOfCards={data.length || CARDS_PER_PAGE}
          subTitle={false}
          lineContent={1}
        />
      </Grid>
    );
  }

  return (
    <p className="p-5 text-center">
      <Trans>No data found</Trans>
    </p>
  );
}
