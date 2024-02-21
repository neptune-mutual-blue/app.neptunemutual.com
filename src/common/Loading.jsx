export const Loading = () => {
  return (
    <div className='flex flex-col items-center flex-1 py-8'>
      <span className='inline-block w-6 h-6 my-4 border-2 rounded-full border-b-transparent loader animate-spin' />
      <span>Loading...</span>
    </div>
  )
}

export const NoDataFound = () => {
  return (
    <div className='flex flex-col items-center py-8'>
      <span>No Data Found</span>
    </div>
  )
}
