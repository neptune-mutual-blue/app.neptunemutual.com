import { Trans } from '@lingui/macro'

export const CoverRules = ({ rules = '' }) => {
  return (
    <div>
      <h4 className='mt-10 mb-6 font-semibold text-lg'>
        <Trans>Cover Rules</Trans>
      </h4>
      <p className='mb-4'>
        <Trans>
          Carefully read the following terms and conditions. For a successful
          claim payout, all of the following points must be true.
        </Trans>
      </p>
      <ol className='pl-5 list-decimal'>
        {rules.split('\n').map((x, i) => {
          return (
            <li key={i}>
              {x
                .trim()
                .replace(/^\d+\./g, '')
                .trim()}
            </li>
          )
        })}
      </ol>
    </div>
  )
}
