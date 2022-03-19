import { SocialIconLinks } from "@/components/common/CoverProfileInfo/SocialIconLinks";
import { getProviderOrSigner } from "@/lib/connect-wallet/utils/web3";
import { useNetwork } from "@/src/context/Network";
import { getCoverStatus } from "@/src/helpers/store/getCoverStatus";
import { useWeb3React } from "@web3-react/core";
import { useEffect, useState } from "react";
import { ProjectImage } from "./ProjectImage";
import { ProjectName } from "./ProjectName";
import { ProjectStatusIndicator } from "./ProjectStatusIndicator";
import { ProjectWebsiteLink } from "./ProjectWebsiteLink";

export const CoverProfileInfo = ({ imgSrc, projectName, links, coverKey }) => {
  const [status, setStatus] = useState({
    activeIncidentDate: "0",
    status: "",
  });
  const { account, library } = useWeb3React();
  const { networkId } = useNetwork();

  useEffect(() => {
    if (!networkId || !coverKey || !account) return;

    console.log(networkId, coverKey, account);

    const signerOrProvider = getProviderOrSigner(library, account, networkId);

    getCoverStatus(networkId, coverKey, signerOrProvider.provider)
      .then(setStatus)
      .catch(console.error);
  }, [account, coverKey, library, networkId]);

  return (
    <div className="flex">
      <div>
        <ProjectImage imgSrc={imgSrc} name={projectName} />
      </div>
      <div className="p-3"></div>
      <div>
        <div className="flex items-center">
          <ProjectName name={projectName} />
          <ProjectStatusIndicator
            coverKey={coverKey}
            status={status.status}
            incidentDate={status.activeIncidentDate}
          />
        </div>
        <ProjectWebsiteLink website={links?.website} />
        <SocialIconLinks links={links} />
      </div>
    </div>
  );
};
