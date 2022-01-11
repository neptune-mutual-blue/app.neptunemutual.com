import { OutlinedCard } from "@/components/UI/molecules/outlined-card";
import { IncidentReporter } from "@/components/UI/molecules/reporting/IncidentReporter";
import { InsightsTable } from "@/components/UI/molecules/reporting/InsightsTable";
import { HlCalendar } from "@/lib/hl-calendar";
import UnstakeYourAmount from "@/components/UI/molecules/reporting/UnstakeYourAmount";
import { VotesSummaryHorizantalChart } from "@/components/UI/organisms/reporting/VotesSummaryHorizantalChart";
import { Divider } from "@/components/UI/atoms/divider";


export const ResolvedReportSummary = () => {
  const startDate = new Date();
  const endDate = new Date(startDate.getTime());
  endDate.setDate(startDate.getDate() + 6);

  return (
    <>
      <OutlinedCard className="md:flex bg-white">
        {/* Left half */}
        <div className="p-10 border-r border-B0C4DB flex-1">
          <h2 className="text-h3 font-sora font-bold mb-6">Report Summary</h2>

          <VotesSummaryHorizantalChart votes={{ yes: 3000, no: 1000 }} />
          <Divider />

          <UnstakeYourAmount />
        </div>

        {/* Right half */}
        <div className="p-10">
          <h3 className="text-h4 font-sora font-bold mb-4">Insights</h3>
          <InsightsTable
            insights={[
              { title: "Incident Occured", value: "75%", variant: "success" },
              { title: "User Votes:", value: "123456" },
              { title: "Stake:", value: "500 NPM" },
            ]}
          />

          <hr className="mt-4 mb-6 border-t border-d4dfee" />
          <InsightsTable
            insights={[
              { title: "False Reporting", value: "25%", variant: "error" },
              { title: "User Votes:", value: "12345" },
              { title: "Stake:", value: "300K NPM" },
            ]}
          />

          <hr className="mt-6 mb-6 border-t border-d4dfee" />
          <h3 className="text-h4 font-sora font-bold mb-4">
            Incident Reporters
          </h3>
          <IncidentReporter
            variant={"success"}
            account={"0xce3805...000633"}
            txHash={"0xasdasd"}
          />
          <IncidentReporter
            variant={"error"}
            account={"0xce3805...000633"}
            txHash={"0xasdasd"}
          />

          <hr className="mt-8 mb-6 border-t border-d4dfee" />
          <h3 className="text-h4 font-sora font-bold mb-4">Reporting Period</h3>
          <p className="text-sm opacity-50 mb-4">1 September - 7 September</p>
          <HlCalendar startDate={startDate} endDate={endDate} />
        </div>

        <></>
      </OutlinedCard>
    </>
  );
};
