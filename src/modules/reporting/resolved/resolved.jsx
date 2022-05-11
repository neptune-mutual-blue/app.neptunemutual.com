import { useState } from "react";
import { NeutralButton } from "@/common/Button/NeutralButton";
import { Container } from "@/common/Container/Container";
import { Grid } from "@/common/Grid/Grid";
import { SearchAndSortBar } from "@/common/SearchAndSortBar";
import { ResolvedReportingCard } from "@/src/modules/reporting/resolved/ResolvedReportingCard";
import { ReportStatus } from "@/src/config/constants";
import { useCovers } from "@/src/context/Covers";
import { useResolvedReportings } from "@/src/hooks/useResolvedReportings";
import { useSearchResults } from "@/src/hooks/useSearchResults";
import Link from "next/link";
import { sortData } from "@/utils/sorting";
import { CardSkeleton } from "@/common/Skeleton/CardSkeleton";
import { COVERS_PER_PAGE } from "@/src/config/constants";
import { Trans } from "@lingui/macro";
import { safeParseBytes32String } from "@/utils/formatter/bytes32String";

export const ReportingResolvedPage = () => {
  const { data, loading, hasMore, handleShowMore } = useResolvedReportings();
  const { getInfoByKey } = useCovers();
  const { searchValue, setSearchValue, filtered } = useSearchResults({
    list: data.incidentReports,
    filter: (item, term) => {
      const info = getInfoByKey(item.key);
      return info.projectName.toLowerCase().indexOf(term.toLowerCase()) > -1;
    },
  });

  const [sortType, setSortType] = useState({ name: "A-Z" });

  const filteredResolvedCardInfo = filtered.map((item) => {
    const resolvedCardInfo = getInfoByKey(item.key);

    return { ...resolvedCardInfo, resolvedReporting: item };
  });

  const searchHandler = (ev) => {
    setSearchValue(ev.target.value);
  };

  const renderResolvedReportings = () => {
    const noData = data.incidentReports.length <= 0;

    if (!loading && !noData) {
      return (
        <Grid className="mb-24 mt-14">
          {sortData(filteredResolvedCardInfo, sortType.name).map(
            ({ resolvedReporting }) => {
              const resolvedOn = resolvedReporting.emergencyResolved
                ? resolvedReporting.emergencyResolveTransaction?.timestamp
                : resolvedReporting.resolveTransaction?.timestamp;

              return (
                <Link
                  href={`/reporting/${safeParseBytes32String(
                    resolvedReporting.id.split("-")[0]
                  )}/${resolvedReporting.id.split("-")[1]}/details`}
                  key={resolvedReporting.id}
                >
                  <a className="rounded-3xl focus:outline-none focus-visible:ring-2 focus-visible:ring-4e7dd9">
                    <ResolvedReportingCard
                      coverKey={resolvedReporting.key}
                      resolvedOn={resolvedOn}
                      status={ReportStatus[resolvedReporting.status]}
                    />
                  </a>
                </Link>
              );
            }
          )}
        </Grid>
      );
    } else if (!loading && noData) {
      return (
        <p className="text-center">
          <Trans>No data found</Trans>
        </p>
      );
    }

    return (
      <Grid className="mb-24 mt-14">
        <CardSkeleton
          numberOfCards={data.incidentReports.length || COVERS_PER_PAGE}
          subTitle={false}
          lineContent={1}
        />
      </Grid>
    );
  };

  return (
    <Container className={"pt-16 pb-36"}>
      <div className="flex justify-end">
        <SearchAndSortBar
          searchValue={searchValue}
          onSearchChange={searchHandler}
          sortType={sortType}
          setSortType={setSortType}
        />
      </div>

      {renderResolvedReportings()}

      {!loading && hasMore && (
        <NeutralButton
          className={"rounded-lg border-0.5"}
          onClick={handleShowMore}
        >
          <Trans>Show More</Trans>
        </NeutralButton>
      )}
    </Container>
  );
};
