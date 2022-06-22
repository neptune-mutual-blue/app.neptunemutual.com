import { OutlinedCard } from "@/common/OutlinedCard/OutlinedCard";
import { explainInterval } from "@/utils/formatter/interval";
import Link from "next/link";
import { Trans } from "@lingui/macro";
import { useCoverStatsContext } from "@/common/Cover/CoverStatsContext";

export const CoverResolutionSources = ({ children, coverInfo }) => {
  const projectName =
    coverInfo?.infoObj?.projectName || coverInfo?.infoObj?.productName;
  const { reportingPeriod } = useCoverStatsContext();

  const knowledgebase = coverInfo?.resolutionSources?.[1] || "";
  const twitter = coverInfo?.resolutionSources?.[0] || "";

  return (
    <div className="col-span-3 row-start-2 md:col-auto md:row-start-auto">
      <OutlinedCard className="flex flex-col flex-wrap justify-between px-8 py-10 bg-DEEAF6">
        <div className="flex flex-wrap justify-between md:block">
          <div>
            <h3 className="font-semibold text-h4 font-sora">
              <Trans>Resolution Sources</Trans>
            </h3>
            <p className="mt-1 mb-6 text-sm opacity-50">
              {explainInterval(reportingPeriod)} <Trans>reporting period</Trans>
            </p>
          </div>
          <div className="flex flex-col md:block sm:items-end">
            <Link href={knowledgebase}>
              <a
                target="_blank"
                className="block capitalize text-4e7dd9 hover:underline sm:mt-0 md:mt-3"
                rel="nofollow"
              >
                {projectName} Knowledgebase
              </a>
            </Link>
            <Link href={twitter}>
              <a
                target="_blank"
                className="block mt-3 capitalize text-4e7dd9 hover:underline sm:mt-0 md:mt-3"
                rel="nofollow"
              >
                {projectName} Twitter
              </a>
            </Link>
          </div>
        </div>

        {children}
      </OutlinedCard>
    </div>
  );
};
