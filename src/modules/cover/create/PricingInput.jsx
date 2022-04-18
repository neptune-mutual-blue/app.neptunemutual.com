import { Label } from "@/common/components/Label/Label";
import { RegularInput } from "@/common/components/Input/RegularInput";

const PricingInput = ({ setPricing, pricing }) => {
  return (
    <>
      <Label htmlFor={"cover_pricing"} className={"mt-10 mb-2"}>
        Fine Tune the Premium Pricing
      </Label>
      <div id="cover_pricing" className="flex flex-wrap justify-between">
        <div className="w-2/5">
          <RegularInput
            className="leading-none"
            inputProps={{
              id: "min_rate",
              placeholder: "Floor Rate",
              value: pricing.floorRate,
              onChange: (e) =>
                setPricing({ ...pricing, floorRate: e.target.value }),
            }}
          />
          <p className="pl-2 mt-2 text-sm text-9B9B9B mb-x">
            Enter the policy floor rate.
          </p>
        </div>
        <div className="w-2/5">
          <RegularInput
            className="leading-none"
            inputProps={{
              id: "max_rate",
              placeholder: "Ceiling Rate",
              value: pricing.ceilingRate,
              onChange: (e) =>
                setPricing({ ...pricing, ceilingRate: e.target.value }),
            }}
          />
          <p className="pl-2 mt-2 text-sm text-9B9B9B mb-x">
            Enter the policy ceiling rate.
          </p>
        </div>
      </div>
    </>
  );
};

export default PricingInput;
