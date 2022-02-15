import { NeutralButton } from "@/components/UI/atoms/button/neutral-button";
import { Container } from "@/components/UI/atoms/container";
import { Grid } from "@/components/UI/atoms/grid";
import { SearchAndSortBar } from "@/components/UI/molecules/search-and-sort";
import { ActiveReportingCard } from "@/components/UI/organisms/reporting/ActiveReportingCard";
import { ActiveReportingEmptyState } from "@/components/UI/organisms/reporting/ActiveReportingEmptyState";
import { useActiveReportings } from "@/src/hooks/useActiveReportings";
import { getParsedKey } from "@/src/helpers/cover";
import Link from "next/link";

export const ReportingActivePage = () => {
  const { data, loading } = useActiveReportings();

  if (loading) {
    return <>loading...</>;
  }

  const isEmpty = data.incidentReports.length === 0;

  return (
    <Container className={"pt-16 pb-36"}>
      {isEmpty && <ActiveReportingEmptyState />}
      {!isEmpty && <ActiveReportingCards reportings={data.incidentReports} />}
    </Container>
  );
};

const ActiveReportingCards = ({ reportings }) => (
  <>
    <div className="flex justify-end">
      <SearchAndSortBar />
    </div>
    <Grid className="mt-14 mb-24">
      {reportings.map((reporting) => (
        <Link
          href={`/reporting/${getParsedKey(reporting.id.split("-")[0])}/${
            reporting.id.split("-")[1]
          }/details`}
          key={reporting.id}
        >
          <a className="rounded-3xl focus:outline-none focus-visible:ring-2 focus-visible:ring-4e7dd9">
            <ActiveReportingCard
              coverKey={reporting.key}
              incidentDate={reporting.incidentDate}
            />
          </a>
        </Link>
      ))}
    </Grid>
    <NeutralButton className={"rounded-lg"}>Show More</NeutralButton>
  </>
);
