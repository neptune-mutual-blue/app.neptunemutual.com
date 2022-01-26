import { RegularButton } from "@/components/UI/atoms/button/regular";
import { Label } from "@/components/UI/atoms/label";
import { useEffect, useState } from "react";
import { ReportingDropdown } from "@/components/UI/molecules/reporting/reporting-dropdown";
import { useRouter } from "next/router";
import { useAvailableCovers } from "@/components/pages/home/useAvailableCovers";
import { actions } from "@/src/config/cover/actions";
import { getParsedKey } from "@/src/helpers/cover";

export const ActiveReportingEmptyState = () => {
  const router = useRouter();

  const { availableCovers } = useAvailableCovers();
  const [selected, setSelected] = useState();

  useEffect(() => {
    if (availableCovers && availableCovers.length > 0) {
      setSelected(availableCovers[0]);
    }
  }, [availableCovers]);

  const handleAddReport = () => {
    const cover_id = getParsedKey(selected.key);
    router.push(actions.report.getHref(cover_id));
  };

  if (!availableCovers) {
    return <>loading...</>;
  }

  return (
    <div className="w-full flex flex-col items-center pt-20">
      <img
        src="/images/covers/empty-list-illustration.png"
        alt="no data found"
        className="w-48 h-48"
      />
      <p className="text-h5 text-404040 text-center mt-8 w-96 max-w-full">
        There is no any active reporting yet. All the covers under resolution
        period will be{" "}
        <span className="whitespace-nowrap">displayed here.</span>
      </p>
      <div className="flex flex-col w-full max-w-lg mt-16 mb-4">
        <Label htmlFor={"reporting-dropdown"} className="hidden">
          select a cover
        </Label>
        <ReportingDropdown
          options={availableCovers}
          selected={selected}
          setSelected={setSelected}
          prefix={
            <div className="w-8 h-8 p-1 mr-2 bg-DEEAF6 rounded-full">
              <img src={selected?.imgSrc} alt={selected?.coverName} />
            </div>
          }
        />
        <RegularButton
          className={"text-sm font-medium uppercase mt-6 py-4 w-full"}
          onClick={handleAddReport}
        >
          REPORT AN INCIDENT
        </RegularButton>
      </div>
    </div>
  );
};
