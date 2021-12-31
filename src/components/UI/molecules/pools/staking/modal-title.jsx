export const ModalTitle = ({ children, fromPage, imgSrc }) => (
  <>
    <div className="border bg-DEEAF6 border-black rounded-full w-10 h-10 flex justify-center items-center mr-3">
      <img
        src={fromPage ? imgSrc : "/pools/staking/npm.png"}
        alt={name}
        className="inline-block"
      />
    </div>
    {children}
  </>
);
