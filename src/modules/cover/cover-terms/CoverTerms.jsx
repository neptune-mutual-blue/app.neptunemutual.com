import {
  DescriptionComponent
} from '@/modules/cover/cover-terms/DescriptionComponent'
import { Network } from '@/modules/cover/cover-terms/Network'
import { Trans } from '@lingui/macro'

export const CoverTerms = ({ coverInfo }) => {
  const { infoObj: { coverName, productName, blockchains, about, parameters } } = coverInfo

  return (
    <div>
      <h1 className='mt-12 text-000000 text-h1'>
        <Trans>{coverName ?? productName} Cover Terms</Trans>
      </h1>

      {
        blockchains?.length && (
          <div className='mt-5'>
            <p className='font-semibold'><Trans>Covered Blockchains</Trans></p>
            <div className='flex flex-wrap gap-2 mt-2'>
              {
                blockchains.map((chain, idx) => <Network chainId={chain.chainId} key={idx} />)
              }
            </div>
          </div>
        )
      }

      <div className='mt-6'>
        <p>{about}</p>
      </div>

      {
        parameters?.map(({ parameter, text, list }, idx) => (
          <DescriptionComponent
            wrapperClass='mt-6'
            title={parameter}
            text={text}
            bullets={list?.items}
            key={idx}
          />
        ))
      }
    </div>
  )
}
