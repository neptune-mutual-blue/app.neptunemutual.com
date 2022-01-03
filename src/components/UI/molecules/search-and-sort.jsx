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
    <div className="flex justify-between">
      <div className="flex items-center pr-5">
        <input
          className="max-w-180 -mr-11 pl-4 pr-12 py-3 border border-B0C4DB bg-white rounded-lg placeholder-9B9B9B focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-4E7DD9"
          placeholder="Search"
        />

        <div className="text-9B9B9B flex justify-center items-center">
          <SearchIcon width={24} height={24} />
        </div>
      </div>

      <div className="px-3"></div>

      <Select
        prefix="Sort by: "
        options={options}
        selected={selected}
        setSelected={setSelected}
      ></Select>
    </div>
  );
};
