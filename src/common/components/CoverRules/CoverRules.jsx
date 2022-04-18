export const CoverRules = ({ rules = "" }) => {
  return (
    <div>
      <h4 className="mt-10 mb-6 font-semibold text-h4 font-sora">
        Cover Rules
      </h4>
      <p className="mb-4">
        Carefully read the following terms and conditions. For a successful
        claim payout, all of the following points must be true.
      </p>
      <ol className="pl-5 list-decimal">
        {rules.split("\n").map((x, i) => (
          <li key={i}>
            {x
              .trim()
              .replace(/^\d+\./g, "")
              .trim()}
          </li>
        ))}
      </ol>
    </div>
  );
};
