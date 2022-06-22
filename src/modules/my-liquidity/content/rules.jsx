import AcceptTerms from "@/modules/my-liquidity/content/accept-form.tsx";
import { Trans } from "@lingui/macro";

/**
 *
 * @param {{
 * setAcceptedRules: (bool: boolean) => void
 * }} param0
 * @returns
 */
export default function Rules({ setAcceptedRules }) {
  return (
    <>
      <DownloadButton />

      <WarningMessage />
      <Notes setAcceptedRules={setAcceptedRules} />
    </>
  );
}

function DownloadButton() {
  return (
    <div className="pb-14">
      <button
        className="inline-flex flex-grow-0 items-center justify-center text-sm font-medium leading-loose text-white border border-transparent rounded-md bg-4e7dd9 hover:bg-opacity-75 py-3 px-5"
        onClick={() => {}}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="mr-3"
        >
          <path
            d="M14 11V14H2V11H0V14C0 15.1 0.9 16 2 16H14C15.1 16 16 15.1 16 14V11H14ZM13 7L11.59 5.59L9 8.17V0H7V8.17L4.41 5.59L3 7L8 12L13 7Z"
            fill="#FEFEFF"
          />
        </svg>
        Download LP Cover Terms
      </button>
    </div>
  );
}

function WarningMessage() {
  return (
    <div className="flex items-center justify-center bg-F7E2BE  py-4 px-11 text-sm">
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M9 5H11V7H9V5ZM9 9H11V15H9V9ZM10 0C4.48 0 0 4.48 0 10C0 15.52 4.48 20 10 20C15.52 20 20 15.52 20 10C20 4.48 15.52 0 10 0ZM10 18C5.59 18 2 14.41 2 10C2 5.59 5.59 2 10 2C14.41 2 18 5.59 18 10C18 14.41 14.41 18 10 18Z"
          fill="#E52E2E"
        />
      </svg>

      <p className="px-7 text-E52E2E">
        <Trans>
          The product(s) listed above are part of a diversified cover pool. The
          payout for a diversified cover product is not guaranteed, so it will
          be granted on a first-come, first-serve basis.
        </Trans>
      </p>

      <svg
        width="10"
        height="10"
        viewBox="0 0 10 10"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M9.66634 1.27301L8.72634 0.333008L4.99967 4.05967L1.27301 0.333008L0.333008 1.27301L4.05967 4.99967L0.333008 8.72634L1.27301 9.66634L4.99967 5.93967L8.72634 9.66634L9.66634 8.72634L5.93967 4.99967L9.66634 1.27301Z"
          fill="#E52E2E"
        />
      </svg>
    </div>
  );
}

/**
 *
 * @param {{
 * setAcceptedRules: (bool: boolean) => void
 * }} param0
 * @returns
 */
function Notes({ setAcceptedRules }) {
  return (
    <div className="flex flex-col pt-6">
      <p>
        <Trans>
          {`Before providing liquidity to or purchasing a product policy from this
          pool, please evaluate all product parameters thoroughly. The
          underwriting capital is concentrated in the "Popular DeFi Apps" pool
          that covers individual products. Although diversified cover pools give
          LPs much higher returns, they are riskier by nature than dedicated
          cover pools.`}
        </Trans>
      </p>

      <p className="text-h3 font-bold py-6">
        <Trans>Important Note</Trans>
      </p>

      <p>
        <Trans>
          {`All rules of individual “Popular DeFi Apps” products are applicable to
          this pool. If a product's trigger event results resolution, liquidity
          from this pool will be used to pay out claims.`}
        </Trans>
      </p>

      <p className="text-h3 font-bold py-6">
        <Trans>Standard Exclusions</Trans>
      </p>

      <p>
        The standard exclusions are enforced on all covers. Neptune Mutual
        reserves the right to update the exclusion list periodically.
      </p>

      <ul className="list-disc ml-6">
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
          <ul className="list-disc ml-6">
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

      <p className="text-h3 font-bold py-6">
        <Trans>Risk Disclosure / Disclaimer</Trans>
      </p>

      <p className="pb-4">
        {`In case of a diversified cover liquidity pool, it will only be able to offer payouts upto the pool's balance. It is critical that you comprehend all risk aspects before establishing any firm expectations. Please carefully assess the following document:`}
      </p>

      <a
        href="https://docs.neptunemutual.com/usage/risk-factors"
        className="text-4e7dd9"
      >
        https://docs.neptunemutual.com/usage/risk-factors
      </a>

      <AcceptTerms
        onAccept={() => {
          setAcceptedRules(true);
        }}
      >
        I have read, evaluated, understood, agreed to, and accepted all risks,
        cover terms, exclusions, standard exclusions of this pool and the
        Neptune Mutual protocol.
      </AcceptTerms>
    </div>
  );
}
