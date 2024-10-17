"use client";
import { useState } from "react";
import styles from "./chackbox-radio.module.css";

export function Radio(props) {
  const { cuestion } = props;
  const [selectedOption, setSelectedOption] = useState("");

  const handleOptionChange = (event) => {
    const newValue = event.target.value;
    setSelectedOption(newValue);
    props.onChange && props.onChange(newValue);
    props.register(cuestion.name, {
      required: cuestion.require && "The field is required.",
      value: newValue,
    });
  };

  return (
    <>
      <span>{cuestion.placeholder}</span>
      <div className={styles["cr-wrapper"]}>
        <div>
          {cuestion.options.map((option, index) => (
            <div key={index} className={styles["radio-option"]}>
              <input
                name={cuestion.name}
                type="radio"
                id={`${cuestion.name}-${index}`}
                value={option}
                checked={selectedOption === option}
                onChange={handleOptionChange}
              />
              <label
                htmlFor={`${cuestion.name}-${index}`}
                className={styles["cr-input"]}
              ></label>
              <label
                htmlFor={`${cuestion.name}-${index}`}
                className={styles["span__radio"]}
              >
                {option}
              </label>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
