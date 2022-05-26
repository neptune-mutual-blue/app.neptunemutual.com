import { Tab } from "@/common/Tab/Tab";
import { classNames } from "@/utils/classnames";

export const TabHeader = ({ activeTab, headers, onClick }) => {
  return (
    <div
      className="px-10 border-b border-b-B0C4DB sm:px-16"
      data-testid="tab-header-container"
    >
      <div className="flex mx-auto max-w-7xl">
        {headers.map((header) => (
          <Tab key={header.name} active={activeTab == header.name}>
            <button
              onClick={() => onClick(header.name)}
              className={classNames(
                "inline-block px-6 py-2",
                activeTab == header.name ? "font-semibold" : ""
              )}
              data-testid="tab-btn"
            >
              {header.displayAs}
            </button>
          </Tab>
        ))}
      </div>
    </div>
  );
};
