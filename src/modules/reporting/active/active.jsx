import { useMemo, useState, useEffect } from "react";
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
import { useCovers } from "@/src/context/Covers";
import { safeParseBytes32String } from "@/utils/formatter/bytes32String";
import { toStringSafe } from "@/utils/string";

/**
 * @type {Object.<string, {selector:(any) => any, datatype: any }>}
 */
const sorterData = {
  [SORT_TYPES.ALPHABETIC]: {
    selector: (report) => report.info.projectName,
    datatype: SORT_DATA_TYPES.STRING,
  },
  [SORT_TYPES.UTILIZATION_RATIO]: {
    selector: (report) => report.info.utilization,
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
  const { getInfoByKey } = useCovers();

  const [data, setData] = useState([]);

  const [sortType, setSortType] = useState({
    name: t`${SORT_TYPES.ALPHABETIC}`,
  });
  const router = useRouter();

  const { searchValue, setSearchValue, filtered } = useSearchResults({
    list: data,
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

  useEffect(() => {
    setData(
      incidentReports.map((item) => {
        return {
          ...item,
          info: getInfoByKey(item.key),
        };
      })
    );
  }, [incidentReports, getInfoByKey]);

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
          {data.map((cover) => {
            return (
              <Link
                href={`/reporting/${safeParseBytes32String(
                  cover.id.split("-")[0]
                )}/${cover.id.split("-")[1]}/details`}
                key={cover.id}
              >
                <a className="rounded-3xl focus:outline-none focus-visible:ring-2 focus-visible:ring-4e7dd9">
                  <ActiveReportingCard
                    coverKey={cover.key}
                    incidentDate={cover.incidentDate}
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
