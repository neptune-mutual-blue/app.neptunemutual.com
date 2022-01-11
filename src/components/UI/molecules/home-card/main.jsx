import ReportIcon from "@/icons/report";
import ActiveSheildIcon from "@/icons/shield-active";

export const HomeMainCard = () => {
  return (
    <div
      className={
        "w-full max-w-96 h-36 bg-e2ebf6 rounded-xl flex flex-col justify-center items-center px-12 shadow-mainCard"
      }
      style={{
        backgroundImage: "url(/home/bg-pattern.png)",
      }}
    >
      <div className="w-full flex items-center justify-between font-sora">
        <div className="mr-2">
          <span className="sr-only">Sheild</span>
          <ActiveSheildIcon width={24} />
        </div>
        <h4 className="text-h4">Available</h4>
        <h4 className="text-h4 text-4e7dd9 font-bold ml-auto">30</h4>
      </div>

      <div className="w-full flex items-center justify-between font-sora mt-5">
        <div className="mr-2">
          <span className="sr-only">Report</span>
          <ReportIcon width={24} height={24} />
        </div>
        <h4 className="text-h4">Reporting</h4>
        <h4 className="text-h4 text-4e7dd9 font-bold ml-auto">2</h4>
      </div>
    </div>
  );
};
