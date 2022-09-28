import { Trans } from '@lingui/macro'

export function DiversifiedCoverRules ({ coverInfo }) {
  return (
    <>
      <DownloadButton />
      <WarningMessage />
      <Notes coverInfo={coverInfo} />
    </>
  )
}

function DownloadButton () {
  return (
    <div className='text-center mt-7 xl:mt-0 mb-14 xl:text-left'>
      <button
        className='inline-flex items-center justify-center flex-grow-0 px-5 py-3 text-sm font-medium leading-loose text-white uppercase border border-transparent rounded-md bg-4e7dd9 hover:bg-opacity-75'
        onClick={() => {}}
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

function WarningMessage () {
  return (
    <div
      className='flex items-center justify-center px-10 py-4 text-sm bg-F7E2BE'
      data-testid='warning-message'
    >
      <div>
        <svg
          width='20'
          height='20'
          viewBox='0 0 20 20'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'
        >
          <path
            d='M9 5H11V7H9V5ZM9 9H11V15H9V9ZM10 0C4.48 0 0 4.48 0 10C0 15.52 4.48 20 10 20C15.52 20 20 15.52 20 10C20 4.48 15.52 0 10 0ZM10 18C5.59 18 2 14.41 2 10C2 5.59 5.59 2 10 2C14.41 2 18 5.59 18 10C18 14.41 14.41 18 10 18Z'
            fill='#E52E2E'
          />
        </svg>
      </div>

      <p className='px-6 leading-5 text-E52E2E'>
        <Trans>
          The product(s) listed above are part of a diversified cover pool. The
          payout for a diversified cover product is not guaranteed, so it will
          be granted on a first-come, first-serve basis.
        </Trans>
      </p>

      <div>
        <svg
          width='10'
          height='10'
          viewBox='0 0 10 10'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'
        >
          <path
            d='M9.66634 1.27301L8.72634 0.333008L4.99967 4.05967L1.27301 0.333008L0.333008 1.27301L4.05967 4.99967L0.333008 8.72634L1.27301 9.66634L4.99967 5.93967L8.72634 9.66634L9.66634 8.72634L5.93967 4.99967L9.66634 1.27301Z'
            fill='#E52E2E'
          />
        </svg>
      </div>
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
  )
}
