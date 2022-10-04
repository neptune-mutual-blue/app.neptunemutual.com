import { DescriptionComponent } from '@/modules/my-policies/PurchasePolicyReceipt/DescriptionComponent'
import { useRouter } from 'next/router'
import { safeParseBytes32String } from '@/utils/formatter/bytes32String'
import { useCoverOrProductData } from '@/src/hooks/useCoverOrProductData'
import { convertFromUnits, toBN } from '@/utils/bn'
import { useAppConstants } from '@/src/context/AppConstants'
import { formatCurrency } from '@/utils/formatter/currency'
import { formatPercent } from '@/utils/formatter/percent'
import { Fragment } from 'react'

import { useFetchCoverPurchasedEvent } from '@/src/hooks/useFetchCoverPurchasedEvent'
import DateLib from '@/lib/date/DateLib'
import { CoverParameters } from '@/common/CoverParameters/CoverParameters'
import { Alert } from '@/common/Alert/Alert'
import { t } from '@lingui/macro'

export const PurchasePolicyReceipt = ({ txHash }) => {
  const router = useRouter()

  const { liquidityTokenDecimals, liquidityTokenSymbol } = useAppConstants()
  const { data: event } = useFetchCoverPurchasedEvent({ txHash })
  const coverInfo = useCoverOrProductData({
    coverKey: event?.coverKey,
    productKey: event?.productKey
  })

  if (!txHash || !event) return null

  const purchaser = event.onBehalfOf
  const onBehalfOf = event.onBehalfOf

  const policyName =
    coverInfo?.infoObj?.productName || coverInfo?.infoObj?.coverName
  const date = new Date(
    parseInt(event.createdAtTimestamp) * 1000
  ).toUTCString()
  const receiptNo = event.policyId

  const daysCovered = toBN(event.expiresOn)
    .minus(event.createdAtTimestamp)
    .dividedBy(24 * 60 * 60)
    .toString()

  const duration = Math.ceil(
    parseFloat(toBN(daysCovered).dividedBy(30).toString())
  )

  const rate = toBN(event.fee)
    .multipliedBy(365)
    .dividedBy(
      toBN(event.amountToCover).multipliedBy(
        Math.floor(parseFloat(daysCovered))
      )
    )
    .toString()

  const onBehalfOfData = [
    {
      label: 'Protection',
      value: formatCurrency(
        convertFromUnits(
          event.amountToCover,
          liquidityTokenDecimals
        ).toString(),
        router.locale,
        liquidityTokenSymbol,
        true
      ).long
    },
    {
      label: 'Premium Rate',
      value: formatPercent(rate, router.locale)
    },
    {
      label: 'Duration',
      value: `${duration} months`
    },
    {
      label: 'Start Date',
      value: DateLib.toLongDateFormat(event.createdAtTimestamp, 'en-GB', '')
    },
    {
      label: 'End Date',
      value: DateLib.toLongDateFormat(event.expiresOn, 'en-GB', '')
    },
    {
      label: 'Referral Code',
      value: safeParseBytes32String(event.referralCode) || '---'
    }
  ]

  const premuimPaid = formatCurrency(
    convertFromUnits(event.fee, liquidityTokenDecimals).toString(),
    router.locale,
    liquidityTokenSymbol,
    true
  ).long

  const text = {
    policyInfo: coverInfo?.infoObj?.about,
    coverRules: [
      'Carefully read the following terms and conditions. For a successful claim payout, all of the following points must be true.',
      <CoverParameters key='cover_params' parameters={coverInfo?.infoObj?.parameters} titleClassName='text-lg font-bold mt-6 leading-5 mb-2 font-arial' />
    ],
    exclusions: coverInfo?.infoObj?.exclusions,
    standardExclusions: [
      'The standard exclusions are enforced on all covers. Neptune Mutual reserves the right to update the exclusion list periodically.',
      [
        'If we have reason to believe you are an attacker or are directly or indirectly associated with an attacker, we reserve the right to blacklist you or deny your claims.',
        <Fragment key='exclusions-2'>
          In addition to{' '}
          <a href='#' className='text-4e7dd9'>
            coverage lag
          </a>
          , we may also blacklist you or deny your claims if you purchased
          coverage just before, on, or the same day of the attack.
        </Fragment>,
        'Minimum total loss should exceed $1 million.',
        'Any loss in which the protocol continues to function as intended is not covered.',
        'Any type of 51 percent attack or consensus attack on the parent blockchain is not covered.',
        'Consensus attack on the protocol is not covered.',
        'Financial risk can not be covered.',
        'Bridge-related losses not coverable.',
        'Backend exploits are not coverable.',
        "Gross negligence or misconduct by a project's founders, employees, development team, or former employees are not coverable.",
        [
          'Rug pull or theft of funds.',
          'Project team confiscating user funds. ',
          'Attacks by team members or former team members on their protocol.',
          'Compromised private key.',
          'Compromised API access keys.',
          'Utilization of obsolete or vulnerable dependencies in the application or DApp before the coverage period began',
          'Developers or insiders creating backdoors to later exploit their own protocol.'
        ]
      ]
    ],
    riskDisclosure: [
      "In case of a diversified cover liquidity pool, it will only be able to offer payouts upto the pool's balance. It is critical that you comprehend all risk aspects before establishing any firm expectations. Please carefully assess the following document:",
      <a
        href='https://docs.neptunemutual.com/usage/risk-factors'
        key='1235'
        className='text-4e7dd9'
      >
        https://docs.neptunemutual.com/usage/risk-factors
      </a>
    ]
  }

  const policyReceiptData = [
    [
      'Date:',
      new Date(date).toUTCString()
    ],
    [
      'Receipt no:',
      receiptNo
    ],
    [
      'Purchaser:',
      purchaser
    ]
  ]

  return (
    <div className='font-arial bg-white'>

      <div className='px-10 md:px-10 lg:max-w-5xl m-auto pt-4 pb-52'>
        <div className='mt-9 flex cursor-pointer'>
          <picture onClick={() => router.back()}>
            <img
              loading='lazy'
              alt={t`Neptune Mutual`}
              srcSet='/logos/neptune-mutual-full.svg'
              className='w-full h-9 text-black'
              data-testid='header-logo'
            />
          </picture>
          <div className='flex-grow'> </div>
          <a
            href='https://neptunemutual.com'
            className='mt-2 text-black items-end'
          >
            neptunemutual.com
          </a>
        </div>

        <hr className='mt-4 mb-10' />
        <h1 className='font-bold leading-9 text-receipt-info'>
          {policyName} Policy Receipt
        </h1>

        {
          policyReceiptData.map(([label, value]) => (
            <div className='mt-4 text-lg leading-7 flex' key={label}>
              <p className='font-bold mr-2'>{label}</p>
              <p>{value}</p>
            </div>
          ))
        }

        <hr className='mt-12' />

        <div className='mt-10'>

          <div className='text-lg leading-6 mt-3.5 mb-10'>
            <p className='font-bold mr-2 mb-2 text-receipt-info leading-7'>On Behalf Of</p>
            <p className='text-md'>{onBehalfOf}</p>
          </div>

          {onBehalfOfData.map(({ label, value }, i) => (
            <div
              key={i}
              className='flex pb-4 text-lg leading-6'
            >
              <p className='flex-shrink-0 font-bold leading-5 max-w-60 w-full'>{label}</p>
              <div className='overflow-hidden'>{value}</div>
            </div>
          ))}

          <div className='flex text-lg font-bold leading-6'>
            <p className='max-w-60 w-full'>Premium Paid</p>
            <p className='uppercase'>{premuimPaid}</p>
          </div>

          <hr className='mt-12' />

          <div className='mt-10 text-lg leading-5 flex'>
            <p className='font-bold max-w-60 w-full flex-shrink-0'>Your cxDAI Address</p>
            <div className='flex items-center break-all'>
              {event.cxToken}
            </div>
          </div>
          <div className='mt-6 text-lg leading-5 flex'>
            <p className='font-bold max-w-60 w-full flex-shrink-0'>Transaction Receipt</p>
            <div className='flex items-center break-all'>
              {txHash}
            </div>
          </div>
        </div>

        <hr className='my-10' />

        <Alert className='!bg-white leading-5'>
          <p className='text-lg font-bold text-E03636 pb-1'>Beta Version Disclaimer</p>
          <p className='text-lg text-E03636'>As you are participating in the beta version of the Neptune Mutual protocol, it is possible that the terms and exclusions may change.</p>
        </Alert>

        <DescriptionComponent
          title='Cover Rules'
          text={text.coverRules}
          className='mt-13'
          bullets={!false}
        />

        <DescriptionComponent
          title='Standard Exclusions'
          text={text.exclusions}
          className='mt-6'
          bullets={false}
        />
        <div>
          <p className='text-lg font-bold mt-6 leading-5'>Risk Disclosure/Disclaimer</p>
          <p className='text-lg mt-2'>In case of a diversified cover liquidity pool, it will only be able to offer payouts upto the pool's balance. It is critical that you comprehend all risk aspects before establishing any firm expectations. Please carefully assess the following document:
            <a target='_blank' rel='noreferer noopener nofollow noreferrer' href='https://docs.neptunemutual.com/usage/risk-factors'>
              Risk Factors, Neptune Mutual Documentation
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
