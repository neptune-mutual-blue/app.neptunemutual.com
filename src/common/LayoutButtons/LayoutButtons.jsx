import LargeGridIcon from "@/icons/LargeGridIcon";
import SmallGridIcon from "@/icons/SmallGridIcon";
import { classNames } from "@/utils/classnames";

export const LayoutButtons = ({ coverView, setCoverView }) => (
  <div className="flex ml-4">
    <input
      type={"radio"}
      name="choose_layout"
      id="choose_product"
      hidden={true}
      onChange={
        coverView !== "products" ? () => setCoverView("products") : () => {}
      }
      className="hidden"
    />
    <label
      htmlFor="choose_product"
      className={classNames(
        "w-8 h-8 flex justify-center items-center border rounded cursor-pointer mr-1",
        coverView === "products" ? "border-4e7dd9" : "border-9B9B9B"
      )}
    >
      <SmallGridIcon color={coverView === "products" ? "#4e7dd9" : "#9B9B9B"} />
    </label>
    <input
      type={"radio"}
      name="choose_layout"
      id="choose_covers"
      onChange={
        coverView !== "covers" ? () => setCoverView("covers") : () => {}
      }
      className="hidden"
    />
    <label
      htmlFor="choose_covers"
      className={classNames(
        "w-8 h-8 flex justify-center items-center border rounded cursor-pointer",
        coverView === "covers" ? "border-4e7dd9" : "border-9B9B9B"
      )}
    >
      <LargeGridIcon color={coverView === "covers" ? "#4e7dd9" : "#9B9B9B"} />
    </label>
  </div>
);
