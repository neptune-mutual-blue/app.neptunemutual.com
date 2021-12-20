import { Tab } from "@/components/UI/atoms/tab";
import Link from "next/link";

export const TabHeader = ({ activeTab, onClick, headers }) => {
  return (
    <div className="flex">
      {headers.map((header) => (
        <Tab
          key={header.id}
          className={"text-body px-6 py-2 mx-3"}
          text={header.displayAs}
          active={activeTab == header.id ? true : false}
          id={header.id}
          onClick={onClick}
        >
          <Link href={`/pools/${header.name}`}>{header.displayAs}</Link>
        </Tab>
      ))}
    </div>
  );
};
