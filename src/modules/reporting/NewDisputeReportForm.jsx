import { RegularButton } from "@/common/Button/RegularButton";
import { RegularInput } from "@/common/Input/RegularInput";
import { Label } from "@/common/Label/Label";
import { TokenAmountInput } from "@/common/TokenAmountInput/TokenAmountInput";
import DeleteIcon from "@/icons/delete-icon";
import { useFirstReportingStake } from "@/src/hooks/useFirstReportingStake";
import { useDisputeIncident } from "@/src/hooks/useDisputeIncident";
import { convertFromUnits, convertToUnits } from "@/utils/bn";
import { classNames } from "@/utils/classnames";
import { Fragment, useState, useEffect } from "react";
import { DataLoadingIndicator } from "@/common/DataLoadingIndicator";
import { t, Trans } from "@lingui/macro";
import { useTokenDecimals } from "@/src/hooks/useTokenDecimals";

export const NewDisputeReportForm = ({ incidentReport }) => {
  const [disputeTitle, setDisputeTitle] = useState("");
  const [urls, setUrls] = useState([{ url: "" }]);
  const [description, setDescription] = useState("");
  const [textCounter, setTextCounter] = useState(0);
  const [value, setValue] = useState();
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
    error,
  } = useDisputeIncident({
    value,
    coverKey: incidentReport.coverKey,
    productKey: incidentReport.productKey,
    incidentDate: incidentReport.incidentDate,
    minStake,
  });
  const tokenDecimals = useTokenDecimals(tokenAddress);
  const [loading, setLoading] = useState("");

  useEffect(() => {
    if (minStake) {
      const _minStake = convertFromUnits(minStake, tokenDecimals);

      // When minStake is being fetched
      if (_minStake.isLessThanOrEqualTo(0))
        return setLoading(t`Fetching min-stake amount...`);
      else setLoading("");
    }
  }, [minStake, tokenDecimals]);

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
    setValue(convertFromUnits(balance, tokenDecimals).toString());
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
      <h2 className="mb-12 font-bold text-h3 font-sora">Submit Your Dispute</h2>
      <div className="flex flex-col max-w-3xl gap-y-10">
        <div>
          <Label htmlFor={"incident_title"} className={"mb-2"}>
            <Trans>Title</Trans>
          </Label>
          <RegularInput
            className="leading-none disabled:cursor-not-allowed"
            inputProps={{
              id: "incident_title",
              placeholder: t`Enter a title of this dispute`,
              value: disputeTitle,
              onChange: (e) => setDisputeTitle(e.target.value),
              disabled: approving || disputing,
            }}
          />
        </div>

        <div>
          <Label htmlFor={"incident_url"} className={"mb-2"}>
            <Trans>Proof of dispute</Trans>
          </Label>

          {urls.map((x, i) => (
            <Fragment key={i}>
              <div>
                <div className="flex items-center mt-2">
                  <RegularInput
                    className={classNames(
                      i === 0 && "mr-12",
                      "disabled:cursor-not-allowed"
                    )}
                    inputProps={{
                      id: `incident_url_${i}`,
                      placeholder: "https://",
                      value: x["url"],
                      onChange: (e) => handleChange(e, i),
                      disabled: approving || disputing,
                    }}
                  />
                  {i !== 0 && (
                    <span
                      role="button"
                      aria-label="Remove"
                      onClick={() => handleDeleteLink(i)}
                      className="p-2 ml-4 border rounded-md cursor-pointer border-CEEBED"
                    >
                      <DeleteIcon width={14} height={16} />
                    </span>
                  )}
                </div>
              </div>
            </Fragment>
          ))}

          <button
            onClick={handleNewLink}
            className="mt-4 text-black bg-transparent border-none hover:underline"
          >
            + <Trans>Add new link</Trans>
          </button>
        </div>

        <div>
          <Label htmlFor={"reporting-description"} className={"mb-2"}>
            <Trans>Description</Trans>
          </Label>
          <div className="relative">
            <textarea
              id="reporting-description"
              className="block w-full py-6 pl-6 bg-white border rounded-lg focus:ring-4e7dd9 focus:border-4e7dd9 border-B0C4DB disabled:cursor-not-allowed"
              placeholder={t`Explain briefly about the incident if you want to add anything.`}
              rows={8}
              value={description}
              onChange={(e) => handleTextArea(e)}
              disabled={approving || disputing}
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
            labelText={t`Enter your amount`}
            tokenBalance={balance}
            tokenSymbol={tokenSymbol}
            tokenAddress={tokenAddress}
            handleChooseMax={handleChooseMax}
            disabled={approving || disputing}
            onChange={handleValueChange}
            error={error}
          >
            <p className="text-9B9B9B">
              <Trans>Minimum Stake:</Trans>{" "}
              {convertFromUnits(minStake, tokenDecimals).toString()} NPM
            </p>
            <p
              className={classNames(
                error ? "opacity-100" : "opacity-0",
                "flex items-center text-FA5C2F"
              )}
            >
              {error ?? t`Error!!!`}
            </p>
          </TokenAmountInput>
        </div>

        <div className="w-max">
          {loading && (
            <div className={classNames("mb-1")}>
              <DataLoadingIndicator message={loading} />
            </div>
          )}
          {!canDispute ? (
            <RegularButton
              disabled={error || approving || !value}
              className="px-24 py-6 font-semibold uppercase text-h6 w-max"
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
              disabled={error || disputing}
              className="px-24 py-6 font-semibold uppercase text-h6 w-max"
              onClick={handleSubmit}
            >
              {disputing ? t`Disputing...` : t`Dispute`}
            </RegularButton>
          )}
        </div>
      </div>
    </div>
  );
};
