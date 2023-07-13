import { RegularButton } from '@/common/Button/RegularButton'
import ArrowNarrowRight from '@/icons/ArrowNarrowRight'
import { AvailableCovers } from '@/modules/home/AvailableCovers2'
import { Insights } from '@/modules/insights'

export default function HomePage () {
  return (
    <>
      <Insights />
      <hr className='border-b border-B0C4DB' />
      <div
        className='flex justify-center px-4 pt-16 pb-0 mx-auto md:pb-8 max-w-7xl sm:px-6 md:px-8'
        data-testid='nft-banner'
      >
        <div className='relative'>
          <img className='object-cover max-w-full overflow-hidden h-96 rounded-xl' src='/nft-banner.webp' alt='avatars coming soon' />

          <a href='https://nft.neptunemutual.com' target='_blank' rel='noreferrer'>
            <RegularButton className='absolute bottom-13 whitespace-nowrap left-[50%] translate-x-[-50%] flex gap-2.5 items-center text-sm text-white py-2.5 px-4 font-bold'>
              Launch NFT Portal
              <ArrowNarrowRight />
            </RegularButton>
          </a>
        </div>

      </div>

      <AvailableCovers />

    </>
  )
}
