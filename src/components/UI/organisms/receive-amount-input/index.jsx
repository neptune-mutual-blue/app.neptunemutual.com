import { Label } from "@/components/UI/atoms/label"

export const ReceiveAmountInput = ({
  tokenSymbol,
  labelText,
  inputValue,
  inputId,
}) => (
  <>
    <Label className="font-semibold mb-4 uppercase">{labelText}</Label>
    <div className="flex rounded-lg shadow-sm text-black text-h4 relative">
      <div className="flex items-stretch flex-grow focus-within:z-10">
        <input
          value={inputValue}
          id={inputId}
          className="focus:ring-4E7DD9 focus:border-4E7DD9 bg-transparent block w-full rounded-lg py-6 pl-6 border border-B0C4DB"
        />
      </div>
      <div className="absolute right-0 h-full flex items-center pr-6 text-9B9B9B ">
        {tokenSymbol}
      </div>
    </div>
  </>
);
