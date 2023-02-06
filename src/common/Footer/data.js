import TwitterIcon from '@/icons/TwitterIcon'
import RedditIcon from '@/icons/RedditIcon'
import TelegramIcon from '@/icons/TelegramIcon'
import GithubIcon from '@/icons/GithubIcon'
import YoutubeIcon from '@/icons/YoutubeIcon'
import DiscordIcon from '@/icons/DiscordIcon'
import LinkedinFilledIcon from '@/icons/LinkedinFilledIcon'

const data = [
  {
    title: 'Resources',
    links: [
      {
        href: 'https://neptunemutual.com',
        text: 'Website',
        isExternal: true
      },
      { href: 'https://neptunemutual.com/blog/', text: 'Blog', isExternal: true },
      { href: 'https://neptunemutual.com/pressroom/', text: 'Press Room', isExternal: true },
      { href: 'https://neptunemutual.com/ecosystem/', text: 'Ecosystem', isExternal: true },
      {
        href: 'https://docs.neptunemutual.com',
        text: 'Documentation',
        isExternal: true
      },
      { href: 'https://neptunemutual.com/web3-tools/', text: 'Web3 Tools', isExternal: true }
    ]
  },
  {
    title: 'Company',
    links: [
      { href: 'https://neptunemutual.com/about/', text: 'About us', isExternal: false },
      {
        href: 'https://neptunemutual.com/grants-and-bounties/',
        text: 'Grants and Bounties',
        isExternal: true
      },
      {
        href: 'https://neptunemutual.com/careers/',
        text: 'Careers',
        isExternal: true
      },
      { href: 'https://neptunemutual.com/security/', text: 'Security', isExternal: true },
      { href: 'https://neptunemutual.com/contact/', text: 'Contact', isExternal: true }
    ]
  },
  {
    title: 'Policies',
    links: [
      { href: 'https://neptunemutual.com/policies/risk-factors/', text: 'Risk Factors', isExternal: true },
      { href: 'https://neptunemutual.com/policies/terms-of-use/', text: 'Terms of Service', isExternal: true },
      { href: 'https://neptunemutual.com/policies/privacy-policy/', text: 'Privacy Policy', isExternal: true },
      { href: 'https://neptunemutual.com/policies/standard-terms-and-conditions/', text: 'Standard Terms & Conditions', isExternal: true }
    ]
  }
]

const socials = [
  {
    Icon: TwitterIcon,
    text: 'twitter',
    href: 'https://twitter.com/neptunemutual',
    isExternal: true
  },
  {
    Icon: RedditIcon,
    text: 'reddit',
    href: 'https://www.reddit.com/r/NeptuneMutual/',
    isExternal: true
  },
  {
    Icon: TelegramIcon,
    text: 'telegram',
    href: 'https://t.me/neptunemutual',
    isExternal: true
  },
  {
    Icon: GithubIcon,
    text: 'github',
    href: 'https://github.com/neptune-mutual-blue',
    isExternal: true
  },
  {
    Icon: LinkedinFilledIcon,
    text: 'linkedin',
    href: 'https://www.linkedin.com/company/neptune-mutual',
    isExternal: true
  },
  {
    Icon: YoutubeIcon,
    text: 'youtube',
    href: 'https://www.youtube.com/c/NeptuneMutual',
    isExternal: true
  },
  {
    Icon: DiscordIcon,
    text: 'discord',
    href: 'https://discord.com/invite/2qMGTtJtnW',
    isExternal: true
  }
]

export { data, socials }
