import ReportIcon from "@/icons/ReportIcon";
import ActiveSheildIcon from "@/icons/ActiveSheildIcon";
import { Trans } from "@lingui/macro";

export const HomeMainCard = ({ heroData }) => {
  return (
    <div
      className={
        "w-full max-w-96 py-5 lg:py-0 lg:h-36  bg-white rounded-2xl border-0.5 border-B0C4DB flex flex-col justify-center items-center px-12 shadow-homeCard"
      }
    >
      <div className="flex items-center justify-between w-full font-sora">
        <div className="mr-3">
          <span className="sr-only">Sheild</span>
          <ActiveSheildIcon className="w-4 md:w-6" />
        </div>
        <h4 className="leading-5 text-h5 md:leading-6 md:text-h4">
          <Trans>Available</Trans>
        </h4>
        <h4 className="ml-auto font-bold leading-5 text-h5 md:leading-6 md:text-h4 text-4e7dd9">
          {heroData.availableCovers}
        </h4>
      </div>

      <div className="flex items-center justify-between w-full mt-3 font-sora md:mt-7">
        <div className="mr-3">
          <span className="sr-only">Report</span>
          <ReportIcon className="w-4 md:w-6" />
        </div>
        <h4 className="leading-5 text-h5 md:leading-6 md:text-h4">
          <Trans>Reporting</Trans>
        </h4>
        <h4 className="ml-auto font-bold leading-5 text-h5 md:leading-6 md:text-h4 text-4e7dd9">
          {heroData.reportingCovers}
        </h4>
      </div>
    </div>
  );
};
