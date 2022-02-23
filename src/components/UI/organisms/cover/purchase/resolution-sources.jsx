import { OutlinedCard } from "@/components/UI/molecules/outlined-card";
import { explainInterval } from "@/utils/formatter/interval";
import Link from "next/link";
import { useReportingPeriod } from "@/src/hooks/useReportingPeriod";

export const CoverPurchaseResolutionSources = ({ children, coverInfo }) => {
  const coverKey = coverInfo.key;
  const projectName = coverInfo.projectName;
  const { reportingPeriod } = useReportingPeriod({ coverKey });

  if (!coverInfo.resolutionSources) {
    return null;
  }

  const knowledgebase = coverInfo?.resolutionSources[1];
  const twitter = coverInfo?.resolutionSources[0];

  return (
    <div>
      <OutlinedCard className="bg-DEEAF6 p-10">
        <h3 className="text-h4 font-sora font-semibold">Resolution Sources</h3>
        <p className="text-sm mt-1 mb-6 opacity-50">
          {explainInterval(reportingPeriod)} reporting period
        </p>

        <Link href={knowledgebase}>
          <a
            target="_blank"
            className="block text-4e7dd9 hover:underline mt-3 capitalize"
          >
            {projectName} Knowledgebase
          </a>
        </Link>

        <Link href={twitter}>
          <a
            target="_blank"
            className="block text-4e7dd9 hover:underline mt-3 capitalize"
          >
            {projectName} Twitter
          </a>
        </Link>

        {children}
      </OutlinedCard>
    </div>
  );
};
