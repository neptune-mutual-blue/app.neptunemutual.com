import { Alert } from '@/common/Alert/Alert'
import { Routes } from '@/src/config/routes'
import { logCoverProductRulesDownload } from '@/src/services/logs'
import { analyticsLogger } from '@/utils/logger'
import { Trans } from '@lingui/macro'
import { useWeb3React } from '@web3-react/core'

export function DiversifiedCoverRules ({ coverInfo, coverKey, productKey }) {
  const { account, chainId } = useWeb3React()

  const onDownload = () => {
    analyticsLogger(() => logCoverProductRulesDownload(chainId ?? null, account ?? null, coverKey, productKey))
    window.open(Routes.ViewCoverProductTerms(coverKey, productKey), '_blank')
  }
  return (
    <>
      <DownloadButton onClick={onDownload} />

      <Alert closable>
        <Trans>
          The product(s) listed above are part of a diversified cover pool. The
          payout for a diversified cover product is not guaranteed, so it will
          be granted on a first-come, first-serve basis.
        </Trans>
      </Alert>

      <Notes coverInfo={coverInfo} />
    </>
  )
}

function DownloadButton ({ onClick }) {
  return (
    <div className='text-center mt-7 xl:mt-4 mb-14 xl:text-left'>
      <button
        className='inline-flex items-center justify-center flex-grow-0 px-5 py-3 text-sm font-medium leading-loose text-white uppercase border border-transparent rounded-md bg-4e7dd9 hover:bg-opacity-75'
        onClick={onClick}
        data-testid='download-button'
      >
        <svg
          width='16'
          height='16'
          viewBox='0 0 16 16'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'
          className='mr-3'
        >
          <path
            d='M14 11V14H2V11H0V14C0 15.1 0.9 16 2 16H14C15.1 16 16 15.1 16 14V11H14ZM13 7L11.59 5.59L9 8.17V0H7V8.17L4.41 5.59L3 7L8 12L13 7Z'
            fill='#FEFEFF'
          />
        </svg>
        <Trans>Download LP Cover Terms</Trans>
      </button>
    </div>
  )
}

function Notes ({ coverInfo }) {
  const coverName = coverInfo.infoObj.coverName

  return (
    <div className='flex flex-col pt-6' data-testid='notes'>
      <p>
        <Trans>
          Before providing liquidity to or purchasing a product policy from this
          pool, please evaluate all product parameters thoroughly. The
          underwriting capital is concentrated in the &quot;
          {coverName}&quot; pool that covers individual products. Although
          diversified cover pools give LPs much higher returns, they are riskier
          by nature than dedicated cover pools.
        </Trans>
      </p>

      <p className='py-6 font-bold text-h3'>
        <Trans>Important Note</Trans>
      </p>

      <p>
        <Trans>
          All rules of individual &quot;{coverName}&quot; products are
          applicable to this pool. If a product&apos;s trigger event results
          resolution, liquidity from this pool will be used to pay out claims.
        </Trans>
      </p>

      <div className='max-w-[800px]'>
        <p className='py-6 font-bold text-h3'>
          <Trans>Standard Exclusions</Trans>
        </p>
        <p>
          The standard exclusions are enforced on all covers. Neptune Mutual
          reserves the right to update the exclusion list periodically.
        </p>
        <ul className='ml-6 list-disc'>
          <li>
            If we have reason to believe you are an attacker or are directly or
            indirectly associated with an attacker, we reserve the right to
            blacklist you or deny your claims.
          </li>
          <li>
            In addition to coverage lag, we may also blacklist you or deny your
            claims if you purchased coverage just before, on, or the same day of
            the attack.
          </li>
          <li>Minimum total loss should exceed $1 million.</li>
          <li>
            Any loss in which the protocol continues to function as intended is
            not covered.
          </li>
          <li>
            Any type of 51 percent attack or consensus attack on the parent
            blockchain is not covered.
          </li>
          <li>Consensus attack on the protocol is not covered.</li>
          <li>Financial risk can not be covered.</li>
          <li>Bridge-related losses not coverable.</li>
          <li>Backend exploits are not coverable.</li>
          <li>
            {`Gross negligence or misconduct by a project's founders, employees,
            development team, or former employees are not coverable.`}
            <ul className='ml-6 list-disc'>
              <li>Rug pull or theft of funds.</li>
              <li>Project team confiscating user funds. </li>
              <li>
                Attacks by team members or former team members on their protocol.
              </li>
              <li>Compromised private key.</li>
              <li>Compromised API access keys.</li>
              <li>
                Utilization of obsolete or vulnerable dependencies in the
                application or DApp before the coverage period began
              </li>
              <li>
                Developers or insiders creating backdoors to later exploit their
                own protocol.
              </li>
            </ul>
          </li>
        </ul>
        <p className='py-6 font-bold text-h3'>
          <Trans>Risk Disclosure / Disclaimer</Trans>
        </p>
        <p className='pb-4'>
          {'In case of a diversified cover liquidity pool, it will only be able to offer payouts upto the pool\'s balance. It is critical that you comprehend all risk aspects before establishing any firm expectations. Please carefully assess the following document:'}
        </p>
        <a
          href='https://docs.neptunemutual.com/usage/risk-factors'
          className='break-all text-4e7dd9'
        >
          https://docs.neptunemutual.com/usage/risk-factors
        </a>
      </div>
    </div>
  )
}
