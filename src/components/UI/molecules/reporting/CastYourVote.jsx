import { Alert } from "@/components/UI/atoms/alert";
import { RegularButton } from "@/components/UI/atoms/button/regular";
import { Label } from "@/components/UI/atoms/label";
import { useState, useEffect } from "react";
import { Radio } from "@/components/UI/atoms/radio";
import { TokenAmountInput } from "@/components/UI/organisms/token-amount-input";
import { useVote } from "@/src/hooks/useVote";
import {
  convertFromUnits,
  isGreater,
  isEqualTo,
  convertToUnits,
} from "@/utils/bn";
import { useReporterCommission } from "@/src/hooks/useReporterCommission";
import { useRouter } from "next/router";
import Link from "next/link";
import { useFirstReportingStake } from "@/src/hooks/useFirstReportingStake";
import { classNames } from "@/utils/classnames";
import { DataLoadingIndicator } from "@/components/DataLoadingIndicator";

export const CastYourVote = ({ incidentReport }) => {
  const [votingType, setVotingType] = useState("incident-occurred");
  const [value, setValue] = useState();
  const { minStake } = useFirstReportingStake({ coverKey: incidentReport.key });
  const [error, setError] = useState("");
  const {
    balance,
    tokenAddress,
    tokenSymbol,
    handleApprove,
    handleAttest,
    handleRefute,
    loadingAllowance,
    loadingBalance,
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

  useEffect(() => {
    if (!value && error) {
      setError("");
      return;
    }

    if (!value) {
      return;
    }

    if (isGreater(convertToUnits(value), balance)) {
      setError("Exceeds maximum balance");
      return;
    }

    if (isEqualTo(convertToUnits(value), 0)) {
      setError("Insufficient Balance");
      return;
    }

    if (error) {
      setError("");
      return;
    }
  }, [balance, error, value]);

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

  const handleReport = (onTxSuccess) => {
    if (votingType === "false-reporting") {
      handleRefute();
      return;
    }
    handleAttest(onTxSuccess);
  };

  const disputeUrl = router.asPath.replace("/details", "/dispute");

  let loadingMessage = "";
  if (loadingBalance) {
    loadingMessage = "Fetching balance...";
  } else if (loadingAllowance) {
    loadingMessage = "Fetching allowance...";
  }

  return (
    <>
      <h3 className="font-bold text-center lg:text-left text-h3 font-sora">
        Cast Your Vote
      </h3>
      <div className="flex flex-col items-center justify-between max-w-lg mt-6 mb-8 sm:justify-start sm:items-start sm:flex-row">
        <div
          className={classNames(
            "w-full h-18 sm:h-auto mb-4 bg-white border rounded-lg sm:mb-0 sm:bg-transparent sm:rounded-none sm:border-0 lg:mr-4 xl:mr-16 border-B0C4DB focus:outline-none focus-visible:ring-0 focus-visible:ring-4e7dd9",
            votingType === "incident-occurred" && "border-2 border-[#4e7dd9]"
          )}
        >
          <Radio
            label={"Incident Occurred"}
            id="incident-radio"
            value="incident-occurred"
            name="vote-radio"
            checked={votingType === "incident-occurred"}
            onChange={handleRadioChange}
          />
        </div>
        <div
          className={classNames(
            "w-full h-18 sm:h-auto mb-4 bg-white border rounded-lg sm:mb-0 sm:bg-transparent sm:rounded-none sm:border-0 lg:mr-4  xl:mr-16 border-B0C4DB focus:outline-none focus-visible:ring-0 focus-visible:ring-4e7dd9",
            votingType === "false-reporting" && "border-2 border-[#4e7dd9]"
          )}
        >
          <Radio
            label={"False Reporting"}
            id="false-radio"
            name="vote-radio"
            value="false-reporting"
            checked={votingType === "false-reporting"}
            onChange={handleRadioChange}
          />
        </div>
      </div>
      {!isFirstDispute && (
        <>
          <Label
            htmlFor={"stake-to-cast-vote"}
            className="mb-2 ml-2 font-semibold uppercase"
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
                {error && (
                  <p className="flex items-center text-FA5C2F">{error}</p>
                )}
              </TokenAmountInput>
            </div>
            <div className="w-full lg:w-64">
              {!canVote ? (
                <RegularButton
                  className={
                    "py-6 w-full lg:w-64 text-h5 uppercase font-semibold whitespace-nowrap tracking-wider leading-6 text-EEEEEE"
                  }
                  onClick={handleApprove}
                  disabled={
                    isError ||
                    approving ||
                    !value ||
                    error ||
                    loadingBalance ||
                    loadingAllowance
                  }
                >
                  {approving ? "Approving..." : <>Approve {tokenSymbol}</>}
                </RegularButton>
              ) : (
                <RegularButton
                  className={
                    "flex-auto w-full lg:w-64 py-6 text-h5 uppercase font-semibold whitespace-nowrap tracking-wider leading-6 text-EEEEEE"
                  }
                  onClick={() => handleReport(() => setValue(""))}
                  disabled={
                    isError ||
                    voting ||
                    error ||
                    loadingBalance ||
                    loadingAllowance
                  }
                >
                  {voting ? "Reporting..." : "Report"}
                </RegularButton>
              )}
              <DataLoadingIndicator message={loadingMessage} />
            </div>
          </div>
        </>
      )}
      {isFirstDispute && (
        <>
          <Alert info>
            Since you are the first person to dispute this incident reporting,
            you will need to stake atleast{" "}
            {convertFromUnits(minStake).toString()} NPM tokens. If the majority
            agree with you, you will earn {commission}% of the platform fee
            instead of the incident reporter.
          </Alert>
          <Link href={disputeUrl} passHref>
            <RegularButton
              className={
                "flex-auto w-full lg:w-64 mb-11 sm:mb-0 py-6 text-h5 uppercase font-semibold whitespace-nowrap tracking-wider leading-6 text-EEEEEE mt-4"
              }
            >
              Add Dispute
            </RegularButton>
          </Link>
        </>
      )}
    </>
  );
};
