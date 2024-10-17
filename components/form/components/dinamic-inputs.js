"use client";
import React, { useState, useEffect } from "react";
import styles from "./inputs.module.css";
import { XSvg } from "@/assets/svgs/x";
import { SvgPlus } from "@/assets/svgs/plus";

export function MultipleParagraphInput({
  register,
  errors,
  setError,
  setValue,
  cuestion,
}) {
  const [paragraphs, setParagraphs] = useState([
    {
      name: "0",
      valueDefined: "",
      placeholder: "Paragraph...",
      require: cuestion.require,
    },
  ]);

  const handleAddParagraph = () => {
    const newIndex = paragraphs.length;
    setParagraphs([
      ...paragraphs,
      {
        name: `${newIndex}`,
        valueDefined: "",
        placeholder: "Paragraph...",
        require: cuestion.require,
      },
    ]);
  };

  useEffect(() => {
    const newIndex = paragraphs.length;
    const newParagraphs = cuestion.valueDefined
      ? cuestion.valueDefined.$values.map((text, key) => ({
          name: `${newIndex + key}`,
          valueDefined: text.text,
          placeholder: "Paragraph...",
          require: cuestion.require,
        }))
      : [
          {
            name: `${newIndex}`,
            valueDefined: "",
            placeholder: "Paragraph...",
            require: cuestion.require,
          },
        ];

    setParagraphs([...newParagraphs]);
  }, []);

  const handleRemoveParagraph = (index) => {
    const newParagraphs = [...paragraphs];
    newParagraphs.splice(index, 1);
    setParagraphs(newParagraphs);
  };

  return (
    <div>
      {paragraphs.map((cuestion, index) => (
        <div key={index} className={styles.inputGroup}>
          <Input
            cuestion={cuestion}
            register={register}
            errors={errors}
            setError={setError}
            setValue={setValue}
          />
          <button
            type="button"
            style={{ marginRight: "-2rem" }}
            onClick={() => handleRemoveParagraph(index)}
          >
            {index}
            <XSvg />
          </button>
        </div>
      ))}
      <center style={{ marginBottom: "1rem" }}>
        <button
          onClick={handleAddParagraph}
          style={{ padding: ".5rem", borderRadius: "14px" }}
        >
          <SvgPlus style={{ fill: "#7F7F7F" }} />
        </button>
      </center>
    </div>
  );
}

export function Input(props) {
  const { cuestion } = props;

  const handleInputChange = (event) => {
    const { value } = event.target;
    props.setError(cuestion.name, {});
    props.setValue(cuestion.name, value);
    props.onInputChange(cuestion.name, value);
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
        onChange={handleInputChange}
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
