import styles from "./textarea.module.css";
export function TextArea(props) {
  const { cuestion } = props;
  const handleInputChange = () => {
    props.setError(cuestion.name, {});
  };
  return (
    <div className={styles.label}>
      <textarea
        required={cuestion.require}
        className={styles.input}
        value={cuestion.valueDefined}
        onChange={handleInputChange}
        {...props.register(cuestion.name, {
          required: cuestion.require && "The field is required.",
        })}
      ></textarea>
      <span>{cuestion.placeholder}</span>
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
