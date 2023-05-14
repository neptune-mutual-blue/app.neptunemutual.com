import OpenInNewIcon from '@/icons/OpenInNewIcon'
import { getTxLink } from '@/lib/connect-wallet/utils/explorer'
import { useNetwork } from '@/src/context/Network'
import { classNames } from '@/utils/classnames'

export const IncidentReporter = ({ variant, account, txHash }) => {
  const { networkId } = useNetwork()

  return (
    <>
      <div className='flex items-center mb-4 text-sm'>
        <div
          className={classNames(
            'w-3 h-3 mr-2 rotate-45',
            variant === 'success' ? 'bg-21AD8C' : 'bg-FA5C2F'
          )}
        />

        <div className='text-4E7DD9'>{account}</div>

        {/* Link to reported tx */}
        <div className='flex items-center justify-center ml-auto'>
          <a
            href={getTxLink(networkId, { hash: txHash })}
            target='_blank'
            rel='noreferrer noopener nofollow'
            className='p-1 text-black'
            title='Open in explorer'
          >
            <span className='sr-only'>Open in explorer</span>
            <OpenInNewIcon className='w-4 h-4' />
          </a>
        </div>
      </div>
    </>
  )
}
