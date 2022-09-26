import React, { useState } from "react";

import { Label } from "@/common/Label/Label";
import { RegularInput } from "@/common/Input/RegularInput";
import { classNames } from "@/utils/classnames";
import { t } from "@lingui/macro";
import DeleteIcon from "@/icons/delete-icon";

/**
 *
 * @param {Object} props
 * @param {string} props.label
 * @param {string} props.id
 * @returns
 */
function InputHeader({ label, id }) {
  return (
    <Label htmlFor={id} className={"mb-2 mt-6"}>
      {label}
    </Label>
  );
}

/**
 *
 * @param {Object} props
 * @param {string} props.desc
 * @param {string} [props.label]
 * @param {React.ComponentProps<'input'> & React.RefAttributes<HTMLInputElement> & {error:boolean}} props.inputProps
 * @param {string} [props.className]
 * @param {string} [props.error]
 * @param {number | string} [props.key]
 * @returns
 */
export function InputField({ label, inputProps, desc, className = "", error }) {
  return (
    <div className={classNames(className, inputProps.disabled && "opacity-40")}>
      {label && <InputHeader label={label} id={inputProps.id} />}
      <RegularInput {...inputProps} />
      {desc && <span className="pl-2 mt-2 text-sm text-9B9B9B">{desc}</span>}
      {error && (
        <span className="flex items-center pl-2 text-FA5C2F">{error}</span>
      )}
    </div>
  );
}

/**
 *
 * @param {Object} props
 * @param {string} props.label
 * @param {{id?: string, name?: string, disabled: boolean, required: boolean, className?: string, placeholder?: string, rows?: number, maxLength?: number }} props.inputProps
 * @param {string} [props.className]
 * @returns
 */
export function InputDescription({ label, inputProps, className }) {
  const [descriptionCounter, setDescriptionCounter] = useState(0);
  const { className: inputClassName, ...rest } = inputProps;

  /**
   * @param {Object} e
   */
  function handleChange(e) {
    const text = e.target.value;
    setDescriptionCounter(text.length);
  }

  return (
    <div className={classNames(className, inputProps.disabled && "opacity-40")}>
      <InputHeader label={label} id={inputProps.id} />
      <textarea
        {...rest}
        className={classNames(inputClassName, "disabled:cursor-not-allowed")}
        onChange={handleChange}
      ></textarea>
      <span
        className={classNames(
          "absolute bottom-0 right-0 mr-2 mb-2",
          descriptionCounter >= inputProps.maxLength && "text-FA5C2F"
        )}
      >
        {descriptionCounter}/{inputProps.maxLength}
      </span>
    </div>
  );
}

/**
 *
 * @param {Object} props
 * @param {boolean} [props.disabled]
 * @param {boolean} [props.required]
 * @returns
 */
export function ProofOfIncident({ disabled, required }) {
  /**
   * @type {[Array, (fields: Array) => void]}
   */
  const [fields, setFields] = useState([]);

  /**
   *
   * @param {Object} e
   */
  function handleAdd(e) {
    e && e.preventDefault();
    const newFields = [...fields];
    newFields.push("");
    setFields(newFields);
  }

  /**
   *
   * @param {Object} e
   * @param {number} index
   */
  function handleChange(e, index) {
    const newFields = [...fields];
    newFields[index] = e.target.value;
    setFields(newFields);
  }

  /**
   *
   * @param {number} num
   */
  function handleDelete(num) {
    const newFields = [...fields].filter((_, key) => {
      return key !== num;
    });

    setFields(newFields);
  }

  return (
    <>
      <InputField
        label={t`Proof of incident`}
        inputProps={{
          id: "incident_url",
          name: "incident_url",
          placeholder: t`https://`,
          required: required,
          disabled: disabled,
        }}
        desc={t`Provide a URL confirming the nature of the incident.`}
      />

      {fields.map((value, i) => {
        return (
          <div key={i} className="flex flex-row">
            <InputField
              className="flex-grow"
              label={t`Proof of incident`}
              inputProps={{
                id: `incident_url_${i}`,
                name: "incident_url",
                placeholder: "https://",
                onChange: (/** @type {Object} */ e) => handleChange(e, i),
                value: value,
                required: required,
                disabled: disabled,
              }}
              desc={t`Provide a URL confirming the nature of the incident.`}
            />

            <button
              onClick={(/** @type {Object} */ e) => {
                e && e.preventDefault();
                handleDelete(i);
              }}
              className={classNames(
                `flex-shrink p-2 ml-4 border rounded-md h-10 mt-18 border-CEEBED button-${i}`,
                `disabled:opacity-40 disabled:cursor-not-allowed`
              )}
              title="Delete"
              type="button"
              disabled={disabled}
            >
              <DeleteIcon width={14} height={16} />
            </button>
          </div>
        );
      })}

      <button
        onClick={handleAdd}
        type="button"
        disabled={disabled}
        className={classNames(
          "px-6 py-3 mt-4 text-black bg-transparent rounded-md border-B0C4DB bg-E6EAEF hover:underline",
          "disabled:opacity-40 disabled:cursor-not-allowed"
        )}
      >
        + {t`Add new link`}
      </button>
    </>
  );
}
