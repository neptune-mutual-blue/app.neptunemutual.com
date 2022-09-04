import { useState } from "react";
import { Select } from "@/common/Select";
import { t } from "@lingui/macro";
import SmallGridIcon from "@/icons/SmallGridIcon";

const defaultOptions = [
  { name: t`All` },
  { name: t`Diversified Pool` },
  { name: t`Dedicated Pool` },
];

export const SelectListBar = ({
  sortClassContainer,
  sortClass,
  sortType,
  setSortType,
  prefix,
  options = null,
}) => {
  const selectOptions = options ?? defaultOptions;
  const [selected, setSelected] = useState(selectOptions[0]);

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
