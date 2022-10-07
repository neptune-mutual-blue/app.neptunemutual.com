import { ModalRegular } from '@/common/Modal/ModalRegular'
import { ModalCloseButton } from '@/common/Modal/ModalCloseButton'
import { ModalWrapper } from '@/common/Modal/ModalWrapper'
import { Trans } from '@lingui/macro'
import { Routes } from '@/src/config/routes'
import { RegularButton } from '@/common/Button/RegularButton'
import { useRouter } from 'next/router'
import OpenInNewIcon from '@/icons/OpenInNewIcon'
import { CompleteSvg } from './assets/CompleteSvg'
import { LoadingSvg } from './assets/LoadingSvg'

/**
 * @param {{ isOpen: boolean, txHash: string }} prop
 * @returns
 */
export const PurchasePolicyModal = ({
  isOpen,
  txHash
}) => {
  const router = useRouter()

  const hanldeClose = () => {
    router.push(Routes.MyPolicies)
  }

  return (
    <ModalRegular
      isOpen={isOpen}
      onClose={hanldeClose}
      data-testid='purchase-policy-status'
      className='max-w-lg'
    >
      <ModalWrapper className='bg-f1f3f6 !p-10'>
        {
          txHash ? <Complete txHash={txHash} onClose={hanldeClose} /> : <Loading />
        }
      </ModalWrapper>
    </ModalRegular>
  )
}

/**
 * @param {{ txHash: string, onClose: Function }} prop
 */
function Complete ({ txHash, onClose }) {
  return (
    <div className='flex flex-col items-center'>
      <ModalCloseButton
        disabled={false}
        onClick={onClose}
      />
      <CompleteSvg className='w-14 h-14 mb-8 mt-6' />
      <h4 className='font-bold mb-8 w-64 text-h2 leading-9 text-center'><Trans>Cover Purchased Successfully!</Trans></h4>

      <RegularButton
        className='p-6 font-semibold uppercase text-h6 text-white flex justify-center items-center min-w-sm w-full'
        onClick={() => {
          window.open(Routes.ViewPolicyReceipt(txHash), '_blank')
          onClose()
        }}
      >
        <Trans>View Policy Receipt</Trans>
        <OpenInNewIcon className='w-4 h-4 ml-2' fill='currentColor' />
      </RegularButton>
    </div>
  )
}

function Loading () {
  return (
    <div className='flex flex-col items-center'>
      <LoadingSvg />
      <h4 className='font-sora mt-6 text-h2 leading-9 font-bold text-center'><Trans>Transaction in progress</Trans></h4>
      <p className='font-poppins text-para leading-6 mt-4 w-72 text-center'>
        <Trans>Please do not exit this page while transaction is in progress</Trans>
      </p>
    </div>
  )
}
