import { Label } from "@/components/UI/atoms/label";

export const UnlockDate = ({ title, value }) => {
  return (
    <>
      <Label htmlFor={"unlock-date"} className="font-semibold mb-1 uppercase">
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
