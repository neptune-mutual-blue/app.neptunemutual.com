import { Container } from "@/components/UI/atoms/container";
import { Grid } from "@/components/UI/atoms/grid";
import { SearchAndSortBar } from "@/components/UI/molecules/search-and-sort";
import { ResolvedReportingCard } from "@/components/UI/organisms/reporting/ResolvedReportingCard";
import { getParsedKey } from "@/src/helpers/cover";
import { useResolvedReportings } from "@/src/hooks/useResolvedReportings";
import Link from "next/link";

export const ReportingResolvedPage = () => {
  const { data, loading } = useResolvedReportings();

  const isEmpty = data.incidentReports.length === 0;

  return (
    <Container className={"pt-16 pb-36"}>
      <div className="flex justify-end">
        <SearchAndSortBar />
      </div>

      {loading && <p className="text-center">Loading...</p>}

      {!loading && isEmpty && <p className="text-center">No data found</p>}

      <Grid className="mt-14 mb-24">
        {data.incidentReports.map((report) => {
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
                  status={report.status}
                />
              </a>
            </Link>
          );
        })}
      </Grid>
    </Container>
  );
};
