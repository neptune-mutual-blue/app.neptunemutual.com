import { useResolvedReporting } from "@/components/pages/reporting/resolved/useResolvedReporting";
import { Container } from "@/components/UI/atoms/container";
import { Grid } from "@/components/UI/atoms/grid";
import { SearchAndSortBar } from "@/components/UI/molecules/search-and-sort";
import { ResolvedReportingCard } from "@/components/UI/organisms/reporting/resolved-reporting";
import Link from "next/link";

export const ReportingResolvedPage = () => {
  const { resolvedReportings } = useResolvedReporting();

  if (!resolvedReportings) {
    return <>loading..!</>;
  }
  return (
    <Container className={"pt-16 pb-36"}>
      <div className="flex justify-end">
        <SearchAndSortBar />
      </div>
      <Grid className="mt-14 mb-24">
        {resolvedReportings.map((resolved) => (
          <Link href={`/reporting/${resolved.key}/vote`} key={resolved.name}>
            <a className="rounded-3xl focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-4E7DD9">
              <ResolvedReportingCard key={resolved.id} details={resolved} />
            </a>
          </Link>
        ))}
      </Grid>
    </Container>
  );
};
