import { useMemo, useState, useEffect } from "react";
import { NeutralButton } from "@/common/Button/NeutralButton";
import { Container } from "@/common/Container/Container";
import { Grid } from "@/common/Grid/Grid";
import { SearchAndSortBar } from "@/common/SearchAndSortBar";
import { ActiveReportingCard } from "@/src/modules/reporting/active/ActiveReportingCard";
import { ActiveReportingEmptyState } from "@/src/modules/reporting/active/ActiveReportingEmptyState";
import { useActiveReportings } from "@/src/hooks/useActiveReportings";
import { getParsedKey } from "@/src/helpers/cover";
import Link from "next/link";
import { useSearchResults } from "@/src/hooks/useSearchResults";
import { getProperty, sortList, SORT_TYPES } from "@/utils/sorting";
import { CardSkeleton } from "@/common/Skeleton/CardSkeleton";
import { COVERS_PER_PAGE } from "@/src/config/constants";
import { t, Trans } from "@lingui/macro";
import { useRouter } from "next/router";
import { useCovers } from "@/src/context/Covers";

export const ReportingActivePage = () => {
  const {
    data: { incidentReports },
  } = useActiveReportings();
  const { getInfoByKey } = useCovers();

  const [data, setData] = useState([]);

  const [sortType, setSortType] = useState({ name: t`${SORT_TYPES.AtoZ}` });
  const router = useRouter();

  const { searchValue, setSearchValue, filtered } = useSearchResults({
    list: data,
    filter: (cover, term) => {
      const projectName = getProperty(cover.info, "projectName");
      return projectName.toLowerCase().indexOf(term.toLowerCase()) > -1;
    },
  });

  const activeCardInfoArray = useMemo(
    () => sortList(filtered, getSortCallback(sortType.name), sortType.name),
    [filtered, sortType.name]
  );

  const options = useMemo(() => {
    if (router.locale) {
      return [{ name: t`${SORT_TYPES.AtoZ}` }];
    }

    return [{ name: SORT_TYPES.AtoZ }];
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

      <Content data={activeCardInfoArray} />
    </Container>
  );
};

function Content({ data }) {
  const { loading, hasMore, handleShowMore } = useActiveReportings();
  if (data.length) {
    return (
      <>
        <Grid className="mb-24 mt-14">
          {data.map((cover) => {
            return (
              <Link
                href={`/reporting/${getParsedKey(cover.id.split("-")[0])}/${
                  cover.id.split("-")[1]
                }/details`}
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
        <CardSkeleton numberOfCards={data.length || COVERS_PER_PAGE} />
      </Grid>
    );
  }

  return <ActiveReportingEmptyState />;
}

const SORT_CALLBACK = {
  [SORT_TYPES.AtoZ]: (cover) => {
    return getProperty(cover.info, "projectName", "");
  },
};

const getSortCallback = (sortTypeName) =>
  getProperty(SORT_CALLBACK, sortTypeName, SORT_CALLBACK[SORT_TYPES.AtoZ]);
