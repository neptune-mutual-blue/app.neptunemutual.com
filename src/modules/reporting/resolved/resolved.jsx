import { useMemo, useState, useEffect } from "react";
import { NeutralButton } from "@/common/Button/NeutralButton";
import { Container } from "@/common/Container/Container";
import { Grid } from "@/common/Grid/Grid";
import { SearchAndSortBar } from "@/common/SearchAndSortBar";
import { ResolvedReportingCard } from "@/src/modules/reporting/resolved/ResolvedReportingCard";
import { ReportStatus } from "@/src/config/constants";
import { useCovers } from "@/src/context/Covers";
import { getParsedKey } from "@/src/helpers/cover";
import { useResolvedReportings } from "@/src/hooks/useResolvedReportings";
import { useSearchResults } from "@/src/hooks/useSearchResults";
import Link from "next/link";
import { CardSkeleton } from "@/common/Skeleton/CardSkeleton";
import { COVERS_PER_PAGE } from "@/src/config/constants";
import { getProperty, sortList, SORT_TYPES } from "@/utils/sorting";
import { t, Trans } from "@lingui/macro";
import { useRouter } from "next/router";

export const ReportingResolvedPage = () => {
  const {
    data: { incidentReports },
  } = useResolvedReportings();
  const { getInfoByKey } = useCovers();

  const [data, setData] = useState([]);

  const [sortType, setSortType] = useState({ name: t`${SORT_TYPES.AtoZ}` });
  const router = useRouter();

  const { searchValue, setSearchValue, filtered } = useSearchResults({
    list: data,
    filter: (item, term) => {
      const info = getInfoByKey(item.key);
      return info.projectName.toLowerCase().indexOf(term.toLowerCase()) > -1;
    },
  });

  const resolvedCardInfoArray = useMemo(
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

      <Content data={resolvedCardInfoArray} />
    </Container>
  );
};

function Content({ data }) {
  const { loading, hasMore, handleShowMore } = useResolvedReportings();

  if (data.length) {
    return (
      <>
        <Grid className="mb-24 mt-14">
          {data.map((cover) => {
            const resolvedOn = cover.emergencyResolved
              ? cover.emergencyResolveTransaction?.timestamp
              : cover.resolveTransaction?.timestamp;

            return (
              <Link
                href={`/reporting/${getParsedKey(cover.id.split("-")[0])}/${
                  cover.id.split("-")[1]
                }/details`}
                key={cover.id}
              >
                <a className="rounded-3xl focus:outline-none focus-visible:ring-2 focus-visible:ring-4e7dd9">
                  <ResolvedReportingCard
                    coverKey={cover.key}
                    resolvedOn={resolvedOn}
                    status={ReportStatus[cover.status]}
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
        <CardSkeleton
          numberOfCards={data.length || COVERS_PER_PAGE}
          subTitle={false}
          lineContent={1}
        />
      </Grid>
    );
  }

  return (
    <p className="text-center">
      <Trans>No data found</Trans>
    </p>
  );
}

const SORT_CALLBACK = {
  [SORT_TYPES.AtoZ]: (cover) => {
    return getProperty(cover.info, "projectName", "");
  },
};

const getSortCallback = (sortTypeName) =>
  getProperty(SORT_CALLBACK, sortTypeName, SORT_CALLBACK[SORT_TYPES.AtoZ]);
