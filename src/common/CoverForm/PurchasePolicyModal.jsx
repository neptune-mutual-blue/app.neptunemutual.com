import { ModalRegular } from '@/common/Modal/ModalRegular'
import { ModalCloseButton } from '@/common/Modal/ModalCloseButton'
import { ModalWrapper } from '@/common/Modal/ModalWrapper'
import { Trans } from '@lingui/macro'
import { Routes } from '@/src/config/routes'
import { useRouter } from 'next/router'
import OpenInNewIcon from '@/icons/OpenInNewIcon'
import SuccessIcon from '@/lib/toast/components/icons/SuccessIcon'
import { Loader } from '@/common/Loader/Loader'
import Link from 'next/link'
import { classNames } from '@/utils/classnames'

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
    >
      <ModalWrapper className='max-w-lg bg-f6f7f9'>
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
      <SuccessIcon className='w-18 h-18 text-21AD8C' aria-hidden='true' />
      <h4 className='max-w-xs mt-8 font-bold leading-9 text-center text-h2'><Trans>Cover Purchased Successfully!</Trans></h4>

      <Link href={Routes.ViewPolicyReceipt(txHash)}>
        <a
          target='_blank'
          className={classNames(
            'text-EEEEEE border border-4e7dd9 rounded-lg bg-4e7dd9 focus:outline-none focus-visible:ring-2 focus-visible:ring-4e7dd9',
            'flex items-center justify-center w-full p-6 mt-8 font-semibold text-white uppercase text-h6 md:min-w-sm')}
          onClick={() => {
            onClose()
          }}
        >

          <Trans>View Policy Receipt</Trans>
          <OpenInNewIcon className='w-4 h-4 ml-2' fill='currentColor' />
        </a>
      </Link>
    </div>
  )
}

function Loading () {
  return (
    <div className='flex flex-col items-center'>
      <Loader className='w-18 h-18 text-4e7dd9' />
      <h4 className='font-bold leading-9 text-center mt-7 font-sora text-h2'>
        <Trans>Transaction in progress</Trans>
      </h4>
      <p className='mt-4 leading-6 text-center font-poppins text-para md:w-72'>
        <Trans>Please do not exit this page while transaction is in progress</Trans>
      </p>
    </div>
  )
}
