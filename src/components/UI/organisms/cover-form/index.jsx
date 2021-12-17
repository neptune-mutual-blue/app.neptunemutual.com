import { Container } from "@/components/UI/atoms/container";
import { Input } from "@/components/UI/atoms/input";
import { Radio } from "@/components/UI/atoms/radio";
import { RegularButton } from "@/components/UI/atoms/button/regular";
import { useState } from "react";
import { CoverDetails } from "@/components/UI/organisms/cover-details/CoverDetails";

export const CoverForm = () => {
  const FEES = 6.5;
  const [value, setValue] = useState();
  const [coverMonth, setCoverMonth] = useState();

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

  return (
    <Container>
      <Input
        label={"Amount you wish to cover"}
        placeholder={"Enter Amount"}
        value={value}
        onChange={(e) => handleChange(e)}
      />
      <div className="flex px-3 items-center text-dimmed-fg mt-2 w-lgInput">
        {value !== undefined && parseInt(value) !== NaN && (
          <p>Balance: {`${value}`} DAI</p>
        )}
        <div className="flex w-14 items-center justify-between ml-auto">
          <img src="/icons/launch_24px.png"></img>
          <img src="/icons/add.png"></img>
        </div>
      </div>
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
      <RegularButton className={"w-lgInput h-18 mt-9"}>
        Approve Dai
      </RegularButton>
      {value && coverMonth && (
        <CoverDetails fees={FEES} daiValue={value} claimEnd={coverMonth} />
      )}
    </Container>
  );
};
