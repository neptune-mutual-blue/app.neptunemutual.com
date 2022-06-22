import { ModalRegular } from "@/common/Modal/ModalRegular";
import * as Dialog from "@radix-ui/react-dialog";

/**
 * @typedef {import('@/modules/my-liquidity/content/CoveredProducts').IProductBase} IProductBase
 *
 *
 * @param {{
 *   product: IProductBase
 *   setShowModal: (_bool: boolean) => void
 * }} param0
 * @returns
 */
export default function LiquidityProductModal({ product, setShowModal }) {
  return (
    <ModalRegular
      isOpen={true}
      onClose={() => {
        setShowModal(false);
      }}
    >
      <div className="border-[1.5px] border-[#B0C4DB] relative inline-block w-full max-w-lg p-12 overflow-y-auto text-left align-middle min-w-500 lg:min-w-[907px] max-h-90vh bg-f1f3f6 rounded-3xl">
        <Dialog.Title
          className="flex items-center w-full font-bold font-sora text-h2 border-b-B0C4DB border-b pb-3"
          data-testid="dialog-title"
        >
          <svg
            width="40"
            height="40"
            viewBox="0 0 40 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g clipPath="url(#clip0_7315_49925)">
              <path
                d="M20 36.25C28.9746 36.25 36.25 28.9746 36.25 20C36.25 11.0254 28.9746 3.75 20 3.75C11.0254 3.75 3.75 11.0254 3.75 20C3.75 28.9746 11.0254 36.25 20 36.25Z"
                fill="#364253"
              />
              <path
                d="M19.9184 9.72266L15.3298 12.411L19.9184 15.1004L24.5933 12.411L19.9184 9.72266ZM20.673 24.0775V29.4552L26.9059 25.8995V20.5208L20.673 24.0775ZM25.3479 14.102V19.4808L20.672 22.1702V16.7914L25.3479 14.102ZM14.0928 19.4808L18.7687 22.1702V16.7914L14.0928 14.102V19.4808ZM14.0928 26.7669L18.7687 29.4552V24.0775L14.0928 21.3891V26.7669Z"
                fill="white"
              />
            </g>
            <defs>
              <clipPath id="clip0_7315_49925">
                <rect
                  width="32.5"
                  height="32.5"
                  fill="white"
                  transform="translate(3.75 3.75)"
                />
              </clipPath>
            </defs>
          </svg>

          <span className="pl-3 flex-grow">
            {product.infoObj.productName} Cover Terms
          </span>
          <span className="pl-3 text-h4 text-9B9B9B">
            70% Capital Efficiency
          </span>
        </Dialog.Title>
        <div className="mt-6" data-testid="token-input">
          <p className="text-h5 font-bold py-6">Cover Rules</p>

          <p className="text-md">
            Carefully read the following terms and conditions. For a successful
            claim payout, all of the following points must be true.
          </p>

          <ul className="text-md list-disc pl-8 mt-5 marker:text-xs">
            {product.infoObj.rules.split("\n").map((x, i) => (
              <li key={i}>
                {x
                  .trim()
                  .replace(/^\d+\./g, "")
                  .trim()}
              </li>
            ))}
          </ul>

          <p className="text-h5 font-bold py-6">Exclusions</p>

          <p className="text-md">{product.infoObj.exclusions}</p>
        </div>

        <div className="flex justify-end pt-14">
          <button
            onClick={() => setShowModal(false)}
            className="border border-4e7dd9 text-4e7dd9 px-5 mr-6 rounded font-bold"
          >
            CLOSE
          </button>
          <DownloadButton onClick={() => setShowModal(false)} />
        </div>
      </div>
    </ModalRegular>
  );
}

function DownloadButton({ onClick }) {
  return (
    <button
      className="inline-flex flex-grow-0 items-center justify-center text-sm font-medium leading-loose text-white border border-transparent rounded-md bg-4e7dd9 hover:bg-opacity-75 py-3 px-5 capitalize"
      onClick={onClick}
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="mr-3"
      >
        <path
          d="M14 11V14H2V11H0V14C0 15.1 0.9 16 2 16H14C15.1 16 16 15.1 16 14V11H14ZM13 7L11.59 5.59L9 8.17V0H7V8.17L4.41 5.59L3 7L8 12L13 7Z"
          fill="#FEFEFF"
        />
      </svg>
      Download Product Cover Terms
    </button>
  );
}
