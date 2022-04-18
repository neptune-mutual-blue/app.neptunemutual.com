import { useState } from "react";
import { NeutralButton } from "@/common/components/Button/NeutralButton";
import { Container } from "@/common/components/Container/Container";
import { Grid } from "@/common/components/Grid/Grid";
import { SearchAndSortBar } from "@/common/components/SearchAndSortBar";
import { ActiveReportingCard } from "@/src/modules/reporting/active/ActiveReportingCard";
import { ActiveReportingEmptyState } from "@/src/modules/reporting/active/ActiveReportingEmptyState";
import { useActiveReportings } from "@/src/hooks/useActiveReportings";
import { getParsedKey } from "@/src/helpers/cover";
import Link from "next/link";
import { useSearchResults } from "@/src/hooks/useSearchResults";
import { useCovers } from "@/src/context/Covers";
import { sortData } from "@/utils/sorting";
import { CardSkeleton } from "@/src/common/components/Skeleton/CardSkeleton";
import { COVERS_PER_PAGE } from "@/src/config/constants";

export const ReportingActivePage = () => {
  const { data, loading, hasMore, handleShowMore } = useActiveReportings();
  const { getInfoByKey } = useCovers();
  const { searchValue, setSearchValue, filtered } = useSearchResults({
    list: data.incidentReports,
    filter: (item, term) => {
      const info = getInfoByKey(item.key);

      return info.projectName.toLowerCase().indexOf(term.toLowerCase()) > -1;
    },
  });

  const [sortType, setSortType] = useState({ name: "A-Z" });

  const filteredActiveCardInfo = filtered.map((item) => {
    const activeCardInfo = getInfoByKey(item.key);

    return { ...activeCardInfo, activeReporting: item };
  });

  const searchHandler = (ev) => {
    setSearchValue(ev.target.value);
  };

  const renderActiveReportings = () => {
    const noData = data.incidentReports.length <= 0;

    if (!loading && !noData) {
      return (
        <Grid className="mb-24 mt-14">
          {sortData(filteredActiveCardInfo, sortType.name).map(
            ({ activeReporting }) => {
              return (
                <Link
                  href={`/reporting/${getParsedKey(
                    activeReporting.id.split("-")[0]
                  )}/${activeReporting.id.split("-")[1]}/details`}
                  key={activeReporting.id}
                >
                  <a className="rounded-3xl focus:outline-none focus-visible:ring-2 focus-visible:ring-4e7dd9">
                    <ActiveReportingCard
                      coverKey={activeReporting.key}
                      incidentDate={activeReporting.incidentDate}
                    />
                  </a>
                </Link>
              );
            }
          )}
        </Grid>
      );
    } else if (!loading && noData) {
      return <ActiveReportingEmptyState />;
    }

    return (
      <Grid className="mb-24 mt-14">
        <CardSkeleton
          numberOfCards={data.incidentReports.length || COVERS_PER_PAGE}
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

      {renderActiveReportings()}

      {!loading && hasMore && (
        <NeutralButton
          className={"rounded-lg border-0.5"}
          onClick={handleShowMore}
        >
          Show More
        </NeutralButton>
      )}
    </Container>
  );
};
