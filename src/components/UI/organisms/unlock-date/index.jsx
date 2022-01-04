import { Label } from "@/components/UI/atoms/label"

export const UnlockDate = ({ dateValue }) => {
  return (
    <>
    <Label className="font-semibold mb-1 uppercase">Unlock Date</Label>
    <div>
      <span className="text-7398C0">{dateValue}</span>
    </div>
    </>
  )
}