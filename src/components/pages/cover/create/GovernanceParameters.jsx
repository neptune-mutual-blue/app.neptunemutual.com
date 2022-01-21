import { RegularInput } from "@/components/UI/atoms/input/regular-input";
import { Label } from "@/components/UI/atoms/label";

const GovernanceParameters = ({
  governanceParameter,
  setGovernanceParameter,
}) => {
  return (
    <>
      <Label htmlFor={"cover_pricing"} className={"mt-10 mb-2"}>
        Configure Governance Parameters
      </Label>
      <div id="cover_pricing" className="flex flex-wrap justify-between">
        <div className="w-2/5">
          <RegularInput
            className="leading-none"
            inputProps={{
              id: "reporting_period",
              placeholder: "Reporting Period",
              value: governanceParameter.reporting_period,
              onChange: (e) =>
                setGovernanceParameter({
                  ...governanceParameter,
                  reporting_period: e.target.value,
                }),
            }}
          />
          <p className="text-sm text-9B9B9B mt-2 mb-x pl-2">
            Min 7-day reporting period.
          </p>
        </div>
        <div className="w-2/5">
          <RegularInput
            className="leading-none"
            inputProps={{
              id: "claim_period",
              placeholder: "Claim Period",
              value: governanceParameter.claim_period,
              onChange: (e) =>
                setGovernanceParameter({
                  ...governanceParameter,
                  claim_period: e.target.value,
                }),
            }}
          />
          <p className="text-sm text-9B9B9B mt-2 mb-x pl-2">
            Min 7-day claim period.
          </p>
        </div>
      </div>
    </>
  );
};

export default GovernanceParameters;
