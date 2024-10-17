import styles from "./inputs.module.css";
export function Email(props) {
  const { cuestion } = props;
  const handleInputChange = () => {
    props.setError(cuestion.name, {});
  };
  return (
    <div className={styles.inputGroup}>
      <input
        type="email"
        required={cuestion.require}
        value={cuestion.valueDefined}
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
