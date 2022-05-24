import { useCoverStatsContext } from "@/common/Cover/CoverStatsContext";
import { SocialIconLinks } from "@/common/CoverProfileInfo/SocialIconLinks";
import { ProjectImage } from "./ProjectImage";
import { ProjectName } from "./ProjectName";
import { ProjectStatusIndicator } from "./ProjectStatusIndicator";
import { ProjectWebsiteLink } from "./ProjectWebsiteLink";

export const CoverProfileInfo = ({ imgSrc, projectName, links, coverKey }) => {
  const { status, activeIncidentDate } = useCoverStatsContext();
  console.log({ status, activeIncidentDate });

  return (
    <div className="flex" data-testid="coverprofileinfo-container">
      <div>
        <ProjectImage imgSrc={imgSrc} name={projectName} />
      </div>
      <div className="p-3"></div>
      <div>
        <div className="flex items-center">
          <ProjectName name={projectName} />
          <ProjectStatusIndicator
            coverKey={coverKey}
            status={status}
            incidentDate={activeIncidentDate}
          />
        </div>
        <ProjectWebsiteLink website={links?.website} />
        <SocialIconLinks links={links} />
      </div>
    </div>
  );
};
