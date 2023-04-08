import { AvailableCovers } from '@/modules/home/AvailableCovers2'
import { Insights } from '@/modules/insights'

export default function HomePage () {
  return (
    <>
      <Insights />
      <hr className='border-b border-B0C4DB' />
      <div className='flex justify-center px-4 pt-16 pb-0 mx-auto md:pb-8 max-w-7xl sm:px-6 md:px-8'>
        <a href='https://neptunemutual.com/docs/neptune-mutual-nfts/' target='_blank' rel='noreferrer'>
          <img className='hidden object-cover max-w-full overflow-hidden md:inline-block md:h-80 xl:h-96 rounded-xl' src='/avatars-coming-soon.webp' alt='avatars coming soon' />
          <img className='inline-block object-cover max-w-full overflow-hidden md:hidden rounded-xl' src='/avatars-coming-soon-mobile.webp' alt='avatars coming soon' />
        </a>
      </div>

      <AvailableCovers />

    </>
  )
}
