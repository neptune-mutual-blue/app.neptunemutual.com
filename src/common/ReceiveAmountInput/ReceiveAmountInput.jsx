import { DisabledInput } from '@/common/Input/DisabledInput'
import { Label } from '@/common/Label/Label'

export const ReceiveAmountInput = ({
  tokenSymbol,
  labelText,
  inputValue,
  ...rest
}) => {
  return (
    <>
      <Label className='mb-4' htmlFor='receive-amount'>
        {labelText}
      </Label>

      <DisabledInput value={inputValue} unit={tokenSymbol} {...rest} />
    </>
  )
}
