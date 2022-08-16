import React, { useRef, useState, useEffect } from "react";
import { t, Trans } from "@lingui/macro";

import {
  InputField,
  InputDescription,
  ProofOfIncident,
} from "@/modules/reporting/form";
import { convertFromUnits, isGreater, convertToUnits } from "@/utils/bn";

import { Container } from "@/common/Container/Container";
import { RegularButton } from "@/common/Button/RegularButton";
import { TokenAmountInput } from "@/common/TokenAmountInput/TokenAmountInput";
import { DataLoadingIndicator } from "@/common/DataLoadingIndicator";

import { useFirstReportingStake } from "@/src/hooks/useFirstReportingStake";
import { useDisputeIncident } from "@/src/hooks/useDisputeIncident";
import { useTokenDecimals } from "@/src/hooks/useTokenDecimals";

export const NewDisputeReportForm = ({ incidentReport }) => {
  const form = useRef();

  const [value, setValue] = useState("");
  const [buttonDisabled, setButtonDisabled] = useState(false);

  const { minStake } = useFirstReportingStake({
    coverKey: incidentReport.coverKey,
  });
  const {
    balance,
    tokenAddress,
    tokenSymbol,
    handleApprove,
    handleDispute,
    approving,
    disputing,
    canDispute,
  } = useDisputeIncident({
    value,
    coverKey: incidentReport.coverKey,
    productKey: incidentReport.productKey,
    incidentDate: incidentReport.incidentDate,
    minStake,
  });

  const tokenDecimals = useTokenDecimals(tokenAddress);

  useEffect(() => {
    setButtonDisabled(approving || disputing || !value);
  }, [approving, disputing, value]);

  /**
   *
   * @param {string | Object} val
   */
  function handleStakeChange(val) {
    if (typeof val === "string") setValue(val);
  }

  /**
   * @param {Object} e
   */
  function handleChooseMax(e) {
    e && e.preventDefault();
    setValue(convertFromUnits(balance, tokenDecimals).toString());
  }

  /**
   *
   * @param {Object} e
   */
  function onSubmit(e) {
    e && e.preventDefault();
    if (canDispute) {
      // process form and submit report

      const { current } = form;

      const insidentUrl = current.incident_url;
      const urlReports = Object.keys(insidentUrl).map(
        (i) => insidentUrl[i].value
      );

      const payload = {
        title: current.title.value,
        proofOfIncident: urlReports,
        description: current.description.value,
        stake: convertToUnits(value).toString(),
      };
      handleDispute(payload);
    } else {
      // ask for approval
      handleApprove();
    }
  }

  return (
    <Container className="pt-12 pb-24 border-t border-t-B0C4DB max-w-none bg-white md:bg-transparent">
      <form
        data-testid="incident-report-form"
        ref={form}
        onSubmit={onSubmit}
        className="max-w-7xl mx-auto px-2 bg-white md:py-16 md:px-24"
      >
        <h2 className="mb-4 font-bold text-h2">
          <Trans>Submit Your Dispute</Trans>
        </h2>

        <InputField
          label={t`Title`}
          inputProps={{
            id: "incident_title",
            name: "title",
            placeholder: t`Enter Dispute Title`,
            required: canDispute,
            disabled: approving || disputing,
          }}
          desc={t`Enter the incident title.`}
        />

        <ProofOfIncident
          disabled={approving || disputing}
          required={canDispute}
        />

        <div className="relative">
          <InputDescription
            className="mt-10"
            label={t`Description`}
            inputProps={{
              id: "description",
              name: "description",
              className:
                "block w-full py-6 pl-6 mb-10 bg-white border rounded-lg focus:ring-4e7dd9 focus:border-4e7dd9 border-B0C4DB",
              placeholder: t`Explain briefly about the incident if you want to add anything.`,
              rows: 5,
              maxLength: 300,
              required: canDispute,
              disabled: approving || disputing,
            }}
          />
        </div>

        <div className="md:max-w-lg">
          <TokenAmountInput
            inputId={"stake-amount"}
            inputValue={value}
            labelText={t`Enter your stake`}
            tokenBalance={balance}
            tokenSymbol={tokenSymbol}
            tokenAddress={tokenAddress}
            name="stake"
            handleChooseMax={handleChooseMax}
            onChange={handleStakeChange}
            disabled={approving || disputing}
          >
            <p className="text-9B9B9B">
              <Trans>Minimum Stake:</Trans>{" "}
              {convertFromUnits(minStake, tokenDecimals).toString()} NPM
            </p>
            <span className="flex items-center text-FA5C2F">
              {/* Show error for Insufficent state */}
              {value && isGreater(minStake, convertToUnits(value)) && (
                <Trans>Insufficient Stake</Trans>
              )}

              {/* Show error for Insufficent balance */}
              {value &&
                isGreater(convertToUnits(value), balance) &&
                isGreater(convertToUnits(value), minStake) && (
                  <Trans>Insufficient Balanced</Trans>
                )}
            </span>
          </TokenAmountInput>
        </div>

        <div className="mt-10">
          <div className="max-w-xs pr-8">
            {convertFromUnits(minStake, tokenDecimals).isLessThanOrEqualTo(
              0
            ) && <DataLoadingIndicator message={t`Fetching min stake...`} />}
          </div>

          <RegularButton
            disabled={buttonDisabled}
            className="px-24 py-6 font-semibold uppercase text-h6"
            type="submit"
          >
            {canDispute && (disputing ? t`Disputing...` : t`Dispute`)}
            {!canDispute &&
              (approving ? t`Approving...` : `${t`Approve`} ${tokenSymbol}`)}
          </RegularButton>
        </div>
      </form>
    </Container>
  );
};
