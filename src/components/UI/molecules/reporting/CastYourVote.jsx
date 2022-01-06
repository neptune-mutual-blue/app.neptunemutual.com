import { Alert } from "@/components/UI/atoms/alert";
import { RegularButton } from "@/components/UI/atoms/button/regular";
import { Label } from "@/components/UI/atoms/label";
import { Radio } from "@/components/UI/atoms/radio";
import { TokenAmountInput } from "@/components/UI/organisms/token-amount-input";
import { useState } from "react/cjs/react.development";

const maxAmtToStake = 500;

export const CastYourVote = () => {
  const [approved, setApproved] = useState(false);
  const [vote, setVote] = useState("incident-occurred");
  const [stakedAmount, setStakedAmount] = useState();

  const handleRadioChange = (e) => {
    setVote(e.target.value);
  };

  const handleChooseMax = () => {
    setStakedAmount(maxAmtToStake);
  };

  const handleStakedAmtChange = (e) => {
    setStakedAmount(e.target.value);
  };

  const handleApproveClick = () => {
    setApproved(true);
  };

  const handleReportClick = () => {
    console.log("handle report clicked");
  };

  return (
    <>
      <h3 className="text-h3 font-sora font-bold">Cast Your Vote</h3>
      <div className="flex mt-6 mb-8">
        <Radio
          label={"Incident Occurred"}
          id="incident-radio"
          value="incident-occurred"
          name="vote-radio"
          checked={vote === "incident-occurred"}
          onChange={handleRadioChange}
        />
        <Radio
          label={"False Reporting"}
          id="false-radio"
          name="vote-radio"
          value="false-reporting"
          checked={vote === "false-reporting"}
          onChange={handleRadioChange}
        />
      </div>
      <div className="flex flex-wrap items-center justify-between mb-11">
        <div className="max-w-lg">
          <TokenAmountInput
            labelText={"Stake"}
            tokenSymbol={"NPM"}
            handleChooseMax={handleChooseMax}
            inputValue={stakedAmount}
            inputId={"stake-to-cast-vote"}
            onInput={handleStakedAmtChange}
          />
        </div>

        {!approved && (
          <RegularButton className={"px-18 py-6"} onClick={handleApproveClick}>
            Approve NPM
          </RegularButton>
        )}

        {approved && (
          <RegularButton className={"px-18 py-6"} onClick={handleReportClick}>
            Report
          </RegularButton>
        )}
      </div>
      {stakedAmount && (
        <Alert>
          Since you are the first person to dispute this incident reporting, you
          will need to stake atleast 250 NPM tokens. If the majority agree with
          you, you will earn 20% of the platform fee instead of the incident
          reporter.
        </Alert>
      )}
    </>
  );
};
