import { Alert } from '@/common/Alert/Alert'
import { Routes } from '@/src/config/routes'
import { Trans } from '@lingui/macro'

export function DiversifiedCoverRules ({ projectName, coverKey, productKey }) {
  const onDownload = () => {
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

      <Notes projectName={projectName} />
    </>
  )
}

function DownloadButton ({ onClick }) {
  return (
    <div className='text-center mt-7 xl:mt-4 mb-14 xl:text-left'>
      <button
        className='inline-flex items-center justify-center flex-grow-0 px-5 py-3 text-sm font-medium leading-loose tracking-wide text-white uppercase border border-transparent rounded-md hover:bg-opacity-75 bg-primary'
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

function Notes ({ projectName }) {
  return (
    <div className='flex flex-col pt-6' data-testid='notes'>
      <p>
        <Trans>
          Before providing liquidity to or purchasing a product policy from this
          pool, please evaluate all product parameters thoroughly. The
          underwriting capital is concentrated in the &quot;
          {projectName}&quot; pool that covers individual products. Although
          diversified cover pools give LPs much higher returns, they are riskier
          by nature than dedicated cover pools.
        </Trans>
      </p>

      <p className='py-6 font-bold text-display-xs'>
        <Trans>Important Note</Trans>
      </p>

      <p>
        <Trans>
          All rules of individual &quot;{projectName}&quot; products are
          applicable to this pool. If a product&apos;s trigger event results
          resolution, liquidity from this pool will be used to pay out claims.
        </Trans>
      </p>

      <div className='max-w-[800px]'>
        <p className='py-6 font-bold text-display-xs'>
          <Trans>Risk Disclosure / Disclaimer</Trans>
        </p>
        <p className='pb-4'>
          {'In case of a diversified cover liquidity pool, it will only be able to offer payouts upto the pool\'s balance. It is critical that you comprehend all risk aspects before establishing any firm expectations. Please carefully assess the following document:'}
        </p>
        <a
          href='https://docs.neptunemutual.com/usage/risk-factors'
          className='break-all text-4E7DD9'
        >
          https://docs.neptunemutual.com/usage/risk-factors
        </a>
      </div>
    </div>
  )
}
