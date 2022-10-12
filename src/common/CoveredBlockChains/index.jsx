import { ChainLogos, NetworkNames } from '@/lib/connect-wallet/config/chains'

const CoveredBlockchains = ({ blockChains }) => {
  if (blockChains.length === 0) return null

  const getLogo = (chainId) => {
    const ChainLogo = ChainLogos[chainId]
    return <ChainLogo width='32' height='32' />
  }

  return (
    <div>
      <h4 className='text-sm font-semibold mt-9'>Covered Blockchain</h4>
      <div className='mt-2'>
        {blockChains.map((blockChain, index) => (
          <div className='inline-flex items-center justify-center mr-2 rounded w-fit bg-E6EAEF' key={index}>
            {getLogo(blockChain.chainId)}
            <p className='px-2 py-1 text-sm'>{NetworkNames[blockChain.chainId]}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
export default CoveredBlockchains
