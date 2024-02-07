import { GaugeChart } from '@/common/GaugeChart/GaugeChart'
import { Loading } from '@/common/Loading'
import MaxIcon from '@/icons/MaxIcon'
import MinIcon from '@/icons/MinIcon'
import SumIcon from '@/icons/SumIcon'
import { ShortNetworkNames } from '@/lib/connect-wallet/config/chains'
import { formatEther } from '@/utils/formatEther'

const maxValues = {
  1: [50, 100, 250, 500, 1000, 2500, 5000, 10000],
  42161: [0.5, 1, 2.5, 5, 10, 25, 50, 100, 250, 500],
  84531: [0.5, 1, 2.5, 5, 10, 25, 50, 100, 250, 500],
  43113: [0.5, 1, 2.5, 5, 10, 25, 50, 100, 250, 500]
}

export const GasPriceSummary = ({ data, loading }) => {
  return (
    <div className='flex flex-wrap justify-center gap-8'>
      {loading && (
        <Loading />
      )}
      {!loading && (
        <>
          {data.map(chainGasSummary => {
            const avgGasPrice = formatEther(parseInt(chainGasSummary.averageGasPrice))
            const maxGasPrice = formatEther(parseInt(chainGasSummary.maxGasPrice))
            const minGasPrice = formatEther(parseInt(chainGasSummary.minGasPrice))

            return (
              <div key={chainGasSummary.chainId} className='-mr-6'>
                <GaugeChart min={0} max={maxValues[chainGasSummary.chainId]?.find((x) => { return x >= +avgGasPrice.gweiNumeric }) ?? Math.ceil(maxGasPrice.gweiNumeric)} value={avgGasPrice.gweiNumeric} />
                <div className='px-8 -ml-3 text-center -mt-14 first-of-type:pl-3'>
                  <div className='text-md leading-7.5 mb-1.5 font-bold relative z-1' title={avgGasPrice.gweiLong}>{avgGasPrice.gwei}</div>
                  <div className='text-sm font-semibold leading-5'>{chainGasSummary.nickName !== 'Mainnet' ? chainGasSummary.nickName : ShortNetworkNames[chainGasSummary.chainId]}</div>
                  <div>
                    <div className='flex items-center gap-2 mb-6 mt-6.5'>
                      <SumIcon />
                      <div className='text-sm leading-5' title={avgGasPrice.gweiLong}>Average Gas Price: {avgGasPrice.gwei}</div>
                    </div>
                    <div className='flex items-center gap-2 mb-6'>
                      <MinIcon />
                      <div className='text-sm leading-5' title={minGasPrice.gweiLong}>Minimum Gas Price: {minGasPrice.gwei}</div>
                    </div>
                    <div className='flex items-center gap-2'>
                      <MaxIcon />
                      <div className='text-sm leading-5' title={maxGasPrice.gweiLong}>Maximum Gas Price: {maxGasPrice.gwei}</div>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
          {/* <div>
            <GaugeChart min={0} max={1} value={0.75} />
            <div className='px-8 text-center -mt-14'>
              <div className='text-md leading-7.5 font-bold'>0.123 gwei</div>
              <div className='text-sm font-semibold leading-5'>Arbitrum</div>
              <div>
                <div className='flex items-center gap-2 mb-6 mt-6.5'>
                  <SumIcon />
                  <div className='text-sm leading-5'>Average Gas Price: 0.123 gwei</div>
                </div>
                <div className='flex items-center gap-2 mb-6 '>
                  <MinIcon />
                  <div className='text-sm leading-5'>Minimum Gas Price: 0.08 gwei</div>
                </div>
                <div className='flex items-center gap-2'>
                  <MaxIcon />
                  <div className='text-sm leading-5'>Maximum Gas Price: 1 gwei</div>
                </div>
              </div>

            </div>
          </div> */}
        </>

      )}
    </div>
  )
}
