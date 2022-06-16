import { NeutralButton } from "@/common/Button/NeutralButton";
import { Container } from "@/common/Container/Container";
import { NewCoverCard } from "@/common/NewCoverCard/NewCoverCard";
import { mockBasketData } from "@/modules/basket/__mock__";
import { safeParseBytes32String } from "@/utils/formatter/bytes32String";
import Link from "next/link";

export const BasketCardGrids = () => {
  return (
    <Container className={"pt-14 pb-28"}>
      <div className="grid gap-8 md:grid-cols-2">
        {mockBasketData.map((item) => {
          const coverKey = safeParseBytes32String(item.key);

          return (
            <Link href={`basket/${coverKey}`} key={item.id}>
              <a>
                <NewCoverCard
                  name={item.name}
                  status={item.status}
                  utilization={item.utilization}
                  protection={item.protection}
                  liquidity={item.liquidity}
                  levarageRatio={item.levarageRatio}
                  products={item.products}
                  totalProducts={item.totalProducts}
                  pricingCeiling={item.pricingCeiling}
                  pricingFloor={item.pricingFloor}
                />
              </a>
            </Link>
          );
        })}
      </div>

      <NeutralButton
        className={"mt-14 rounded-lg border-0.5"}
        onClick={() => {}}
      >
        Show More
      </NeutralButton>
    </Container>
  );
};
