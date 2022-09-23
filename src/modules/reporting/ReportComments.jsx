import { useRouter } from "next/router";
import { OutlinedCard } from "@/common/OutlinedCard/OutlinedCard";
import { Trans, t } from "@lingui/macro";
import { safeParseString } from "@/src/services/transactions/utils";
import { fromNow } from "@/utils/formatter/relative-time";
import DateLib from "@/lib/date/DateLib";
import { getReplacedString } from "@/utils/string";
import { IPFS_HASH_URL } from "@/src/config/constants";
import OpenInNewIcon from "@/icons/OpenInNewIcon";

const INCIDENT = 0;
const DISPUTE = 1;

/**
 * @param {{ type: string; createdBy: string; reportedAt: number; ipfsHash: string; }} props
 */
function HeaderReport(props) {
  const { locale } = useRouter();
  const { type, createdBy, reportedAt, ipfsHash } = props;

  return (
    <div className="text-sm">
      <span role="header-type">{type}</span>
      <span role="address" className="mx-2 text-4e7dd9">
        {createdBy && createdBy}
      </span>
      <span
        role="reported-at"
        className="text-9B9B9B"
        title={DateLib.toLongDateFormat(reportedAt, locale)}
      >
        {reportedAt && fromNow(reportedAt)}
      </span>

      {/* Link to ipfs */}
      <span className="absolute inline-flex items-center justify-center ml-2">
        <a
          href={getReplacedString(IPFS_HASH_URL, { ipfsHash })}
          target="_blank"
          rel="noreferrer noopener nofollow"
          className="p-1 -mt-1 text-black"
          title="Open in new tab"
        >
          <span className="sr-only">Open in new tab</span>
          <OpenInNewIcon className="w-4 h-4" />
        </a>
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
 * @param {string} props.ipfsHash
 * @param {JSX.Element} [props.children]
 * @returns
 */
function Report({ header, content, report, children, ipfsHash }) {
  return (
    <>
      <HeaderReport
        type={header.type}
        createdBy={header.createdBy}
        reportedAt={header.reportedAt}
        ipfsHash={ipfsHash}
      />
      <ReportType type={report.type} />

      <div className="block pl-5 text-black border-l border-l-B0C4DB">
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
 * @param {string} props.reportIpfsHash
 * @param {number} props.reportIpfsDataTimeStamp
 * @param {string} [props.disputeIpfsHash]
 * @param {string} [props.disputeIpfsData]
 * @param {number} [props.disputeIpfsDataTimeStamp]
 * @returns
 */
export default function ReportComments({
  reportIpfsData,
  reportIpfsHash,
  reportIpfsDataTimeStamp,
  disputeIpfsData,
  disputeIpfsHash,
  disputeIpfsDataTimeStamp,
}) {
  /**
   * @type {ReportDesputeData}
   */
  const reportData = safeParseString(reportIpfsData, {});

  /**
   * @type {ReportDesputeData}
   */
  const disputeData = safeParseString(disputeIpfsData, {});

  return (
    <OutlinedCard className="p-6 mt-8 bg-white">
      {reportData && (
        <Report
          header={{
            type: t`Reported by`,
            createdBy: reportData?.createdBy,
            reportedAt: reportIpfsDataTimeStamp,
          }}
          report={{
            type: INCIDENT,
          }}
          content={{
            title: reportData?.title,
            description: reportData?.description,
          }}
          ipfsHash={reportIpfsHash}
        >
          {disputeIpfsData && (
            <Report
              header={{
                type: t`Disputed by`,
                createdBy: disputeData?.createdBy,
                reportedAt: disputeIpfsDataTimeStamp,
              }}
              report={{
                type: DISPUTE,
              }}
              content={{
                title: disputeData?.title,
                description: disputeData?.description,
              }}
              ipfsHash={disputeIpfsHash}
            />
          )}
        </Report>
      )}
    </OutlinedCard>
  );
}
