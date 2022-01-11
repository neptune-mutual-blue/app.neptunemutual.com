import { Alert } from "@/components/UI/atoms/alert";
import { RegularButton } from "@/components/UI/atoms/button/regular";
import { Label } from "@/components/UI/atoms/label";
import { useState } from "react";
import { Radio } from "@/components/UI/atoms/radio";
import { TokenAmountInput } from "@/components/UI/organisms/token-amount-input";

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
    setApproved(false);
  };

  const isFirstDispute = vote === "false-reporting";

  return (
    <>
      <h3 className="text-h3 font-sora font-bold">Cast Your Vote</h3>
      <div className="flex mt-6 mb-8 max-w-lg">
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
      <Label
        htmlFor={"stake-to-cast-vote"}
        className="font-semibold mb-4 uppercase"
      >
        {"Stake"}
      </Label>
      <div className="flex flex-wrap items-start gap-6 mb-11">
        <div>
          <TokenAmountInput
            tokenSymbol={"NPM"}
            handleChooseMax={handleChooseMax}
            inputValue={stakedAmount}
            inputId={"stake-to-cast-vote"}
            onInput={handleStakedAmtChange}
          />
        </div>

        {!approved && (
          <RegularButton
            className={
              "flex-auto px-8 py-6 text-h5 font-bold whitespace-nowrap"
            }
            onClick={handleApproveClick}
            disabled={!stakedAmount && true}
          >
            APPROVE NPM
          </RegularButton>
        )}

        {approved && (
          <RegularButton
            className={
              "flex-auto px-8 py-6 text-h5 font-bold whitespace-nowrap"
            }
            onClick={handleReportClick}
            disabled={!stakedAmount && true}
          >
            REPORT
          </RegularButton>
        )}
      </div>
      {isFirstDispute && (
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
