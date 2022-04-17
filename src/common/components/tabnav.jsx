import { Container } from "@/src/common/components/container";
import { Tab } from "@/src/common/components/tab";
import Link from "next/link";

export const TabNav = ({ activeTab, headers }) => {
  return (
    <div className="border-b border-b-B0C4DB">
      <Container className={"flex"}>
        {headers.map((header) => (
          <Tab key={header.name} active={activeTab == header.name}>
            <Link href={header.href}>
              <a className="inline-block px-6 py-2">{header.displayAs}</a>
            </Link>
          </Tab>
        ))}
      </Container>
    </div>
  );
};
