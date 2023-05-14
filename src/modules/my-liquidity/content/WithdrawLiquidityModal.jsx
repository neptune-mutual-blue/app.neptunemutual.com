import { useState } from 'react'

import { ModalCloseButton } from '@/common/Modal/ModalCloseButton'
import { ModalRegular } from '@/common/Modal/ModalRegular'
import { ModalWrapper } from '@/common/Modal/ModalWrapper'
import {
  WithdrawLiquidityForm
} from '@/src/modules/my-liquidity/content/WithdrawLiquidityForm'
import * as Dialog from '@radix-ui/react-dialog'

export const WithdrawLiquidityModal = ({ modalTitle, isOpen, onClose }) => {
  const [isDisabled, setIsDisabled] = useState(false)

  return (
    <ModalRegular
      isOpen={isOpen}
      onClose={onClose}
      disabled={isDisabled}
      data-testid='withdraw-liquidity-modal'
    >
      <ModalWrapper className='max-w-lg !px-0 bg-F6F7F9'>
        <div className='px-8 sm:px-12'>
          <Dialog.Title className='flex font-bold text-display-sm'>
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
