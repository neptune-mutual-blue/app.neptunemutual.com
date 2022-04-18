import { RegularInput } from "@/common/components/Input/RegularInput";
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
                    className="p-2 ml-4 border rounded-md cursor-pointer border-CEEBED"
                  >
                    <DeleteIcon width={14} height={16} />
                  </span>
                )}
              </div>
              <p className="pl-2 mt-2 text-sm text-9B9B9B mb-x">
                Enter a link to your social media profile.
              </p>
            </div>
          </React.Fragment>
        );
      })}
      <button
        onClick={() => handleNewLink("resolution")}
        className="mt-4 text-black bg-transparent border-none hover:underline"
      >
        + Add new
      </button>
    </>
  );
};
