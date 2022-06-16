import { NeutralButton } from "@/common/Button/NeutralButton";
import { Container } from "@/common/Container/Container";
import { NewCoverCard } from "@/common/NewCoverCard/NewCoverCard";
import { mockBasketData } from "@/modules/basket/__mock__";

export const BasketCardGrids = () => {
  return (
    <Container className={"pt-14 pb-28"}>
      <div className="grid gap-8 md:grid-cols-2">
        {mockBasketData.map((item, index) => (
          <NewCoverCard
            key={index}
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
        ))}
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
