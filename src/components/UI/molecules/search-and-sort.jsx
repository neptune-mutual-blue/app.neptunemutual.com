import { Select } from "@/components/UI/molecules/select";
import SearchIcon from "@/icons/SearchIcon";
import { useState } from "react";

const options = [
  { name: "A-Z" },
  { name: "Utilization Ratio" },
  { name: "Liquidity" },
  { name: "APR" },
];

export const SearchAndSortBar = () => {
  const [selected, setSelected] = useState(options[0]);

  return (
    <div className="flex justify-between min-w-sm">
      <div className="flex items-center w-64">
        <input
          className="w-full -mr-11 pl-4 pr-12 py-3 border border-B0C4DB bg-white rounded-lg placeholder-9B9B9B focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-4e7dd9"
          placeholder="Search"
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
      ></Select>
    </div>
  );
};
