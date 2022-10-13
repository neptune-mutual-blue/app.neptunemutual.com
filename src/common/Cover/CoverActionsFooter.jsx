import Link from 'next/link'

import { Container } from '@/common/Container/Container'
import { Grid } from '@/common/Grid/Grid'
import { CoverActionCard } from './CoverActionCard'
import { actions as coverActions } from '@/src/config/cover/actions'
import { Trans } from '@lingui/macro'

export const CoverActionsFooter = ({ activeKey, coverKey, productKey }) => {
  return (
    <>
      {/* Cover Actions */}
      <div
        className='pt-12 border-t sm:pt-20 pb-36 bg-f6f7f9 border-t-B0C4DB'
        data-testid='main-container'
      >
        <Container>
          <h1 className='mb-10 font-bold text-center capitalize text-h4 md:text-h2 font-sora sm:mb-12'>
            <Trans>Didn&#x2019;t find what you were looking for?</Trans>
          </h1>
          <Grid>
            {Object.keys(coverActions)
              .filter((x) => x !== activeKey)
              .map((actionKey, i) => {
                return (
                  <Link
                    key={i}
                    href={coverActions[actionKey].getHref(coverKey, productKey)}
                  >
                    <a
                      className='rounded-3xl focus:outline-none focus-visible:ring-2 focus-visible:ring-4e7dd9'
                      data-testid='cover-action-card'
                    >
                      <CoverActionCard
                        title={coverActions[actionKey].title}
                        description={coverActions[actionKey].description}
                        imgSrc={coverActions[actionKey].footerImgSrc}
                      />
                    </a>
                  </Link>
                )
              })}
          </Grid>
        </Container>
      </div>
    </>
  )
}
