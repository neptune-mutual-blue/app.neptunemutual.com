import { useActiveReporting } from "@/components/pages/reporting/active/useActiveReportingLIst";
import { useNoOfArray } from "@/components/pages/reporting/active/useNoOfArray";
import { NeutralButton } from "@/components/UI/atoms/button/neutral-button";
import { Container } from "@/components/UI/atoms/container";
import { Grid } from "@/components/UI/atoms/grid";
import { SearchAndSortBar } from "@/components/UI/molecules/search-and-sort";
import { ReportingCard } from "@/components/UI/organisms/reporting/active-reporting-card";
import { AddReporting } from "@/components/UI/organisms/reporting/add-reporting";

export const ReportingActivePage = () => {
  const { activeReportings } = useActiveReporting();
  const { show } = useNoOfArray();

  if (!activeReportings || !show) {
    return <>loading...</>;
  }

  const addReportingCards = () => (
    <>
      <div className="flex justify-end">
        <SearchAndSortBar />
      </div>
      <Grid className="mt-14 mb-24">
        {activeReportings.map((activeReporting) => (
          <ReportingCard key={activeReporting.id} details={activeReporting} />
        ))}
      </Grid>
      <NeutralButton className={"rounded-lg"}>Show More</NeutralButton>
    </>
  );
  return (
    <Container className={"pt-16 pb-36"}>
      {show !== "false" ? addReportingCards() : <AddReporting />}
    </Container>
  );
};
