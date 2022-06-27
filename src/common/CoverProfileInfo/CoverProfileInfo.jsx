import { useCoverStatsContext } from "@/common/Cover/CoverStatsContext";
import { SocialIconLinks } from "@/common/CoverProfileInfo/SocialIconLinks";
import { isValidProduct } from "@/src/helpers/cover";
import { safeFormatBytes32String } from "@/utils/formatter/bytes32String";
import { ProjectImage } from "./ProjectImage";
import { ProjectName } from "./ProjectName";
import { ProjectStatusIndicator } from "./ProjectStatusIndicator";
import { ProjectWebsiteLink } from "./ProjectWebsiteLink";

export const CoverProfileInfo = ({
  imgSrc,
  projectName,
  links,
  coverKey,
  productKey = safeFormatBytes32String(""),
}) => {
  const { coverStatus, productStatus, activeIncidentDate } =
    useCoverStatsContext();

  const isDiversified = isValidProduct(productKey);

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
            productKey={productKey}
            status={!isDiversified ? coverStatus : productStatus}
            incidentDate={activeIncidentDate}
          />
        </div>
        <ProjectWebsiteLink website={links?.website} />
        <SocialIconLinks links={links} />
      </div>
    </div>
  );
};
