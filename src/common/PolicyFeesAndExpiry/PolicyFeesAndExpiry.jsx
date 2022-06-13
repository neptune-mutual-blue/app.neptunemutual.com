import DateLib from "@/lib/date/DateLib";
import { convertFromUnits, convertUintToPercentage } from "@/utils/bn";
import { formatCurrency } from "@/utils/formatter/currency";
import { formatPercent } from "@/utils/formatter/percent";
import { Trans } from "@lingui/macro";
import { useRouter } from "next/router";

export const PolicyFeesAndExpiry = ({ data }) => {
  const { fee, rate } = data;
  const router = useRouter();

  const rateConverted = convertUintToPercentage(rate);
  const coverFee = convertFromUnits(fee).toString();

  const expires = DateLib.fromUnix(data.expiryDate);

  return (
    <>
      <hr className="py-1 mb-4 border-t mt-14 border-d4dfee" />
      <table className="w-full font-semibold text-black uppercase text-h6">
        <tbody>
          <tr className="flex justify-between mt-3">
            <th>
              <Trans>Fees</Trans>
            </th>
            <td className="text-4e7dd9">
              {formatPercent(rateConverted, router.locale)}
            </td>
          </tr>
          <tr className="flex justify-between mt-3">
            <th>
              <Trans>Cover Fee</Trans>
            </th>
            <td
              className="text-4e7dd9"
              title={formatCurrency(coverFee, router.locale, "DAI", true).long}
            >
              {formatCurrency(coverFee, router.locale, "DAI", true).short}
            </td>
          </tr>
          <tr className="flex justify-between mt-3">
            <th>
              <Trans>Claim Expiry</Trans>
            </th>
            <td className="text-4e7dd9" title={expires.toString()}>
              {DateLib.toLongDateFormat(expires, router.locale, "UTC")}
            </td>
          </tr>
        </tbody>
      </table>
      <hr className="mt-4 border-t border-d4dfee" />
    </>
  );
};
