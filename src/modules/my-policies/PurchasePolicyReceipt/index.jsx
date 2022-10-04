import { BackButton } from '@/common/BackButton/BackButton'
import { HeaderLogo } from '@/common/HeaderLogo'
import OpenInNewIcon from '@/icons/OpenInNewIcon'
import LinkedinIcon from '@/icons/LinkedinIcon'
import RedditIcon from '@/icons/RedditIcon'
import TelegramIcon from '@/icons/TelegramIcon'
import TwitterIcon from '@/icons/TwitterIcon'
import { OutlinedButton } from '@/common/Button/OutlinedButton'
import DownloadIcon from '@/icons/DownloadIcon'
import AddCircleIcon from '@/icons/AddCircleIcon'
import { DescriptionComponent } from '@/modules/my-policies/PurchasePolicyReceipt/DescriptionComponent'
import { useRouter } from 'next/router'
import { safeParseBytes32String } from '@/utils/formatter/bytes32String'
import { useCoverOrProductData } from '@/src/hooks/useCoverOrProductData'
import { convertFromUnits, toBN } from '@/utils/bn'
import { useAppConstants } from '@/src/context/AppConstants'
import { formatCurrency } from '@/utils/formatter/currency'
import { formatPercent } from '@/utils/formatter/percent'
import { Fragment } from 'react'
import {
  getAddressLink,
  getTokenLink,
  getTxLink
} from '@/lib/connect-wallet/utils/explorer'
import { useRegisterToken } from '@/src/hooks/useRegisterToken'
import { useNetwork } from '@/src/context/Network'
import { useFetchCoverPurchasedEvent } from '@/src/hooks/useFetchCoverPurchasedEvent'
import DateLib from '@/lib/date/DateLib'
import { useTokenDecimals } from '@/src/hooks/useTokenDecimals'
import { useTokenSymbol } from '@/src/hooks/useTokenSymbol'
import { CoverParameters } from '@/common/CoverParameters/CoverParameters'

