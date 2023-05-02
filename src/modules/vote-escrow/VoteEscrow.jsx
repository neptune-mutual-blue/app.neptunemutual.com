import { useState } from 'react'

import Link from 'next/link'

import { RegularButton } from '@/common/Button/RegularButton'
import { Checkbox } from '@/common/Checkbox/Checkbox'
import Slider from '@/common/Slider/Slider'
import AddCircleIcon from '@/icons/AddCircleIcon'
import CopyIcon from '@/icons/CopyIcon'
import ExternalLinkIcon from '@/icons/ExternalLinkIcon'
import LaunchIcon from '@/icons/LaunchIcon'
import DateLib from '@/lib/date/DateLib'
import EscrowSummary from '@/modules/vote-escrow/EscrowSummary'
import KeyValueList from '@/modules/vote-escrow/KeyValueList'
import UnlockEscrow from '@/modules/vote-escrow/UnlockEscrow'
import VoteEscrowCard from '@/modules/vote-escrow/VoteEscrowCard'
import VoteEscrowTitle from '@/modules/vote-escrow/VoteEscrowTitle'
import { classNames } from '@/utils/classnames'

const VoteEscrow = () => {
  const [sliderValue, setSliderValue] = useState(4)
  const [extend, setExtend] = useState(false)
  const [unlock, setUnlock] = useState(false)

  if (unlock) {
    return (
      <UnlockEscrow onBack={() => {
        setUnlock(false)
      }}
      />
    )
  }

  return (
    <div>
      <VoteEscrowCard>
        <VoteEscrowTitle title='Get Vote Escrow NPM' />
        <EscrowSummary />
        <div className='p-8'>

          <div className='text-center text-xl font-semibold'>
            Get Boosted Voting Power
          </div>

          <div className='text-center text-md mb-8'>
            and boosted POD Staking APR
          </div>

          <div className='mb-4 flex justify-between items-center'>
            <div className='text-md font-semibold'>NPM to lock</div>
            <div className='flex items-center text-sm'>
              <Checkbox
                checked={extend} onChange={(e) => {
                  setExtend(e.target.checked)
                }} className='border-1 border-gray-300 rounded-1 h-4 w-4 m-0' id='extend-checkbox' labelClassName='ml-1'
              >
                Extend Only
              </Checkbox>
            </div>
          </div>

          <div className={extend ? 'opacity-50 cursor-not-allowed' : ''}>
            <div className='rounded-2 mb-2 border-1 border-B0C4DB overflow-hidden grid grid-cols-[1fr_auto] focus-within:ring-4E7DD9 focus-within:ring focus-within:ring-offset-0 focus-within:ring-opacity-30'>
              <div className='relative'>
                <input type='text' className={classNames('py-5 px-6 text-lg outline-none', extend ? 'cursor-not-allowed' : '')} placeholder='0.00' disabled={extend} />
                <div className='absolute text-9B9B9B text-lg top-5 right-4'>NPM</div>
              </div>
              <button className='bg-E6EAEF py-5 px-6 text-lg'>
                Max
              </button>
            </div>

            <div className='flex justify-between items-center mb-6'>
              <div className='text-md text-9B9B9B'>Balance: 0.00 NPM</div>
              <div className='flex gap-4'>
                <button className={extend ? 'cursor-not-allowed' : ''}>
                  <CopyIcon className='text-AAAAAA h-6 w-6' />
                </button>
                <button className={extend ? 'cursor-not-allowed' : ''}>
                  <LaunchIcon className='text-AAAAAA h-6 w-6' />
                </button>
                <button className={extend ? 'cursor-not-allowed' : ''}>
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
            <Checkbox className='border-1 border-gray-300 rounded-1 h-4 w-4 m-0' id='agree-terms-escrow' />
            <label htmlFor='agree-terms-escrow' className='-mt-0.5'>
              I hereby acknowledge my obligation to pay a penalty fee of 25% in the event that I prematurely unlock, as per the applicable <a href='https://neptunemutual.com/policies/standard-terms-and-conditions/' target='_blank' className='text-1170FF' rel='noreferrer'>terms and conditions</a>.
            </label>
          </div>

          <RegularButton className='w-full rounded-tooltip p-4 font-semibold text-md normal-case'>{extend ? 'EXTEND MY DURATION' : 'GET veNPM TOKENS'}</RegularButton>

          <KeyValueList
            className='my-6'
            list={[
              {
                key: 'Boost:',
                value: '1.234234x'
              },
              {
                key: 'Locked:',
                value: '13.24K NPM'
              },
              {
                key: 'Power:',
                value: '45.62K NPM'
              }
            ]}
          />

          <div className='text-right'>
            <button
              className='text-4E7DD9 text-sm font-semibold' onClick={() => {
                setUnlock(true)
              }}
            >Unlock
            </button>
          </div>
        </div>
      </VoteEscrowCard>
      <div className='w-[489px] mx-auto mt-4'>
        <div className='flex justify-between'>
          <Link href=''>
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
