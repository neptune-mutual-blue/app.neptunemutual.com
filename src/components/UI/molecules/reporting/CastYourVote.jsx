import { Alert } from "@/components/UI/atoms/alert";
import { RegularButton } from "@/components/UI/atoms/button/regular";
import { Label } from "@/components/UI/atoms/label";
import { useState } from "react";
import { Radio } from "@/components/UI/atoms/radio";
import { TokenAmountInput } from "@/components/UI/organisms/token-amount-input";
import { useToast } from "@/lib/toast/context";
import { TOAST_DEFAULT_TIMEOUT } from "@/src/config/toast";

const maxAmtToStake = 500;

export const CastYourVote = () => {
  const [approved, setApproved] = useState(false);
  const [vote, setVote] = useState("incident-occurred");
  const [stakedAmount, setStakedAmount] = useState();

  const toast = useToast();

  const handleRadioChange = (e) => {
    setVote(e.target.value);
  };

  const handleChooseMax = () => {
    setStakedAmount(maxAmtToStake);
  };

  const handleStakedAmtChange = (val) => {
    if (typeof val === "string") {
      setStakedAmount(val);
    }
  };

  const handleApproveClick = () => {
    setApproved(true);
  };

  const handleReportClick = () => {
    setApproved(false);
    toast?.pushSuccess({
      title: "Bond Claimed Successfully",
      message: <p></p>,
      lifetime: TOAST_DEFAULT_TIMEOUT,
    });
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
      <div className="flex flex-wrap items-start gap-8 mb-11">
        <div className="flex-auto">
          <TokenAmountInput
            tokenSymbol={"NPM"}
            handleChooseMax={handleChooseMax}
            inputValue={stakedAmount}
            inputId={"stake-to-cast-vote"}
            onChange={handleStakedAmtChange}
          />
        </div>

        {!approved && (
          <RegularButton
            className={
              "py-6 w-64 text-h5 font-bold whitespace-nowrap tracking-wider leading-6 text-EEEEEE"
            }
            onClick={handleApproveClick}
            disabled={!stakedAmount}
          >
            APPROVE NPM
          </RegularButton>
        )}

        {approved && (
          <RegularButton
            className={
              "flex-auto w-64 py-6 text-h5 font-bold whitespace-nowrap tracking-wider leading-6 text-EEEEEE"
            }
            onClick={handleReportClick}
            disabled={!stakedAmount}
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
