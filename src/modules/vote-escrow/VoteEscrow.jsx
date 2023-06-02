import {
  useCallback,
  useEffect,
  useState
} from 'react'

import Link from 'next/link'
import { useRouter } from 'next/router'

import { RegularButton } from '@/common/Button/RegularButton'
import { Checkbox } from '@/common/Checkbox/Checkbox'
import {
  CopyAddressComponent
} from '@/common/CopyAddressComponent/CopyAddressComponent'
import { GaugeChartSemiCircle } from '@/common/GaugeChart/GaugeChartSemiCircle'
import Slider from '@/common/Slider/Slider'
import AddCircleIcon from '@/icons/AddCircleIcon'
import ExternalLinkIcon from '@/icons/ExternalLinkIcon'
import LaunchIcon from '@/icons/LaunchIcon'
import { getTokenLink } from '@/lib/connect-wallet/utils/explorer'
import DateLib from '@/lib/date/DateLib'
import EscrowSummary from '@/modules/vote-escrow/EscrowSummary'
import KeyValueList from '@/modules/vote-escrow/KeyValueList'
import UnlockEscrow from '@/modules/vote-escrow/UnlockEscrow'
import VoteEscrowCard from '@/modules/vote-escrow/VoteEscrowCard'
import {
  MULTIPLIER,
  NpmTokenContractAddresses,
  SNAPSHOT_INTERFACE_URL,
  SNAPSHOT_SPACE_ID
} from '@/src/config/constants'
import { useAppConstants } from '@/src/context/AppConstants'
import { useNetwork } from '@/src/context/Network'
import { useVoteEscrowData } from '@/src/hooks/contracts/useVoteEscrowData'
import { useRegisterToken } from '@/src/hooks/useRegisterToken'
import {
  convertFromUnits,
  convertToUnits,
  toBN
} from '@/utils/bn'
import {
  calculateBoost,
  getBoostText,
  getBoostTextClass
} from '@/utils/calculate-boost'
import { classNames } from '@/utils/classnames'
import { formatCurrency } from '@/utils/formatter/currency'
import { useWeb3React } from '@web3-react/core'
import CurrencyInput from '@/lib/react-currency-input-field'
import { getNetworkInfo } from '@/utils/network'

export const secondsInWeek = 604_800
export const VOTE_ESCROW_MIN_WEEKS = 1
export const VOTE_ESCROW_MAX_WEEKS = 208

