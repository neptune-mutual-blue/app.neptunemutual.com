import { DataLoadingIndicator } from "@/src/common/components/DataLoadingIndicator";
import { RegularButton } from "@/src/common/components/button/regular";
import { Container } from "@/src/common/components/container";
import { RegularInput } from "@/src/common/components/input/regular-input";
import { Label } from "@/src/common/components/label";
import { TokenAmountInput } from "@/src/common/components/token-amount-input";
import DeleteIcon from "@/icons/delete-icon";
import { useFirstReportingStake } from "@/src/hooks/useFirstReportingStake";
import { useReportIncident } from "@/src/hooks/useReportIncident";
import { convertFromUnits, convertToUnits, isGreater } from "@/utils/bn";
import { classNames } from "@/utils/classnames";
import { Fragment, useState, useEffect } from "react";

export const NewIncidentReportForm = ({ coverKey }) => {
  const [value, setValue] = useState();
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
  } = useReportIncident({ coverKey, value });

  const [incidentTitle, setIncidentTitle] = useState("");
  const [incidentDate, setIncidentDate] = useState("");
  const [urls, setUrls] = useState([{ url: "" }]);
  const [description, setDescription] = useState("");
  const [textCounter, setTextCounter] = useState(0);
  const [validationErrors, setValidationErrors] = useState({});

  const maxDate = new Date().toISOString().slice(0, 16);

  const handleChooseMax = () => {
    setValue(convertFromUnits(balance).toString());
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
        dateError: "Please choose date from the past",
      }));
    }
  };

  let loadingMessage = "";
  if (loadingAllowance) {
    loadingMessage = "Fetching allowance...";
  } else if (loadingBalance) {
    loadingMessage = "Fetching balance...";
  } else if (fetchingMinStake) {
    loadingMessage = "Fetching min stake...";
  }

  useEffect(() => {
    if (value && isGreater(minStake, convertToUnits(value))) {
      setValidationErrors((prev) => ({
        ...prev,
        balanceError: "Insufficient Stake",
      }));
    } else if (value && isGreater(convertToUnits(value), balance)) {
      setValidationErrors((prev) => ({
        ...prev,
        balanceError: "Insufficient Balance",
      }));
    } else {
      setValidationErrors((prev) => ({
        ...prev,
        balanceError: "",
      }));
    }
  }, [value, minStake, balance]);

  return (
    <>
      {/* Content */}
      <div className="pt-12 pb-24 border-t border-t-B0C4DB">
        <Container>
          <div className="max-w-3xl">
            <div className="flex flex-wrap justify-between w-full md:flex-nowrap">
              <div className="flex-grow mr-4">
                <Label htmlFor={"incident_title"} className={"mb-2 mt-6"}>
                  Incident Title
                </Label>
                <RegularInput
                  className="leading-none"
                  inputProps={{
                    id: "incident_title",
                    placeholder: "Enter Incident Title",
                    value: incidentTitle,
                    disabled: approving || reporting,
                    onChange: (e) => setIncidentTitle(e.target.value),
                  }}
                />
                <p className="pl-2 mt-2 text-sm text-9B9B9B">
                  Enter the incident title.
                </p>
              </div>
              <div className="">
                <Label htmlFor={"incident_date"} className={"mb-2 mt-6"}>
                  Observed Date &amp; Time
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
                  Select the incident observance date.
                </p>
                {validationErrors.dateError && (
                  <p className="flex items-center pl-2 text-sm text-FA5C2F">
                    {validationErrors.dateError}
                  </p>
                )}
              </div>
            </div>
            <Label htmlFor={"incident_url"} className={"mt-10 mb-2"}>
              Proof of incident
            </Label>

            {urls.map((x, i) => (
              <Fragment key={i}>
                <div>
                  <div className="flex items-center mt-2">
                    <RegularInput
                      className={i === 0 && "mr-12"}
                      inputProps={{
                        id: `incident_url_${i}`,
                        placeholder: "https://",
                        value: x["url"],
                        disabled: approving || reporting,
                        onChange: (e) => handleChange(e, i),
                      }}
                    />
                    {i !== 0 && (
                      <span
                        onClick={() =>
                          approving || reporting ? {} : handleDeleteLink(i)
                        }
                        className={classNames(
                          "p-2 ml-4 border rounded-md cursor-pointer border-CEEBED",
                          (approving || reporting) && "cursor-not-allowed"
                        )}
                      >
                        <DeleteIcon width={14} height={16} />
                      </span>
                    )}
                  </div>
                  <p className="pl-2 mt-2 text-sm text-9B9B9B mb-x">
                    Provide URL with a proximate proof of the incident.
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
              + Add new link
            </button>
            <Label htmlFor={"reporting-description"} className={"mt-10 mb-2"}>
              Description
            </Label>
            <div className="relative">
              <textarea
                id="reporting-description"
                className={classNames(
                  "block w-full py-6 pl-6 mb-10 bg-white border rounded-lg focus:ring-4e7dd9 focus:border-4e7dd9 border-B0C4DB",
                  (approving || reporting) && "cursor-not-allowed"
                )}
                placeholder="Explain briefly about the incident if you want to add anything."
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
                labelText={"Enter your amount"}
                tokenBalance={balance}
                tokenSymbol={tokenSymbol}
                tokenAddress={tokenAddress}
                handleChooseMax={handleChooseMax}
                disabled={approving || reporting}
                onChange={handleValueChange}
              >
                <p className="text-9B9B9B">
                  Minimum Stake: {convertFromUnits(minStake).toString()} NPM
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
                  {approving ? "Approving..." : <>Approve {tokenSymbol}</>}
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
                  {reporting ? "Reporting..." : "Report"}
                </RegularButton>
              )}
            </div>
          </div>
        </Container>
      </div>
    </>
  );
};
