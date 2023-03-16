import { GaugeChart } from '@/common/GaugeChart/GaugeChart'
import MaxIcon from '@/icons/MaxIcon'
import MinIcon from '@/icons/MinIcon'
import SumIcon from '@/icons/SumIcon'
import { formatEther } from '@/utils/formatEther'

const maxValues = {
  1: [50, 100, 250, 500, 1000, 2500, 5000, 10000],
  42161: [0.5, 1, 2.5, 5, 10, 25, 50, 100, 250, 500],
  43113: [0.5, 1, 2.5, 5, 10, 25, 50, 100, 250, 500]
}

const GasPriceSummary = ({ data, loading }) => {
  return (
    <div className='flex justify-center gap-8 flex-wrap'>
      {loading && (
        <div className='text-center italic'>Loading...</div>
      )}
      {!loading && (
        <>
          {data.map(chainGasSummary => {
            const avgGasPrice = formatEther(parseInt(chainGasSummary.averageGasPrice))
            const maxGasPrice = formatEther(parseInt(chainGasSummary.maxGasPrice))
            const minGasPrice = formatEther(parseInt(chainGasSummary.minGasPrice))

            return (
              <div key={chainGasSummary.chainId} className='-mr-6'>
                <GaugeChart min={0} max={maxValues[chainGasSummary.chainId].find((x) => x >= +avgGasPrice.gweiNumeric) ?? Math.ceil(maxGasPrice.gweiNumeric)} value={avgGasPrice.gweiNumeric} />
                <div className='text-center -mt-14 px-8 first-of-type:pl-3 -ml-3'>
                  <div className='text-md leading-7.5 mb-1.5 font-bold relative z-1' title={avgGasPrice.gweiLong}>{avgGasPrice.gwei}</div>
                  <div className='text-sm leading-5 font-semibold'>{chainGasSummary.nickName !== 'Mainnet' ? chainGasSummary.nickName : 'Ethereum'}</div>
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
            <div className='text-center -mt-14 px-8'>
              <div className='text-md leading-7.5 font-bold'>0.123 gwei</div>
              <div className='text-sm leading-5 font-semibold'>Arbitrum</div>
              <div>
                <div className='flex items-center gap-2 mb-6 mt-6.5'>
                  <SumIcon />
                  <div className='text-sm leading-5'>Average Gas Price: 0.123 gwei</div>
                </div>
                <div className='flex items-center gap-2 mb-6  '>
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

export { GasPriceSummary }
