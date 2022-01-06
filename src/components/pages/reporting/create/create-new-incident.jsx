import { useCoverInfo } from "@/components/pages/cover/useCoverInfo";
import { RegularButton } from "@/components/UI/atoms/button/regular";
import { Container } from "@/components/UI/atoms/container";
import { RegularInput } from "@/components/UI/atoms/input/regular-input";
import { Label } from "@/components/UI/atoms/label";
import { ReportingHero } from "@/components/UI/organisms/reporting/new/ReportingHero";
import { TokenAmountInput } from "@/components/UI/organisms/token-amount-input";
import { classNames } from "@/utils/classnames";
import { useRouter } from "next/router";
import { useState } from "react";

export const CreateNewIncidentPage = () => {
  const router = useRouter();
  const { coverInfo } = useCoverInfo();

  const [incidentTitle, setIncidentTitle] = useState();
  const [incidentDate, setIncidentDate] = useState();
  const [urls, setUrls] = useState({});
  const [description, setDescription] = useState();
  const [staked, setStaked] = useState();
  const [textCounter, setTextCounter] = useState(0);
  const [noOfUrl, setNoOfUrl] = useState(1);
  const maxValueToStake = 1000;
  const minValueToStake = 250;

  if (!coverInfo) {
    return <>loading...</>;
  }

  const imgSrc = "/covers/clearpool.png";
  const title = coverInfo?.coverName;

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
    setNoOfUrl(noOfUrl + 1);
  };

  const handleChange = (e) => {
    const listOfUrls = {};
    listOfUrls[e.target.id] = e.target.value;
    setUrls({ ...urls, ...listOfUrls });
  };

  const handleReportClick = () => {
    console.log("report clicked");
  };

  return (
    <main>
      {/* hero */}
      <ReportingHero coverInfo={coverInfo} title={title} imgSrc={imgSrc} />

      {/* Content */}
      <div className="pt-12 pb-24 border-t border-t-B0C4DB">
        <Container>
          <div className="max-w-3xl">
            <div className="w-full flex justify-between flex-wrap">
              <div className="flex-grow flex flex-col mr-4">
                <Label className={"mb-2 mt-6"}>Incident Title</Label>
                <RegularInput
                  className="flex-grow"
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
              <div className="flex flex-col">
                <Label className={"mb-2 mt-6"}>Observed Date &amp; Time</Label>
                <RegularInput
                  className="flex-grow uppercase text-9B9B9B leading-none"
                  inputProps={{
                    id: "incident_title",
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
            <Label className={"mt-10 mb-2"}>Proof of incident</Label>
            {Array.from(Array(noOfUrl)).map((c, i) => (
              <>
                <RegularInput
                  key={i}
                  inputProps={{
                    id: `incident_url_${i}`,
                    placeholder: "https://",
                    onChange: handleChange,
                  }}
                />
                <p className="text-sm text-9B9B9B mt-2 pl-2">
                  Provide link with proof of incident.
                </p>
              </>
            ))}

            <button
              onClick={handleNewLink}
              className="bg-transparent text-black border-none hover:underline mt-4"
            >
              + Add new link
            </button>
            <Label className={"mt-10 mb-2"}>Description</Label>
            <div className="relative">
              <textarea
                className="focus:ring-4E7DD9 focus:border-4E7DD9 bg-white block w-full rounded-lg py-6 pl-6 border border-B0C4DB mb-10"
                placeholder="Explain briefly about the incident if you want to add anything."
                rows={5}
                value={description}
                onChange={(e) => handleTextArea(e)}
              />
              <span
                className={classNames(
                  "absolute bottom-0 right-0 mr-2 mb-2",
                  textCounter === 100 && "text-FA5C2F"
                )}
              >
                {textCounter}/100
              </span>
            </div>
            <div className="max-w-lg">
              <TokenAmountInput
                tokenSymbol={"NPM"}
                labelText={"Enter your amount"}
                handleChooseMax={handleChooseMax}
                inputValue={staked}
                id={"stake-amount"}
                onInput={(e) => setStaked(e.target.value)}
              />

              <p className="text-9B9B9B px-3 mt-2">
                Minimum Stake: {minValueToStake} NPM
              </p>
            </div>
            <RegularButton
              className="text-h6 font-bold py-6 px-24 mt-16"
              onClick={handleReportClick}
            >
              REPORT
            </RegularButton>
          </div>
        </Container>
      </div>
    </main>
  );
};
