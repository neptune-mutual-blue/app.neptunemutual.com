export const PolicyCalculation = ({ feeData, loadingFeeData }) => {
  console.log(feeData, ' -- fee Data ')
  return (
    <div className='pt-6'>
      <div className='block uppercase font-light pt-4 pb-1'>
        Your policy fee is
      </div>
      <div className='flex items-start justify-between'>

        <div className='block uppercase font-bold'>
          ${!loadingFeeData && feeData ? feeData.fee : '0'} ({!loadingFeeData && feeData ? feeData.rate : '0'}%)
        </div>
        <div>
          <a className='text-5D52DC'> Buy Cover &gt; </a>
        </div>
      </div>
    </div>
  )
}
