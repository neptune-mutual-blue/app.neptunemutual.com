import { OutlinedButton } from '@/common/Button/OutlinedButton'
import { useLiquidityFormsContext } from '@/common/LiquidityForms/LiquidityFormsContext'
import { DedicatedLiquidityResolutionSources } from '@/common/LiquidityResolutionSources/DedicatedLiquidityResolutionSources'
import { DiversifiedLiquidityResolutionSources } from '@/common/LiquidityResolutionSources/DiversifiedLiquidityResolutionSources'
import { ModalTitle } from '@/common/Modal/ModalTitle'
import { WithdrawLiquidityModal } from '@/modules/my-liquidity/content/WithdrawLiquidityModal'
import { getCoverImgSrc } from '@/src/helpers/cover'
import { log } from '@/src/services/logs'
import { isGreater } from '@/utils/bn'
import { safeFormatBytes32String } from '@/utils/formatter/bytes32String'
import { analyticsLogger } from '@/utils/logger'
import { Trans } from '@lingui/macro'
import { useWeb3React } from '@web3-react/core'
import { useRouter } from 'next/router'
import { useState } from 'react'

export const LiquidityResolutionSources = ({
  isDiversified,
  coverInfo,
  info,
  isWithdrawalWindowOpen,
  accrueInterest
}) => {
  const { account, chainId } = useWeb3React()
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()
  const { coverId } = router.query
  const coverKey = safeFormatBytes32String(coverId)

  const {
    info: { myStake, myPodBalance }
  } = useLiquidityFormsContext()

  const imgSrc = getCoverImgSrc({ key: coverKey })

  const onClose = () => {
    setIsOpen(false)
  }

  const handleLog = () => {
    const funnel = 'Withdraw Liquidity'
    const journey = `my-${router?.query?.coverId}-liquidity-page`

    const sequence = 1
    const step = 'withdraw-liquidity-button'
    const event = 'click'
    const props = {
      coverKey,
      coverName: coverInfo?.infoObj?.coverName
    }

    const sequence2 = 2
    const step2 = 'withdraw-liquidity-modal'
    const event2 = 'pop-up'

    analyticsLogger(() => {
      log(chainId, funnel, journey, step, sequence, account, event, props)
      log(chainId, funnel, journey, step2, sequence2, account, event2, {})
    })
  }

  const onOpen = () => {
    setIsOpen(true)
    handleLog()
  }

  return (
    <div
      className='col-span-3 row-start-2 lg:col-auto lg:row-start-auto'
      data-testid='liquidity-resolution-container'
    >
      {isDiversified
        ? (
          <DiversifiedLiquidityResolutionSources info={info}>
            <WithdrawLiquidityButton
              onOpen={onOpen}
              myStake={myStake}
              podBalance={myPodBalance}
            />
          </DiversifiedLiquidityResolutionSources>
          )
        : (
          <DedicatedLiquidityResolutionSources coverInfo={coverInfo} info={info}>
            <WithdrawLiquidityButton
              onOpen={onOpen}
              myStake={myStake}
              podBalance={myPodBalance}
            />
          </DedicatedLiquidityResolutionSources>
          )}
      <div className='flex justify-end'>
        {isWithdrawalWindowOpen && (
          <button
            className='mt-4 mr-2 text-sm tracking-wide uppercase text-4e7dd9 hover:underline disabled:hover:no-underline'
            onClick={accrueInterest}
          >
            <Trans>Accrue</Trans>
          </button>
        )}
      </div>

      <WithdrawLiquidityModal
        modalTitle={
          <ModalTitle imgSrc={isDiversified ? null : imgSrc}>
            <Trans>Withdraw Liquidity</Trans>
          </ModalTitle>
        }
        onClose={onClose}
        isOpen={isOpen}
      />
    </div>
  )
}

const WithdrawLiquidityButton = ({ onOpen, myStake, podBalance }) => {
  return (
    <>
      {(isGreater(myStake, '0') || isGreater(podBalance, '0')) && (
        <div className='flex justify-center mt-8 px-7'>
          <OutlinedButton
            className='!text-sm font-medium rounded-big'
            onClick={onOpen}
          >
            <Trans>Withdraw Liquidity</Trans>
          </OutlinedButton>
        </div>
      )}
    </>
  )
}
