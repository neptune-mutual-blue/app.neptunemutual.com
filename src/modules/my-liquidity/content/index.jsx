import { Container } from "@/common/Container/Container";
import AddLiquidity from "@/modules/my-liquidity/content/add-liquidity";
import { CoveredProducts } from "@/modules/my-liquidity/content/CoveredProducts";
import Rules from "@/modules/my-liquidity/content/rules";
import { useState } from "react";

export function Content() {
  const [acceptedRules, setAcceptedRules] = useState(false);

  return (
    <Container className="flex flex-col py-9">
      <CoveredProducts />

      {!acceptedRules && <Rules setAcceptedRules={setAcceptedRules} />}
      {acceptedRules && <AddLiquidity />}
    </Container>
  );
}
