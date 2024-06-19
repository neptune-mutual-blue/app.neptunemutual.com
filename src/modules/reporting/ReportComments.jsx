import {
  useEffect,
  useState
} from 'react'

import { useRouter } from 'next/router'

import { OutlinedCard } from '@/common/OutlinedCard/OutlinedCard'
import OpenInNewIcon from '@/icons/OpenInNewIcon'
import { getAddressLink } from '@/lib/connect-wallet/utils/explorer'
import DateLib from '@/lib/date/DateLib'
import { NPM_IPFS_HASH_URL } from '@/src/config/constants'
import { useNetwork } from '@/src/context/Network'
import { readFromIpfs } from '@/src/services/api/ipfs/read'
import { fromNow } from '@/utils/formatter/relative-time'
import { getReplacedString } from '@/utils/string'
import {
  t,
  Trans
} from '@lingui/macro'
import { useLingui } from '@lingui/react'

const INCIDENT = 0
const DISPUTE = 1

/**
 * @param {{ type: string; createdBy: string; reportedAt: number; ipfsHash: string; }} props
 */
function HeaderReport (props) {
  const { locale } = useRouter()
  const { type, createdBy, reportedAt, ipfsHash } = props
  const { networkId } = useNetwork()

  return (
    <div className='flex flex-wrap gap-2 text-sm sm:flex-nowrap'>
      <span data-testid='header-type'>{type}</span>
      <span data-testid='address' className='overflow-hidden text-4E7DD9'>
        {createdBy && (
          <a
            href={getAddressLink(networkId, createdBy)}
            target='_blank'
            rel='noreferrer noopener nofollow'
            className='block overflow-hidden text-ellipsis'
          >
            {createdBy}
          </a>
        )}
      </span>
      <span
        data-testid='reported-at'
        className='text-9B9B9B shrink-0'
        title={DateLib.toLongDateFormat(reportedAt, locale)}
      >
        {reportedAt && fromNow(reportedAt, locale)}
      </span>

      {/* Link to ipfs */}
      <span className='inline-flex items-start justify-center'>
        <a
          href={getReplacedString(NPM_IPFS_HASH_URL, { ipfsHash })}
          target='_blank'
          rel='noreferrer noopener nofollow'
          className='p-1 -mt-1 text-black'
          title='Open in new tab'
        >
          <span className='sr-only'>Open in new tab</span>
          <OpenInNewIcon className='w-4 h-4' />
        </a>
      </span>
    </div>
  )
}

/**
 * @param {{ type: number; }} props
 */
function ReportType (props) {
  const { type } = props

  return (
    <div className='my-3'>
      <span
        data-testid='report-type'
        className={`${
          type === INCIDENT ? 'bg-21AD8C' : 'bg-FA5C2F'
        } text-white text-xs p-0.5 px-1 rounded-1`}
      >
        {type === INCIDENT
          ? (
            <Trans>Incident Occurred</Trans>
            )
          : (
            <Trans>False Reporting</Trans>
            )}
      </span>
    </div>
  )
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
function Report ({ header, content, report, children, ipfsHash }) {
  return (
    <>
      <HeaderReport
        type={header.type}
        createdBy={header.createdBy}
        reportedAt={header.reportedAt}
        ipfsHash={ipfsHash}
      />
      <ReportType type={report.type} />

      <div className='block pl-5 text-black border-l border-l-B0C4DB'>
        <h3 data-testid='title' className='font-semibold text-md'>
          {content.title}
        </h3>
        <p data-testid='desc' className='text-md'>
          {content.description}
        </p>

        {children && (
          <div data-testid='dispute' className='mt-8'>
            {children}
          </div>
        )}
      </div>
    </>
  )
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
 * @param {string} props.reportIpfsHash
 * @param {number} props.reportIpfsDataTimeStamp
 * @param {string} [props.disputeIpfsHash]
 * @param {number} [props.disputeIpfsDataTimeStamp]
 * @returns
 */
export default function ReportComments ({
  reportIpfsHash,
  reportIpfsDataTimeStamp,
  disputeIpfsHash,
  disputeIpfsDataTimeStamp
}) {
  /**
   * @type {[?ReportDesputeData, import('react').Dispatch<import('react').SetStateAction<ReportDesputeData>>]}
   */
  const [reportData, setReportData] = useState()

  /**
   * @type {[?ReportDesputeData, import('react').Dispatch<import('react').SetStateAction<ReportDesputeData>>]}
   */
  const [disputeData, setDisputeData] = useState()

  useEffect(() => {
    if (!reportIpfsHash && !disputeIpfsHash) { return }

    async function fetchIpfs () {
      if (reportIpfsHash) {
        const _reportData = await readFromIpfs(reportIpfsHash)
        if (_reportData) { setReportData(_reportData) }
      }

      if (disputeIpfsHash) {
        const _disputeData = await readFromIpfs(disputeIpfsHash)
        if (_disputeData) { setDisputeData(_disputeData) }
      }
    }

    fetchIpfs()
  }, [reportIpfsHash, disputeIpfsHash])

  const { i18n } = useLingui()

  if (!reportData) { return null }

  return (
    <OutlinedCard className='p-6 mt-8 bg-white'>
      <Report
        header={{
          type: t(i18n)`Reported by`,
          createdBy: reportData?.createdBy,
          reportedAt: reportIpfsDataTimeStamp
        }}
        report={{
          type: INCIDENT
        }}
        content={{
          title: reportData?.title,
          description: reportData?.description
        }}
        ipfsHash={reportIpfsHash}
      >
        {disputeData && (
          <Report
            header={{
              type: t(i18n)`Disputed by`,
              createdBy: disputeData?.createdBy,
              reportedAt: disputeIpfsDataTimeStamp
            }}
            report={{
              type: DISPUTE
            }}
            content={{
              title: disputeData?.title,
              description: disputeData?.description
            }}
            ipfsHash={disputeIpfsHash}
          />
        )}
      </Report>
    </OutlinedCard>
  )
}
