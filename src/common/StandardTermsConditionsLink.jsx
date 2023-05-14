import StandardTermsConditionsIcon from '@/icons/StandardTermsConditionsIcon'
import { STANDARD_TERMS_AND_CONDITIONS } from '@/src/config/constants'

export const StandardTermsConditionsLink = () => {
  return (
    <p className='mt-6 text-4E7DD9'>
      <a href={STANDARD_TERMS_AND_CONDITIONS} target='_blank' rel='noopener noreferrer' className='inline-flex items-center gap-2'>
        <StandardTermsConditionsIcon /> View Standard Terms & Conditions
      </a>
    </p>
  )
}
