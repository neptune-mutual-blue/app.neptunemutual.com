import { classNames } from '@/utils/classnames'
import { isAddress } from '@ethersproject/address'

export const AddressInput = ({ value, onChange, placeholder = 'Enter Value', className = '' }) => {
  const error = (!isAddress(value) && value) ? 'Invalid Wallet Address' : ''

  return (
    <div
      className={
        classNames(
          'rounded-big w-full p-2.5 border focus-within:ring-4E7DD9 focus-within:ring focus-within:ring-offset-0 focus-within:ring-opacity-30',
          (error) ? 'border-E52E2E bg-E52E2E bg-opacity-5' : 'border-F6F7F9 bg-F6F7F9',
          className
        )
      }
    >
      <input
        placeholder={placeholder}
        className={classNames('w-full text-md bg-transparent outline-none')}
        value={value}
        onChange={e => { return onChange(e.target.value) }}
      />

      {error && <p className='mt-2 text-sm text-E52E2E'>{error}</p>}
    </div>
  )
}
