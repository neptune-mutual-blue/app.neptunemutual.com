import { getCoverImgSrc } from "@/src/helpers/cover";
import { useCoverOrProductData } from "@/src/hooks/useCoverOrProductData";
import { classNames } from "@/utils/classnames";
import { utils } from "@neptunemutual/sdk";

export const DropdownOption = ({ option, selected, active }) => {
  const coverInfo = useCoverOrProductData({
    coverKey: option?.coverKey,
    productKey: option?.productKey || utils.keyUtil.toBytes32(""),
  });

  const isValidProduct = isValidProduct(option?.productKey);

  return (
    <span
      className={classNames(
        `truncate px-4 py-2 flex items-center`,
        selected ? "font-medium" : "font-normal",
        active ? "bg-EEEEEE bg-opacity-50 rounded-lg" : ""
      )}
    >
      <div className="w-8 h-8 p-1 mr-2 rounded-full bg-DEEAF6">
        <img
          src={getCoverImgSrc({
            key: isValidProduct ? option.productKey : option.coverKey,
          })}
          alt={
            coverInfo?.infoObj?.projectName || coverInfo?.infoObj?.productName
          }
        />
      </div>
      {coverInfo?.infoObj?.projectName || coverInfo?.infoObj?.productName}
    </span>
  );
};
