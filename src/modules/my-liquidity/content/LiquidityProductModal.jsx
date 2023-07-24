import { OutlinedButton } from '@/common/Button/OutlinedButton'
import { RegularButton } from '@/common/Button/RegularButton'
import { CoverParameters } from '@/common/CoverParameters/CoverParameters'
import { ModalRegular } from '@/common/Modal/ModalRegular'
import CloseIcon from '@/icons/CloseIcon'
import { MULTIPLIER } from '@/src/config/constants'
import { Routes } from '@/src/config/routes'
import { getCoverImgSrc } from '@/src/helpers/cover'
import { toBN } from '@/utils/bn'
import { formatPercent } from '@/utils/formatter/percent'
import * as Dialog from '@radix-ui/react-dialog'

export function LiquidityProductModal ({ productData, setShowModal }) {
  const imgSrc = getCoverImgSrc({ key: productData.productKey })
  const onClose = () => { return setShowModal(false) }

  const onDownload = () => {
    window.open(Routes.ViewCoverProductTerms(productData.coverKey, productData.productKey), '_blank')
    setShowModal(false)
  }

  return (
    <ModalRegular
      isOpen
      onClose={() => {
        setShowModal(false)
      }}
      data-testid='liquidity-product-modal'
    >
      <div className='grid grid-rows-basket-modal border-1.5 border-B0C4DB relative w-full max-w-lg p-2 xs:p-6 md:p-11 pb-9 text-left align-middle md:min-w-700 lg:min-w-910 max-h-90vh bg-FEFEFF rounded-3xl overflow-hidden'>
        <Dialog.Title
          className='flex flex-col items-center w-full pt-12 pb-5 font-bold border-b md:p-3 md:pt-0 md:flex-row border-b-B0C4DB'
          data-testid='dialog-title'
        >
          <button
            aria-label='Close'
            onClick={onClose}
            className='absolute cursor-pointer right-5 top-5 md:hidden'
            title='close'
          >
            <CloseIcon width={24} height={24} />
          </button>
          <img src={imgSrc} alt={productData?.productInfoDetails?.productName} className='w-8 h-8 mb-2 md:mb-0' />

          <span className='flex-grow mb-1 overflow-hidden text-lg font-bold md:pl-3 md:text-display-xs text-ellipsis md:mb-0'>
            {productData?.productInfoDetails?.productName} Cover Terms
          </span>
          <span className='text-sm font-normal leading-5 md:pl-3 md:text-md lg:text-lg md:font-semibold text-9B9B9B whitespace-nowrap'>
            {formatPercent(
              toBN(productData?.capitalEfficiency)
                .dividedBy(MULTIPLIER)
                .toString()
            )}{' '}
            Capital Efficiency
          </span>
        </Dialog.Title>
        <div className='py-2 pr-6 -mr-6 md:pr-7 md:-mr-7 overflow-y-auto min-h-[0] h-full'>
          <p className='py-2 text-sm font-bold leading-5 md:py-6 text-000000'>
            Cover Rules
          </p>

          <p className='text-sm text-404040'>
            Carefully read the following terms and conditions. For a successful
            claim payout, all of the following points must be true.
          </p>

          <ul
            className='pb-2 mt-5 list-disc text-md marker:text-xs text-404040 md:text-sm md:leading-5'
            data-testid='cover-rules'
          >
            <CoverParameters
              titleClassName='text-sm mt-10 mb-6 font-semibold'
              textClassName='text-404040 text-m text-sm'
              parameters={productData?.productInfoDetails?.parameters}
            />
          </ul>
        </div>

        <div className='flex justify-end pt-6 border-t border-t-B0C4DB'>
          <OutlinedButton
            onClick={onClose}
            className='hidden p-3 mr-6 text-sm font-medium leading-6 tracking-wider border rounded md:text-xs lg:text-md md:inline-block md:font-semibold'
            data-testid='close-button'
          >
            CLOSE
          </OutlinedButton>
          <DownloadButton onClick={onDownload} />
        </div>
      </div>
    </ModalRegular>
  )
}

function DownloadButton ({ onClick }) {
  return (
    <RegularButton
      className='inline-flex items-center justify-center flex-grow-0 w-full px-4 py-3 tracking-wide uppercase rounded outline-none md:w-auto'
      onClick={onClick}
      data-testid='download-button'
    >
      <svg
        width='16'
        height='16'
        viewBox='0 0 16 16'
        fill='none'
        xmlns='http://www.w3.org/2000/svg'
        className='hidden mr-3 scale-75 md:inline'
      >
        <path
          d='M14 11V14H2V11H0V14C0 15.1 0.9 16 2 16H14C15.1 16 16 15.1 16 14V11H14ZM13 7L11.59 5.59L9 8.17V0H7V8.17L4.41 5.59L3 7L8 12L13 7Z'
          fill='#FEFEFF'
        />
      </svg>
      <span className='hidden font-semibold leading-6 md:text-xs lg:text-md md:inline-block'>
        Download Product Cover Terms
      </span>
      <span className='text-sm font-medium md:hidden'>
        Download Cover Terms
      </span>
    </RegularButton>
  )
}
