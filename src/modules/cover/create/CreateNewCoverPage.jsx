import FeeAndAmount from "@/src/modules/cover/create/FeeAndAmount";
import GovernanceParameters from "@/src/modules/cover/create/GovernanceParameters";
import PricingInput from "@/src/modules/cover/create/PricingInput";
import { ResolutionSourcesInput } from "@/src/modules/cover/create/ResolutionSourcesInput";
import SocialUrlInput from "@/src/modules/cover/create/SocialUrlInput";
import { Checkbox } from "@/src/common/components/checkbox";
import { Container } from "@/src/common/components/container";
import { RegularInput } from "@/src/common/components/input/regular-input";
import { Label } from "@/src/common/components/label";
import { TagsInput } from "@/src/common/components/tags-input";
import { classNames } from "@/utils/classnames";
import React, { useState } from "react";

const CreateNewCoverPage = () => {
  const [coverName, setCoverName] = useState();
  const [coverDescription, setCoverDescription] = useState();
  const [coverRules, setCoverRules] = useState();
  const [socialUrls, setSocialUrls] = useState([{ url: "" }]);
  const [resolutionUrls, setResolutionUrls] = useState([{ url: "" }]);

  const [pricing, setPricing] = useState({});
  const [governanceParameter, setGovernanceParameter] = useState({});
  const [npmStake, setNpmStake] = useState();
  const [reassuranceAmt, setReassuranceAmt] = useState();
  const [coverLiquidity, setCoverLiquidity] = useState();
  const [checked, setChecked] = useState(false);
  const [, setTags] = useState();
  const [, setNetworkTags] = useState();

  const selectedTags = (_tags) => {
    setTags(_tags);
  };
  const blockchainTags = (_tags) => {
    setNetworkTags(_tags);
  };

  const handleChange = (e, on, i) => {
    const listOfUrls = {};
    listOfUrls[i] = e.target.value;
    if (on === "social") {
      const { value } = e.target;
      const list = [...socialUrls];
      list[i]["url"] = value;
      setSocialUrls(list);
    }
    if (on === "resolution") {
      const { value } = e.target;
      const list = [...resolutionUrls];
      list[i]["url"] = value;
      setResolutionUrls(list);
    }
  };

  const handleNewLink = (on) => {
    if (on === "resolution") {
      setResolutionUrls([...resolutionUrls, { url: "" }]);
    }
    if (on === "social") {
      setSocialUrls([...socialUrls, { url: "" }]);
    }
  };

  const handleDeleteLink = (on, i) => {
    if (on === "resolution") {
      let newArr = [...resolutionUrls];
      newArr.splice(i, 1);
      setResolutionUrls(newArr);
    }
    if (on === "social") {
      let newArr = [...socialUrls];
      newArr.splice(i, 1);
      setSocialUrls(newArr);
    }
  };

  const handleSocialsInput = (e) => {
    setSocialUrls({ ...socialUrls, [e.target.id]: e.target.value });
  };

  const handleCreateCoverClick = () => {
    const resolutionArray = [];
    for (let item in resolutionUrls) {
      resolutionArray.push(resolutionUrls[item].url);
    }
    // let data = {
    //   key: "0x70726f746f3a636f6e7472616374733a636f7665723a6366633a303100000010",
    //   coverName: coverName,
    //   projectName: coverName,
    //   about: coverDescription,
    //   tags: tags,
    //   blockchain: {
    //     chainId: "",
    //     name: "",
    //   },
    //   smartContracts: networkTags,
    //   rules: coverRules,
    //   links: {
    //     website: socialUrls.website,
    //     documentation: socialUrls.documentation || "",
    //     telegram: socialUrls?.telegram || "",
    //     twitter: socialUrls?.twitter || "",
    //     github: socialUrls?.github || "",
    //     facebook: socialUrls?.facebook || "",
    //     blog: socialUrls?.blog || "",
    //     discord: socialUrls?.discord || "",
    //     linkedin: socialUrls?.linkedin || "",
    //     slack: socialUrls?.slack || "",
    //   },
    //   reportingPeriod: governanceParameter.reporting_period,
    //   resolutionSources: resolutionArray,
    //   reassuranceToken: {
    //     at: "0xe8BAb5ca5eA0Fc93b2a4E1aD22376726ED209ed5",
    //     name: "DAI Stablecoin",
    //     symbol: "DAI",
    //     initialAmount: reassuranceAmt,
    //   },
    //   stakeWithFees: npmStake,
    //   initialLiquidity: coverLiquidity,
    //   minReportingStake: 1000,
    //   coverFees: {
    //     min: pricing.floorRate,
    //     max: pricing.ceilingRate,
    //   },
    // };
  };

  return (
    <div>
      <h1 className="mt-20 font-bold text-center text-h2 font-sora">
        Create a New Cover
      </h1>
      <Container>
        <Label htmlFor={"cover_name"} className={"mb-2 mt-6"}>
          Cover Name
        </Label>
        <RegularInput
          className="leading-none"
          inputProps={{
            id: "cover_name",
            placeholder: "Synthetix Protocol",
            value: coverName,
            onChange: (e) => setCoverName(e.target.value),
          }}
        />
        <TagsInput className={"mt-8"} selectedTags={selectedTags} />
        <p className="pl-2 mt-2 text-sm text-9B9B9B mb-x">
          Specify tags. Enter comma to add a new item
        </p>
        <Label htmlFor={"new_cover-description"} className={"mt-10 mb-2"}>
          Description
        </Label>
        <div className="relative">
          <textarea
            id="new_cover-description"
            className="block w-full py-6 pl-6 mb-10 bg-white border rounded-lg focus:ring-4e7dd9 focus:border-4e7dd9 border-B0C4DB"
            placeholder="Enter description of your project"
            rows={5}
            value={coverDescription}
            onChange={(e) => setCoverDescription(e.target.value)}
          />
        </div>
        <TagsInput className={"mt-8"} selectedTags={blockchainTags} />
        <p className="pl-2 mt-2 text-sm text-9B9B9B mb-x">
          Enter the list of blockchain networks your app supports.
        </p>
        <Label htmlFor={"new_cover-description"} className={"mt-10 mb-2"}>
          Cover Rules &amp; Parameters
        </Label>
        <div className="relative">
          <textarea
            id="new_cover-description"
            className="block w-full py-6 pl-6 mb-10 bg-white border rounded-lg focus:ring-4e7dd9 focus:border-4e7dd9 border-B0C4DB"
            placeholder="Enter cover rules and parameters"
            rows={10}
            value={coverRules}
            onChange={(e) => setCoverRules(e.target.value)}
          />
        </div>
        <SocialUrlInput
          handleSocialsInput={handleSocialsInput}
          socialUrls={socialUrls}
        />
        <PricingInput pricing={pricing} setPricing={setPricing} />
        <GovernanceParameters
          governanceParameter={governanceParameter}
          setGovernanceParameter={setGovernanceParameter}
        />
        {/* reporting resolution and claim period */}
        <Label htmlFor={"cover_pricing"} className={"mt-10 mb-2"}>
          Reporting, Resolution and Claim Period
        </Label>
        <ResolutionSourcesInput
          resolutionUrls={resolutionUrls}
          handleChange={handleChange}
          handleNewLink={handleNewLink}
          handleDeleteLink={handleDeleteLink}
        />
        <FeeAndAmount
          npmStake={npmStake}
          setNpmStake={setNpmStake}
          reassuranceAmt={reassuranceAmt}
          setReassuranceAmt={setReassuranceAmt}
          coverLiquidity={coverLiquidity}
          setCoverLiquidity={setCoverLiquidity}
        />
        <div className="mb-8">
          <Checkbox
            id="checkid"
            name="checkinputname"
            checked={checked}
            onChange={() => setChecked((prev) => !prev)}
          >
            I have read, understood and agree to the terms of service
          </Checkbox>
          <br />
          <button
            type="submit"
            disabled={!checked}
            onClick={handleCreateCoverClick}
            className={classNames(
              !checked && "opacity-30 cursor-not-allowed",
              "bg-4e7dd9 text-EEEEEE py-3 px-8 mt-8 rounded-big"
            )}
          >
            Create Synthetix Protocol
          </button>
        </div>
      </Container>
    </div>
  );
};

export default CreateNewCoverPage;
