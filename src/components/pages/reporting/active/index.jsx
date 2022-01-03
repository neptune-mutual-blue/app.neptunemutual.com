import { Container } from "@/components/UI/atoms/container";
import { Grid } from "@/components/UI/atoms/grid";
import { SearchAndSortBar } from "@/components/UI/molecules/search-and-sort";

export const ReportingActivePage = () => {
  return (
    <Container className={"pt-16 pb-36"}>
      <div className="flex justify-end">
        <SearchAndSortBar />
      </div>
      <Grid className="mt-14 mb-24">Active</Grid>
    </Container>
  );
};
