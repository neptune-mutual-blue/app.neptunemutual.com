import BlogIcon from '@/icons/BlogIcon'
import DiscordIcon from '@/icons/DiscordIcon'
import DocumentationIcon from '@/icons/DocumentationIcon'
import FacebookIcon from '@/icons/FacebookIcon'
import GithubIcon from '@/icons/GithubIcon'
import LinkedinIcon from '@/icons/LinkedinIcon'
import TelegramIcon from '@/icons/TelegramIcon'
import TwitterIcon from '@/icons/TwitterIcon'
import WebsiteIcon from '@/icons/WebsiteIcon'

const IconLink = ({ href, iconText, icon }) => {
  return (
    <a
      href={href}
      className='inline-block mr-4 hover:fill-4E7DD9 hover:text-4E7DD9'
      target='_blank'
      rel='noreferrer nofollow noopener'
      data-testid='icon-link'
      title={`${iconText} link`}
    >
      <span className='sr-only'>{iconText}</span>
      {icon}
    </a>
  )
}

export const SocialIconLinks = ({ links }) => {
  const { facebook, linkedin, twitter, discord, documentation, github, telegram, website, blog } = links || {}

  return (
    <div className='mt-4 sm:mt-5' data-testid='socialiconlinks-container'>
      {facebook && (
        <IconLink
          href={facebook}
          iconText='Facebook'
          icon={<FacebookIcon width={24} />}
        />
      )}

      {linkedin && (
        <IconLink
          href={linkedin}
          iconText='LinkedIn'
          icon={<LinkedinIcon width={24} />}
        />
      )}

      {twitter && (
        <IconLink
          href={twitter}
          iconText='Twitter'
          icon={<TwitterIcon width={24} />}
        />
      )}

      {blog && (
        <IconLink
          href={blog}
          iconText='Blog'
          icon={<BlogIcon width={24} />}
        />
      )}

      {discord && (
        <IconLink
          href={discord}
          iconText='Discord'
          icon={<DiscordIcon width={24} />}
        />
      )}

      {documentation && (
        <IconLink
          href={documentation}
          iconText='Documentation'
          icon={<DocumentationIcon width={24} />}
        />
      )}

      {github && (
        <IconLink
          href={github}
          iconText='Github'
          icon={<GithubIcon width={24} />}
        />
      )}

      {telegram && (
        <IconLink
          href={telegram}
          iconText='Telegram'
          icon={<TelegramIcon width={24} />}
        />
      )}

      {website && (
        <IconLink
          href={website}
          iconText='Website'
          icon={<WebsiteIcon width={24} />}
        />
      )}
    </div>
  )
}
