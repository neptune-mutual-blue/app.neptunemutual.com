export default function AnnouncementBanner () {
  const imageSrc = '/new-year-banner.jpg'
  const imageAlt = 'New year rewards'
  const linkHref = 'https://community.neptunemutual.com/t/enjoy-110-cashback-this-new-year/279'

  return (
    <div
      className='flex justify-center px-4 pt-16 pb-0 mx-auto md:pb-8 max-w-7xl sm:px-6 md:px-8'
      data-testid='announcement-banner'
    >
      <div className='relative'>

        <a href={linkHref} target='_blank' rel='noreferrer'>
          <img className='object-cover h-64 max-w-full overflow-hidden sm:h-96 rounded-xl' src={imageSrc} alt={imageAlt} />
        </a>
      </div>

    </div>
  )
}
