import { classNames } from "@/utils/classnames";

export const ModalTitle = ({ children, imgSrc }) => {
  return (
    <>
      {imgSrc && (
        <div className="flex items-center justify-center w-10 h-10 mr-3 border border-black rounded-full bg-DEEAF6">
          <img src={imgSrc} alt="logo" className={classNames("inline-block")} />
        </div>
      )}
      {children}
    </>
  );
};
