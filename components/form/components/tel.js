import styles from "./inputs.module.css";

export function Tel(props) {
  const { cuestion } = props;

  const handleInputChange = (event) => {
    // Filtrar solo caracteres numéricos
    event.target.value = event.target.value.replace(/\D/, "");
    props.setError(cuestion.name, {});
  };

  return (
    <div className={styles.inputGroup}>
      <input
        required={cuestion.require}
        type="tel"
        value={cuestion.valueDefined}
        onInput={handleInputChange}
        {...props.register(cuestion.name, {
          required: cuestion.require && "The field is required.",
          pattern: {
            value: /^[0-9]*$/,
            message: "Only numeric values are allowed.",
          },
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
