import { RegularButton } from '@/common/Button/RegularButton'
import ArrowNarrowRight from '@/icons/ArrowNarrowRight'

export default function AnnouncementBanner () {
  const imageSrc = '/nft-banner.webp'
  const imageAlt = 'avatars coming soon'
  const linkHref = 'https://nft.neptunemutual.com'
  const btnText = 'Launch NFT Portal'

  return (
    <div
      className='flex justify-center px-4 pt-16 pb-0 mx-auto md:pb-8 max-w-7xl sm:px-6 md:px-8'
      data-testid='announcement-banner'
    >
      <div className='relative'>
        <img className='object-cover max-w-full overflow-hidden h-96 rounded-xl' src={imageSrc} alt={imageAlt} />

        <a href={linkHref} target='_blank' rel='noreferrer'>
          <RegularButton className='absolute bottom-13 whitespace-nowrap left-[50%] translate-x-[-50%] flex gap-2.5 items-center text-sm text-white py-2.5 px-4 font-bold'>
            {btnText}
            <ArrowNarrowRight />
          </RegularButton>
        </a>
      </div>

    </div>
  )
}
