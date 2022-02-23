import { Alert } from "@/components/UI/atoms/alert";
import { RegularButton } from "@/components/UI/atoms/button/regular";
import { Label } from "@/components/UI/atoms/label";
import { useState } from "react";
import { Radio } from "@/components/UI/atoms/radio";
import { TokenAmountInput } from "@/components/UI/organisms/token-amount-input";
import { useVote } from "@/src/hooks/useVote";
import { convertFromUnits } from "@/utils/bn";
import { useReporterCommission } from "@/src/hooks/useReporterCommission";
import { useRouter } from "next/router";
import Link from "next/link";

export const CastYourVote = ({ incidentReport }) => {
  const [votingType, setVotingType] = useState("incident-occurred");
  const [value, setValue] = useState();
  const {
    balance,
    minStake,
    tokenAddress,
    tokenSymbol,
    handleApprove,
    // handleDispute,
    handleAttest,
    handleRefute,
    approving,
    voting,
    canVote,
    isError,
  } = useVote({
    value,
    coverKey: incidentReport.key,
    incidentDate: incidentReport.incidentDate,
  });
  const { commission } = useReporterCommission();

  const router = useRouter();

  const handleRadioChange = (e) => {
    setVotingType(e.target.value);
  };

  const handleChooseMax = () => {
    setValue(convertFromUnits(balance).toString());
  };

  const handleValueChange = (val) => {
    if (typeof val === "string") {
      setValue(val);
    }
  };

  const isFirstDispute =
    votingType === "false-reporting" &&
    incidentReport.totalRefutedCount === "0";

  const handleReport = () => {
    if (votingType === "false-reporting") {
      handleRefute();
      return;
    }
    handleAttest();
  };

  const disputeUrl = router.asPath.replace("/details", "/dispute");

  return (
    <>
      <h3 className="text-h3 font-sora font-bold">Cast Your Vote</h3>
      <div className="flex mt-6 mb-8 max-w-lg">
        <Radio
          label={"Incident Occurred"}
          id="incident-radio"
          value="incident-occurred"
          name="vote-radio"
          checked={votingType === "incident-occurred"}
          onChange={handleRadioChange}
        />
        <Radio
          label={"False Reporting"}
          id="false-radio"
          name="vote-radio"
          value="false-reporting"
          checked={votingType === "false-reporting"}
          onChange={handleRadioChange}
        />
      </div>
      {!isFirstDispute && (
        <>
          <Label
            htmlFor={"stake-to-cast-vote"}
            className="font-semibold ml-2 mb-2 uppercase"
          >
            Stake
          </Label>

          <div className="flex flex-wrap items-start gap-8 mb-11">
            <div className="flex-auto">
              <TokenAmountInput
                tokenSymbol={tokenSymbol}
                tokenAddress={tokenAddress}
                tokenBalance={balance}
                handleChooseMax={handleChooseMax}
                inputValue={value}
                inputId={"stake-to-cast-vote"}
                disabled={approving || voting}
                onChange={handleValueChange}
              >
                {isFirstDispute && (
                  <p className="text-9B9B9B">
                    Minimum Stake: {convertFromUnits(minStake).toString()} NPM
                  </p>
                )}
              </TokenAmountInput>
            </div>

            {!canVote ? (
              <RegularButton
                className={
                  "py-6 w-64 text-h5 uppercase font-semibold whitespace-nowrap tracking-wider leading-6 text-EEEEEE"
                }
                onClick={handleApprove}
                disabled={isError || approving || !value}
              >
                {approving ? "Approving..." : <>Approve {tokenSymbol}</>}
              </RegularButton>
            ) : (
              <RegularButton
                className={
                  "flex-auto w-64 py-6 text-h5 uppercase font-semibold whitespace-nowrap tracking-wider leading-6 text-EEEEEE"
                }
                onClick={handleReport}
                disabled={isError || voting}
              >
                {voting ? "Reporting..." : "Report"}
              </RegularButton>
            )}
          </div>
        </>
      )}
      {isFirstDispute && (
        <>
          <Link href={disputeUrl} passHref>
            <RegularButton
              className={
                "flex-auto w-64 py-6 text-h5 uppercase font-semibold whitespace-nowrap tracking-wider leading-6 text-EEEEEE mb-4"
              }
            >
              Submit your Dispute
            </RegularButton>
          </Link>
          <Alert>
            Since you are the first person to dispute this incident reporting,
            you will need to stake atleast{" "}
            {convertFromUnits(minStake).toString()} NPM tokens. If the majority
            agree with you, you will earn {commission}% of the platform fee
            instead of the incident reporter.
          </Alert>
        </>
      )}
    </>
  );
};
