import RightPointerSideIcon from '@/icons/RightPointerSideIcon'

export const PolicyCalculation = ({ feeData, loadingFeeData }) => {
  return (
    <div>
      <div className='block uppercase font-normal font-poppins text-sm text-01052D pb-2'>
        Your policy fee is
      </div>
      <div className='flex items-end justify-between'>

        <div className='block text-01052D uppercase font-semibold leading-6 text-lg leading-6'>
          ${!loadingFeeData && feeData ? feeData.fee : '0'} ({!loadingFeeData && feeData ? feeData.rate : '0'}%)
        </div>
        <div>
          <a className='text-4B7EE1 font-bold text-sm leading-5 flex flex-row items-center px-0 my-0 py-0 mx-0'> Buy Cover <span className='ml-3'><RightPointerSideIcon className='w-8 h-4' /> </span> </a>
        </div>
      </div>
    </div>
  )
}
