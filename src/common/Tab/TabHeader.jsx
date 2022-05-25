import { Tab } from "@/common/Tab/Tab";
import { classNames } from "@/utils/classnames";

export const TabHeader = ({ activeTab, headers, onClick }) => {
  return (
    <div className="border-b border-b-B0C4DB px-10 sm:px-16">
      <div className="max-w-7xl mx-auto flex">
        {headers.map((header) => (
          <Tab key={header.name} active={activeTab == header.name}>
            <button
              onClick={() => onClick(header.name)}
              className={classNames(
                "inline-block px-6 py-2",
                activeTab == header.name ? "font-semibold" : ""
              )}
            >
              {header.displayAs}
            </button>
          </Tab>
        ))}
      </div>
    </div>
  );
};
