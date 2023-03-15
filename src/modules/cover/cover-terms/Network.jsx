const { ChainLogos, NetworkNames } = require('@/lib/connect-wallet/config/chains')
const { classNames } = require('@/utils/classnames')

export const Network = ({ chainId }) => {
  const ChainLogo = ChainLogos[chainId]
  const NetworkName = NetworkNames[chainId]

  return (
    <div className='inline-flex items-center justify-center mr-2 overflow-hidden font-normal leading-loose rounded-md text-FEFEFF bg-E6EAEF'>
      <figure title='Network'>
        <span>
          <ChainLogo width='40' height='40' />{' '}
        </span>
      </figure>
      <p
        className={classNames(
          'inline-block truncate py-1 px-2 w-full text-center text-000000 text-sm leading-6'
        )}
      >
        {NetworkName}
      </p>
    </div>
  )
}
