import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { t } from "@lingui/macro";

import { ReportingHero } from "@/modules/reporting/ReportingHero";

import { useCoverOrProductData } from "@/src/hooks/useCoverOrProductData";
import { getSubgraphData } from "@/src/services/subgraph";
import { useNetwork } from "@/src/context/Network";
import { isValidProduct } from "@/src/helpers/cover";

import DateLib from "@/lib/date/DateLib";

import {
  safeFormatBytes32String,
  safeParseBytes32String,
} from "@/utils/formatter/bytes32String";
import { classNames } from "@/utils/classnames";
import { convertFromUnits } from "@/utils/bn";
import { fromNow } from "@/utils/formatter/relative-time";
import { truncateAddress } from "@/utils/address";

import { Table, TableWrapper, THead } from "@/common/Table/Table";
import { Container } from "@/common/Container/Container";
import { Badge, identifyStatus } from "@/common/CardStatusBadge";

/**
 *
 * @param {string} coverKey
 * @param {string} productKey
 * @returns
 */
const subgraphQuery = function (coverKey, productKey) {
  return `{
    incidentReports(
      skip: 0
      orderBy: incidentDate
      orderDirection: desc
      where:{
        coverKey: "${coverKey}"
        productKey: "${productKey}"
      }
    ) {
      id
      coverKey
      productKey
      incidentDate
      resolved
      status
      totalAttestedStake
      totalRefutedStake
      reporter
    }
  }`;
};

/**
 *
 * @param {{name: string, align: string}} col
 * @returns
 */
function renderHeader(col) {
  return (
    <th
      scope="col"
      className={classNames(
        `px-6 pt-6 pb-2 font-bold text-xs uppercase whitespace-nowrap`,
        col.align === "right" ? "text-right" : "text-left"
      )}
    >
      {col.name}
    </th>
  );
}

const columns = [
  {
    name: t`reporter`,
    align: "left",
    renderHeader,
  },
  {
    name: t`date and time`,
    align: "left",
    renderHeader,
  },
  {
    name: t`total attested stake`,
    align: "right",
    renderHeader,
  },
  {
    name: t`total refuted stake`,
    align: "right",
    renderHeader,
  },
  {
    name: t`status`,
    align: "right",
    renderHeader,
  },
];

const ReportListing = () => {
  const { query, locale, push } = useRouter();
  const { networkId } = useNetwork();
  const { product_id = "", cover_id } = query;
  const [reports, setReports] = useState([]);

  const coverKey = safeFormatBytes32String(cover_id);
  const productKey = safeFormatBytes32String(product_id);

  const coverInfo = useCoverOrProductData({
    coverKey,
    productKey,
  });

  useEffect(() => {
    async function fetchData() {
      const { incidentReports = [] } =
        (await getSubgraphData(
          networkId,
          subgraphQuery(coverKey, productKey)
        )) || {};

      setReports(incidentReports);
    }

    fetchData();
  }, [coverKey, productKey, networkId]);

  /**
   *
   * @param {string} reportId
   */
  function goTo(reportId) {
    const [, , timestamp] = reportId.split("-");
    const isDiversified = isValidProduct(productKey);

    const cover_id = safeParseBytes32String(coverKey);
    const product_id = safeParseBytes32String(productKey);

    if (isDiversified) {
      push(`/reporting/${cover_id}/product/${product_id}/${timestamp}/details`);
    }
    push(`/reporting/${cover_id}/${timestamp}/details`);
  }

  return (
    <>
      <ReportingHero coverInfo={coverInfo} />
      <Container className={"pt-16 pb-36"}>
        <TableWrapper>
          <Table>
            <THead
              theadClass="bg-white text-[#9B9B9B] font-poppins border-b-[1px] border-[#DAE2EB]"
              columns={columns}
            />
            <tbody
              className="divide-y divide-DAE2EB"
              data-testid="app-table-body"
            >
              {reports.map((report, i) => (
                <tr
                  onClick={() => goTo(report.id)}
                  className="cursor-pointer hover:bg-F4F8FC"
                  key={i}
                >
                  <td className="px-6 py-2 text-sm max-w-180">
                    <span className="w-max" title={report.reporter}>
                      {truncateAddress(report.reporter)}
                    </span>
                  </td>
                  <td className="px-6 py-2 text-sm max-w-180">
                    <span
                      className="w-max"
                      title={DateLib.toLongDateFormat(
                        report.incidentDate,
                        locale
                      )}
                    >
                      {fromNow(report.incidentDate)}
                    </span>
                  </td>
                  <td className="px-6 py-2 text-sm max-w-180 text-right">
                    {convertFromUnits(report.totalAttestedStake)
                      .decimalPlaces(0)
                      .toNumber()}
                  </td>
                  <td className="px-6 py-2 text-sm max-w-180 text-right">
                    {convertFromUnits(report.totalRefutedStake)
                      .decimalPlaces(0)
                      .toNumber()}
                  </td>
                  <td className="px-6 py-2 text-sm max-w-180 text-right">
                    <Badge
                      className="rounded-1 py-0 leading-4 border-0 tracking-normal inline-block !text-xs"
                      status={identifyStatus(report.status)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </TableWrapper>
      </Container>
    </>
  );
};

export default ReportListing;
