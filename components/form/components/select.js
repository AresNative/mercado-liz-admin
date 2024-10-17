"use client";
import React, { useState, useEffect, useRef } from "react";
import styles from "./select.module.css";
import { XSvg } from "@/assets/svgs/x";

export function SearchableSelect(props) {
  const { cuestion, register, setValue } = props;

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOption, setSelectedOption] = useState({ id: "", label: "" });
  const [isInputFocused, setIsInputFocused] = useState(false);

  const filteredOptions = cuestion.options.filter((option) =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSelectChange = (selectedValue) => {
    console.log(selectedValue);
    setSearchTerm(selectedValue.label);
    setSelectedOption(selectedValue);
    setIsInputFocused(false);
    const valueToSet =
      cuestion.valuePropKey === "id" ? selectedValue.id : selectedValue.label;

    setValue(cuestion.name, valueToSet);
  };

  const handleInputFocus = () => {
    setIsInputFocused(true);
  };

  const handleInputNoFocus = () => {
    setIsInputFocused(false);
  };

  const handleClearSelection = () => {
    setSearchTerm("");
    setSelectedOption({ id: "", label: "" });
    setValue(cuestion.name, "");
  };

  const componentRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        componentRef.current &&
        !componentRef.current.contains(event.target)
      ) {
        handleInputNoFocus();
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [componentRef]);

  useEffect(() => {
    if (cuestion.valueDefined) {
      setSelectedOption({
        id: cuestion.valueDefined.id,
        label: cuestion.valueDefined.name,
      });
      setSearchTerm(cuestion.valueDefined.name);
    }
  }, [cuestion.valueDefined]);
  return (
    <div className={styles.inputGroup} ref={componentRef}>
      <input
        type="text"
        autoComplete="off"
        required={cuestion.require}
        value={searchTerm}
        {...register(cuestion.name, {
          value: selectedOption.id,
          required: cuestion.require && "The field is required.",
        })}
        onChange={handleInputChange}
        onFocus={handleInputFocus}
      />

      <label className={styles.label}>{cuestion.placeholder}</label>
      <button
        type="button"
        className={styles["clear__button"]}
        onClick={handleClearSelection}
      >
        <XSvg />
      </button>
      {isInputFocused && (
        <div className={styles.selectContainer}>
          <ul>
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option, key) => (
                <li key={key} onClick={() => handleSelectChange(option)}>
                  {option.label}
                </li>
              ))
            ) : (
              <li>No matching options</li>
            )}
          </ul>
        </div>
      )}
      {props.errors[cuestion.name] && props.errors[cuestion.name].message && (
        <div>
          <span className={styles.danger}>
            {props.errors[cuestion.name].message}
          </span>
        </div>
      )}
    </div>
  );
}
