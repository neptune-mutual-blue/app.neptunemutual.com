import CloseIcon from "@/icons/CloseIcon";
import { classNames } from "@/utils/classnames";
import { useState } from "react";

export const TagsInput = ({ selectedTags, className }) => {
  const [tags, setTags] = useState([]);

  const addTags = (e) => {
    if (e.key === "," && e.target.value !== "") {
      setTags([...tags, e.target.value.replace(",", "")]);
      selectedTags([...tags, e.target.value]);
      e.target.value = "";
    }
  };

  const removeTags = (index) => {
    setTags([...tags.filter((tag) => tags.indexOf(tag) !== index)]);
  };

  return (
    <div
      className={classNames(
        "bg-white flex flex-wrap border border-B0C4DB rounded-lg",
        className
      )}
    >
      <ul className="flex flex-wrap mt-2">
        {tags.map((tag, index) => (
          <li
            key={index}
            className="w-auto flex items-center justify-center rounded-md mt-2 mx-2 px-2 py-2 bg-AABDCB"
          >
            <span>{tag}</span>
            <span className="bg-white rounded-lg ml-2 cursor-pointer">
              <CloseIcon
                onClick={() => removeTags(index)}
                width={16}
                height={16}
              >
                close
              </CloseIcon>
            </span>
          </li>
        ))}
      </ul>
      <input
        placeholder="Tags"
        onKeyUp={(e) => addTags(e)}
        className={classNames(
          "text-h4 block w-full p-6 rounded-lg placeholder-9B9B9B focus:outline-none focus-visible:none focus-visible:ring-4e7dd9"
        )}
      />
    </div>
  );
};
