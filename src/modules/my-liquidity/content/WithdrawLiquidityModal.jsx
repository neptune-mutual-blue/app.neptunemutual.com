import { useState } from 'react'
import * as Dialog from '@radix-ui/react-dialog'

import { ModalRegular } from '@/common/Modal/ModalRegular'
import { ModalCloseButton } from '@/common/Modal/ModalCloseButton'
import { ModalWrapper } from '@/common/Modal/ModalWrapper'
import { WithdrawLiquidityForm } from '@/src/modules/my-liquidity/content/WithdrawLiquidityForm'

export const WithdrawLiquidityModal = ({ modalTitle, isOpen, onClose }) => {
  const [isDisabled, setIsDisabled] = useState(false)

  return (
    <ModalRegular
      isOpen={isOpen}
      onClose={onClose}
      disabled={isDisabled}
      data-testid='withdraw-liquidity-modal'
    >
      <ModalWrapper className='max-w-lg !px-0 bg-f6f7f9'>
        <div className='px-8 sm:px-12'>
          <Dialog.Title className='flex font-bold font-sora text-h2'>
            {modalTitle}
          </Dialog.Title>
        </div>

        <ModalCloseButton
          disabled={isDisabled}
          onClick={onClose}
        />
        <WithdrawLiquidityForm setModalDisabled={setIsDisabled} />
      </ModalWrapper>
    </ModalRegular>
  )
}
