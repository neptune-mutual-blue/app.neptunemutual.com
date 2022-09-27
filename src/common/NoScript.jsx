export const NoScript = () => {
  return (
    <noscript>
      <div className='flex flex-col items-center justify-center w-full text-white bg-black h-100vh'>
        <div className='h-10'>
          <img
            loading='lazy'
            alt='Neptune Mutual'
            srcSet='/logos/neptune-mutual-inverse-full-beta.svg'
            className='h-full'
          />
        </div>
        <p className='mt-4'>
          Please enable JavaScript to use this application.
        </p>
      </div>
    </noscript>
  )
}
