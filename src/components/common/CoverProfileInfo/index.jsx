import { SocialIconLinks } from "@/components/common/CoverProfileInfo/SocialIconLinks";
import { getProviderOrSigner } from "@/lib/connect-wallet/utils/web3";
import { useAppContext } from "@/src/context/AppWrapper";
import { getCoverStatus } from "@/src/helpers/store/getCoverStatus";
import { useWeb3React } from "@web3-react/core";
import { useEffect, useState } from "react";
import { ProjectImage } from "./ProjectImage";
import { ProjectName } from "./ProjectName";
import { ProjectStatusIndicator } from "./ProjectStatusIndicator";
import { ProjectWebsiteLink } from "./ProjectWebsiteLink";

export const CoverProfileInfo = ({ imgSrc, projectName, links, coverKey }) => {
  const [status, setStatus] = useState("");
  const { account, library } = useWeb3React();
  const { networkId } = useAppContext();

  useEffect(() => {
    if (!networkId || !coverKey || !account) return;

    console.log(networkId, coverKey, account);

    const signerOrProvider = getProviderOrSigner(library, account, networkId);

    getCoverStatus(networkId, coverKey, signerOrProvider.provider).then(
      setStatus
    );
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
          <ProjectStatusIndicator status={status} />
        </div>
        <ProjectWebsiteLink website={links?.website} />
        <SocialIconLinks links={links} />
      </div>
    </div>
  );
};
