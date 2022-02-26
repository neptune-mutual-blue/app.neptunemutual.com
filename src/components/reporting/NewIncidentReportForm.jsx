import { RegularButton } from "@/components/UI/atoms/button/regular";
import { Container } from "@/components/UI/atoms/container";
import { RegularInput } from "@/components/UI/atoms/input/regular-input";
import { Label } from "@/components/UI/atoms/label";
import { TokenAmountInput } from "@/components/UI/organisms/token-amount-input";
import DeleteIcon from "@/icons/delete-icon";
import { useFirstReportingStake } from "@/src/hooks/useFirstReportingStake";
import { useReportIncident } from "@/src/hooks/useReportIncident";
import { convertFromUnits, convertToUnits } from "@/utils/bn";
import { classNames } from "@/utils/classnames";
import { Fragment, useState } from "react";

export const NewIncidentReportForm = ({ coverKey }) => {
  const [value, setValue] = useState();
  const { minStake } = useFirstReportingStake({ coverKey });
  const {
    balance,
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

  return (
    <>
      {/* Content */}
      <div className="pt-12 pb-24 border-t border-t-B0C4DB">
        <Container>
          <div className="max-w-3xl">
            <div className="w-full flex justify-between flex-wrap md:flex-nowrap">
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
                    onChange: (e) => setIncidentTitle(e.target.value),
                  }}
                />
                <p className="text-sm text-9B9B9B mt-2 pl-2">
                  Type a name of this cover. You cannot change this later.
                </p>
              </div>
              <div className="">
                <Label htmlFor={"incident_date"} className={"mb-2 mt-6"}>
                  Observed Date &amp; Time
                </Label>
                <RegularInput
                  className="uppercase text-9B9B9B pr-3"
                  inputProps={{
                    max: maxDate,
                    id: "incident_date",
                    // placeholder: "DD/MM/YY | HH:MM:SS",
                    value: incidentDate,
                    type: "datetime-local",
                    onChange: (e) => setIncidentDate(e.target.value),
                  }}
                />
                <p className="text-sm text-9B9B9B mt-2 pl-2">
                  Select date when it was hacked
                </p>
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
                        onChange: (e) => handleChange(e, i),
                      }}
                    />
                    {i !== 0 && (
                      <span
                        onClick={() => handleDeleteLink(i)}
                        className="ml-4 border border-CEEBED rounded-md p-2 cursor-pointer"
                      >
                        <DeleteIcon width={14} height={16} />
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-9B9B9B mt-2 mb-x pl-2">
                    Provide link with proof of incident.
                  </p>
                </div>
              </Fragment>
            ))}

            <button
              onClick={handleNewLink}
              className="bg-transparent text-black border-none hover:underline mt-4"
            >
              + Add new link
            </button>
            <Label htmlFor={"reporting-description"} className={"mt-10 mb-2"}>
              Description
            </Label>
            <div className="relative">
              <textarea
                id="reporting-description"
                className="focus:ring-4e7dd9 focus:border-4e7dd9 bg-white block w-full rounded-lg py-6 pl-6 border border-B0C4DB mb-10"
                placeholder="Explain briefly about the incident if you want to add anything."
                rows={5}
                value={description}
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
              </TokenAmountInput>
            </div>

            {!canReport ? (
              <RegularButton
                disabled={isError || approving || !value}
                className="uppercase text-h6 font-semibold py-6 px-24 mt-16"
                onClick={handleApprove}
              >
                {approving ? "Approving..." : <>Approve {tokenSymbol}</>}
              </RegularButton>
            ) : (
              <RegularButton
                disabled={isError || reporting}
                className="uppercase text-h6 font-semibold py-6 px-24 mt-16"
                onClick={handleSubmit}
              >
                {reporting ? "Reporting..." : "Report"}
              </RegularButton>
            )}
          </div>
        </Container>
      </div>
    </>
  );
};
