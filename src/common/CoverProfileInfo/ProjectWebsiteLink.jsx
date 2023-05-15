export const ProjectWebsiteLink = ({ website = '' }) => {
  const text = website.replace(/(^\w+:|^)\/\//, '').replace(/\/$/, '')

  return (
    <p data-testid='projectwebsitelink-container'>
      <a
        href={website}
        target='_blank'
        rel='noreferrer noopener nofollow'
        className='underline text-4E7DD9 hover:no-underline'
      >
        {text}
      </a>
    </p>
  )
}
