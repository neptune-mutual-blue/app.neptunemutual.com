import { CoverParameters } from '@/common/CoverParameters/CoverParameters'
import { ModalRegular } from '@/common/Modal/ModalRegular'
import CloseIcon from '@/icons/CloseIcon'
import PDFFileIcon from '@/icons/PDFFileIcon'
import { Routes } from '@/src/config/routes'
import { useNetwork } from '@/src/context/Network'
import { getCoverImgSrc } from '@/src/helpers/cover'
import { useValidateNetwork } from '@/src/hooks/useValidateNetwork'
import { classNames } from '@/utils/classnames'
import * as Dialog from '@radix-ui/react-dialog'

/**
 * @typedef {{
 *  coverKey: string,
 *  productKey?: string,
 *  infoObj: {
 *    coverName?: string,
 *    productName?: string,
 *    parameters: any[]
 *  }
 * }} CoverOrProductItem
 *
 *
 * @param {{
 *   item: CoverOrProductItem
 *   setShowModal: (_bool: boolean) => void
 * }} param0
 * @returns
 */
export function CoverTermsModal ({ item, setShowModal }) {
  const imgSrc = getCoverImgSrc({ key: item.productKey || item.coverKey })
  const onClose = () => setShowModal(false)

  const onDownload = () => {
    window.open(Routes.ViewCoverProductTerms(item.coverKey, item.productKey || ''), '_blank')
  }

  return (
    <ModalRegular
      isOpen
      onClose={onClose}
      className='md:w-max'
      overlayProps={{ onClick: onClose }}
    >
      <div className='grid grid-rows-basket-modal border-1.5 border-B0C4DB relative w-full max-w-lg p-2 xs:p-6 md:p-11 pb-9 text-left align-middle md:min-w-700 lg:min-w-910 max-h-90vh bg-FEFEFF rounded-3xl overflow-hidden'>
        <Dialog.Title
          className='flex flex-col items-center w-full pt-12 pb-5 font-bold border-b md:p-3 md:pt-0 md:flex-row font-sora border-b-B0C4DB'
        >
          <button
            aria-label='Close'
            onClick={onClose}
            className='absolute cursor-pointer right-5 top-5 md:hidden'
            title='close'
          >
            <CloseIcon width={24} height={24} />
          </button>
          <img src={imgSrc} alt={item.infoObj.productName || item.infoObj.coverName} className='w-8 h-8 mb-2 md:mb-0' />

          <span className='flex-grow mb-1 overflow-hidden font-bold text-h4 md:pl-3 md:text-h3 text-ellipsis md:mb-0'>
            {item.infoObj.productName || item.infoObj.coverName} Cover Terms
          </span>
        </Dialog.Title>
        <div className='py-2 pr-6 -mr-6 md:pr-7 md:-mr-7 overflow-y-auto font-sora min-h-[0] h-full'>
          <p className='py-2 text-sm font-bold leading-5 md:py-6 text-000000'>
            Cover Rules
          </p>

          <p className='text-sm font-poppins text-404040'>
            Carefully read the following terms and conditions. For a successful
            claim payout, all of the following points must be true.
          </p>

          <ul
            className='pb-2 mt-5 list-disc text-md marker:text-xs font-poppins text-404040 md:text-sm md:leading-5'
          >
            <CoverParameters
              titleClassName='text-sm mt-10 mb-6 font-semibold font-sora'
              textClassName='font-poppins text-404040 text-m text-sm'
              parameters={item.infoObj.parameters}
            />
          </ul>
        </div>

        <div className='flex justify-end pt-6 border-t border-t-B0C4DB'>
          <DownloadButton onClick={onDownload} />
        </div>
      </div>
    </ModalRegular>
  )
}

function DownloadButton ({ onClick }) {
  const { networkId } = useNetwork()
  const { isMainNet } = useValidateNetwork(networkId)

  return (
    <button
      className={classNames(
        'inline-flex items-center justify-center tracking-wide flex-grow-0 w-full p-3 gap-1 uppercase border border-transparent rounded md:w-auto',
        isMainNet ? 'text-4e7dd9' : 'text-5D52DC'
      )}
      onClick={onClick}
    >
      <PDFFileIcon />
      <span className='font-semibold uppercase text-h6 font-poppins'>
        Download PDF
      </span>
    </button>
  )
}
