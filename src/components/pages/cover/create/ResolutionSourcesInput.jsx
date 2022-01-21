import { RegularInput } from "@/components/UI/atoms/input/regular-input";
import DeleteIcon from "@/icons/delete-icon";
import React from "react";

export const ResolutionSourcesInput = ({
  resolutionUrls,
  handleChange,
  handleNewLink,
  handleDeleteLink,
}) => {
  return (
    <>
      {resolutionUrls.map((x, i) => {
        return (
          <React.Fragment key={i}>
            <div>
              <div className="flex items-center mt-2">
                <RegularInput
                  className={i === 0 && "mr-12"}
                  inputProps={{
                    id: `social_profiles_${i}`,
                    placeholder: "https://",
                    value: x["url"],
                    onChange: (e) => handleChange(e, "resolution", i),
                  }}
                />
                {i !== 0 && (
                  <span
                    onClick={() => handleDeleteLink("resolution", i)}
                    className="ml-4 border border-CEEBED rounded-md p-2 cursor-pointer"
                  >
                    <DeleteIcon width={14} height={16} />
                  </span>
                )}
              </div>
              <p className="text-sm text-9B9B9B mt-2 mb-x pl-2">
                Enter a link to your social media profile.
              </p>
            </div>
          </React.Fragment>
        );
      })}
      <button
        onClick={() => handleNewLink("resolution")}
        className="bg-transparent text-black border-none hover:underline mt-4"
      >
        + Add new
      </button>
    </>
  );
};
