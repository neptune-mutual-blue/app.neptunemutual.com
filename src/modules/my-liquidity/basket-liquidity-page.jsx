import { Content } from "@/modules/my-liquidity/content";
import LiquidityProductModal from "@/modules/my-liquidity/content/liquidity-product-modal";
import Header from "@/modules/my-liquidity/header";
import { createContext, useContext, useState } from "react";

const MyBasketLiquidityContext = createContext({
  showModal: false,
  setShowModal: (_bool) => {},
});

export const useMyBasketLiquidityContext = () =>
  useContext(MyBasketLiquidityContext);

export default function MyBasketLiquidityPage() {
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
        <LiquidityProductModal />
      </main>
    </MyBasketLiquidityContext.Provider>
  );
}
