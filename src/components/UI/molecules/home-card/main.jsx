import ReportIcon from "@/icons/ReportIcon";
import ActiveSheildIcon from "@/icons/ActiveSheildIcon";

export const HomeMainCard = ({ heroData }) => {
  return (
    <div
      className={
        "w-full max-w-96 py-5 lg:py-0 lg:h-36  bg-white rounded-2xl border-0.5 border-B0C4DB flex flex-col justify-center items-center px-12 shadow-homeCard"
      }
    >
      <div className="w-full flex items-center justify-between font-sora">
        <div className="mr-3">
          <span className="sr-only">Sheild</span>
          <ActiveSheildIcon className="w-4 md:w-6" />
        </div>
        <h4 className="text-h5 leading-5 md:leading-6 md:text-h4">Available</h4>
        <h4 className="text-h5 leading-5 md:leading-6 md:text-h4 text-4e7dd9 font-bold ml-auto">
          {heroData.availableCovers}
        </h4>
      </div>

      <div className="w-full flex items-center justify-between font-sora mt-3 md:mt-7">
        <div className="mr-3">
          <span className="sr-only">Report</span>
          <ReportIcon className="w-4 md:w-6" />
        </div>
        <h4 className="text-h5 leading-5 md:leading-6 md:text-h4">Reporting</h4>
        <h4 className="text-h5 leading-5 md:leading-6 md:text-h4 text-4e7dd9 font-bold ml-auto">
          {heroData.reportingCovers}
        </h4>
      </div>
    </div>
  );
};
