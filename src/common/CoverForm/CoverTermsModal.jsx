import { CoverParameters } from '@/common/CoverParameters/CoverParameters'
import { ModalRegular } from '@/common/Modal/ModalRegular'
import CloseIcon from '@/icons/CloseIcon'
import PDFFileIcon from '@/icons/PDFFileIcon'
import { Routes } from '@/src/config/routes'
import * as Dialog from '@radix-ui/react-dialog'

export function CoverTermsModal ({
  coverKey,
  productKey,
  setShowModal,
  projectOrProductName,
  parameters,
  imgSrc
}) {
  const onClose = () => { return setShowModal(false) }

  const onDownload = () => {
    window.open(Routes.ViewCoverProductTerms(coverKey, productKey || ''), '_blank')
  }

  return (
    <ModalRegular
      isOpen
      onClose={onClose}
      className='md:w-max'
      overlayProps={{ onClick: onClose }}
    >
      <div className='grid grid-rows-basket-modal border-1.5 border-B0C4DB relative w-full max-w-lg p-4 md:p-11 pb-9 text-left align-middle md:min-w-700 lg:min-w-910 max-h-90vh bg-FEFEFF rounded-3xl overflow-hidden'>
        <Dialog.Title
          className='flex flex-row items-center w-full pb-5 font-bold border-b md:p-3 border-b-B0C4DB'
        >
          <button
            aria-label='Close'
            onClick={onClose}
            className='absolute cursor-pointer right-5 top-5'
            title='close'
          >
            <CloseIcon width={24} height={24} />
          </button>
          <img src={imgSrc} alt={projectOrProductName} className='w-8 h-8' />

          <span className='flex-grow pl-3 overflow-hidden text-lg font-bold md:text-display-xs text-ellipsis'>
            {projectOrProductName} Cover Terms
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
          >
            <CoverParameters
              titleClassName='text-sm mt-10 mb-6 font-semibold'
              textClassName='text-404040 text-m text-sm'
              parameters={parameters}
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
  return (
    <button
      className='inline-flex items-center justify-center flex-grow-0 w-full gap-1 p-3 tracking-wide text-white uppercase border border-transparent rounded md:w-auto bg-primary'
      onClick={onClick}
    >
      <PDFFileIcon />
      <span className='font-semibold tracking-wider uppercase text-md'>
        Download PDF
      </span>
    </button>
  )
}
