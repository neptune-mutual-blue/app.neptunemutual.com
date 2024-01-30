import { Container } from '@/common/Container/Container'
import {
  data,
  socials
} from '@/common/Footer/data'
import DiscordIcon from '@/icons/DiscordIcon'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'

export const Footer = () => {
  const { i18n } = useLingui()

  return (
    <footer className='pt-16 border-t pb-18 border-B0C4DB print:hidden'>
      <Container>
        <div className='flex flex-col justify-between gap-10 lg:flex-row'>
          <div className='flex flex-col items-start justify-between gap-8'>
            <img
              loading='lazy'
              alt={t(i18n)`Neptune Mutual`}
              srcSet='/logos/neptune-mutual-full.svg'
              className='h-8.5 w-max'
              data-testid='footer-logo'
            />

            <div className='text-01052D'>
              <p className='font-bold leading-7 text-display-xs'>Need assistance?</p>
              <p className='mt-2 font-semibold text-md'>Contact us on Discord</p>
              <a className='hover:fill-4E7DD9 hover:text-4E7DD9' href='https://discord.com/invite/2qMGTtJtnW' target='_blank' rel='noreferrer'>
                <DiscordIcon className='mt-4' width='48' height='48' />
              </a>
            </div>
          </div>

          <div className='flex flex-wrap justify-between gap-6 lg:flex-nowrap'>
            {
            data.map(({ title, links }, i) => {
              return (
                <div key={i} className='min-w-205'>
                  <p className='text-sm font-semibold leading-5 text-9B9B9B'>{title}</p>

                  <div className='mt-4 space-y-3 font-medium text-md text-364253'>
                    {
                    links.map(({ text, href, isExternal }, idx) => {
                      return (
                        <a className='block hover:text-4E7DD9' href={href} key={idx} target={isExternal ? '_blank' : ''} rel='noreferrer noopener'>
                          {text}
                        </a>
                      )
                    })
                  }
                  </div>
                </div>
              )
            })
          }
          </div>
        </div>

        <div className='py-8 mt-12 border-y border-B0C4DB text-364253'>
          <p className='font-semibold text-lg leading-7.5'>Risk Warning</p>
          <p className='mt-2 text-sm leading-6'>
            Trading crypto assets involves significant risk and can result in the loss of your capital. You should not invest more than you can afford to lose and you should ensure that you fully understand the risks involved. Before trading, please take into consideration your level of experience, investment objectives, and seek independent financial advice if necessary. It is your responsibility to ascertain whether you are permitted to use the services of Neptune Mutual based on the legal requirements in your country of residence.
          </p>
        </div>

        <div className='flex flex-wrap justify-between gap-2 mt-8'>
          <p className='text-667085 text-md'>Neptune Mutual © 2022 </p>
          <div className='flex flex-wrap items-center gap-6'>
            {
              socials.map(({ href, Icon, isExternal }, i) => {
                return (
                  <a href={href} key={i} target={isExternal ? '_blank' : ''} rel='noreferrer noopener'>
                    <Icon width='24' height='24' className='text-1D2939 hover:fill-4E7DD9 hover:text-4E7DD9' />
                  </a>
                )
              })
            }
          </div>
        </div>
      </Container>
    </footer>
  )
}
