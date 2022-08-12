import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { OutlinedCard } from "@/common/OutlinedCard/OutlinedCard";
import { truncateAddressParam } from "@/utils/address";
import { Trans, t } from "@lingui/macro";
import { safeParseString } from "@/src/services/transactions/utils";
import { fromNow } from "@/utils/formatter/relative-time";
import DateLib from "@/lib/date/DateLib";

const INCIDENT = 0;
const DISPUTE = 1;

/**
 * @param {{ type: string; createdBy: string; reportedAt: number; }} props
 */
function HeaderReport(props) {
  const { locale } = useRouter();
  const { type, createdBy, reportedAt } = props;

  return (
    <div className="text-sm">
      <span role="header-type">{type}</span>
      <span role="address" className="text-4e7dd9 mx-2">
        {createdBy && truncateAddressParam(createdBy, 8, -6)}
      </span>
      <span
        role="reported-at"
        className="text-9B9B9B"
        title={DateLib.toLongDateFormat(reportedAt, locale)}
      >
        {reportedAt && fromNow(reportedAt)}
      </span>
    </div>
  );
}

/**
 * @param {{ type: number; }} props
 */
function ReportType(props) {
  const { type } = props;

  return (
    <div className="my-3">
      <span
        role="report-type"
        className={`${
          type === INCIDENT ? "bg-21AD8C" : "bg-FA5C2F"
        } text-white text-xs p-0.5 px-1 rounded-1`}
      >
        {type === INCIDENT ? (
          <Trans>Incident Occured</Trans>
        ) : (
          <Trans>False Reporting</Trans>
        )}
      </span>
    </div>
  );
}

/**
 * @param {Object} props
 * @param {{type: string, createdBy: string, reportedAt: number}} props.header
 * @param {{title: string; description: string}} props.content
 * @param {{type: number}} props.report
 * @param {JSX.Element} [props.children]
 * @returns
 */
function Report({ header, content, report, children }) {
  return (
    <>
      <HeaderReport
        type={header.type}
        createdBy={header.createdBy}
        reportedAt={header.reportedAt}
      />
      <ReportType type={report.type} />

      <div className="block text-black border-l-1.5 border-l-B0C4DB pl-5">
        <h3 role={"title"} className="font-semibold text-h5">
          {content.title}
        </h3>
        <p role={"desc"} className="text-h6">
          {content.description}
        </p>

        {children && (
          <div role="dispute" className="mt-8">
            {children}
          </div>
        )}
      </div>
    </>
  );
}

/**
 * @typedef ReportDesputeData
 * @prop {string} createdBy
 * @prop {string} title
 * @prop {string} description
 * @prop {number} timeStamp
 */

/**
 * @param {Object} props
 * @param {string} props.reportIpfsData
 * @param {number} props.reportIpfsDataTimeStamp
 * @param {string} [props.disputeIpfsData]
 * @param {number} [props.disputeIpfsDataTimeStamp]
 * @returns
 */
export default function ReportComments({
  reportIpfsData,
  reportIpfsDataTimeStamp,
  disputeIpfsData,
  disputeIpfsDataTimeStamp,
}) {
  /**
   * @type {[ReportDesputeData, (reportData: ReportDesputeData) => void]}
   */
  const [reportData, setReportData] = useState();

  /**
   * @type {[ReportDesputeData, (disputeData: ReportDesputeData) => void]}
   */
  const [disputeData, setDisputeData] = useState();

  useEffect(() => {
    const {
      createdBy: rCreatedBy,
      title: rTitle,
      description: rDescription,
    } = safeParseString(reportIpfsData, {});

    setReportData({
      createdBy: rCreatedBy,
      title: rTitle,
      description: rDescription,
      timeStamp: reportIpfsDataTimeStamp,
    });

    const {
      createdBy: dCreatedBy,
      title: dTitle,
      description: dDescription,
    } = safeParseString(disputeIpfsData, {});

    if (dTitle) {
      setDisputeData({
        createdBy: dCreatedBy,
        title: dTitle,
        description: dDescription,
        timeStamp: disputeIpfsDataTimeStamp,
      });
    }
  }, [
    reportIpfsData,
    disputeIpfsData,
    reportIpfsDataTimeStamp,
    disputeIpfsDataTimeStamp,
  ]);

  return (
    <OutlinedCard className="bg-white p-6 mt-8">
      {reportData && (
        <Report
          header={{
            type: t`Reported by`,
            createdBy: reportData?.createdBy,
            reportedAt: reportData?.timeStamp,
          }}
          report={{
            type: INCIDENT,
          }}
          content={{
            title: reportData?.title,
            description: reportData?.description,
          }}
        >
          {disputeData && (
            <Report
              header={{
                type: t`Disputed by`,
                createdBy: disputeData?.createdBy,
                reportedAt: disputeData?.timeStamp,
              }}
              report={{
                type: DISPUTE,
              }}
              content={{
                title: disputeData?.title,
                description: disputeData?.description,
              }}
            />
          )}
        </Report>
      )}
    </OutlinedCard>
  );
}
