import { useNetwork } from '@/src/context/Network'

export default function AnnouncementBanner () {
  const imageAlt = 'Earn fees from NPM trading'

  const { networkId } = useNetwork()

  const data = {
    1: {
      image: '/images/banners/Ethereum-Banner-Desktop.webp',
      link: 'https://www.sushi.com/pool/137%3A0x0e3eaef09dfe55824a3cda7146a387af261d7824'
    },
    42161: {
      image: '/images/banners/Arbitrum-Banner-Desktop.webp',
      link: 'https://www.sushi.com/pool/137%3A0x0e3eaef09dfe55824a3cda7146a387af261d7824'
    },
    56: {
      image: '/images/banners/BSC-Banner-Desktop.webp',
      link: ''
    }
  }

  if (!data[networkId]) { return null }

  return (
    <div
      className='flex justify-center px-4 pt-16 pb-0 mx-auto md:pb-8 max-w-7xl sm:px-6 md:px-8'
      data-testid='announcement-banner'
    >
      <div className='relative'>
        <a href={data[networkId].link || undefined} target='_blank' rel='noreferrer'>
          <img
            className='object-cover object-center h-64 max-w-full overflow-hidden sm:h-96 rounded-xl'
            src={data[networkId].image}
            alt={imageAlt}
          />
        </a>
      </div>

    </div>
  )
}
