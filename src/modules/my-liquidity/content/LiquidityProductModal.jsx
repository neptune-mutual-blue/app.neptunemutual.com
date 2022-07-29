import { ModalRegular } from "@/common/Modal/ModalRegular";
import CloseIcon from "@/icons/CloseIcon";
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
export function LiquidityProductModal({ product, setShowModal }) {
  const onClose = () => setShowModal(false);
  return (
    <ModalRegular
      isOpen={true}
      onClose={() => {
        setShowModal(false);
      }}
    >
      <div className="grid grid-rows-basket-modal border-1.5 border-B0C4DB relative w-full max-w-lg p-8 md:p-11 pb-9 text-left align-middle md:min-w-700 lg:min-w-910 max-h-90vh bg-FEFEFF rounded-3xl overflow-hidden">
        <Dialog.Title
          className="flex items-center flex-col md:flex-row w-full pb-3 font-bold border-b font-sora border-b-B0C4DB"
          data-testid="dialog-title"
        >
          <button
            aria-label="Close"
            onClick={onClose}
            className="absolute right-5 top-5 cursor-pointer md:hidden"
          >
            <CloseIcon width={24} height={24} />
          </button>
          <svg
            className="w-10"
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

          <span className="flex-grow text-h4 font-bold md:pl-3 md:text-h3 whitespace-nowrap text-ellipsis overflow-hidden">
            {product.infoObj.productName} Cover Terms
          </span>
          <span className="text-sm font-normal leading-5 md:pl-3 md:text-h5 lg:text-h4 md:font-semibold text-9B9B9B whitespace-nowrap font-poppins">
            70% Capital Efficiency
          </span>
        </Dialog.Title>
        <div className="py-2 pr-6 -mr-6 md:pr-7 md:-mr-7 overflow-y-auto font-sora min-h-[0] h-full">
          <p className="py-2 md:py-6 text-000000 font-bold text-sm leading-5">
            Cover Rules
          </p>

          <p className="font-poppins text-404040 text-md md:text-sm">
            Carefully read the following terms and conditions. For a successful
            claim payout, all of the following points must be true.
          </p>

          <ul className="pl-8 mt-5 list-disc text-md marker:text-xs font-poppins text-404040 md:text-sm">
            {product.infoObj.rules.split("\n").map((x, i) => (
              <li key={i} className="pb-4 leading-5 md:pb-1">
                {x
                  .trim()
                  .replace(/^\d+\./g, "")
                  .trim()}
              </li>
            ))}
          </ul>

          <p className="py-2 md:py-6 text-000000 font-bold text-sm leading-5">
            Exclusions
          </p>

          <p className="font-poppins text-404040 text-md md:text-sm">
            {product.infoObj.exclusions}
          </p>
        </div>

        <div className="flex justify-end pt-6 border-t border-t-B0C4DB">
          <button
            onClick={onClose}
            className="text-sm md:text-h7 lg:text-h6 font-medium hidden md:inline-block p-3 mr-6 md:font-semibold border rounded border-4e7dd9 text-4e7dd9 leading-6"
          >
            CLOSE
          </button>
          <DownloadButton onClick={onClose} />
        </div>
      </div>
    </ModalRegular>
  );
}

function DownloadButton({ onClick }) {
  return (
    <button
      className="inline-flex w-full md:w-auto items-center justify-center flex-grow-0 px-4 py-3 text-white uppercase border border-transparent rounded bg-4e7dd9 hover:bg-opacity-75"
      onClick={onClick}
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="mr-3 scale-75 hidden md:inline"
      >
        <path
          d="M14 11V14H2V11H0V14C0 15.1 0.9 16 2 16H14C15.1 16 16 15.1 16 14V11H14ZM13 7L11.59 5.59L9 8.17V0H7V8.17L4.41 5.59L3 7L8 12L13 7Z"
          fill="#FEFEFF"
        />
      </svg>
      <span className="md:text-h7 lg:text-h6 font-semibold leading-6 hidden md:inline-block">
        Download Product Cover Terms
      </span>
      <span className="text-sm font-medium md:hidden">
        Download Cover Terms
      </span>
    </button>
  );
}
