import { Fragment, useMemo, useState } from "react";
import { Container } from "@/common/Container/Container";
import { SearchAndSortBar } from "@/common/SearchAndSortBar";
import { ReportStatus } from "@/src/config/constants";
import { useResolvedReportings } from "@/src/hooks/useResolvedReportings";
import { useSearchResults } from "@/src/hooks/useSearchResults";
import { sorter, SORT_DATA_TYPES, SORT_TYPES } from "@/utils/sorting";
import { t } from "@lingui/macro";
import { useRouter } from "next/router";
import { safeParseBytes32String } from "@/utils/formatter/bytes32String";
import { toStringSafe } from "@/utils/string";
import { useSortableStats } from "@/src/context/SortableStatsContext";
import { isValidProduct } from "@/src/helpers/cover";
import { classNames } from "@/utils/classnames";
import {
  Table,
  TableWrapper,
  THead,
  TableShowMore
} from "@/common/Table/Table";
import { ResolvedTBodyRow } from "@/modules/reporting/resolved/ResolvedTBodyRow";
import { ResolvedStatusBadge } from "@/modules/reporting/resolved/ResolvedStatusBadge";
import DateLib from "@/lib/date/DateLib";
import { fromNow } from "@/utils/formatter/relative-time";

/**
 * @type {Object.<string, {selector:(any) => any, datatype: any, ascending?: boolean }>}
 */
const sorterData = {
  [SORT_TYPES.ALPHABETIC]: {
    selector: (report) => report.info.projectName,
    datatype: SORT_DATA_TYPES.STRING,
  },
  [SORT_TYPES.INCIDENT_DATE]: {
    selector: (report) => report.incidentDate,
    datatype: SORT_DATA_TYPES.BIGNUMBER,
  },
  [SORT_TYPES.RESOLVED_DATE]: {
    selector: (report) => report.resolvedOn,
    datatype: SORT_DATA_TYPES.BIGNUMBER,
  },
};

