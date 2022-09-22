import React, { useRef, useEffect, useState } from "react";
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

import { useReportIncident } from "@/src/hooks/useReportIncident";
import { useTokenDecimals } from "@/src/hooks/useTokenDecimals";

import { useCoverStatsContext } from "@/common/Cover/CoverStatsContext";
import DateLib from "@/lib/date/DateLib";

/**
 *
 * @param {Object} props
 * @param {string} props.coverKey
 * @param {string} props.productKey
 * @returns
 */
export function NewIncidentReportForm({ coverKey, productKey }) {
  const max = DateLib.toDateTimeLocal();

  const form = useRef();

  const [value, setValue] = useState("");
  const [buttonDisabled, setButtonDisabled] = useState(false);

  const {
    balance,
    loadingBalance,
    loadingAllowance,
    tokenAddress,
    tokenSymbol,
    handleApprove,
    handleReport,
    approving,
    reporting,
    canReport,
    isError,
  } = useReportIncident({ coverKey, productKey, value });

  const { minReportingStake } = useCoverStatsContext();
  const tokenDecimals = useTokenDecimals(tokenAddress);

  useEffect(() => {
    setButtonDisabled(
      isError ||
        approving ||
        reporting ||
        !value ||
        loadingAllowance ||
        loadingBalance
    );
  }, [approving, reporting, value, loadingAllowance, loadingBalance, isError]);

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
   * @param {Object} e
   */
  function onSubmit(e) {
    e && e.preventDefault();

    if (canReport) {
      // process form and submit report

      const { current } = form;

      const incidentUrl =
        (current?.incident_url || []).length > 1
          ? current?.incident_url
          : [current?.incident_url];

      const urlReports = Object.keys(incidentUrl).map(
        (i) => incidentUrl[i]?.value
      );

      const payload = {
        title: current?.title?.value,
        observed: new Date(current?.incident_date?.value),
        proofOfIncident: urlReports,
        description: current?.description?.value,
        stake: convertToUnits(value).toString(),
      };

      handleReport(payload);
    } else {
      // ask for approval
      handleApprove();
    }
  }

  return (
    <Container className="pt-12 pb-24 bg-white max-w-none md:bg-transparent">
      <form
        data-testid="incident-report-form"
        ref={form}
        onSubmit={onSubmit}
        className="px-2 mx-auto bg-white max-w-7xl md:py-16 md:px-24"
      >
        <h2 className="mb-4 font-bold text-h2">
          <Trans>Report an incident</Trans>
        </h2>
        <div className="flex flex-col md:flex-row">
          <InputField
            className="lg:flex-grow md:mr-4"
            label={t`Title`}
            inputProps={{
              id: "incident_title",
              name: "title",
              placeholder: t`Enter Incident Title`,
              required: canReport,
              disabled: approving || reporting,
            }}
            desc={t`Enter the incident title.`}
          />

          <InputField
            className="lg:flex-shrink"
            label={t`Observed Date & Time`}
            inputProps={{
              max: max,
              id: "incident_date",
              name: "incident_date",
              type: "datetime-local",
              required: canReport,
              disabled: approving || reporting,
            }}
            desc={t`Select the incident observance date.`}
          />
        </div>

        <ProofOfIncident
          disabled={approving || reporting}
          required={canReport}
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
              required: canReport,
              disabled: approving || reporting,
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
            disabled={approving || reporting}
            required={true}
          >
            <p className="text-9B9B9B">
              <Trans>Minimum Stake:</Trans>{" "}
              {convertFromUnits(minReportingStake, tokenDecimals).toString()}{" "}
              NPM
            </p>
            <span className="flex items-center text-FA5C2F">
              {/* Show error for Insufficent state */}
              {value && isGreater(minReportingStake, convertToUnits(value)) && (
                <Trans>Insufficient Stake</Trans>
              )}

              {/* Show error for Insufficent balance */}
              {value &&
                isGreater(convertToUnits(value), balance) &&
                isGreater(convertToUnits(value), minReportingStake) && (
                  <Trans>Insufficient Balance</Trans>
                )}
            </span>
          </TokenAmountInput>
        </div>

        <div className="mt-10">
          <div className="max-w-xs pr-8" data-testid="loaders">
            {loadingAllowance && (
              <DataLoadingIndicator message={t`Fetching allowance...`} />
            )}

            {loadingBalance && (
              <DataLoadingIndicator message={t`Fetching balance...`} />
            )}
          </div>

          <RegularButton
            disabled={buttonDisabled}
            className="px-24 py-6 font-semibold uppercase text-h6"
            type="submit"
          >
            {canReport && (reporting ? t`Reporting...` : t`Report`)}
            {!canReport &&
              (approving ? t`Approving...` : `${t`Approve`} ${tokenSymbol}`)}
          </RegularButton>
        </div>
      </form>
    </Container>
  );
}
