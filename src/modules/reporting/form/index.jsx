import React, { useState } from 'react'

import { RegularInput } from '@/common/Input/RegularInput'
import { Label } from '@/common/Label/Label'
import DeleteIcon from '@/icons/delete-icon'
import { classNames } from '@/utils/classnames'
import {
  t,
  Trans
} from '@lingui/macro'
import { useLingui } from '@lingui/react'

/**
 *
 * @param {Object} props
 * @param {import('react').ReactNode} props.label
 * @param {string} props.id
 * @returns
 */
function InputHeader ({ label, id }) {
  return (
    <Label htmlFor={id} className='mt-6 mb-2'>
      {label}
    </Label>
  )
}

/**
 *
 * @param {Object} props
 * @param {string} props.desc
 * @param {import('react').ReactNode} [props.label]
 * @param {React.ComponentProps<'input'> & React.RefAttributes<HTMLInputElement> & {error?:boolean}} props.inputProps
 * @param {string} [props.className]
 * @param {string} [props.error]
 * @param {number | string} [props.key]
 * @returns
 */
export function InputField ({ label, inputProps, desc, className = '', error }) {
  return (
    <div className={classNames(className, inputProps.disabled && 'opacity-40')}>
      {label && <InputHeader label={label} id={inputProps.id} />}
      <RegularInput {...inputProps} />
      {desc && <span className='pl-2 mt-2 text-sm text-9B9B9B'>{desc}</span>}
      {error && (
        <span className='flex items-center pl-2 text-FA5C2F'>{error}</span>
      )}
    </div>
  )
}

/**
 *
 * @param {Object} props
 * @param {import('react').ReactNode} props.label
 * @param {{id?: string, name?: string, disabled: boolean, required: boolean, className?: string, placeholder?: string, rows?: number, maxLength?: number }} props.inputProps
 * @param {string} [props.className]
 * @returns
 */
export function InputDescription ({ label, inputProps, className }) {
  const [descriptionCounter, setDescriptionCounter] = useState(0)
  const { className: inputClassName, ...rest } = inputProps

  /**
   * @param {Object} e
   */
  function handleChange (e) {
    const text = e.target.value
    setDescriptionCounter(text.length)
  }

  return (
    <div className={classNames(className, inputProps.disabled && 'opacity-40')}>
      <InputHeader label={label} id={inputProps.id} />
      <textarea
        {...rest}
        autoComplete='off'
        className={classNames(inputClassName, 'disabled:cursor-not-allowed')}
        onChange={handleChange}
      />
      <span
        className={classNames(
          'absolute bottom-0 right-0 mr-2 mb-2',
          descriptionCounter >= inputProps.maxLength && 'text-FA5C2F'
        )}
      >
        {descriptionCounter}/{inputProps.maxLength}
      </span>
    </div>
  )
}

/**
 *
 * @param {Object} props
 * @param {boolean} [props.disabled]
 * @param {boolean} [props.required]
 * @returns
 */
export function ProofOfIncident ({ disabled, required }) {
  /**
   * @type {[Array, (fields: Array) => void]}
   */
  const [fields, setFields] = useState([])

  /**
   *
   * @param {Object} e
   */
  function handleAdd (e) {
    e && e.preventDefault()
    const newFields = [...fields]
    newFields.push('')
    setFields(newFields)
  }

  /**
   *
   * @param {Object} e
   * @param {number} index
   */
  function handleChange (e, index) {
    const newFields = [...fields]
    newFields[index] = e.target.value
    setFields(newFields)
  }

  /**
   *
   * @param {number} num
   */
  function handleDelete (num) {
    const newFields = [...fields].filter((_, key) => {
      return key !== num
    })

    setFields(newFields)
  }

  const { i18n } = useLingui()

  return (
    <>
      <InputField
        label={<Trans>Proof of incident</Trans>}
        inputProps={{
          id: 'incident_url',
          name: 'incident_url',
          placeholder: 'https://',
          required: required,
          disabled: disabled,
          type: 'url'
        }}
        desc={t(i18n)`Provide a URL confirming the nature of the incident.`}
      />

      {fields.map((value, i) => {
        return (
          <div key={i} className='flex flex-row mt-12'>
            <InputField
              className='flex-grow'
              inputProps={{
                id: `incident_url_${i}`,
                name: 'incident_url',
                placeholder: 'https://',
                onChange: (/** @type {Object} */ e) => { return handleChange(e, i) },
                value: value,
                required: required,
                disabled: disabled,
                type: 'url'
              }}
              desc={t(i18n)`Provide a URL confirming the nature of the incident.`}
            />

            <button
              onClick={(/** @type {Object} */ e) => {
                e && e.preventDefault()
                handleDelete(i)
              }}
              data-testid={`button-${i}`}
              className={classNames(
                'text-404040 flex-shrink ml-4 border rounded-md h-10 mt-4 px-2.5 border-E6EAEF bg-E6EAEF',
                'disabled:opacity-40 disabled:cursor-not-allowed'
              )}
              title='Delete'
              type='button'
              disabled={disabled}
            >
              <DeleteIcon width={14} height={16} />
            </button>
          </div>
        )
      })}

      <button
        onClick={handleAdd}
        type='button'
        disabled={disabled}
        className={classNames(
          'px-6 py-3 mt-4 text-black bg-transparent rounded-lg border border-B0C4DB bg-E6EAEF',
          'disabled:opacity-40 disabled:cursor-not-allowed'
        )}
      >
        + <Trans>Add new link</Trans>
      </button>
    </>
  )
}