export const ReportingResolvedPage = () => {
  const {
    data: { incidentReports },
    loading,
    hasMore,
    handleShowMore,
  } = useResolvedReportings();

  const [sortType, setSortType] = useState({
    name: t`${SORT_TYPES.RESOLVED_DATE}`,
  });
  const router = useRouter();
  const { getStatsByKey } = useSortableStats();

  const { searchValue, setSearchValue, filtered } = useSearchResults({
    list: incidentReports.map((report) => {
      return {
        ...report,
        info: { projectName: "" },
        ...getStatsByKey(report.id),
      };
    }),
    filter: (item, term) => {
      return (
        toStringSafe(item.info.projectName).indexOf(toStringSafe(term)) > -1
      );
    },
  });

  const resolvedCardInfoArray = useMemo(
    () =>
      sorter({
        ...sorterData[sortType.name],
        list: filtered,
      }),

    [filtered, sortType.name]
  );

  const options = useMemo(() => {
    if (router.locale) {
      return [
        { name: t`${SORT_TYPES.ALPHABETIC}` },
        { name: t`${SORT_TYPES.INCIDENT_DATE}` },
        { name: t`${SORT_TYPES.RESOLVED_DATE}` },
      ];
    }

    return [
      { name: SORT_TYPES.ALPHABETIC },
      { name: SORT_TYPES.INCIDENT_DATE },
      { name: SORT_TYPES.RESOLVED_DATE },
    ];
  }, [router.locale]);

  const renderHeader = (col) => {
    return (
      <th
        scope="col"
        className={classNames(
          `px-6 pt-6 pb-2 font-bold text-xs uppercase`,
          col.align === "right" ? "text-right" : "text-left"
        )}
      >
      {col.name}
    </th>
    );
  };

  const renderCover = (row) => {
    return (
      <td className="px-6 py-2">
        <span className="flex items-center">
          <img
            src={row.imgSrc}
            alt={row.isDiversified ? row.coverInfo?.infoObj.productName : row.coverInfo?.infoObj.projectName}
            className='rounded-full bg-DEEAF6'
            width={48}
            height={48}
          />
          <p className="ml-2 text-sm text-black font-poppins">{row.isDiversified ? row.coverInfo?.infoObj.productName : row.coverInfo?.infoObj.projectName}</p>
        </span>
      </td>
    );
  }

  // const renderYourStakeColumnOne = (row) => {
  //   return (
  //     <td className="px-6 py-2">
  //       N/A
  //     </td>
  //   );
  // }

  // const renderYourStakeColumnTwo = (row) => {
  //   return (
  //     <td className="px-6 py-2">
  //       N/A
  //     </td>
  //   );
  // }

  const renderDateAndTime = (row) => {
    return (
      <td className="px-6 py-2">
        <span title={DateLib.toLongDateFormat(row.resolvedOn, row.locale)}>
          {
            fromNow(row.resolvedOn)
          }
        </span>
      </td>
    );
  }

  const renderStatus = (row) => {
    return (
      <td className="px-6 py-2 text-right">
        <ResolvedStatusBadge status={row.status} />
      </td>
    );
  }

  const columns = [
    {
      name: t`cover`,
      align: 'left',
      renderHeader,
      renderData: renderCover
    },
    // {
    //   name: t`your stake`,
    //   align: 'left',
    //   renderHeader,
    //   renderData: renderYourStakeColumnOne
    // },
    // {
    //   name: t`your stake`,
    //   align: 'left',
    //   renderHeader,
    //   renderData: renderYourStakeColumnTwo
    // },
    {
      name: t`date and time`,
      align: 'left',
      renderHeader,
      renderData: renderDateAndTime
    },
    {
      name: t`status`,
      align: 'right',
      renderHeader,
      renderData: renderStatus
    }
  ];

  const getUrl = (reportId) => {
    let keysArray = reportId.split("-");
    let coverKey = keysArray[0];
    let productKey = keysArray[1];
    let timestamp = keysArray[2];
    let isProductValid = isValidProduct(productKey);
  
    if (isProductValid) {
      return `/reporting/${safeParseBytes32String(
        coverKey
      )}/product/${safeParseBytes32String(productKey)}/${timestamp}/details`;
    }
    return `/reporting/${safeParseBytes32String(coverKey)}/${timestamp}/details`;
  }

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
          containerClass="flex-col sm:flex-row w-full p-8 bg-DAE2EB/[0.3] rounded-2xl z-10"
          searchClass="w-full"
        />
      </div>

      <div className="mt-6">
        <TableWrapper>
          <Table>
            <THead theadClass='bg-white text-[#9B9B9B] font-poppins border-b-[1px] border-[#DAE2EB]' columns={columns} />
            <tbody className="divide-y divide-DAE2EB" data-testid="app-table-body">
              {
                resolvedCardInfoArray.length === 0 && (
                  <tr className="text-center">
                    <td className="px-0 py-2" colSpan={columns.length}>
                      {loading ? t`loading...` : t`No data found`}
                    </td>
                  </tr>
                )
              }
              {
                resolvedCardInfoArray.map((report) => {
                  const resolvedOn = report.emergencyResolved
                  ? report.emergencyResolveTransaction?.timestamp
                  : report.resolveTransaction?.timestamp;
                  
                  return (
                    <Fragment key={report.id}>
                      <tr 
                        className="cursor-pointer hover:bg-F4F8FC"
                        onClick={() => router.push(getUrl(report.id))}
                      >
                        <ResolvedTBodyRow
                          columns={columns}
                          id={report.id}
                          coverKey={report.coverKey}
                          productKey={report.productKey}
                          resolvedOn={resolvedOn}
                          status={ReportStatus[report.status]}
                        />
                      </tr>
                    </Fragment>
                  );
                })
              }
            </tbody>
          </Table>
          {
            hasMore && (
              <TableShowMore
                isLoading={loading}
                onShowMore={handleShowMore}
              />
            )
          }
        </TableWrapper>
      </div>
    </Container>
  );
};
