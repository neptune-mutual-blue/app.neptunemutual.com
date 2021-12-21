import { Container } from "@/components/UI/atoms/container";
import { Tab } from "@/components/UI/atoms/tab";
import Link from "next/link";

export const TabNav = ({ activeTab, headers }) => {
  return (
    <div className="border-b border-b-B0C4DB">
      <Container className={"flex"}>
        {headers.map((header) => (
          <Tab key={header.name} active={activeTab == header.name}>
            <Link href={header.href}>
              <a className="inline-block text-body px-6 py-2">
                {header.displayAs}
              </a>
            </Link>
          </Tab>
        ))}
      </Container>
    </div>
  );
};