const VoteEscrow = () => {
  const [extend, setExtend] = useState(false)
  const [agreed, setAgreed] = useState(false)

  const { active } = useWeb3React()

  const [unlock, setUnlock] = useState(false)

  const { networkId } = useNetwork()
  const { isTestNet } = getNetworkInfo(networkId)

  const [input, setInput] = useState('')

  const { data, lock, unlock: unlockNPMTokens, actionLoading, canLock, handleApprove, hasUnlockAllowance, handleApproveUnlock } = useVoteEscrowData()

  const { register } = useRegisterToken()

  const { NPMTokenDecimals } = useAppConstants()

  const canUnlock = data.veNPMBalance.short !== 'N/A'

  const router = useRouter()

  const allowanceExists = canLock(input || '0')

  const now = Date.now()

  const unlockDateTimestamp = (data.unlockTimestamp !== '0' ? new Date(data.unlockTimestamp).valueOf() : now)

  const unlockDuration = (unlockDateTimestamp - now) / 1000

  const weeks = Math.ceil(unlockDuration / secondsInWeek)

  useEffect(() => {
    if (weeks !== 0) {
      const weekInFraction = (unlockDuration / secondsInWeek) % 1 !== 0

      if (weekInFraction && weeks > VOTE_ESCROW_MIN_WEEKS) {
        setUnlockDate(DateLib.toDateFormat(unlockDateTimestamp / 1000, 'en', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }))
      }

      setSliderValue(weeks < VOTE_ESCROW_MIN_WEEKS ? VOTE_ESCROW_MIN_WEEKS : weeks)
    }
  }, [weeks, unlockDateTimestamp, unlockDuration])

  const [sliderValue, setSliderValue] = useState(1)

  const newUnlockDate = DateLib.addDays(new Date(), sliderValue * 7)

  const [unlockDate, setUnlockDate] = useState(DateLib.toDateFormat(newUnlockDate, 'en', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }))

  const boostBN = toBN(calculateBoost((newUnlockDate.valueOf() - now) / 1000)).dividedBy(MULTIPLIER)
  const boost = boostBN.toString()

  const lockedNpmBalance = toBN(data.lockedNPMBalanceRaw).plus(convertToUnits(input || '0'))

  const votingPower = formatCurrency(convertFromUnits(boostBN.multipliedBy(lockedNpmBalance).toString(), NPMTokenDecimals), router.locale, 'NPM', true)

  const lockedNpm = formatCurrency(convertFromUnits(lockedNpmBalance.toString(), NPMTokenDecimals), router.locale, 'NPM', true)

  const [isSmallDevice, setIsSmallDevice] = useState(window.innerWidth < 475)

  // choose the screen size
  const handleResize = useCallback(() => {
    if (window.innerWidth < 768) {
      setIsSmallDevice(true)
    } else {
      setIsSmallDevice(false)
    }
  }, [])

  // create an event listener
  useEffect(() => {
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [handleResize])

  if (unlock) {
    return (
      <UnlockEscrow
        hasUnlockAllowance={hasUnlockAllowance}
        handleApproveUnlock={handleApproveUnlock}
        loading={actionLoading}
        data={data}
        unlockNPMTokens={unlockNPMTokens}
        onBack={() => {
          setUnlock(false)
        }}
      />
    )
  }

  const onLockSuccess = () => {
    setExtend(false)
    setAgreed(false)
    setInput('')
  }

  const inputFieldProps = {
    className: classNames('py-5 px-6 text-lg outline-none', extend ? 'cursor-not-allowed' : ''),
    placeholder: '0.00',
    disabled: extend,
    intlConfig: {
      locale: router.locale
    },
    autoComplete: 'off',
    decimalsLimit: 25,
    onChange: null,
    value: input,
    onValueChange: val => setInput(val)
  }

  const submitUrl = isTestNet
    ? `${SNAPSHOT_INTERFACE_URL.testnet}/#/${SNAPSHOT_SPACE_ID}`
    : `${SNAPSHOT_INTERFACE_URL.mainnet}/#/${SNAPSHOT_SPACE_ID}`

  return (
    <div className='max-w-[990px] mx-auto'>
      <VoteEscrowCard className='!max-w-full p-5 md:p-8 rounded-2xl flex flex-wrap gap-4 justify-between items-end mb-6'>
        <div>
          <h2 className='mb-1 font-semibold text-display-sm text-4E7DD9'>Get Vote Escrow NPM</h2>
          <p className='text-sm'>Get boosted voting power and boosted gauge emissions</p>
        </div>
        <div className='flex flex-wrap gap-4'>
          <Link href='/pools/liquidity-gauge-pools'>
            <a className='text-4E7DD9 text-sm font-semibold p-2.5 flex-grow text-center md:text-left md:flex-grow-0 border-1 border-4E7DD9 rounded-tooltip'>
              View Liquidity Gauge
            </a>
          </Link>
          <a target='_blank' href={submitUrl} rel='noreferrer'>
            <a className='text-4E7DD9 text-sm font-semibold p-2.5  border-1 border-4E7DD9 flex-grow text-center justify-center md:justify-start md:text-left md:flex-grow-0 rounded-tooltip flex items-center gap-1'>
              Submit Your Vote <ExternalLinkIcon />
            </a>
          </a>
        </div>
      </VoteEscrowCard>
      <VoteEscrowCard className='!max-w-full grid grid-cols-1 lg:grid-cols-2 gap-8 p-5 md:p-8'>
        <div>
          <EscrowSummary className='bg-F3F5F7' veNPMBalance={data.veNPMBalance} unlockTimestamp={data.unlockTimestamp} />
          <div className='mt-6'>
            <div className='flex items-center justify-between mb-4'>
              <div className='font-semibold text-md'>NPM to Lock</div>
              <div className='flex items-center text-sm'>
                <Checkbox
                  disabled={!canUnlock}
                  checked={extend} onChange={(e) => {
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

            <div className={extend ? 'opacity-50 cursor-not-allowed relative' : 'relative'}>
              <div className='rounded-2 mb-2 border-1 border-B0C4DB overflow-hidden grid grid-cols-[1fr_auto] focus-within:ring-4E7DD9 focus-within:ring focus-within:ring-offset-0 focus-within:ring-opacity-30'>
                <div className='relative'>
                  <CurrencyInput
                    {...inputFieldProps}
                  />
                  <div className='absolute text-lg text-9B9B9B top-5 right-4'>NPM</div>
                </div>
              </div>
              <button
                className='bg-E6EAEF py-5 px-6 text-lg absolute top-[1px] right-[1px] rounded-tr-2 rounded-br-2' onClick={() => {
                  if (data.npmBalance.short !== 'N/A') {
                    setInput(data.npmBalance.long.split(' ')[0].replace(/,/g, ''))
                  }
                }}
                disabled={extend}
              >
                Max
              </button>

              <div className='flex items-center justify-between mb-6'>
                <div className='text-md text-9B9B9B'>Balance: {data.npmBalance.short}</div>
                <div className='flex gap-4'>
                  <CopyAddressComponent account={NpmTokenContractAddresses[networkId]} iconOnly iconClassName='text-AAAAAA h-6 w-6' />
                  <a href={getTokenLink(networkId, NpmTokenContractAddresses[networkId])} target='_blank' className={extend ? 'cursor-not-allowed' : ''} rel='noreferrer'>
                    <LaunchIcon className='w-6 h-6 text-AAAAAA' />
                  </a>
                  <button
                    className={extend ? 'cursor-not-allowed' : ''} onClick={() => {
                      register(NpmTokenContractAddresses[networkId], 'NPM', NPMTokenDecimals)
                    }}
                  >
                    <AddCircleIcon className='w-6 h-6 text-AAAAAA' />
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
        <div>

          <div className='p-4 rounded-lg md:p-6 bg-F3F5F7'>
            <div className='mb-4'>
              <GaugeChartSemiCircle chartDiameter={isSmallDevice ? 240 : undefined} min={1} max={4} value={boost} />
              <div className='max-w-[308px] mx-auto mt-2 text-xs font-semibold flex justify-between'>
                <div className='text-EAAA08'>Minimum</div>
                <div className='text-479E28'>Maximum</div>
              </div>
              <div className='font-semibold text-center text-md'>
                {parseFloat(boost).toFixed(2)}
              </div>
              <div className={classNames('text-sm font-semibold text-center', getBoostTextClass(boost))}>
                {getBoostText(boost)} Boost
              </div>
            </div>

            <Slider
              label='Duration'
              id='escrow-duration'
              min={VOTE_ESCROW_MIN_WEEKS}
              max={VOTE_ESCROW_MAX_WEEKS}
              value={sliderValue}
              onChange={(value) => {
                if (value >= weeks) {
                  setSliderValue(parseInt(value))

                  setUnlockDate(DateLib.toDateFormat(DateLib.addDays(new Date(), value * 7), 'en', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  }))
                }
              }}
            />

            <div className='flex justify-between mb-8 text-sm'>
              <div>{sliderValue} weeks</div>
              <div>
                <div className='text-xs text-right'>
                  Unlocks on:
                </div>
                <div>
                  {unlockDate}
                </div>
              </div>
            </div>

            <div className='grid grid-cols-[auto_1fr] gap-2 mb-6'>
              <Checkbox
                checked={agreed} onChange={(e) => {
                  setAgreed(e.target.checked)
                }} className='w-4 h-4 m-0 border-gray-300 border-1 rounded-1' id='agree-terms-escrow'
              />
              <label htmlFor='agree-terms-escrow' className='-mt-0.5 text-sm'>
                I hereby acknowledge my obligation to pay a penalty fee of 25% in the event that I prematurely unlock, as per the applicable <a href='https://neptunemutual.com/policies/standard-terms-and-conditions/' target='_blank' className='text-1170FF' rel='noreferrer'>terms and conditions</a>.
              </label>
            </div>

            <RegularButton
              disabled={!(active && agreed && !actionLoading && ((!extend && input) || extend))} onClick={() => {
                if (allowanceExists) {
                  lock(input || '0', sliderValue, onLockSuccess)
                } else {
                  handleApprove(input || '0')
                }
              }} className='w-full p-4 font-semibold normal-case rounded-tooltip text-md'
            >
              {active ? extend ? 'EXTEND MY DURATION' : allowanceExists ? 'GET veNPM TOKENS' : 'Approve' : 'Connect Wallet'}
            </RegularButton>

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
                  value: lockedNpm.short,
                  tooltip: lockedNpm.long
                },
                {
                  key: 'Power:',
                  value: votingPower.short,
                  tooltip: votingPower.long
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
