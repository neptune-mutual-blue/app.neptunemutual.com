import { useNetwork } from '@/src/context/Network'

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

export default function AnnouncementBanner () {
  const imageAlt = 'Earn fees from NPM trading'

  const { networkId } = useNetwork()

  if (!data[networkId]) { return null }

  const imageElement = (
    <img
      className='object-cover object-center h-64 max-w-full overflow-hidden sm:h-96 rounded-xl'
      src={data[networkId].image}
      alt={imageAlt}
    />
  )

  return (
    <div
      className='flex justify-center px-4 pt-16 pb-0 mx-auto md:pb-8 max-w-7xl sm:px-6 md:px-8'
      data-testid='announcement-banner'
    >
      <div className='relative'>
        {
          data[networkId].link
            ? (
              <a href={data[networkId].link} target='_blank' rel='noreferrer'>
                {imageElement}
              </a>
              )
            : (
                imageElement
              )
        }
      </div>

    </div>
  )
}
