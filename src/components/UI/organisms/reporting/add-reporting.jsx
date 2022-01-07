import { RegularButton } from "@/components/UI/atoms/button/regular";
import { Label } from "@/components/UI/atoms/label";
import { useEffect, useState } from "react";
import { ReportingDropdown } from "@/components/UI/molecules/reporting/reporting-dropdown";
import { useRouter } from "next/router";
import { useAvailableCovers } from "@/components/pages/home/useAvailableCovers";

export const AddReporting = () => {
  const router = useRouter();

  const { availableCovers } = useAvailableCovers();
  const [selected, setSelected] = useState();

  useEffect(() => {
    if (availableCovers && availableCovers.length > 0) {
      setSelected(availableCovers[0]);
    }
  }, [availableCovers]);

  const handleAddReport = () => {
    router.push(`/cover/${selected.key}/report/details`);
  };

  if (!availableCovers) {
    return <>loading...</>;
  }

  return (
    <div className="w-full flex flex-col items-center">
      <img src="/reporting/empty-eclipse.png" alt="empty circle" />
      <p className="font-sora font-bold text-h2 text-CDD6E3 mt-5">
        No Active Reporting
      </p>
      <div className="w-full lg:px-60">
        <Label htmlFor={"reporting-dropdown"} className={"mt-36 mb-4"}>
          select a cover
        </Label>
        <div className="flex">
          <ReportingDropdown
            options={availableCovers}
            selected={selected}
            setSelected={setSelected}
            prefix={
              <div className="w-8 h-8 p-1 mr-2 bg-DEEAF6 rounded-full">
                <img src={selected?.imgSrc} alt={selected?.name} />
              </div>
            }
          />
          <RegularButton
            className={
              "text-sm font-medium whitespace-nowrap px-4 md:px-10 lg:px-14 ml-5"
            }
            onClick={handleAddReport}
          >
            ADD REPORT
          </RegularButton>
        </div>
      </div>
    </div>
  );
};
