import { RegularButton } from "@/components/UI/atoms/button/regular";
import { Container } from "@/components/UI/atoms/container";
import { DropdownButton } from "@/components/UI/molecules/dropdown-button";
import { Label } from "@/components/UI/atoms/label";
import { useState } from "react";
import { ReportingDropdown } from "@/components/UI/molecules/reporting/reporting-dropdown";

const options = [
  {
    name: "Coinbase",
    imgSrc: "/reporting/coinbase.png",
  },
  {
    name: "Clearpool",
    imgSrc: "/reporting/clearpool.png",
  },
];

export const AddReporting = () => {
  const [selected, setSelected] = useState(options[0]);

  const handleAddReport = () => {
    console.log(selected);
  };

  return (
    <div className="w-full flex flex-col items-center">
      <img src="/reporting/empty-eclipse.png" alt="empty circle" />
      <p className="font-sora font-bold text-h2 text-CDD6E3 mt-5">
        No Active Reporting
      </p>
      <div className="w-full lg:px-60">
        <Label className={"mt-36 justify-start mb-4"}>select a cover</Label>
        <div className="flex">
          <ReportingDropdown
            options={options}
            selected={selected}
            setSelected={setSelected}
            prefix={
              <img
                className="w-8 h-8 mr-2"
                src={selected.imgSrc}
                alt={selected.name}
              />
            }
          />
          <RegularButton
            className={"whitespace-nowrap py-3 px-1 md:px-10 lg:px-14 ml-5"}
            onClick={handleAddReport}
          >
            ADD REPORT
          </RegularButton>
        </div>
      </div>
    </div>
  );
};
