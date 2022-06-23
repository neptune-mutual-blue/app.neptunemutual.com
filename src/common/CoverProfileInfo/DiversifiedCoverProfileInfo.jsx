export const DiversifiedCoverProfileInfo = ({ projectName }) => {
  return (
    <div className="flex" data-testid="coverprofileinfo-container">
      <div>
        <div className="flex flex-col  items-center">
          <h1 className="w-full font-sora font-bold text-h1">
            Provide Liquidity
          </h1>

          <h3 className="flex w-full text-h5 leading-5 font-bold font-sora">
            {projectName}
          </h3>
        </div>
      </div>
    </div>
  );
};
