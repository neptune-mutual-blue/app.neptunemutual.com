export const DiversifiedCoverProfileInfo = ({ projectName }) => {
  return (
    <div className='flex' data-testid='diversified-coverprofileinfo-container'>
      <div>
        <div className='flex flex-col items-center'>
          <h1 className='w-full font-bold text-display-md'>
            Provide Liquidity
          </h1>

          <h3 className='flex w-full font-bold leading-5 text-md'>
            {projectName}
          </h3>
        </div>
      </div>
    </div>
  )
}