export const PurchasePolicyReceipt = ({ txHash }) => {
  const router = useRouter()

  const { liquidityTokenDecimals, liquidityTokenSymbol } = useAppConstants()
  const { networkId } = useNetwork()
  const { register } = useRegisterToken()
  const { data: event } = useFetchCoverPurchasedEvent({ txHash })
  const cxTokenSymbol = useTokenSymbol(event?.cxToken)
  const cxTokenDecimals = useTokenDecimals(event?.cxToken)
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

  const data = [
    {
      label: 'On Behalf of',
      value: (
        <div className='flex items-center gap-2 overflow-hidden text-lg leading-6'>
          <span className='overflow-hidden text-ellipsis'>{onBehalfOf}</span>
          <a
            href={getAddressLink(networkId, onBehalfOf)}
            target='_blank'
            rel='noreferrer'
            title='Open In Explorer'
          >
            <OpenInNewIcon className='w-4 h-4' fill='#DADADA' />
          </a>
        </div>
      )
    },
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
      value: DateLib.toLongDateFormat(event.createdAtTimestamp)
    },
    {
      label: 'End Date',
      value: DateLib.toLongDateFormat(event.expiresOn)
    },
    {
      label: 'Referral',
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
      <CoverParameters key='cover_params' parameters={coverInfo?.infoObj?.parameters} />
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

  const shareUrl = window.location.href
  const shareText = encodeURI('Purchase a Policy in Neptune Mutual')

  const socials = [
    {
      Icon: TwitterIcon,
      href: `https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareText}&via=`,
      label: 'Twitter'
    },
    {
      Icon: RedditIcon,
      href: `https://reddit.com/submit?url=${shareUrl}&title=${shareText}`,
      label: 'Reddit'
    },
    {
      Icon: TelegramIcon,
      href: `https://telegram.me/share/url?url=${shareUrl}&text=${shareText}`,
      label: 'Telegram'
    },
    {
      Icon: LinkedinIcon,
      href: `https://www.linkedin.com/shareArticle?url=${shareUrl}&title=${shareText}`,
      label: 'Linkedin'
    }
  ]

  return (
    <div>
      <div className='py-9.5 px-4 md:px-10 lg:px-13 bg-black text-white'>
        <BackButton
          onClick={() => router.back()}
          className='!px-4 !py-2 border-white !text-white hover:bg-transparent hover:text-white'
        />

        <div className='mt-9 lg:px-42 font-sora'>
          <HeaderLogo />
          <a
            href='https://neptunemutual.com'
            className='mt-2 underline text-4e7dd9'
          >
            neptunemutual.com
          </a>

          <p className='mt-5 text-sm font-semibold leading-6'>Purchaser:</p>
          <p className='flex items-center gap-2 overflow-hidden text-lg leading-6'>
            <span className='overflow-hidden text-ellipsis'>{purchaser}</span>
            <a
              href={getAddressLink(networkId, purchaser)}
              target='_blank'
              rel='noreferrer'
              title='Open In Explorer'
            >
              <span className='sr-only'>Open in Explorer</span>
              <OpenInNewIcon className='w-4 h-4' fill='#DADADA' />
            </a>
          </p>
        </div>
      </div>

      <div className='px-4 bg-white md:px-10 lg:px-54 pt-14 pb-52'>
        <h1 className='font-semibold leading-8 text-receipt-info font-sora'>
          {policyName} Policy Receipt
        </h1>

        <div className='text-lg leading-6 font-sora text-9B9B9B mt-3.5'>
          <p className='font-semibold'>Date:</p>
          <p>{new Date(date).toUTCString()}</p>
        </div>

        <div className='mt-4 text-lg leading-6 font-sora text-9B9B9B'>
          <p className='font-semibold'>Receipt no:</p>
          <p>{receiptNo}</p>
        </div>

        <p className='mt-8'>{text.policyInfo}</p>

        <div className='mt-6'>
          <p>Share it with your friends for surprise gift!</p>
          <div className='flex gap-4 mt-4'>
            {socials.map(({ Icon, href, label }, idx) => (
              <Fragment key={idx}>
                {href && (
                  <a
                    href={href}
                    target='_blank'
                    rel='noreferrer'
                    title={`Share on ${label}`}
                  >
                    <Icon className='w-6 h-6 text-black' />
                  </a>
                )}
              </Fragment>
            ))}
          </div>
        </div>

        <OutlinedButton
          onClick={() => {}}
          className='flex items-center gap-2 p-4 mt-12 rounded-lg border-4e7dd9 text-4e7dd9'
        >
          <DownloadIcon />
          <span className='font-semibold uppercase'>
            Download Product Cover Terms
          </span>
        </OutlinedButton>

        <div className='mt-16 divide-y divide-9B9B9B'>
          {data.map(({ label, value }, i) => (
            <div
              key={i}
              className='flex justify-between gap-2 pt-6 pb-4 text-lg leading-6'
            >
              <p className='flex-shrink-0 font-semibold font-sora'>{label}</p>
              <div className='overflow-hidden font-poppins'>{value}</div>
            </div>
          ))}

          <div className='flex justify-between py-5 text-lg font-bold leading-6 !border-y-2 !border-y-404040'>
            <p className='font-sora'>Premium Paid</p>
            <p className='uppercase font-poppins'>{premuimPaid}</p>
          </div>

          <div className='py-8 !border-t-0 !border-b-2 !border-y-404040 text-lg leading-6'>
            <p className='font-semibold font-sora'>Your cx DAI Address</p>
            <div className='flex items-center gap-3 mt-1.5 overflow-hidden'>
              <span className='overflow-hidden text-ellipsis'>
                {event.cxToken}
              </span>
              <a
                href={getTokenLink(networkId, event.cxToken)}
                target='_blank'
                rel='noreferrer'
                title='Open In Explorer'
              >
                <span className='sr-only'>Open in Explorer</span>
                <OpenInNewIcon className='w-4 h-4' fill='#AAAAAA' />
              </a>
              <button
                onClick={() =>
                  register(event.cxToken, cxTokenSymbol, cxTokenDecimals)}
                title='Add to Metamask'
              >
                <span className='sr-only'>Add to Metamask</span>
                <AddCircleIcon className='w-4 h-4' fill='#AAAAAA' />
              </button>
            </div>

            <p className='mt-6 font-semibold font-sora'>View Transaction</p>
            <div className='flex items-center gap-3 mt-1.5 overflow-hidden'>
              <span className='overflow-hidden text-ellipsis'>{txHash}</span>
              <a
                href={getTxLink(networkId, { hash: txHash })}
                target='_blank'
                rel='noreferrer'
                title='Open In Explorer'
              >
                <span className='sr-only'>Open in Explorer</span>
                <OpenInNewIcon className='w-4 h-4' fill='#AAAAAA' />
              </a>
            </div>
          </div>
        </div>

        <DescriptionComponent
          title='Cover Rules'
          text={text.coverRules}
          className='mt-14'
          bullets={false}
        />

        <DescriptionComponent
          title='Exclusions'
          text={text.exclusions}
          className='mt-8'
        />
      </div>
    </div>
  )
}
