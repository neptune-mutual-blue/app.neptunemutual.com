import { SocialIconLinks } from "@/components/common/CoverProfileInfo/SocialIconLinks";
import { ProjectImage } from "./ProjectImage";
import { ProjectName } from "./ProjectName";
import { ProjectStatusIndicator } from "./ProjectStatusIndicator";
import { ProjectWebsiteLink } from "./ProjectWebsiteLink";

export const CoverProfileInfo = ({ imgSrc, projectName, links }) => {
  return (
    <div className="flex">
      <div>
        <ProjectImage imgSrc={imgSrc} name={projectName} />
      </div>
      <div className="p-3"></div>
      <div>
        <div className="flex items-center">
          <ProjectName name={projectName} />
          <ProjectStatusIndicator variant="success" />
        </div>
        <ProjectWebsiteLink website={links.website} />
        <SocialIconLinks links={links} />
      </div>
    </div>
  );
};
