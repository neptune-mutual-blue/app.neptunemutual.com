import { useState } from 'react'

import { RegularButton } from '@/common/Button/RegularButton'
import { Checkbox } from '@/common/Checkbox/Checkbox'
import { classNames } from '@/utils/classnames'

export const AcceptReportRulesForm = ({ onAccept, children }) => {
  const [checked, setChecked] = useState(false)

  const handleChange = (ev) => {
    setChecked(ev.target.checked)
  }

  const handleSubmit = (ev) => {
    ev.preventDefault()

    if (checked) {
      onAccept()
    }
  }

  return (
    <>
      {/* Accept Rules Form */}
      <form autoComplete='off' onSubmit={handleSubmit} className='mt-20'>
        <Checkbox
          id='checkid'
          name='checkinputname'
          checked={checked}
          onChange={handleChange}
          data-testid='accept-report-rules-check-box'
        >
          I have read, understood, and agree to the terms of cover rules
        </Checkbox>
        <br />
        {children}
        <RegularButton
          data-testid='accept-report-rules-next-button'
          disabled={!checked}
          className={classNames(
            !checked && 'opacity-30 cursor-not-allowed',
            'font-bold py-6 px-12 mt-8 w-full md:w-auto'
          )}
          type='submit'
        >
          REPORT AN INCIDENT
        </RegularButton>
      </form>
    </>
  )
}
