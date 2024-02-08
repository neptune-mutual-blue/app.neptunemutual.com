import { useState } from 'react'

import BigNumber from 'bignumber.js'
import Link from 'next/link'
import { useRouter } from 'next/router'

import { RegularButton } from '@/common/Button/RegularButton'
import { Checkbox } from '@/common/Checkbox/Checkbox'
import { DataLoadingIndicator } from '@/common/DataLoadingIndicator'
import { GaugeChartSemiCircle } from '@/common/GaugeChart/GaugeChartSemiCircle'
import Slider from '@/common/Slider/Slider'
import { TokenAmountInput } from '@/common/TokenAmountInput/TokenAmountInput'
import ExternalLinkIcon from '@/icons/ExternalLinkIcon'
import DateLib from '@/lib/date/DateLib'
import EscrowSummary from '@/modules/vote-escrow/EscrowSummary'
import KeyValueList from '@/modules/vote-escrow/KeyValueList'
import UnlockEscrow from '@/modules/vote-escrow/UnlockEscrow'
import { useDeviceSize } from '@/modules/vote-escrow/useDeviceSize'
import VoteEscrowCard from '@/modules/vote-escrow/VoteEscrowCard'
import {
  MULTIPLIER,
  PREMATURE_UNLOCK_PENALTY_FRACTION,
  WEEKS
} from '@/src/config/constants'
import { ChainConfig } from '@/src/config/hardcoded'
import { Routes } from '@/src/config/routes'
import { useAppConstants } from '@/src/context/AppConstants'
import { useNetwork } from '@/src/context/Network'
import { useVoteEscrowData } from '@/src/hooks/contracts/useVoteEscrowData'
import { useVoteEscrowLock } from '@/src/hooks/contracts/useVoteEscrowLock'
import {
  convertFromUnits,
  convertToUnits,
  toBN,
  toBNSafe
} from '@/utils/bn'
import {
  calculateBoost,
  getBoostText,
  getBoostTextClass
} from '@/utils/calculate-boost'
import { classNames } from '@/utils/classnames'
import { formatCurrency } from '@/utils/formatter/currency'
import { formatPercent } from '@/utils/formatter/percent'
import { getSpaceLink } from '@/utils/snapshot'
import { Trans } from '@lingui/macro'

const VOTE_ESCROW_MIN_WEEKS = 1
const VOTE_ESCROW_MAX_WEEKS = 208

