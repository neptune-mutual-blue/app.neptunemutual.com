import {
  DescriptionComponent
} from '@/modules/cover/cover-terms/DescriptionComponent'
import { Network } from '@/modules/cover/cover-terms/Network'
import { Trans } from '@lingui/macro'

export const CoverTerms = ({ name: coverName, blockchains, about, parameters }) => {
  return (
    <div>
      <h1 className='mt-12 text-000000 text-display-md'>
        <Trans>{coverName} Cover Terms</Trans>
      </h1>

      {
        blockchains?.length && (
          <div className='mt-5'>
            <p className='font-semibold'>
              <Trans>Covered Blockchains</Trans>
            </p>
            <div className='flex flex-wrap gap-2 mt-2'>
              {
                blockchains.map((chain, idx) => {
                  return (
                    <Network
                      chainId={chain.chainId}
                      key={idx}
                    />
                  )
                })
              }
            </div>
          </div>
        )
      }

      <div className='mt-6'>
        <p>{about}</p>
      </div>

      {
        parameters?.map(({ parameter, text, list }, idx) => {
          return (
            <DescriptionComponent
              key={idx}
              wrapperClass='mt-6'
              title={parameter}
              text={text}
              bullets={list?.items}
            />
          )
        })
      }
    </div>
  )
}
