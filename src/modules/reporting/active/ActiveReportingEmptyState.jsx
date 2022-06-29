import { RegularButton } from "@/common/Button/RegularButton";
import { Label } from "@/common/Label/Label";
import { useEffect, useState } from "react";
import { ReportingDropdown } from "@/src/modules/reporting/reporting-dropdown";
import { useRouter } from "next/router";
import { actions } from "@/src/config/cover/actions";
import { getCoverImgSrc } from "@/src/helpers/cover";
import { t, Trans } from "@lingui/macro";
import { safeParseBytes32String } from "@/utils/formatter/bytes32String";
import { useFlattenedCoverProducts } from "@/src/hooks/useFlattenedCoverProducts";
import { useCoverOrProductData } from "@/src/hooks/useCoverOrProductData";
import { utils } from "@neptunemutual/sdk";

export const ActiveReportingEmptyState = () => {
  const router = useRouter();

  const { data: covers, loading } = useFlattenedCoverProducts();

  const [selected, setSelected] = useState({});

  useEffect(() => {
    if (covers && covers.length > 0) {
      setSelected(covers[0]);
    }
  }, [covers]);

  const selectedCover = useCoverOrProductData({
    coverKey: selected?.coverKey,
    productKey: selected?.productKey || utils.keyUtil.toBytes32(""),
  });

  const handleAddReport = () => {
    const cover_id = safeParseBytes32String(selectedCover.coverKey);
    if (selectedCover.productKey) {
      const prod_id = safeParseBytes32String(selectedCover.productKey);
      router.push(actions.report.getHref(cover_id, prod_id, true));
    } else {
      router.push(actions.report.getHref(cover_id));
    }
  };

  if (loading) {
    return (
      <>
        <Trans>loading...</Trans>
      </>
    );
  }

  return (
    <div className="flex flex-col items-center w-full pt-20">
      <img
        src="/images/covers/empty-list-illustration.svg"
        alt={t`no data found`}
        className="w-48 h-48"
      />
      <p className="max-w-full mt-8 text-center text-h5 text-404040 w-96">
        <Trans>
          No known incident found for any cover product. If you believe a cover
          incident has occurred, earn rewards by reporting the incident.
        </Trans>
      </p>
      <div className="flex flex-col w-full max-w-lg mt-16 mb-4">
        <Label htmlFor={"reporting-dropdown"} className="sr-only">
          <Trans>select a cover</Trans>
        </Label>
        <ReportingDropdown
          options={covers}
          selected={selected}
          setSelected={setSelected}
          selectedName={
            selectedCover?.infoObj?.projectName ||
            selectedCover?.infoObj?.productName
          }
          prefix={
            <div className="w-8 h-8 p-1 mr-2 rounded-full bg-DEEAF6">
              <img
                src={getCoverImgSrc({
                  key: selectedCover?.productKey || selectedCover?.coverKey,
                })}
                alt={
                  selectedCover?.infoObj.coverName ||
                  selectedCover?.infoObj.productName
                }
              />
            </div>
          }
        />
        <RegularButton
          className={"text-sm font-medium uppercase mt-6 py-4 w-full"}
          onClick={handleAddReport}
        >
          <Trans>REPORT AN INCIDENT</Trans>
        </RegularButton>
      </div>
    </div>
  );
};
