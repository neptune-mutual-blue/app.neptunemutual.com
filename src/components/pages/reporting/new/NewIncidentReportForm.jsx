import { useCoverInfo } from "@/components/pages/cover/useCoverInfo";
import { RegularButton } from "@/components/UI/atoms/button/regular";
import { Container } from "@/components/UI/atoms/container";
import { RegularInput } from "@/components/UI/atoms/input/regular-input";
import { Label } from "@/components/UI/atoms/label";
import { ReportingHero } from "@/components/UI/organisms/reporting/new/ReportingHero";
import { TokenAmountInput } from "@/components/UI/organisms/token-amount-input";
import DeleteIcon from "@/icons/delete-icon";
import { useAppConstants } from "@/src/context/AppConstants";
import { toBytes32 } from "@/src/helpers/cover";
import { classNames } from "@/utils/classnames";
import { useRouter } from "next/router";
import { Fragment, useState } from "react";

export const NewIncidentReportForm = () => {
  const router = useRouter();
  const { cover_id } = router.query;
  const coverKey = toBytes32(cover_id);

  const { coverInfo } = useCoverInfo(coverKey);
  const { NPMTokenAddress } = useAppConstants();

  const [incidentTitle, setIncidentTitle] = useState();
  const [incidentDate, setIncidentDate] = useState();
  const [urls, setUrls] = useState([{ url: "" }]);
  const [description, setDescription] = useState();
  const [staked, setStaked] = useState();
  const [textCounter, setTextCounter] = useState(0);
  const maxValueToStake = 1000;
  const minValueToStake = 250;

  const maxDate = new Date().toISOString().slice(0, 16);

  console.log(NPMTokenAddress);

  if (!coverInfo) {
    return <>loading...</>;
  }

  const handleChooseMax = () => {
    setStaked(maxValueToStake);
  };

  const handleTextArea = (e) => {
    let text = e.target.value;
    if (text.length <= 100) {
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

  const handleReportClick = () => {
    console.log({
      incidentTitle,
      incidentDate,
      urls,
      description,
      staked,
    });
  };

  const handleStakeChange = (val) => {
    if (typeof val === "string") {
      setStaked(val);
    }
  };

  const handleDeleteLink = (i) => {
    console.log(i);
    let newArr = [...urls];
    newArr.splice(i, 1);
    setUrls(newArr);
  };

  return (
    <main>
      {/* hero */}
      <ReportingHero coverInfo={coverInfo} />

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
                  textCounter >= 100 && "text-FA5C2F"
                )}
              >
                {textCounter}/100
              </span>
            </div>
            <div className="max-w-lg">
              <TokenAmountInput
                tokenSymbol={"NPM"}
                tokenAddress={NPMTokenAddress}
                labelText={"Enter your amount"}
                handleChooseMax={handleChooseMax}
                inputValue={staked}
                inputId={"stake-amount"}
                onChange={handleStakeChange}
              >
                <p className="text-9B9B9B mt-2">
                  Minimum Stake: {minValueToStake} NPM
                </p>
              </TokenAmountInput>
            </div>
            <RegularButton
              className="text-h6 font-bold py-6 px-24 mt-16"
              onClick={handleReportClick}
              disabled={!staked}
            >
              REPORT
            </RegularButton>
          </div>
        </Container>
      </div>
    </main>
  );
};
