import { Label } from "@/components/UI/atoms/label";
import { RegularInput } from "@/components/UI/atoms/input/regular-input";

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
          <p className="text-sm text-9B9B9B mt-2 mb-x pl-2">
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
          <p className="text-sm text-9B9B9B mt-2 mb-x pl-2">
            Enter the policy ceiling rate.
          </p>
        </div>
      </div>
    </>
  );
};

export default PricingInput;
