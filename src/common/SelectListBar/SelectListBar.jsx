import { useEffect } from "react";
import { Select } from "@/common/Select";
import { t } from "@lingui/macro";
import SmallGridIcon from "@/icons/SmallGridIcon";
import { SORT_TYPES } from "@/utils/sorting";
import { useRouter } from "next/router";
import { useRef } from "react";

export const SelectListBar = ({
  sortClassContainer,
  sortClass,
  sortType,
  setSortType = ({}) => {},
  prefix,
  options = null,
}) => {
  const { query } = useRouter();
  const selectRef = useRef(null);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const defaultOptions = [
    { name: t`All`, value: SORT_TYPES.ALL },
    { name: t`Diversified Pool`, value: SORT_TYPES.DIVERSIFIED_POOL },
    { name: t`Dedicated Pool`, value: SORT_TYPES.DEDICATED_POOL },
  ];

  const selectOptions = options ?? defaultOptions;

  useEffect(() => {
    if (query.view === "diversified") {
      const selectedOption = defaultOptions.find(
        (item) => item.value === SORT_TYPES.DIVERSIFIED_POOL
      );
      setSortType(selectedOption);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query.view, setSortType]);

  return (
    <div
      ref={selectRef}
      data-testid="select-list-bar"
      className={sortClassContainer}
    >
      <Select
        prefix={prefix}
        options={selectOptions}
        selected={sortType}
        setSelected={setSortType}
        className={sortClass}
        icon={<SmallGridIcon color="#9B9B9B" aria-hidden="true" />}
        direction="right"
      />
    </div>
  );
};
