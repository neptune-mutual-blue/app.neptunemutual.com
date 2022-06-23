import { useCoverStatsContext } from "@/common/Cover/CoverStatsContext";
import { ProjectStatusIndicator } from "./ProjectStatusIndicator";

export const DiversifiedCoverProfileInfo = ({
  projectName,
  coverKey,
  productKey,
}) => {
  const { coverStatus, activeIncidentDate } = useCoverStatsContext();

  return (
    <div className="flex" data-testid="coverprofileinfo-container">
      <div>
        <div className="flex flex-col  items-center">
          <div className="w-full font-sora font-bold text-h1">
            Provide Liquidity
          </div>

          <div className="flex w-full">
            <div className="text-h5 leading-5 font-bold font-sora">
              {projectName}
            </div>
            <ProjectStatusIndicator
              coverKey={coverKey}
              productKey={productKey}
              status={coverStatus}
              incidentDate={activeIncidentDate}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
