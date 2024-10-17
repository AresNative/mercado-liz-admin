"use client";

import { useState } from "react";
import styles from "./chackbox-radio.module.css";

export function CheckBox(props) {
  const { cuestion } = props;
  const [isAtLeastOneChecked, setIsAtLeastOneChecked] = useState(false);

  const handleCheckboxChange = async (name) => {
    await props.register(cuestion.name, {
      required: cuestion.require && "The field is required.",
      value: name,
    });
  };
  return (
    <>
      {cuestion.options.length > 1 && <label>{cuestion.placeholder} </label>}
      {cuestion.options.length > 1 &&
        cuestion.options.map((option, index) => (
          <div key={index} className={styles["checkbox__map"]}>
            <label className={styles["cr-wrapper"]}>
              <input
                type="checkbox"
                id={`${cuestion.name}-${index}`}
                onClick={() => handleCheckboxChange(option)}
              />
              <div className={styles["cr-input"]}></div>
              <label
                className={styles["span__default"]}
                htmlFor={`${cuestion.name}-${index}`}
              >
                {option}{" "}
                {cuestion.important && <strong>{cuestion.important}</strong>}
              </label>
            </label>
          </div>
        ))}
      {cuestion.options.length === 1 && (
        <label className={styles["cr-wrapper"]}>
          <input
            type="checkbox"
            id={`${cuestion.name}`}
            checked={isAtLeastOneChecked}
            onClick={() => setIsAtLeastOneChecked(!isAtLeastOneChecked)}
            {...props.register(cuestion.name, {
              required: cuestion.require && "The field is required.",
            })}
          />
          <div className={styles["cr-input"]}></div>
          <label
            className={styles["span__default"]}
            htmlFor={`${cuestion.name}`}
          >
            {cuestion.placeholder}{" "}
            {cuestion.important && <strong>{cuestion.important}</strong>}
          </label>
        </label>
      )}
      {props.errors[cuestion.name] && props.errors[cuestion.name].message && (
        <div>
          <span className={styles.danger}>
            {props.errors[cuestion.name].message}
          </span>
        </div>
      )}
    </>
  );
}
