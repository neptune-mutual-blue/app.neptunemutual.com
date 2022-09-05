import { Select } from "@/common/Select";
import SearchIcon from "@/icons/SearchIcon";
import { classNames } from "@/utils/classnames";
import { useState } from "react";
import { t } from "@lingui/macro";
import ChevronDownIcon from "@/icons/ChevronDownIcon";

const defaultOptions = [
  { name: t`A-Z` },
  { name: t`Utilization Ratio` },
  { name: t`Liquidity` },
];

export const SearchAndSortBar = ({
  containerClass = "min-w-sm",
  searchClass = "w-64",
  sortClass = "",
  searchValue,
  onSearchChange,
  searchOnFocus,
  searchOnBlur,
  sortType,
  setSortType,
  searchAndSortOptions = null,
}) => {
  const options = searchAndSortOptions ?? defaultOptions;
  const [selected, setSelected] = useState(options[0]);

  return (
    <div
      className={classNames("flex justify-between ", containerClass)}
      data-testid="search-and-sort-container"
    >
      <div
        role="search"
        className={classNames(
          "flex items-center mr-0 mb-4 md:mb-0 md:mr-2",
          searchClass
        )}
      >
        <input
          className={
            "w-full -mr-11 pl-4 pr-12 py-2 border border-B0C4DB bg-white rounded-lg placeholder-9B9B9B focus:outline-none focus-visible:ring-1 focus-visible:ring-4e7dd9"
          }
          placeholder={t`Search`}
          value={searchValue}
          onChange={onSearchChange}
          onFocus={searchOnFocus}
          onBlur={searchOnBlur}
          data-testid="search-input"
        />

        <div className="flex items-center justify-center text-9B9B9B">
          <SearchIcon width={24} height={24} data-testid="search-icon" />
        </div>
      </div>

      <Select
        prefix={t`Sort by:` + " "}
        options={options}
        selected={sortType ?? selected}
        setSelected={setSortType ?? setSelected}
        className={sortClass}
        icon={<ChevronDownIcon className="w-6 h-6" aria-hidden="true" />}
      ></Select>
    </div>
  );
};
