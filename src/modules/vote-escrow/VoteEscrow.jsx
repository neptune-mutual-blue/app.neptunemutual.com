import { useState } from 'react'

import Link from 'next/link'

import { RegularButton } from '@/common/Button/RegularButton'
import { Checkbox } from '@/common/Checkbox/Checkbox'
import { CopyAddressComponent } from '@/common/Header/AccountDetailsModal'
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
import VoteEscrowTitle from '@/modules/vote-escrow/VoteEscrowTitle'
import { NpmTokenContractAddresses } from '@/src/config/constants'
import { useAppConstants } from '@/src/context/AppConstants'
import { useNetwork } from '@/src/context/Network'
import { useVoteEscrowData } from '@/src/hooks/contracts/useVoteEscrowData'
import { useRegisterToken } from '@/src/hooks/useRegisterToken'
import { classNames } from '@/utils/classnames'
import { useWeb3React } from '@web3-react/core'

const VoteEscrow = () => {
  const [sliderValue, setSliderValue] = useState(4)
  const [extend, setExtend] = useState(false)
  const [agreed, setAgreed] = useState(false)

  const { active } = useWeb3React()

  const [unlock, setUnlock] = useState(false)

  const { networkId } = useNetwork()

  const [input, setInput] = useState('')

  const { data, lock, unlock: unlockNPMTokens, actionLoading, canLock, handleApprove, hasUnlockAllowance, handleApproveUnlock } = useVoteEscrowData()

  const { register } = useRegisterToken()

  const { NPMTokenDecimals } = useAppConstants()

  const canUnlock = data.veNPMBalance.short !== 'N/A'

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

  const allowanceExists = canLock(input || '0')

  return (
    <div>
      <VoteEscrowCard>
        <VoteEscrowTitle title='Get Vote Escrow NPM' />
        <EscrowSummary veNPMBalance={data.veNPMBalance} unlockTimestamp={data.unlockTimestamp} />
        <div className='p-8'>

          <div className='text-center text-xl font-semibold'>
            Get Boosted Voting Power
          </div>

          <div className='text-center text-md mb-8'>
            boosted Liquidity Gauge Emissions
          </div>

          <div className='mb-4 flex justify-between items-center'>
            <div className='text-md font-semibold'>NPM to Lock</div>
            <div className='flex items-center text-sm'>
              <Checkbox
                checked={extend} onChange={(e) => {
                  setExtend(e.target.checked)
                  if (e.target.checked) {
                    setInput('')
                  }
                }} className='border-1 border-gray-300 rounded-1 h-4 w-4 m-0' id='extend-checkbox' labelClassName='ml-1'
              >
                Extend Only
              </Checkbox>
            </div>
          </div>

          <div className={extend ? 'opacity-50 cursor-not-allowed' : ''}>
            <div className='rounded-2 mb-2 border-1 border-B0C4DB overflow-hidden grid grid-cols-[1fr_auto] focus-within:ring-4E7DD9 focus-within:ring focus-within:ring-offset-0 focus-within:ring-opacity-30'>
              <div className='relative'>
                <input
                  value={input} onChange={(e) => {
                    // eslint-disable-next-line
                    if (/^[0-9\.]*$/.test(e.target.value)) {
                      setInput(e.target.value)
                    }
                  }} type='text' className={classNames('py-5 px-6 text-lg outline-none', extend ? 'cursor-not-allowed' : '')} placeholder='0.00' disabled={extend}
                />
                <div className='absolute text-9B9B9B text-lg top-5 right-4'>NPM</div>
              </div>
              <button
                className='bg-E6EAEF py-5 px-6 text-lg' onClick={() => {
                  setInput(data.npmBalance.short.split(' ')[0].replace(/,/g, ''))
                }}
                disabled={extend}
              >
                Max
              </button>
            </div>

            <div className='flex justify-between items-center mb-6'>
              <div className='text-md text-9B9B9B'>Balance: {data.npmBalance.short}</div>
              <div className='flex gap-4'>
                <CopyAddressComponent account={NpmTokenContractAddresses[networkId]} iconOnly iconClassName='text-AAAAAA h-6 w-6' />
                <a href={getTokenLink(networkId, NpmTokenContractAddresses[networkId])} target='_blank' className={extend ? 'cursor-not-allowed' : ''} rel='noreferrer'>
                  <LaunchIcon className='text-AAAAAA h-6 w-6' />
                </a>
                <button
                  className={extend ? 'cursor-not-allowed' : ''} onClick={() => {
                    register(NpmTokenContractAddresses[networkId], 'NPM', NPMTokenDecimals)
                  }}
                >
                  <AddCircleIcon className='text-AAAAAA h-6 w-6' />
                </button>
              </div>
            </div>
          </div>

          <Slider
            label='Duration'
            id='escrow-duration'
            min={4} max={208} value={sliderValue} onChange={(value) => {
              setSliderValue(parseInt(value))
            }}
          />

          <div className='flex justify-between text-sm mb-8'>
            <div>{sliderValue} weeks</div>
            <div>Unlocks: {DateLib.toDateFormat(DateLib.addDays(new Date(), sliderValue * 7), 'en', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
            </div>
          </div>

          <div className='grid grid-cols-[auto_1fr] gap-2 mb-6'>
            <Checkbox
              checked={agreed} onChange={(e) => {
                setAgreed(e.target.checked)
              }} className='border-1 border-gray-300 rounded-1 h-4 w-4 m-0' id='agree-terms-escrow'
            />
            <label htmlFor='agree-terms-escrow' className='-mt-0.5'>
              I hereby acknowledge my obligation to pay a penalty fee of 25% in the event that I prematurely unlock, as per the applicable <a href='https://neptunemutual.com/policies/standard-terms-and-conditions/' target='_blank' className='text-1170FF' rel='noreferrer'>terms and conditions</a>.
            </label>
          </div>

          <RegularButton
            disabled={!(active && agreed && !actionLoading && ((!extend && input) || extend))} onClick={() => {
              if (allowanceExists) {
                lock(input || '0', sliderValue, onLockSuccess)
              } else {
                handleApprove(input || '0', sliderValue)
              }
            }} className='w-full rounded-tooltip p-4 font-semibold text-md normal-case'
          >
            {active ? extend ? 'EXTEND MY DURATION' : allowanceExists ? 'GET veNPM TOKENS' : 'Approve' : 'Connect Wallet'}
          </RegularButton>

          <KeyValueList
            className='my-6'
            list={[
              {
                key: 'Boost:',
                value: data.boost + 'x'
              },
              {
                key: 'Locked:',
                value: data.lockedNPMBalance.short,
                tooltip: data.lockedNPMBalance.long
              },
              {
                key: 'Power:',
                value: data.votingPower.short,
                tooltip: data.votingPower.long
              }
            ]}
          />

          <div className='text-right'>
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
      <div className='w-[489px] mx-auto mt-4'>
        <div className='flex justify-between'>
          <Link href='/pools/liquidity-gauge-pools'>
            <div className='text-4E7DD9 text-sm font-semibold cursor-pointer'>
              View Liquidity Gauge
            </div>
          </Link>
          <Link href='#'>
            <div className='text-4E7DD9 text-sm cursor-pointer font-semibold flex items-center gap-1'>
              Submit Your Vote <ExternalLinkIcon />
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default VoteEscrow
