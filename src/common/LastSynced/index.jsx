import { getBlockLink } from '@/lib/connect-wallet/utils/explorer'

export const LastSynced = ({ blockNumber, networkId }) => {
  if (!blockNumber || !networkId) {
    return null
  }

  return (
    <p
      className='font-semibold w-max text-md text-1D2939'
      data-testid='block-number'
    >
      Last Synced:{' '}
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
