import { Select } from "@/components/UI/molecules/select";
import SearchIcon from "@/icons/SearchIcon";
import { classNames } from "@/utils/classnames";
import { useState } from "react";

const options = [
  { name: "A-Z" },
  { name: "Utilization Ratio" },
  { name: "Liquidity" },
  { name: "APR" },
];

export const SearchAndSortBar = ({
  containerClass = "min-w-sm",
  searchClass = "w-64",
  sortClass = "",
  searchValue,
  onSearchChange,
}) => {
  const [selected, setSelected] = useState(options[0]);

  return (
    <div className={classNames("flex justify-between ", containerClass)}>
      <div className={classNames("flex items-center ", searchClass)}>
        <input
          className={
            "w-full -mr-11 pl-4 pr-12 py-3 border border-B0C4DB bg-white rounded-lg placeholder-9B9B9B focus:outline-none focus-visible:ring-2 focus-visible:ring-4e7dd9"
          }
          placeholder="Search"
          value={searchValue}
          onChange={onSearchChange}
        />

        <div className="text-9B9B9B flex justify-center items-center">
          <SearchIcon width={24} height={24} />
        </div>
      </div>

      <div className="p-3"></div>

      <Select
        prefix="Sort by: "
        options={options}
        selected={selected}
        setSelected={setSelected}
        className={sortClass}
      ></Select>
    </div>
  );
};
