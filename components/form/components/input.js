"use client";
import { useEffect } from "react";
import styles from "./inputs.module.css";
export function Input(props) {
  const { cuestion } = props;
  const handleInputChange = (event) => {
    const { value } = event.target;
    props.setError(cuestion.name, {});
    props.setValue(cuestion.name, value);
  };
  useEffect(() => {
    if (cuestion.valueDefined) {
      props.setValue(cuestion.name, cuestion.valueDefined);
    }
  }, [cuestion.valueDefined]);

  return (
    <div className={styles.inputGroup}>
      <input
        required={cuestion.require}
        type="text"
        onChange={(event) => handleInputChange(event)}
        {...props.register(cuestion.name, {
          required: cuestion.require && "The field is required.",
        })}
      />

      <label className={styles.label}>{cuestion.placeholder}</label>
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
