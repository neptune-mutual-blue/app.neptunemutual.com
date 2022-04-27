import DateLib from "@/lib/date/DateLib";
import { convertFromUnits, convertUintToPercentage } from "@/utils/bn";
import { formatPercent } from "@/utils/formatter/percent";
import { Trans } from "@lingui/macro";
import { useNumberFormat } from "@/src/hooks/useNumberFormat";

export const PolicyFeesAndExpiry = ({ data, coverPeriod }) => {
  const { fee, rate } = data;
  const { formatCurrency } = useNumberFormat();

  const rateConverted = convertUintToPercentage(rate);
  const coverFee = convertFromUnits(fee).toString();

  const next = DateLib.addMonths(new Date(), coverPeriod - 1);
  const expires = DateLib.getEomInUTC(next);

  return (
    <>
      <hr className="py-1 mb-4 border-t mt-14 border-d4dfee" />
      <table className="w-full font-semibold text-black uppercase text-h6">
        <tbody>
          <tr className="flex justify-between mt-3">
            <th>
              <Trans>Fees</Trans>
            </th>
            <td className="text-4e7dd9">{formatPercent(rateConverted)}</td>
          </tr>
          <tr className="flex justify-between mt-3">
            <th>
              <Trans>Cover Fee</Trans>
            </th>
            <td
              className="text-4e7dd9"
              title={formatCurrency(coverFee, "DAI", true).long}
            >
              {formatCurrency(coverFee, "DAI", true).short}
            </td>
          </tr>
          <tr className="flex justify-between mt-3">
            <th>
              <Trans>Claim Expiry</Trans>
            </th>
            <td className="text-4e7dd9" title={expires.toString()}>
              {DateLib.toLongDateFormat(expires, "UTC")}
            </td>
          </tr>
        </tbody>
      </table>
      <hr className="mt-4 border-t border-d4dfee" />
    </>
  );
};
