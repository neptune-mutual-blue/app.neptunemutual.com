import { DataLoadingIndicator } from "@/common/DataLoadingIndicator";
import { RegularButton } from "@/common/Button/RegularButton";
import { Container } from "@/common/Container/Container";
import { RegularInput } from "@/common/Input/RegularInput";
import { Label } from "@/common/Label/Label";
import { TokenAmountInput } from "@/common/TokenAmountInput/TokenAmountInput";
import DeleteIcon from "@/icons/delete-icon";
import { useFirstReportingStake } from "@/src/hooks/useFirstReportingStake";
import { useReportIncident } from "@/src/hooks/useReportIncident";
import { convertFromUnits, convertToUnits, isGreater } from "@/utils/bn";
import { classNames } from "@/utils/classnames";
import { Fragment, useState, useEffect } from "react";
import { t, Trans } from "@lingui/macro";
import { useTokenDecimals } from "@/src/hooks/useTokenDecimals";

export const NewIncidentReportForm = ({ coverKey, productKey }) => {
  const [value, setValue] = useState("");
  const { minStake, fetchingMinStake } = useFirstReportingStake({ coverKey });
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

  const [incidentTitle, setIncidentTitle] = useState("");
  const [incidentDate, setIncidentDate] = useState("");
  const [urls, setUrls] = useState([{ url: "" }]);
  const [description, setDescription] = useState("");
  const [textCounter, setTextCounter] = useState(0);
  const [validationErrors, setValidationErrors] = useState({});
  const tokenDecimals = useTokenDecimals(tokenAddress);

  useEffect(() => {
    let ignore = false;

    if (ignore) return;

    if (value && isGreater(minStake, convertToUnits(value))) {
      setValidationErrors((prev) => ({
        ...prev,
        balanceError: t`Insufficient Stake`,
      }));
    } else if (value && isGreater(convertToUnits(value), balance)) {
      setValidationErrors((prev) => ({
        ...prev,
        balanceError: t`Insufficient Balance`,
      }));
    } else {
      setValidationErrors((prev) => ({
        ...prev,
        balanceError: "",
      }));
    }

    return () => {
      ignore = true;
    };
  }, [value, minStake, balance]);

  const maxDate = new Date().toISOString().slice(0, 16);

  const handleChooseMax = () => {
    setValue(convertFromUnits(balance, tokenDecimals).toString());
  };

  const handleTextArea = (e) => {
    let text = e.target.value;
    if (text.length <= 300) {
      setDescription(text);
      setTextCounter(text.length);
    }
  };

  const handleNewLink = () => {
    setUrls([...urls, { url: "" }]);
  };

  const handleChange = (e, i) => {
    const { value } = e.target;
    const list = [...urls];
    list[i]["url"] = value;
    setUrls(list);
  };

  const handleSubmit = () => {
    const payload = {
      title: incidentTitle,
      observed: new Date(incidentDate),
      proofOfIncident: JSON.stringify(urls.map((x) => x.url)),
      description: description,
      stake: convertToUnits(value).toString(),
    };

    handleReport(payload);
  };

  const handleValueChange = (val) => {
    if (typeof val === "string") {
      setValue(val);
    }
  };

  const handleDeleteLink = (i) => {
    let newArr = [...urls];
    newArr.splice(i, 1);
    setUrls(newArr);
  };

  const handleDateChange = (e) => {
    setIncidentDate(e.target.value);
    if (new Date(e.target.value).toISOString().slice(0, 16) <= maxDate) {
      setValidationErrors((prev) => ({ ...prev, dateError: "" }));
    } else {
      setValidationErrors((prev) => ({
        ...prev,
        dateError: t`Please choose date from the past`,
      }));
    }
  };

  let loadingMessage = "";
  if (loadingAllowance) {
    loadingMessage = t`Fetching allowance...`;
  } else if (loadingBalance) {
    loadingMessage = t`Fetching balance...`;
  } else if (fetchingMinStake) {
    loadingMessage = t`Fetching min stake...`;
  }

  return (
    <>
      {/* Content */}
      <div
        className="pt-12 pb-24 border-t border-t-B0C4DB"
        data-testid="incident-report-form"
      >
        <Container>
          <div className="max-w-3xl">
            <div className="mb-4 font-bold text-h2">{t`Report an incident`}</div>
            <div className="flex flex-wrap justify-between w-full md:flex-nowrap">
              <div className="flex-grow mr-4">
                <Label htmlFor={"incident_title"} className={"mb-2 mt-6"}>
                  <Trans>Incident Title</Trans>
                </Label>
                <RegularInput
                  className="leading-none"
                  inputProps={{
                    id: "incident_title",
                    placeholder: t`Enter Incident Title`,
                    value: incidentTitle,
                    disabled: approving || reporting,
                    onChange: (e) => setIncidentTitle(e.target.value),
                  }}
                />
                <p className="pl-2 mt-2 text-sm text-9B9B9B">
                  <Trans>Enter the incident title.</Trans>
                </p>
              </div>
              <div className="">
                <Label htmlFor={"incident_date"} className={"mb-2 mt-6"}>
                  <Trans>Observed Date &amp; Time</Trans>
                </Label>
                <RegularInput
                  className="pr-3 uppercase text-9B9B9B"
                  inputProps={{
                    max: maxDate,
                    id: "incident_date",
                    // placeholder: "DD/MM/YY | HH:MM:SS",
                    value: incidentDate,
                    type: "datetime-local",
                    disabled: approving || reporting,
                    onChange: (e) => handleDateChange(e),
                  }}
                />
                <p className="pl-2 mt-2 text-sm text-9B9B9B">
                  <Trans>Select the incident observance date.</Trans>
                </p>
                {validationErrors.dateError && (
                  <p className="flex items-center pl-2 text-sm text-FA5C2F">
                    {validationErrors.dateError}
                  </p>
                )}
              </div>
            </div>
            <Label htmlFor={"incident_url"} className={"mt-10 mb-2"}>
              <Trans>Proof of incident</Trans>
            </Label>

            {urls.map((x, i) => (
              <Fragment key={i}>
                <div>
                  <div className="flex items-center mt-2">
                    <RegularInput
                      className={i === 0 && "mr-12"}
                      inputProps={{
                        id: `incident_url_${i}`,
                        placeholder: t`https://`,
                        value: x["url"],
                        disabled: approving || reporting,
                        onChange: (e) => handleChange(e, i),
                      }}
                    />
                    {i !== 0 && (
                      <span
                        role="button"
                        aria-label="Remove"
                        onClick={() =>
                          approving || reporting ? {} : handleDeleteLink(i)
                        }
                        className={classNames(
                          "p-2 ml-4 border rounded-md cursor-pointer border-CEEBED",
                          (approving || reporting) && "cursor-not-allowed"
                        )}
                        title={`Delete`}
                      >
                        <DeleteIcon width={14} height={16} />
                      </span>
                    )}
                  </div>
                  <p className="pl-2 mt-2 text-sm text-9B9B9B mb-x">
                    <Trans>
                      Provide URL with a proximate proof of the incident.
                    </Trans>
                  </p>
                </div>
              </Fragment>
            ))}

            <button
              onClick={() => (approving || reporting ? {} : handleNewLink())}
              className={classNames(
                "mt-4 text-black bg-transparent border-none hover:underline",
                (approving || reporting) && "cursor-not-allowed"
              )}
            >
              + <Trans>Add new link</Trans>
            </button>
            <Label htmlFor={"reporting-description"} className={"mt-10 mb-2"}>
              <Trans>Description</Trans>
            </Label>
            <div className="relative">
              <textarea
                id="reporting-description"
                className={classNames(
                  "block w-full py-6 pl-6 mb-10 bg-white border rounded-lg focus:ring-4e7dd9 focus:border-4e7dd9 border-B0C4DB",
                  (approving || reporting) && "cursor-not-allowed"
                )}
                placeholder={t`Explain briefly about the incident if you want to add anything.`}
                rows={5}
                value={description}
                disabled={approving || reporting}
                onChange={(e) => handleTextArea(e)}
              />
              <span
                className={classNames(
                  "absolute bottom-0 right-0 mr-2 mb-2",
                  textCounter >= 300 && "text-FA5C2F"
                )}
              >
                {textCounter}/300
              </span>
            </div>
            <div className="max-w-lg">
              <TokenAmountInput
                inputId={"stake-amount"}
                inputValue={value}
                labelText={t`Enter your stake`}
                tokenBalance={balance}
                tokenSymbol={tokenSymbol}
                tokenAddress={tokenAddress}
                handleChooseMax={handleChooseMax}
                disabled={approving || reporting}
                onChange={handleValueChange}
              >
                <p className="text-9B9B9B">
                  <Trans>Minimum Stake:</Trans>{" "}
                  {convertFromUnits(minStake, tokenDecimals).toString()} NPM
                </p>
                {validationErrors.balanceError && (
                  <p className="flex items-center text-FA5C2F">
                    {validationErrors.balanceError}
                  </p>
                )}
              </TokenAmountInput>
            </div>

            <div className="mt-10">
              <div className="max-w-xs pr-8">
                <DataLoadingIndicator message={loadingMessage} />
              </div>

              {!canReport ? (
                <RegularButton
                  disabled={
                    isError ||
                    validationErrors.balanceError ||
                    validationErrors.dateError ||
                    approving ||
                    !value ||
                    loadingAllowance ||
                    loadingBalance ||
                    fetchingMinStake
                  }
                  className="px-24 py-6 font-semibold uppercase text-h6"
                  onClick={handleApprove}
                >
                  {approving ? (
                    t`Approving...`
                  ) : (
                    <>
                      <Trans>Approve</Trans> {tokenSymbol}
                    </>
                  )}
                </RegularButton>
              ) : (
                <RegularButton
                  disabled={
                    isError ||
                    validationErrors.balanceError ||
                    validationErrors.dateError ||
                    reporting ||
                    loadingAllowance ||
                    loadingBalance ||
                    fetchingMinStake
                  }
                  className="px-24 py-6 font-semibold uppercase text-h6"
                  onClick={handleSubmit}
                >
                  {reporting ? t`Reporting...` : t`Report`}
                </RegularButton>
              )}
            </div>
          </div>
        </Container>
      </div>
    </>
  );
};
