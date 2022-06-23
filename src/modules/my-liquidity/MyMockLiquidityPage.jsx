import { Content } from "@/modules/my-liquidity/content";
import Header from "@/modules/my-liquidity/header";
import { createContext, useContext, useState } from "react";

const MyBasketLiquidityContext = createContext({
  showModal: false,
  setShowModal: (_bool) => {},
});

export const useMyBasketLiquidityContext = () =>
  useContext(MyBasketLiquidityContext);

export function MyMockLiquidityPage() {
  const [showModal, setShowModal] = useState(false);

  return (
    <MyBasketLiquidityContext.Provider
      value={{
        showModal,
        setShowModal,
      }}
    >
      <main>
        <Header />
        <Content />
      </main>
    </MyBasketLiquidityContext.Provider>
  );
}
