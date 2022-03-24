import { Container } from "@/components/UI/atoms/container";
import { Grid } from "@/components/UI/atoms/grid";
import { SearchAndSortBar } from "@/components/UI/molecules/search-and-sort";
import { ResolvedReportingCard } from "@/components/UI/organisms/reporting/ResolvedReportingCard";
import { ReportStatus } from "@/src/config/constants";
import { useCovers } from "@/src/context/Covers";
import { getParsedKey } from "@/src/helpers/cover";
import { useResolvedReportings } from "@/src/hooks/useResolvedReportings";
import { useSearchResults } from "@/src/hooks/useSearchResults";
import Link from "next/link";

export const ReportingResolvedPage = () => {
  const { data, loading } = useResolvedReportings();
  const { getInfoByKey } = useCovers();
  const { searchValue, setSearchValue, filtered } = useSearchResults({
    list: data.incidentReports,
    filter: (item, term) => {
      const info = getInfoByKey(item.key);
      return info.projectName.toLowerCase().indexOf(term.toLowerCase()) > -1;
    },
  });

  const searchHandler = (ev) => {
    setSearchValue(ev.target.value);
  };

  const isEmpty = data.incidentReports.length === 0;

  return (
    <Container className={"pt-16 pb-36"}>
      <div className="flex justify-end">
        <SearchAndSortBar
          searchValue={searchValue}
          onSearchChange={searchHandler}
        />
      </div>

      {loading && <p className="text-center">Loading...</p>}

      {!loading && isEmpty && <p className="text-center">No data found</p>}

      <Grid className="mb-24 mt-14">
        {filtered.map((report) => {
          const resolvedOn = report.emergencyResolved
            ? report.emergencyResolveTransaction?.timestamp
            : report.resolveTransaction?.timestamp;

          return (
            <Link
              href={`/reporting/${getParsedKey(report.id.split("-")[0])}/${
                report.id.split("-")[1]
              }/details`}
              key={report.id}
            >
              <a className="rounded-3xl focus:outline-none focus-visible:ring-2 focus-visible:ring-4e7dd9">
                <ResolvedReportingCard
                  coverKey={report.key}
                  resolvedOn={resolvedOn}
                  status={ReportStatus[report.status]}
                />
              </a>
            </Link>
          );
        })}
      </Grid>
    </Container>
  );
};
