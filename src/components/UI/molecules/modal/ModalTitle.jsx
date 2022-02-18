import { DoubleImage } from "@/components/common/DoubleImage";
import { classNames } from "@/utils/classnames";

export const ModalTitle = ({
  children,
  imgSrc,
  staking = false,
  imgSecondSrc = null,
}) => {
  if (staking) {
    return (
      <>
        <span className="mr-6">
          <DoubleImage
            images={[
              { src: imgSrc, alt: "npmtoken" },
              { src: imgSecondSrc, alt: "alttoken" },
            ]}
          />
        </span>
        {children}
      </>
    );
  }
  return (
    <>
      <div className="border bg-DEEAF6 border-black rounded-full w-10 h-10 flex justify-center items-center mr-3">
        <img src={imgSrc} alt="logo" className={classNames("inline-block")} />
      </div>
      {children}
    </>
  );
};
