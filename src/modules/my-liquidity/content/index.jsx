import { useState } from "react";
import { Container } from "@/common/Container/Container";
import { MockAddLiquidity } from "@/modules/my-liquidity/content/MockAddLiquidity";
import { Rules } from "@/modules/my-liquidity/content/rules";

export function Content() {
  const [acceptedRules, setAcceptedRules] = useState(false);

  return (
    <Container className="flex flex-col py-9">
      {!acceptedRules && <Rules setAcceptedRules={setAcceptedRules} />}
      {acceptedRules && <MockAddLiquidity />}
    </Container>
  );
}
