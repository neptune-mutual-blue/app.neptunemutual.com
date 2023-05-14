import { getBlockLink } from '@/lib/connect-wallet/utils/explorer'
import { Trans } from '@lingui/macro'

export const LastSynced = ({ blockNumber, networkId }) => {
  if (!blockNumber || !networkId) {
    return null
  }

  return (
    <p
      className='font-semibold w-max text-md text-1D2939'
      data-testid='block-number'
    >
      <Trans>Last Synced:</Trans>{' '}
      <a
        href={getBlockLink(networkId, blockNumber)}
        target='_blank'
        rel='noreferrer noopener nofollow'
        className='pl-1 text-4E7DD9'
      >
        #{blockNumber}
      </a>
    </p>

  )
}
