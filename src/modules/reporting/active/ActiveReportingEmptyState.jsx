import { RegularButton } from "@/common/Button/RegularButton";
import { Label } from "@/common/Label/Label";
import { useEffect, useMemo, useState } from "react";
import { ReportingDropdown } from "@/src/modules/reporting/reporting-dropdown";
import { useRouter } from "next/router";
import { actions } from "@/src/config/cover/actions";
import { getCoverImgSrc } from "@/src/helpers/cover";
import { t, Trans } from "@lingui/macro";
import { safeParseBytes32String } from "@/utils/formatter/bytes32String";
import { useCoversData } from "@/src/hooks/useCoversData";
import { useFlattenedCoverProducts } from "@/src/hooks/useFlattenedCoverProducts";

export const ActiveReportingEmptyState = () => {
  const router = useRouter();

  // const { covers: availableCovers, loading } = useCovers();
  const { data: flattenedCovers } = useFlattenedCoverProducts();

  const coverInfo = useCoversData({ coverList: flattenedCovers });
  const covers = useMemo(() => {
    return coverInfo.reduce((acc, cover) => {
      if (!cover.supportsProducts) {
        acc.push({
          key: cover.coverKey,
          projectName: cover.infoObj.projectName,
          coverName: cover.infoObj.coverName,
        });
      } else {
        // cover.products.forEach((product) => {
        //   acc.push({
        //     key: product.productKey,
        //     productKey: product.productKey,
        //     projectName: product.infoObj.productName,
        //     coverName: product.infoObj.productName,
        //   });
        // });
      }
      return acc.sort((x, y) => {
        if (x.projectName < y.projectName) return -1;
        else if (x.projectName > y.projectName) return 1;
        return 0;
      });
    }, []);
  }, [coverInfo]);
  const [selected, setSelected] = useState({});

  useEffect(() => {
    if (covers && covers.length > 0) {
      setSelected(covers[0]);
    }
  }, [covers]);

  const handleAddReport = () => {
    const cover_id = safeParseBytes32String(selected.key);
    router.push(actions.report.getHref(cover_id));
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
          prefix={
            <div className="w-8 h-8 p-1 mr-2 rounded-full bg-DEEAF6">
              <img src={getCoverImgSrc(selected)} alt={selected?.coverName} />
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
