import { DisabledInput } from "@/src/common/components/input/disabled-input";
import { Label } from "@/src/common/components/label";

export const ReceiveAmountInput = ({ tokenSymbol, labelText, inputValue }) => (
  <>
    <Label className="mb-4" htmlFor="receive-amount">
      {labelText}
    </Label>

    <DisabledInput value={inputValue} unit={tokenSymbol} />
  </>
);
