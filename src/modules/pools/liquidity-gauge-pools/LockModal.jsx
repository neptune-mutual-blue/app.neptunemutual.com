import { useState } from 'react'

import { useRouter } from 'next/router'

import { RegularButton } from '@/common/Button/RegularButton'
import { ModalRegular } from '@/common/Modal/ModalRegular'
import { TokenAmountInput } from '@/common/TokenAmountInput/TokenAmountInput'
import CloseIcon from '@/icons/CloseIcon'
import { convertFromUnits } from '@/utils/bn'
import { formatCurrency } from '@/utils/formatter/currency'
import {
  t,
  Trans
} from '@lingui/macro'
import * as Dialog from '@radix-ui/react-dialog'

export const LockModal = ({
  modalTitle,
  isOpen,
  onClose,
  imgSrc,
  lockupPeriod,
  isReceive,
  isAdd,
  isLock,
  balance,
  token,
  emissionReceived,
  handleSwitch,
  current
}) => {
  const [inputValue, setInputValue] = useState('')

  const router = useRouter()

  const handleChooseMax = () => {
    setInputValue(convertFromUnits(8373.838).toString())
  }

  const handleChange = (val) => {
    if (typeof val === 'string') {
      setInputValue(val)
    }
  }

  return (
    <ModalRegular
      isOpen={isOpen}
      onClose={onClose}
      className='max-w-520'
      overlayProps={{ onClick: onClose }}
    >
      <div className='w-full overflow-hidden bg-white border-B0C4DB rounded-2xl'>
        <Dialog.Title
          className='relative flex justify-center w-full px-3 py-4 font-semibold border-b border-b-B0C4DB'
        >
          <div className='flex flex-row items-center gap-2.5'>
            <button
              aria-label='Close'
              onClick={onClose}
              className='absolute cursor-pointer right-4 top-[50%] -mt-[10px]'
              title='close'
            >
              <CloseIcon width={20} height={20} />
            </button>
            <img src={imgSrc} alt='token-logo' className='w-10 h-10' />

            <span className='text-xl'>
              {modalTitle}
            </span>
          </div>
        </Dialog.Title>

        <div className='px-8 py-6 pb-8'>
          {isReceive && (
            <div className={`${isReceive ? 'mb-6' : ''}`}>
              <button type='button' onClick={() => handleSwitch('receive')} className={`px-4 py-2 text-sm font-semibold text-primary rounded-big ${current === 'receive' ? 'bg-DEEAF6' : ''}`}>Receive</button>
              <button type='button' onClick={() => handleSwitch('unlock')} className={`px-4 py-2 text-sm font-semibold text-primary rounded-big ${current === 'unlock' ? 'bg-DEEAF6' : ''}`}>Unlock</button>
            </div>
          )}

          {(isLock || isAdd || current === 'unlock') && (
            <TokenAmountInput
              labelText={t`Enter Amount You Wish to ${isLock ? 'Lock' : isAdd ? 'Add' : 'Unlock'}`}
              tokenBalance={93883.39}
              tokenSymbol='iUSDC-PRIME'
              tokenAddress='0x8474933'
              handleChooseMax={handleChooseMax}
              inputValue={inputValue}
              id='token-amount'
              onChange={handleChange}
            >
              {/* {errorMsg && (
                <p className='flex items-center text-FA5C2F'>{errorMsg}</p>
              )} */}
            </TokenAmountInput>
          )}

          {(isLock || isAdd) && (
            <RegularButton
              className='w-full p-3 mt-6 font-semibold uppercase sm:min-w-auto sm:w-full'
            >
              <Trans>Lock</Trans>
            </RegularButton>
          )}

          <div className='flex flex-col gap-4 p-4 mt-6 bg-F3F5F7 rounded-big'>
            {(isLock || isAdd) && (
              <div className='flex flex-row items-center justify-between text-sm'>
                <span>Lockup Period</span>
                <span className='font-semibold'>{new Date(lockupPeriod).getHours()} hrs</span>
              </div>
            )}
            {isAdd && (
              <div className='flex flex-row items-center justify-between text-sm'>
                <span>TVL</span>
                <span className='font-semibold'>{formatCurrency(1200000).short}</span>
              </div>
            )}

            {(isReceive && current === 'receive') && (
              <>
                <div className='flex flex-row items-center justify-between text-sm'>
                  <span>Your Balance</span>
                  <span className='font-semibold'>
                    {`${formatCurrency(balance, router.locale, '', true, true).long} ${token}`}
                  </span>
                </div>
                <div className='flex flex-row items-center justify-between text-sm'>
                  <span>Emission Received</span>
                  <span className='font-semibold'>{emissionReceived} NPM</span>
                </div>
              </>
            )}
            {(isReceive && current === 'unlock') && (
              <div className='flex flex-row items-center justify-between text-sm'>
                <span>Emission Received</span>
                <span className='font-semibold'>{emissionReceived} NPM</span>
              </div>
            )}
          </div>

          {isReceive && (
            <RegularButton
              className='w-full p-3 mt-6 font-semibold uppercase sm:min-w-auto sm:w-full'
            >
              <Trans>{current === 'receive' ? 'Receive' : 'Unlock'}</Trans>
            </RegularButton>
          )}
        </div>
      </div>
    </ModalRegular>
  )
}
