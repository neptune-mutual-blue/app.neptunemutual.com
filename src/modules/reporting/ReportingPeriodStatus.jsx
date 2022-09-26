import DateLib from "@/lib/date/DateLib";
import { Trans } from "@lingui/macro";
import { useRouter } from "next/router";
import * as Tooltip from "@radix-ui/react-tooltip";
import InfoIcon from "@/lib/toast/components/icons/InfoIcon";

export const ReportingPeriodStatus = ({ resolutionTimestamp }) => {
  const router = useRouter();
  const endDate = DateLib.fromUnix(resolutionTimestamp);

  const durationToResolution = DateLib.durationBetween(endDate, Date.now());

  return (
    <div className="flex items-center mb-2">
      <p className="font-bold text-sm">{durationToResolution.durationAgo}</p>
      <Tooltip.Root>
        <Tooltip.Trigger className="p-1 mr-4 text-9B9B9B">
          <InfoIcon className="w-4 h-4 text-999BAB" aria-hidden="true" />
        </Tooltip.Trigger>
        <Tooltip.Content side="top">
          <div className="max-w-md p-2 text-xs text-white bg-black rounded font-poppins">
            <Trans>
              {durationToResolution.duration >= 0
                ? "This report will be concluded on"
                : "This report concluded on"}
            </Trans>
            <br />
            {DateLib.toDateFormat(
              resolutionTimestamp,
              router.locale,
              {
                month: "numeric",
                day: "numeric",
                year: "numeric",
                hour: "numeric",
                minute: "numeric",
                second: "numeric",
              },
              "UTC"
            )}
          </div>
          <Tooltip.Arrow offset={16} className="fill-black" />
        </Tooltip.Content>
      </Tooltip.Root>
    </div>
  );
};
