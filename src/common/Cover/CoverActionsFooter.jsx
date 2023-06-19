import Link from 'next/link'

import { Container } from '@/common/Container/Container'
import { Grid } from '@/common/Grid/Grid'
import { actions as coverActions } from '@/src/config/cover/actions'
import { Trans } from '@lingui/macro'

import { CoverActionCard } from './CoverActionCard'

export const CoverActionsFooter = ({ activeKey, coverKey, productKey }) => {
  return (
    <>
      {/* Cover Actions */}
      <div
        className='pt-12 border-t sm:pt-20 pb-36 bg-F6F7F9 border-t-B0C4DB'
        data-testid='main-container'
      >
        <Container>
          <h1 className='mb-10 font-bold text-center capitalize text-lg md:text-display-sm sm:mb-12'>
            <Trans>Didn&#x2019;t find what you were looking for?</Trans>
          </h1>
          <Grid>
            {Object.keys(coverActions)
              .filter((x) => { return x !== activeKey })
              .map((actionKey, i) => {
                return (
                  <Link
                    key={i}
                    href={coverActions[actionKey].getHref(coverKey, productKey)}
                  >
                    <a
                      className='rounded-3xl focus:outline-none focus-visible:ring-2 focus-visible:ring-4E7DD9'
                      data-testid='cover-action-card'
                    >
                      <CoverActionCard
                        title={coverActions[actionKey].title}
                        description={coverActions[actionKey].description}
                        imgSrc={coverActions[actionKey].imgSrc}
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
