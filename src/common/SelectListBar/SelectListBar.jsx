import { useEffect, useMemo, useState } from "react";
import { Select } from "@/common/Select";
import { t } from "@lingui/macro";
import SmallGridIcon from "@/icons/SmallGridIcon";
import { SORT_TYPES } from "@/utils/sorting";
import { useRouter } from "next/router";

export const SelectListBar = ({
  sortClassContainer,
  sortClass,
  sortType,
  setSortType,
  prefix,
  options = null,
}) => {
  const { query } = useRouter();

  const defaultOptions = useMemo(
    () => [
      { name: t`All`, value: SORT_TYPES.ALL },
      { name: t`Diversified Pool`, value: SORT_TYPES.DIVERSIFIED_POOL },
      { name: t`Dedicated Pool`, value: SORT_TYPES.DEDICATED_POOL },
    ],
    []
  );

  const selectOptions = options ?? defaultOptions;
  const [selected, setSelected] = useState(selectOptions[0]);

  useEffect(() => {
    if (query?.["view"] === "diversified") {
      const selectedOption = defaultOptions.find(
        (item) => item.value === SORT_TYPES.DIVERSIFIED_POOL
      );
      setSortType(selectedOption) ?? setSelected(selectedOption);
    }
  }, [defaultOptions, query, setSortType]);

  return (
    <div className={sortClassContainer}>
      <Select
        prefix={prefix}
        options={selectOptions}
        selected={sortType ?? selected}
        setSelected={setSortType ?? setSelected}
        className={sortClass}
        icon={<SmallGridIcon color="#9B9B9B" aria-hidden="true" />}
        direction="right"
      />
    </div>
  );
};
