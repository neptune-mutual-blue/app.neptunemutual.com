import { useMyBasketLiquidityContext } from "@/modules/my-liquidity/basket-liquidity-page";
import { listOfProducts } from "@/modules/my-liquidity/content/listOfProducts";
import { Trans } from "@lingui/macro";

/**
 * @typedef {import('@/modules/my-liquidity/content/listOfProducts').IBasketProduct} IBasketProduct
 */

export default function CoveredProducts() {
  const { setShowModal } = useMyBasketLiquidityContext();

  return (
    <div className="flex flex-col">
      <h1 className="pb-24 text-h3 font-bold">
        <Trans>Products Covered Under This Pool</Trans>
      </h1>
      <div className="grid grid-cols-6">
        {listOfProducts.map((product) => (
          <Product
            {...product}
            key={product.name}
            onClick={() => setShowModal(true)}
          />
        ))}
      </div>
    </div>
  );
}

/**
 * @param {IBasketProduct & { onClick: () => void}} param0
 */
function Product({ name, onClick }) {
  return (
    <div className="flex flex-col items-center justify-start py-8">
      <div className="flex items-center justify-center bg-white rounded-full max-h-[96px] max-w-[96px]">
        <img src="/images/covers/empty.svg" alt="base image" />
      </div>
      <h1 className="pt-2 text-4e7dd9 flex items-center">
        {name}
        <button onClick={onClick}>
          <svg
            className="ml-2"
            width="15"
            height="14"
            viewBox="0 0 15 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M11.6892 2.80909L11.2199 8.23053L6.2673 3.27836L11.6892 2.80909Z"
              fill="#4E7DD9"
            />
            <path
              d="M3.30887 11.1899L3.77817 5.76849L8.73075 10.7207L3.30887 11.1899Z"
              fill="#4E7DD9"
            />
            <path
              d="M5.24805 9.16636L10.3445 4.07031"
              stroke="#4E7DD9"
              strokeWidth="1.33333"
            />
          </svg>
        </button>
      </h1>
    </div>
  );
}