const VoteEscrow = () => {
  const [input, setInput] = useState('')
  const [extend, setExtend] = useState(false)
  const [agreed, setAgreed] = useState(false)
  const [unlock, setUnlock] = useState(false)

  // null when slider is untouched
  const [sliderValue, setSliderValue] = useState(null)

  const { networkId } = useNetwork()

  const router = useRouter()
  const { NPMTokenDecimals, NPMTokenSymbol, NPMTokenAddress } = useAppConstants()
  const veNPMTokenSymbol = ChainConfig[networkId || 1].veNPM.tokenSymbol
  const veNPMTokenDecimals = ChainConfig[networkId || 1].veNPM.tokenDecimals
  const veNPMTokenAddress = ChainConfig[networkId || 1].veNPM.address
  const { isMobile } = useDeviceSize()

  const {
    data,
    // loading,
    refetch: refetchLockData
  } = useVoteEscrowData()
  const {
    canLock,
    data: { npmBalance },
    loadingAllowance,
    loadingBalance,
    lock,
    locking,
    approving,
    handleApprove
  } = useVoteEscrowLock({
    refetchLockData,
    lockAmountInUnits: convertToUnits(input || '0', NPMTokenDecimals),
    veNPMTokenAddress,
    NPMTokenAddress,
    NPMTokenSymbol
  })

  const oldLockDurationBN = toBNSafe(data.unlockTimestamp).isGreaterThan(DateLib.unix())
    ? toBNSafe(data.unlockTimestamp).minus(DateLib.unix()) // to duration left
    : toBN(0)

  const oldDurationInWeeks = oldLockDurationBN
    .dividedBy(WEEKS) // to weeks
    .decimalPlaces(0, BigNumber.ROUND_CEIL) // rounding
    .toNumber()

  const lockDuration = sliderValue
    ? (sliderValue * WEEKS)
    : oldLockDurationBN.decimalPlaces(0, BigNumber.ROUND_CEIL) // rounding
      .toNumber()

  const boost = toBN(calculateBoost(lockDuration)).dividedBy(MULTIPLIER).toString()

  const oldLockedNpm = data.lockedNPMBalance
  const newLockedNpm = toBN(oldLockedNpm)
    .plus(convertToUnits(input || '0', NPMTokenDecimals)).toString()

  const formattedLockedNpm = formatCurrency(convertFromUnits(newLockedNpm, NPMTokenDecimals), router.locale, NPMTokenSymbol, true)

  const votingPower = toBN(boost).multipliedBy(newLockedNpm)
  const formattedVotingPower = formatCurrency(convertFromUnits(votingPower, NPMTokenDecimals), router.locale, NPMTokenSymbol, true)

  const canUnlock = toBN(data.veNPMBalance).isGreaterThan(0)
  if (unlock) {
    return (
      <UnlockEscrow
        veNPMBalance={data.veNPMBalance}
        veNPMTokenAddress={veNPMTokenAddress}
        veNPMTokenSymbol={veNPMTokenSymbol}
        veNPMTokenDecimals={veNPMTokenDecimals}
        unlockTimestamp={data.unlockTimestamp}
        onBack={() => {
          setUnlock(false)
        }}
        refetchLockData={refetchLockData}
      />
    )
  }

  const onLockSuccess = () => {
    setExtend(false)
    setAgreed(false)
    setInput('')
  }

  const handleChange = (val) => {
    if (typeof val === 'string') { setInput(val) }
  }

  const handleMax = () => {
    if (toBN(npmBalance).isGreaterThan(0)) {
      setInput(convertFromUnits(npmBalance, NPMTokenDecimals).toString())
    }
  }

  const submitUrl = getSpaceLink(networkId)

  // When slider is untouched, display old data
  const sliderDisplayValue = sliderValue || oldDurationInWeeks || VOTE_ESCROW_MIN_WEEKS
  const unlockDate = sliderValue ? DateLib.addDays(new Date(), sliderValue * 7) : DateLib.fromUnix(data.unlockTimestamp)
  const formattedUnlockDate = {
    long: DateLib.toLongDateFormat(unlockDate, router.locale),
    short: DateLib.toDateFormat(unlockDate, 'en', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  let loadingMessage = ''
  if (loadingBalance) {
    loadingMessage = <Trans>Fetching balance...</Trans>
  } else if (loadingAllowance) {
    loadingMessage = <Trans>Fetching allowance...</Trans>
  }

  const buttonDisabled = locking || !!loadingMessage || !(agreed && ((!extend && input) || extend))

  const LabelComponent = () => {
    return (
      <div className='flex items-center justify-between mt-6 mb-4'>
        <div className='font-semibold text-md'>NPM to Lock</div>
        <div className='flex items-center text-sm'>
          <Checkbox
            disabled={!canUnlock}
            checked={extend}
            onChange={(e) => {
              setExtend(e.target.checked)
              if (e.target.checked) {
                setInput('')
              }
            }}
            className='w-4 h-4 m-0 border-gray-300 border-1 rounded-1' id='extend-checkbox'
            labelClassName='ml-1'
          >
            Extend Only
          </Checkbox>
        </div>
      </div>
    )
  }

  return (
    <div className='max-w-[990px] mx-auto'>
      <VoteEscrowCard className='!max-w-full p-5 md:p-8 rounded-2xl flex flex-wrap gap-4 justify-between items-end mb-6'>
        <div>
          <h2 className='mb-1 font-semibold text-display-sm text-4E7DD9'>Get Vote Escrow NPM</h2>
          <p className='text-sm'>Get boosted voting power and boosted gauge emissions</p>
        </div>
        <div className='flex flex-wrap gap-4'>
          <Link
            href={Routes.LiquidityGaugePools}
            className='text-4E7DD9 text-sm font-semibold p-2.5 flex-grow text-center md:text-left md:flex-grow-0 border-1 border-4E7DD9 rounded-tooltip'
          >

            View Liquidity Gauge

          </Link>
          <a
            target='_blank' href={submitUrl} rel='noreferrer'
            className='text-4E7DD9 text-sm font-semibold p-2.5  border-1 border-4E7DD9 flex-grow text-center justify-center md:justify-start md:text-left md:flex-grow-0 rounded-tooltip flex items-center gap-1'
          >
            <Trans>Submit Your Vote</Trans> <ExternalLinkIcon />
          </a>
        </div>
      </VoteEscrowCard>
      <VoteEscrowCard className='!max-w-full grid grid-cols-1 lg:grid-cols-2 gap-8 p-5 md:p-8'>
        <div>
          <EscrowSummary
            className='bg-F3F5F7'
            veNPMBalance={data.veNPMBalance}
            veNPMTokenSymbol={veNPMTokenSymbol}
            unlockTimestamp={data.unlockTimestamp}
          />

          <LabelComponent />
          <TokenAmountInput
            labelText=''
            onChange={handleChange}
            handleChooseMax={handleMax}
            tokenAddress={NPMTokenAddress}
            tokenSymbol={NPMTokenSymbol}
            tokenDecimals={NPMTokenDecimals}
            tokenBalance={npmBalance || '0'}
            inputId='npm-amount'
            inputValue={input}
            disabled={extend}
          />
        </div>
        <div>

          <div className='p-4 rounded-lg md:p-6 bg-F3F5F7'>
            <div className='mb-4'>
              <GaugeChartSemiCircle chartDiameter={isMobile ? 240 : undefined} min={1} max={4} value={boost} />
              <div className='max-w-[308px] mx-auto mt-2 text-xs font-semibold flex justify-between'>
                <div className='text-EAAA08'>Minimum</div>
                <div className='text-479E28'>Maximum</div>
              </div>
              <div className='font-semibold text-center text-md'>
                {parseFloat(boost).toFixed(2)}
              </div>
              <div className={classNames('text-sm font-semibold text-center', getBoostTextClass(boost))}>
                {getBoostText(parseFloat(boost))}
              </div>
            </div>

            <Slider
              label='Duration'
              id='escrow-duration'
              min={VOTE_ESCROW_MIN_WEEKS}
              max={VOTE_ESCROW_MAX_WEEKS}
              value={sliderDisplayValue}
              onChange={(value) => {
                if (value >= oldDurationInWeeks) { // only allows increasing the duration
                  setSliderValue(parseInt(value))
                }
              }}
            />

            <div className='flex justify-between mb-8 text-sm'>
              <div>{sliderDisplayValue} weeks</div>
              <div>
                <div className='text-xs text-right'>
                  Unlocks on:
                </div>
                <div title={formattedUnlockDate.long}>
                  {formattedUnlockDate.short}
                </div>
              </div>
            </div>

            <div className='grid grid-cols-[auto_1fr] gap-2 mb-4'>
              <Checkbox
                checked={agreed} onChange={(e) => {
                  setAgreed(e.target.checked)
                }} className='w-4 h-4 m-0 border-gray-300 border-1 rounded-1' id='agree-terms-escrow'
              />
              <label htmlFor='agree-terms-escrow' className='-mt-0.5 text-sm'>
                I hereby acknowledge my obligation to pay a penalty fee of {formatPercent(PREMATURE_UNLOCK_PENALTY_FRACTION)} in the event that I prematurely unlock, as per the applicable <a href='https://neptunemutual.com/policies/standard-terms-and-conditions/' target='_blank' className='text-1170FF' rel='noreferrer'>terms and conditions</a>.
              </label>
            </div>

            <DataLoadingIndicator message={loadingMessage} />

            {canLock && (
              <RegularButton
                disabled={buttonDisabled}
                onClick={() => {
                  lock(input || '0', sliderDisplayValue, onLockSuccess)
                }}
                className='w-full p-4 font-semibold normal-case rounded-tooltip text-md'
              >
                {extend ? 'EXTEND MY DURATION' : 'GET veNPM TOKENS'}
              </RegularButton>
            )}

            {!canLock && (
              <RegularButton
                disabled={buttonDisabled}
                onClick={() => {
                  handleApprove(input || '0')
                }}
                className='w-full p-4 font-semibold uppercase rounded-tooltip text-md'
              >
                {
                  approving
                    ? <Trans>Approving...</Trans>
                    : <><Trans>Approve</Trans> {NPMTokenSymbol}</>
                }
              </RegularButton>
            )}
            <KeyValueList
              className='p-0 pt-6 mt-6 rounded-none border-t-1 border-B0C4DB'
              list={[
                {
                  key: 'Boost:',
                  value: parseFloat(boost).toFixed(2) + 'x',
                  tooltip: boost + 'x'
                },
                {
                  key: 'Locked:',
                  value: formattedLockedNpm.short,
                  tooltip: formattedLockedNpm.long
                },
                {
                  key: 'Power:',
                  value: formattedVotingPower.short,
                  tooltip: formattedVotingPower.long
                }
              ]}
            />

          </div>
          <div className='mt-6 text-right'>
            <button
              disabled={!canUnlock}
              className={classNames('text-4E7DD9 text-sm font-semibold', !canUnlock ? 'opacity-50 cursor-not-allowed' : '')} onClick={() => {
                document.querySelector('#vote-escrow-page').scrollIntoView({ behavior: 'smooth' })
                setUnlock(true)
              }}
            >Unlock
            </button>
          </div>
        </div>

      </VoteEscrowCard>

    </div>
  )
}

export default VoteEscrow
