import { DisabledInput } from "@/components/UI/atoms/input/disabled-input";
import { Label } from "@/components/UI/atoms/label";

export const ReceiveAmountInput = ({ tokenSymbol, labelText, inputValue }) => (
  <>
    <Label className="mb-4" htmlFor="receive-amount">
      {labelText}
    </Label>

    <DisabledInput value={inputValue} unit={tokenSymbol} />
  </>
);
