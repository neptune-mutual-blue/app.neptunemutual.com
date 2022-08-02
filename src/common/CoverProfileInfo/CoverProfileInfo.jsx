import { useCoverStatsContext } from "@/common/Cover/CoverStatsContext";
import { SocialIconLinks } from "@/common/CoverProfileInfo/SocialIconLinks";
import { ProjectImage } from "./ProjectImage";
import { ProjectName } from "./ProjectName";
import { ProjectStatusIndicator } from "./ProjectStatusIndicator";
import { ProjectWebsiteLink } from "./ProjectWebsiteLink";

export const CoverProfileInfo = ({
  imgSrc,
  projectName,
  links,
  coverKey,
  productKey,
}) => {
  const { productStatus, activeIncidentDate } = useCoverStatsContext();

  return (
    <div className="flex" data-testid="dedicated-coverprofileinfo-container">
      <div>
        <ProjectImage imgSrc={imgSrc} name={projectName} />
      </div>
      <div className="p-3"></div>
      <div>
        <div className="flex items-center">
          <ProjectName name={projectName} />
          <ProjectStatusIndicator
            coverKey={coverKey}
            productKey={productKey}
            status={productStatus}
            incidentDate={activeIncidentDate}
          />
        </div>
        <ProjectWebsiteLink website={links?.website} />
        <SocialIconLinks links={links} />
      </div>
    </div>
  );
};
