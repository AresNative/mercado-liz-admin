"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { SwitchTypeInputRender } from "../main-form";

import styles from "./chackbox-radio.module.css";

export function OptionMultiple(props) {
  const { cuestion } = props;
  const [isAtLeastOneChecked, setIsAtLeastOneChecked] = useState(false);
  return (
    <>
      <label className={styles["cr-wrapper"]}>
        <input
          type="checkbox"
          id={`${cuestion.name}`}
          onClick={() => setIsAtLeastOneChecked(!isAtLeastOneChecked)}
          {...props.register(cuestion.name, {
            required: cuestion.require && "The field is required.",
          })}
        />
        <div className={styles["cr-input"]}></div>
        <label className={styles["span__default"]} htmlFor={`${cuestion.name}`}>
          {cuestion.placeholder}{" "}
          {cuestion.important && <strong>{cuestion.important}</strong>}
        </label>
      </label>
      {isAtLeastOneChecked === true &&
        cuestion.options.map((field) => (
          <motion.div
            key={field.id}
            className={styles.options}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
          >
            <SwitchTypeInputRender
              cuestion={field}
              register={props.register}
              watch={props.watch}
              clearErrors={props.clearErrors}
              setError={props.setError}
              errors={props.errors}
              setValue={props.setValue}
            />
          </motion.div>
        ))}
    </>
  );
}
