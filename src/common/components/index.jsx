import { Label } from "@/src/common/components/label";

export const UnlockDate = ({ title, value }) => {
  return (
    <>
      <Label htmlFor={"unlock-date"} className="mb-1 font-semibold uppercase">
        Unlock Date
      </Label>
      <div>
        <span id="unlock-date" className="text-7398C0" title={title}>
          {value}
        </span>
      </div>
    </>
  );
};
