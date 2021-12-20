import { Container } from "@/components/UI/atoms/container";
import { Input } from "@/components/UI/atoms/input";
import { Radio } from "@/components/UI/atoms/radio";
import { RegularButton } from "@/components/UI/atoms/button/regular";
import { useEffect, useState } from "react";
import { CoverDetails } from "@/components/UI/organisms/cover-details/CoverDetails";
import { Label } from "@/components/UI/atoms/label";
//import { FEES, MAX_VALUE_TO_PURCHASE } from "@/src/_mocks/cover/coverform";
import { useConstants } from "@/components/pages/cover/useCoverInfo";

export const CoverForm = () => {
  const [value, setValue] = useState();
  const [coverMonth, setCoverMonth] = useState();

  const { fees, maxValue } = useConstants();

  console.log(fees, maxValue);

  const handleChange = (e) => {
    setValue(e.target.value);
  };

  const handleRadioChange = (e) => {
    setCoverMonth(e.target.value);
  };

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const getMonthsToCover = () => {
    const date = new Date();
    let month = date.getMonth();
    console.log(month, month + 1, month + 2);
    return month;
  };

  const handleMaxButtonClick = () => {
    setValue(maxValue);
  };

  if (!fees && !maxValue) {
    return <>loading...</>;
  }

  return (
    <Container>
      <Label className={"px-3 pb-4"} labelText={"Amount you wish to cover"} />
      <div className="relative w-lgInput">
        <Input
          placeholder={"Enter Amount"}
          value={value}
          onChange={handleChange}
        />
        <div
          style={{ right: "-10px", height: "70px" }}
          className="absolute top-0"
        >
          <span className="text-dimmed-fg px-5">DAI</span>
          <RegularButton
            style={{ height: "inherit" }}
            onClick={() => handleMaxButtonClick()}
            className={
              "w-20 bg-ash-secondary rounded-r-lg border-0 text-black z-10"
            }
          >
            Max
          </RegularButton>
        </div>
      </div>
      <div className="flex px-3 items-center text-dimmed-fg mt-2 w-lgInput">
        {value !== undefined && parseInt(value) !== NaN && (
          <p>Balance: {`${value}`} DAI</p>
        )}
        <div className="flex w-14 items-center justify-between ml-auto">
          <img src="/icons/launch_24px.png"></img>
          <img src="/icons/add.png"></img>
        </div>
      </div>
      {value !== undefined && parseInt(value) !== NaN && (
        <div className="px-3 flex w-fit items-center text-bluish">
          <p>You will receive: {`${value} cxDAI`}</p>

          <img className="pl-1" src="/icons/info.png"></img>
        </div>
      )}
      <div className="mt-12 px-3">
        <p
          className="block uppercase tracking-wide text-black text-h5 text-xs font-bold pb-4"
          htmlFor="grid-first-name"
        >
          Select your coverage period
        </p>
        <div className="flex w-lgInput">
          <Radio text={"january"} onChange={handleRadioChange} />
          <Radio text={"february"} onChange={handleRadioChange} />
          <Radio text={"march"} onChange={handleRadioChange} />
        </div>
      </div>
      {value && coverMonth && (
        <CoverDetails fees={fees} daiValue={value} claimEnd={coverMonth} />
      )}
      <RegularButton className={"w-lgInput h-18 mt-16 py-3 px-4"}>
        Approve Dai
      </RegularButton>
    </Container>
  );
};
