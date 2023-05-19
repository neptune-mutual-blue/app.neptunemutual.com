import { useState } from 'react'

import { InfoTooltip } from '@/common/Cover/InfoTooltip'
import AddIcon from '@/icons/AddIcon'
import { LockModal } from '@/modules/pools/liquidity-gauge-pools/LockModal'

export const LiquidityGaugeCardAction = ({ lockupPeriod, tokenName, tokenIcon, isLock, subTitle, balance, token, emissionReceived }) => {
  const [modal, setModal] = useState(false)
  const [isReceive, setIsReceive] = useState(false)
  const [isAdd, setIsAdd] = useState(false)
  const [isUnlock, setIsUnlock] = useState(false)
  const [current, setCurrent] = useState('receive')

  const handleReceiveModal = () => {
    setIsReceive(true)
    setModal(true)
  }

  const handleAddModal = () => {
    setIsAdd(true)
    setModal(true)
  }

  const handleCloseModal = () => {
    setIsReceive(false)
    setIsAdd(false)
    setModal(false)
  }

  const handleSwitch = (value) => {
    setCurrent(value)

    if (value === 'unlock') setIsUnlock(true)
    else setIsUnlock(false)
  }

  return (
    <>
      <div className='flex mt-6 md:mt-0 flex-col md:flex-row md:items-center justify-between'>
        <div className='flex flex-col gap-1'>
          <div className='text-sm text-999BAB'>
            Lockup Period:{' '}
            <span className='font-semibold text-01052D'>
              {new Date(lockupPeriod).getHours()} hrs approx
            </span>
          </div>
          <div className='flex flex-row items-center gap-1'>
            <div className='text-sm text-999BAB'>Reward Tokens:</div>
            <InfoTooltip infoComponent={`${tokenName} Token`} className='text-[11px] px-2 py-0.75 bg-opacity-100'>
              <button type='button' className='cursor-default'><img src={tokenIcon} alt='npm_icon' className='w-6' /></button>
            </InfoTooltip>
          </div>
        </div>

        <div className='mt-4 md:mt-0'>
          {isLock
            ? (
              <button onClick={() => setModal(true)} className='px-4 py-3 font-semibold tracking-wide text-white uppercase rounded-[10px] bg-primary hover:bg-opacity-90 w-full md:max-w-[216px] flex-auto'>
                Lock
              </button>
              )
            : (
              <div className='flex flex-row gap-2'>
                <button onClick={handleReceiveModal} className='px-4 py-3 font-semibold tracking-wide text-white uppercase rounded-[10px] bg-primary hover:bg-opacity-90  w-[156px] flex-auto'>
                  Receive
                </button>
                <button onClick={handleAddModal} className='px-4 py-3 font-semibold tracking-wide uppercase rounded-[10px] bg-primary hover:bg-opacity-90'>
                  <AddIcon
                    className='w-5 h-5 fill-white'
                  />
                </button>
              </div>
              )}
        </div>
      </div>

      <LockModal
        isOpen={modal}
        onClose={handleCloseModal}
        modalTitle={`${isLock ? 'Lock' : ''} ${isReceive && !isUnlock ? 'Receive' : ''} ${isReceive && isUnlock ? 'Unlock' : ''} ${isAdd ? 'Add' : ''} ${subTitle} ${isAdd ? 'Lock' : ''}`}
        imgSrc={tokenIcon}
        lockupPeriod={lockupPeriod}
        isReceive={isReceive}
        isAdd={isAdd}
        isLock={isLock}
        balance={balance}
        token={token}
        emissionReceived={emissionReceived}
        handleSwitch={handleSwitch}
        current={current}
      />
    </>
  )
}
