import { RegularButton } from "@/components/UI/atoms/button/regular";
import { RegularInput } from "@/components/UI/atoms/input/regular-input";
import { Label } from "@/components/UI/atoms/label";
import { TokenAmountInput } from "@/components/UI/organisms/token-amount-input";
import DeleteIcon from "@/icons/delete-icon";
import { useFirstReportingStake } from "@/src/hooks/useFirstReportingStake";
import { useDisputeIncident } from "@/src/hooks/useDisputeIncident";
import { convertFromUnits, convertToUnits } from "@/utils/bn";
import { classNames } from "@/utils/classnames";
import { Fragment, useState } from "react";

export const NewDisputeReportForm = ({ incidentReport }) => {
  const [disputeTitle, setDisputeTitle] = useState("");
  const [urls, setUrls] = useState([{ url: "" }]);
  const [description, setDescription] = useState("");
  const [textCounter, setTextCounter] = useState(0);
  const [value, setValue] = useState();
  const { minStake } = useFirstReportingStake({ coverKey: incidentReport.key });
  const {
    balance,
    tokenAddress,
    tokenSymbol,
    handleApprove,
    handleDispute,
    approving,
    disputing,
    canDispute,
    isError,
  } = useDisputeIncident({
    value,
    coverKey: incidentReport.key,
    incidentDate: incidentReport.incidentDate,
  });

  const handleChange = (e, i) => {
    const { value } = e.target;
    const list = [...urls];
    list[i]["url"] = value;
    setUrls(list);
  };

  const handleNewLink = () => {
    setUrls([...urls, { url: "" }]);
  };

  const handleDeleteLink = (i) => {
    let newArr = [...urls];
    newArr.splice(i, 1);
    setUrls(newArr);
  };

  const handleTextArea = (e) => {
    let text = e.target.value;
    if (text.length <= 300) {
      setDescription(text);
      setTextCounter(text.length);
    }
  };

  const handleValueChange = (val) => {
    if (typeof val === "string") {
      setValue(val);
    }
  };

  const handleChooseMax = () => {
    setValue(convertFromUnits(balance).toString());
  };

  const handleSubmit = () => {
    const payload = {
      title: disputeTitle,
      proofOfIncident: JSON.stringify(urls.map((x) => x.url)),
      description: description,
      stake: convertToUnits(value).toString(),
    };
    handleDispute(payload);
  };

  return (
    <div className="pt-8 pb-24">
      <h2 className="text-h3 font-sora font-bold mb-8">Submit Your Dispute</h2>
      <div className="max-w-3xl flex flex-col gap-y-10">
        <div>
          <Label htmlFor={"incident_title"} className={"mb-2"}>
            Title
          </Label>
          <RegularInput
            className="leading-none"
            inputProps={{
              id: "incident_title",
              placeholder: "Enter a title of this dispute",
              value: disputeTitle,
              onChange: (e) => setDisputeTitle(e.target.value),
            }}
          />
          {/* <p className="text-sm text-9B9B9B mt-2 pl-2">
            Type a name of this cover. You cannot change this later.
          </p> */}
        </div>

        <div>
          <Label htmlFor={"incident_url"} className={"mb-2"}>
            Proof of dispute
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
                {/* <p className="text-sm text-9B9B9B mt-2 mb-x pl-2">
                  Provide link with proof of incident.
                </p> */}
              </div>
            </Fragment>
          ))}

          <button
            onClick={handleNewLink}
            className="bg-transparent text-black border-none hover:underline mt-4"
          >
            + Add new link
          </button>
        </div>

        <div>
          <Label htmlFor={"reporting-description"} className={"mb-2"}>
            Description
          </Label>
          <div className="relative">
            <textarea
              id="reporting-description"
              className="focus:ring-4e7dd9 focus:border-4e7dd9 bg-white block w-full rounded-lg py-6 pl-6 border border-B0C4DB mb-10"
              placeholder="Explain briefly about the incident if you want to add anything."
              rows={8}
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
            disabled={approving || disputing}
            onChange={handleValueChange}
          >
            <p className="text-9B9B9B">
              Minimum Stake: {convertFromUnits(minStake).toString()} NPM
            </p>
          </TokenAmountInput>
        </div>

        {!canDispute ? (
          <RegularButton
            disabled={isError || approving || !value}
            className="uppercase text-h6 font-semibold py-6 px-24 mt-16 w-max"
            onClick={handleApprove}
          >
            {approving ? "Approving..." : <>Approve {tokenSymbol}</>}
          </RegularButton>
        ) : (
          <RegularButton
            disabled={isError || disputing}
            className="uppercase text-h6 font-semibold py-6 px-24 mt-16 w-max"
            onClick={handleSubmit}
          >
            {disputing ? "Disputing..." : "Dispute"}
          </RegularButton>
        )}
      </div>
    </div>
  );
};
