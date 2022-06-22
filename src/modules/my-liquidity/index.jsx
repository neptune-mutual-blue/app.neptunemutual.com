import { Content } from "@/modules/my-liquidity/content";
import LiquidityProductModal from "@/modules/my-liquidity/content/liquidity-product-modal";
import Header from "@/modules/my-liquidity/header";
import { createContext, useContext, useState } from "react";

const MyLiquidityContext = createContext({
  showModal: false,
  setShowModal: (bool) => {},
});

export const useMyLiquidityContext = () => useContext(MyLiquidityContext);

export default function MyLiquidityPage() {
  const [showModal, setShowModal] = useState(false);

  return (
    <MyLiquidityContext.Provider
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
    </MyLiquidityContext.Provider>
  );
}
